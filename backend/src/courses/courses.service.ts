import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) { }

  async getAll(userId?: string, role?: Role) {
    if (role === Role.INTERN) {
      throw new ForbiddenException('Interns are not permitted to browse the course catalog');
    }

    return this.prisma.course.findMany({
      include: {
        projectCoordinator: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string, userId?: string, role?: Role) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        projectCoordinator: { select: { name: true } },
        lessons: { orderBy: { order: 'asc' } },
        assignments: true,
        quizzes: true,
      },
    });
    if (!course) throw new NotFoundException('Course not found');

    if (role === Role.INTERN) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: userId!,
            courseId: id,
          },
        },
      });
      if (!enrollment) {
        throw new ForbiddenException('You must be enrolled in this course to access it');
      }
    }

    return course;
  }

  async create(data: any) {
    const { title, description, coverImage, projectCoordinatorId, domain, ...extra } = data;

    const activeDomain = domain
      ? await this.prisma.domain.findFirst({
        where: {
          name: {
            equals: domain,
            mode: 'insensitive',
          },
        },
      })
      : null;
    const normalizedDomain = activeDomain ? activeDomain.name : (domain || 'Full Stack');

    const course = await this.prisma.course.create({
      data: {
        title,
        description,
        coverImage,
        projectCoordinatorId,
        domain: normalizedDomain,
        ...extra,
      },
    });

    // Auto-enroll matching interns
    const interns = await this.prisma.user.findMany({
      where: {
        role: Role.INTERN,
        domain: {
          equals: course.domain,
          mode: 'insensitive',
        },
      },
    });

    for (const intern of interns) {
      await this.prisma.enrollment.upsert({
        where: {
          studentId_courseId: {
            studentId: intern.id,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          studentId: intern.id,
          courseId: course.id,
        },
      }).catch(() => { });

      // Notify the intern about the new course
      await this.prisma.notification.create({
        data: {
          userId: intern.id,
          title: 'New Course Available',
          message: `You have been enrolled in a new course: "${course.title}".`,
          type: 'new_course',
          entityId: course.id,
        },
      }).catch(() => {});
    }

    return course;
  }

  async update(
    id: string,
    data: any,
    userId: string,
    role: Role,
  ) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    if (role !== Role.ADMIN && course.projectCoordinatorId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const isSameDomain = user && user.role === Role.PROJECT_COORDINATOR && user.domain && 
        user.domain.toLowerCase() === course.domain.toLowerCase();
      if (!isSameDomain) {
        throw new ForbiddenException('You do not own or have domain permissions for this course');
      }
    }

    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string, role: Role) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    if (role !== Role.ADMIN && course.projectCoordinatorId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const isSameDomain = user && user.role === Role.PROJECT_COORDINATOR && user.domain && 
        user.domain.toLowerCase() === course.domain.toLowerCase();
      if (!isSameDomain) {
        throw new ForbiddenException('You do not own or have domain permissions for this course');
      }
    }

    await this.prisma.course.delete({ where: { id } });
    return { success: true };
  }

  async enroll(studentId: string, courseId: string) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found');

    return this.prisma.enrollment.create({
      data: {
        studentId,
        courseId,
      },
    });
  }

  async getMyEnrolled(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: { domain: true },
    });
    const domain = student?.domain || 'Full Stack';

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId,
        course: {
          domain: {
            equals: domain,
            mode: 'insensitive',
          },
        },
      },
      include: {
        course: {
          include: {
            projectCoordinator: { select: { name: true } },
          },
        },
      },
    });
    return enrollments.map((e) => e.course);
  }

  async getMyCreated(projectCoordinatorId: string) {
    const projectCoordinator = await this.prisma.user.findUnique({
      where: { id: projectCoordinatorId },
    });
    if (projectCoordinator && projectCoordinator.role === Role.PROJECT_COORDINATOR && projectCoordinator.domain) {
      return this.prisma.course.findMany({
        where: {
          domain: {
            equals: projectCoordinator.domain,
            mode: 'insensitive',
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    return this.prisma.course.findMany({
      where: { projectCoordinatorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async uploadBrochure(
    id: string,
    brochureUrl: string,
    brochureName: string,
    brochureMimeType: string,
    userId: string,
    role: Role,
  ) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (role !== Role.ADMIN && course.projectCoordinatorId !== userId) {
      const isSameDomain = user && user.role === Role.PROJECT_COORDINATOR && user.domain && 
        user.domain.toLowerCase() === course.domain.toLowerCase();
      if (!isSameDomain) {
        throw new ForbiddenException('You do not own or have domain permissions for this course');
      }
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        brochureUrl,
        brochureName,
        brochureFileName: brochureName,
        brochureMimeType,
        uploadedBy: user.name,
        uploadedAt: new Date(),
      },
    });
  }

  async deleteBrochure(id: string, userId: string, role: Role) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    if (role !== Role.ADMIN && course.projectCoordinatorId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const isSameDomain = user && user.role === Role.PROJECT_COORDINATOR && user.domain && 
        user.domain.toLowerCase() === course.domain.toLowerCase();
      if (!isSameDomain) {
        throw new ForbiddenException('You do not own or have domain permissions for this course');
      }
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        brochureUrl: null,
        brochureName: null,
        brochureFileName: null,
        brochureMimeType: null,
        uploadedBy: null,
        uploadedAt: null,
      },
    });
  }

  async getDomainBrochures() {
    const courses = await this.prisma.course.findMany({
      where: {
        brochureUrl: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        domain: true,
        brochureUrl: true,
        brochureName: true,
      },
    });

    const brochureMap: Record<string, { brochureUrl: string; brochureName: string }> = {};
    for (const course of courses) {
      if (course.domain && !brochureMap[course.domain]) {
        brochureMap[course.domain] = {
          brochureUrl: course.brochureUrl!,
          brochureName: course.brochureName!,
        };
      }
    }
    return brochureMap;
  }
}
