import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class CapstoneService {
  constructor(private prisma: PrismaService) { }

  private async checkCoursePermission(courseId: string, userId: string, role: Role) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found');

    if (role !== Role.ADMIN && course.projectCoordinatorId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const isSameDomain = user && user.role === Role.PROJECT_COORDINATOR && user.domain &&
        user.domain.toLowerCase() === course.domain.toLowerCase();
      if (!isSameDomain) {
        throw new ForbiddenException('You do not own or have domain permissions for this course');
      }
    }
    return course;
  }

  // ---------------------------------------------------------------------------
  // Capstone Projects
  // ---------------------------------------------------------------------------

  async getProjectsByCourse(courseId: string) {
    return this.prisma.capstoneProject.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProject(
    courseId: string,
    title: string,
    problemStatement: string,
    objectives: string,
    requiredTech: string,
    deliverables: string,
    instructions: string,
    userId: string,
    role: Role,
  ) {
    await this.checkCoursePermission(courseId, userId, role);

    return this.prisma.capstoneProject.create({
      data: {
        title,
        problemStatement,
        objectives,
        requiredTech,
        deliverables,
        instructions,
        courseId,
      },
    });
  }

  async updateProject(
    id: string,
    data: {
      title?: string;
      problemStatement?: string;
      objectives?: string;
      requiredTech?: string;
      deliverables?: string;
      instructions?: string;
    },
    userId: string,
    role: Role,
  ) {
    const project = await this.prisma.capstoneProject.findUnique({
      where: { id },
    });
    if (!project) throw new NotFoundException('Capstone project not found');

    await this.checkCoursePermission(project.courseId, userId, role);

    return this.prisma.capstoneProject.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: string, userId: string, role: Role) {
    const project = await this.prisma.capstoneProject.findUnique({
      where: { id },
    });
    if (!project) throw new NotFoundException('Capstone project not found');

    await this.checkCoursePermission(project.courseId, userId, role);

    await this.prisma.capstoneProject.delete({
      where: { id },
    });
    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // Capstone Submissions
  // ---------------------------------------------------------------------------

  async getMySubmissions(studentId: string) {
    return this.prisma.capstoneSubmission.findMany({
      where: { studentId },
      include: {
        project: {
          select: {
            title: true,
            courseId: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async getSubmissionsByCourse(courseId: string, userId: string, role: Role) {
    await this.checkCoursePermission(courseId, userId, role);

    return this.prisma.capstoneSubmission.findMany({
      where: {
        project: { courseId },
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
            employeeId: true,
            domain: true,
          },
        },
        project: {
          select: {
            title: true,
            courseId: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async saveSubmission(
    projectId: string,
    studentId: string,
    fileUrl: string,
    fileName: string,
  ) {
    const project = await this.prisma.capstoneProject.findUnique({
      where: { id: projectId },
      include: { course: true },
    });
    if (!project) throw new NotFoundException('Capstone project not found');

    // Verify enrollment
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: project.courseId,
        },
      },
    });
    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled in this course to submit a project');
    }

    return this.prisma.capstoneSubmission.upsert({
      where: {
        studentId_projectId: { studentId, projectId },
      },
      update: {
        fileUrl,
        fileName,
        status: 'PENDING',
        submittedAt: new Date(),
        marks: null,
        remarks: null,
        reviewedAt: null,
      },
      create: {
        studentId,
        projectId,
        fileUrl,
        fileName,
      },
    });
  }

  async reviewSubmission(
    submissionId: string,
    marks: number,
    remarks: string,
    status: 'APPROVED' | 'REJECTED',
    userId: string,
    role: Role,
  ) {
    const submission = await this.prisma.capstoneSubmission.findUnique({
      where: { id: submissionId },
      include: {
        project: true,
        student: { select: { name: true } },
      },
    });
    if (!submission) throw new NotFoundException('Submission not found');

    await this.checkCoursePermission(submission.project.courseId, userId, role);

    if (status !== 'APPROVED' && status !== 'REJECTED') {
      throw new BadRequestException('Invalid status. Must be APPROVED or REJECTED');
    }

    const updated = await this.prisma.capstoneSubmission.update({
      where: { id: submissionId },
      data: {
        marks,
        remarks,
        status,
        reviewedAt: new Date(),
      },
    });

    // Notify the student
    await this.prisma.notification.create({
      data: {
        userId: submission.studentId,
        title: status === 'APPROVED' ? 'Capstone Project Approved! 🎉' : 'Capstone Project Needs Work ❌',
        message: status === 'APPROVED'
          ? `Your Capstone Project "${submission.project.title}" has been reviewed and APPROVED with ${marks} marks.`
          : `Your Capstone Project "${submission.project.title}" needs revisions. Coordinator remarks: "${remarks}"`,
        type: 'capstone_reviewed',
        entityId: submission.project.courseId,
      },
    }).catch(() => { });

    return updated;
  }

  async getCoordinatorSubmissions(coordinatorId: string) {
    const coordinator = await this.prisma.user.findUnique({
      where: { id: coordinatorId },
    });
    if (!coordinator) return [];

    const myDomain = coordinator.domain;

    return this.prisma.capstoneSubmission.findMany({
      where: {
        project: {
          course: {
            OR: [
              { projectCoordinatorId: coordinatorId },
              ...(myDomain
                ? [
                  {
                    domain: {
                      equals: myDomain,
                      mode: 'insensitive' as const,
                    },
                  },
                ]
                : []),
            ],
          },
        },
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
            employeeId: true,
            domain: true,
          },
        },
        project: {
          select: {
            title: true,
            courseId: true,
            course: {
              select: {
                title: true,
                domain: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }
}
