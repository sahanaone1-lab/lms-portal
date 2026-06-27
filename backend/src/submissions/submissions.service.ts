import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus, Role } from '@prisma/client';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async submit(
    assignmentId: string,
    studentId: string,
    submissionText?: string,
    fileUrl?: string,
  ) {
    // Verify assignment exists
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { course: true },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');

    // Check if user is enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId: assignment.courseId },
      },
    });
    if (!enrollment)
      throw new BadRequestException('You are not enrolled in this course');

    // Create or update submission
    const existing = await this.prisma.submission.findFirst({
      where: { assignmentId, studentId },
    });

    let submission;
    if (existing) {
      if (existing.status === SubmissionStatus.GRADED) {
        throw new BadRequestException('Cannot edit a graded submission');
      }
      submission = await this.prisma.submission.update({
        where: { id: existing.id },
        data: { submissionText, fileUrl, createdAt: new Date() },
      });
    } else {
      submission = await this.prisma.submission.create({
        data: {
          assignmentId,
          studentId,
          submissionText,
          fileUrl,
        },
      });
    }

    // Trigger notification to project coordinator
    await this.prisma.notification
      .create({
        data: {
          userId: assignment.course.projectCoordinatorId,
          title: 'New Assignment Submission',
          message: `A student submitted answers for assignment "${assignment.title}".`,
        },
      })
      .catch(() => {});

    return submission;
  }

  async grade(
    submissionId: string,
    grade: number,
    feedback: string,
    projectCoordinatorId: string,
    role: Role,
    isApproved?: boolean,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: { course: true },
        },
      },
    });
    if (!submission) throw new NotFoundException('Submission not found');

    // Allow: ADMIN, course owner, or any project coordinator whose domain matches the course domain
    if (role !== Role.ADMIN && submission.assignment.course.projectCoordinatorId !== projectCoordinatorId) {
      // Check if project coordinator's domain matches course domain
      const projectCoordinator = await this.prisma.user.findUnique({
        where: { id: projectCoordinatorId },
        select: { domain: true },
      });
      const courseDomain = submission.assignment.course.domain;
      if (
        !projectCoordinator ||
        !projectCoordinator.domain ||
        !courseDomain ||
        projectCoordinator.domain.toLowerCase() !== courseDomain.toLowerCase()
      ) {
        throw new ForbiddenException('You do not have permission to grade this submission');
      }
    }

    const updated = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        grade,
        feedback,
        status: SubmissionStatus.GRADED,
        gradedAt: new Date(),
        isApproved: isApproved !== undefined ? isApproved : true,
      },
    });

    // Trigger notification to student
    await this.prisma.notification
      .create({
        data: {
          userId: submission.studentId,
          title: 'Assignment Graded',
          message: `Your submission for "${submission.assignment.title}" has been graded: ${grade}/100.`,
        },
      })
      .catch(() => {});

    return updated;
  }

  async getByAssignment(assignmentId: string, userId: string, role: Role) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { course: true },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');

    if (role !== Role.ADMIN && assignment.course.projectCoordinatorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectCoordinatorSubmissions(projectCoordinatorId: string) {
    const projectCoordinator = await this.prisma.user.findUnique({
      where: { id: projectCoordinatorId },
    });

    let whereClause: any = {
      assignment: {
        course: {
          projectCoordinatorId,
        },
      },
    };

    if (projectCoordinator && projectCoordinator.role === Role.PROJECT_COORDINATOR && projectCoordinator.domain) {
      whereClause = {
        assignment: {
          course: {
            domain: projectCoordinator.domain,
          },
        },
      };
    }

    const submissions = await this.prisma.submission.findMany({
      where: whereClause,
      include: {
        student: { select: { name: true } },
        assignment: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return submissions.map((s) => ({
      id: s.id,
      submissionText: s.submissionText,
      fileUrl: s.fileUrl,
      grade: s.grade,
      feedback: s.feedback,
      status: s.status,
      studentId: s.studentId,
      studentName: s.student.name,
      assignmentId: s.assignmentId,
      assignmentTitle: s.assignment.title,
      isApproved: s.isApproved,
      createdAt: s.createdAt,
      gradedAt: s.gradedAt,
    }));
  }

  async getMySubmissions(studentId: string) {
    return this.prisma.submission.findMany({
      where: { studentId },
      include: {
        assignment: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
