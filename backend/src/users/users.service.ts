import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async normalizeDomain(domain?: string): Promise<string | undefined> {
    if (!domain) return undefined;
    let searchName = domain.trim();
    if (/^(gen\s*ai|generative\s*ai)$/i.test(searchName)) {
      searchName = 'Generative AI';
    } else if (/^(full\s*stack)$/i.test(searchName)) {
      searchName = 'Full Stack';
    } else if (/^(data\s*science)$/i.test(searchName)) {
      searchName = 'Data Science';
    } else if (/^(machine\s*learning)$/i.test(searchName)) {
      searchName = 'Machine Learning';
    } else if (/^(cyber\s*security)$/i.test(searchName)) {
      searchName = 'Cyber Security';
    } else if (/^(digital\s*marketing)$/i.test(searchName)) {
      searchName = 'Digital Marketing';
    }

    const activeDomain = await this.prisma.domain.findFirst({
      where: {
        name: {
          equals: searchName,
          mode: 'insensitive',
        },
      },
    });
    return activeDomain ? activeDomain.name : domain.trim();
  }

  private get userSelect() {
    return {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      domain: true,
      phone: true,
      dob: true,
      department: true,
      designation: true,
      collegeName: true,
      batch: true,
      employeeId: true,
      mustChangePassword: true,
      isApproved: true,
      createdAt: true,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.userSelect,
    });
    if (!user) throw new NotFoundException('User profile not found');
    return user;
  }

  async updateProfile(
    userId: string,
    name: string,
    email: string,
    domain?: string,
  ) {
    const existing = await this.prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
    });
    if (existing) throw new BadRequestException('Email is already taken');

    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const normalizedDomain = domain ? await this.normalizeDomain(domain) : undefined;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        domain: currentUser?.role === Role.INTERN 
          ? (normalizedDomain || currentUser.domain || 'Full Stack') 
          : (currentUser?.role === Role.PROJECT_COORDINATOR ? currentUser.domain : null),
      },
      select: this.userSelect,
    });
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) throw new UnauthorizedException('Incorrect current password');

    // Password Validation Rules
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\[\]{}|\\:;"'<>,.?/~`]).{8,}$/;
    if (!passwordRegex.test(newPass)) {
      throw new BadRequestException('Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
    }

    const hashed = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashed,
        mustChangePassword: false,
      },
    });
  }

  async getAll() {
    return this.prisma.user.findMany({
      select: this.userSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    name: string;
    email: string;
    role: Role;
    password?: string;
    domain?: string;
    employeeId?: string;
    username?: string;
    phone?: string;
    dob?: string | Date;
    department?: string;
    designation?: string;
    collegeName?: string;
    batch?: string;
    mustChangePassword?: boolean;
    isApproved?: boolean;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new BadRequestException('Email already registered');

    const username = data.username || data.employeeId;
    if (username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existingUser)
        throw new BadRequestException('Username / ID already registered');
    }

    if (data.employeeId) {
      const existingEmp = await this.prisma.user.findUnique({
        where: { employeeId: data.employeeId },
      });
      if (existingEmp)
        throw new BadRequestException('Employee ID / ID already registered');
    }

    // Default password to DOB or welcome123
    let defaultPass = data.password;
    if (!defaultPass && data.dob) {
      defaultPass = typeof data.dob === 'string' ? data.dob : data.dob.toISOString().split('T')[0];
    }
    if (!defaultPass) {
      defaultPass = 'welcome123';
    }
    const hashed = await bcrypt.hash(defaultPass, 10);
    const dobDate = data.dob ? new Date(data.dob) : null;

    const normalizedDomain = data.domain ? await this.normalizeDomain(data.domain) : undefined;

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: username || null,
        role: data.role,
        domain: (data.role === Role.INTERN || data.role === Role.PROJECT_COORDINATOR) ? normalizedDomain || 'Full Stack' : null,
        password: hashed,
        employeeId: data.employeeId || null,
        phone: data.phone || null,
        dob: dobDate,
        department: data.department || null,
        designation: data.role === Role.PROJECT_COORDINATOR ? data.designation || null : null,
        collegeName: data.role === Role.INTERN ? data.collegeName || null : null,
        batch: data.role === Role.INTERN ? data.batch || null : null,
        mustChangePassword: data.mustChangePassword !== undefined ? data.mustChangePassword : (data.role !== Role.ADMIN),
        isApproved: data.isApproved !== undefined ? data.isApproved : true,
      },
      select: this.userSelect,
    });

    if (user.role === Role.INTERN && user.domain) {
      await this.autoEnrollInternInDomainCourses(user.id, user.domain);
    }

    if (user.role === Role.PROJECT_COORDINATOR) {
      await this.prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Coordinator Added',
          message: `Welcome ${user.name}! You have been added as a Project Coordinator.`,
          type: 'coordinator_added',
          entityId: user.id,
        },
      }).catch(() => {});
    }

    return user;
  }

  async bulkCreate(usersData: any[]) {
    const created: any[] = [];
    const errors: string[] = [];

    for (let idx = 0; idx < usersData.length; idx++) {
      const uData = usersData[idx];
      try {
        const result = await this.create({
          name: uData.name || uData.fullName,
          email: uData.email,
          role: uData.role,
          domain: uData.domain,
          employeeId: uData.employeeId || uData.internId,
          username: uData.employeeId || uData.internId,
          phone: uData.phone || uData.phoneNumber,
          dob: uData.dob || uData.dateOfBirth,
          department: uData.department,
          designation: uData.designation,
          collegeName: uData.collegeName,
          batch: uData.batch || uData.assignedBatch,
          mustChangePassword: true,
          isApproved: true,
        });
        created.push(result);
      } catch (err: any) {
        errors.push(`Row ${idx + 1} (${uData.email || 'No Email'}): ${err.message || 'Validation failed'}`);
      }
    }

    if (errors.length > 0 && created.length === 0) {
      throw new BadRequestException(`Failed to import users:\n${errors.join('\n')}`);
    }

    return { created, errors };
  }

  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: Role;
      domain?: string | null;
      employeeId?: string | null;
      username?: string | null;
      phone?: string | null;
      dob?: string | Date | null;
      department?: string | null;
      designation?: string | null;
      collegeName?: string | null;
      batch?: string | null;
      mustChangePassword?: boolean;
      isApproved?: boolean;
    },
  ) {
    if (data.email) {
      const existing = await this.prisma.user.findFirst({
        where: { email: data.email, NOT: { id } },
      });
      if (existing) throw new BadRequestException('Email already registered');
    }

    if (data.username) {
      const existingUser = await this.prisma.user.findFirst({
        where: { username: data.username, NOT: { id } },
      });
      if (existingUser)
        throw new BadRequestException('Username already registered');
    }

    if (data.employeeId) {
      const existingEmp = await this.prisma.user.findFirst({
        where: { employeeId: data.employeeId, NOT: { id } },
      });
      if (existingEmp)
        throw new BadRequestException('Employee ID already registered');
    }

    const currentUser = await this.prisma.user.findUnique({ where: { id } });
    const nextRole = data.role ?? currentUser?.role;

    let domainVal: string | null | undefined = data.domain;
    if (nextRole !== Role.INTERN && nextRole !== Role.PROJECT_COORDINATOR) {
      domainVal = null;
    } else if (domainVal === undefined) {
      domainVal = currentUser?.domain || 'Full Stack';
    } else if (domainVal !== null) {
      domainVal = await this.normalizeDomain(domainVal);
    }

    const dobDate = data.dob ? new Date(data.dob) : (data.dob === null ? null : undefined);

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        domain: domainVal,
        dob: dobDate,
      },
      select: this.userSelect,
    });

    if (user.role === Role.INTERN && user.domain) {
      await this.autoEnrollInternInDomainCourses(user.id, user.domain);
    }

    return user;
  }

  async delete(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }

  async getSystemStats() {
    const totalUsers = await this.prisma.user.count();
    const totalCourses = await this.prisma.course.count();
    const totalEnrollments = await this.prisma.enrollment.count();

    // Calculate completion rate (students that have at least one claimed certificate / total enrolled students)
    const certificates = await this.prisma.certificate.count();
    const completionRate =
      totalEnrollments > 0
        ? Math.round((certificates / totalEnrollments) * 100)
        : 0;

    return {
      totalUsers,
      totalCourses,
      totalEnrollments,
      completionRate: Math.min(completionRate, 100),
    };
  }

  async getInternsMonitoring(projectCoordinatorId: string, allDomains = false) {
    const projectCoordinator = await this.prisma.user.findUnique({
      where: { id: projectCoordinatorId },
    });
    if (!projectCoordinator || projectCoordinator.role !== Role.PROJECT_COORDINATOR) {
      return [];
    }

    const domain = projectCoordinator.domain;

    // Fetch all interns in the domain
    const interns = await this.prisma.user.findMany({
      where: {
        role: Role.INTERN,
        ...(allDomains
          ? {}
          : {
              domain: {
                equals: domain,
                mode: 'insensitive',
              },
            }),
      },
      select: {
        id: true,
        name: true,
        employeeId: true,
        domain: true,
        email: true,
        phone: true,
        collegeName: true,
        batch: true,
        updatedAt: true,
        enrollments: {
          include: {
            course: {
              include: {
                lessons: true,
                quizzes: true,
                assignments: true,
              },
            },
          },
        },
        quizResults: true,
        submissions: true,
        certificates: true,
      },
    });

    // Fetch all lesson progress records for these interns
    const progressList = await this.prisma.lessonProgress.findMany({
      where: { studentId: { in: interns.map((i) => i.id) } },
    });

    return interns.map((intern) => {
      const completedLessonIds = progressList
        .filter((p) => p.studentId === intern.id)
        .map((p) => p.lessonId);

      const coursesProgress = intern.enrollments.map((e) => {
        const course = e.course;
        const lessons = course.lessons;
        const quizzes = course.quizzes;
        const assignments = course.assignments;

        const totalItems = lessons.length + quizzes.length + assignments.length;
        let progressPercent = 0;

        if (totalItems > 0) {
          const completedLessonsCount = lessons.filter((l) =>
            completedLessonIds.includes(l.id),
          ).length;
          const passedQuizzesCount = quizzes.filter((q) =>
            intern.quizResults.some((r) => r.quizId === q.id && r.passed),
          ).length;
          const submittedAssignmentsCount = assignments.filter((a) =>
            intern.submissions.some((s) => s.assignmentId === a.id),
          ).length;

          const completedItems =
            completedLessonsCount +
            passedQuizzesCount +
            submittedAssignmentsCount;
          progressPercent = Math.round((completedItems / totalItems) * 100);
        }

        // Calculate modules completed
        const weeks = (course.weeks as any[]) || [];
        const weeksList = weeks.map((w) => {
          const wLessons = lessons.filter((l) => l.weekId === w.id);
          const wQuizzes = quizzes.filter((q) => q.weekId === w.id);
          const wAssignments = assignments.filter((a) => a.weekId === w.id);

          if (
            wLessons.length === 0 &&
            wQuizzes.length === 0 &&
            wAssignments.length === 0
          )
            return { id: w.id, number: w.number, title: w.title, completed: true };

          const allL = wLessons.every((l) => completedLessonIds.includes(l.id));
          const allQ = wQuizzes.every((q) =>
            intern.quizResults.some((r) => r.quizId === q.id && r.passed),
          );
          const allA = wAssignments.every((a) =>
            intern.submissions.some((s) => s.assignmentId === a.id),
          );

          return {
            id: w.id,
            number: w.number,
            title: w.title,
            completed: allL && allQ && allA,
          };
        });

        const completedWeeks = weeksList.filter((w) => w.completed).length;

        // Check if certificate has been issued or approved
        const hasCertificate = intern.certificates.some(
          (c) => c.courseId === course.id,
        );
        const certStatus = hasCertificate ? 'Issued' : 'Not Claimed';

        const quizResultsForCourse = intern.quizResults.filter((r) =>
          quizzes.some((q) => q.id === r.quizId),
        );
        const quizAverage = quizResultsForCourse.length > 0
          ? Math.round(
              quizResultsForCourse.reduce((acc, curr) => acc + curr.score, 0) /
                quizResultsForCourse.length,
            )
          : 0;

        const submittedAssignmentsCount = assignments.filter((a) =>
          intern.submissions.some((s) => s.assignmentId === a.id),
        ).length;

        return {
          courseId: course.id,
          courseTitle: course.title,
          progressPercent,
          modulesCompleted: `${completedWeeks}/${weeks.length}`,
          modulesCompletedCount: completedWeeks,
          totalModulesCount: weeks.length,
          certStatus,
          weeksList,
          quizAverage,
          totalAssignments: assignments.length,
          assignmentsSubmitted: submittedAssignmentsCount,
          attendance: progressPercent === 100 ? 95 : Math.max(75, Math.round(75 + progressPercent * 0.2)),
        };
      });

      const primaryCourse = coursesProgress[0] || {
        courseTitle: 'Not Enrolled',
        progressPercent: 0,
        modulesCompleted: '0/0',
        modulesCompletedCount: 0,
        totalModulesCount: 0,
        certStatus: 'Not Claimed',
      };

      // Compute real database-driven lastActivity timestamp
      const submissionDates = intern.submissions.map((s) => new Date(s.createdAt).getTime());
      const quizDates = intern.quizResults.map((q) => new Date(q.createdAt).getTime());
      const progressDates = progressList
        .filter((p) => p.studentId === intern.id)
        .map((p) => new Date(p.createdAt).getTime());

      const allDates = [
        ...submissionDates,
        ...quizDates,
        ...progressDates,
        new Date(intern.updatedAt).getTime()
      ];

      const maxTime = Math.max(...allDates);
      const lastActivity = new Date(maxTime).toISOString();

      return {
        id: intern.id,
        name: intern.name,
        employeeId: intern.employeeId || 'N/A',
        domain: intern.domain,
        email: intern.email,
        phone: intern.phone,
        collegeName: intern.collegeName,
        batch: intern.batch,
        progressPercent: primaryCourse.progressPercent,
        modulesCompleted: primaryCourse.modulesCompleted,
        modulesCompletedCount: primaryCourse.modulesCompletedCount,
        totalModulesCount: primaryCourse.totalModulesCount,
        certStatus: primaryCourse.certStatus,
        lastActivity,
        coursesProgress,
      };
    });
  }

  async autoEnrollInternInDomainCourses(studentId: string, domain: string) {
    const courses = await this.prisma.course.findMany({
      where: { domain },
    });
    for (const course of courses) {
      await this.prisma.enrollment.upsert({
        where: {
          studentId_courseId: {
            studentId,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          studentId,
          courseId: course.id,
        },
      }).catch(() => {});
    }
  }
}
