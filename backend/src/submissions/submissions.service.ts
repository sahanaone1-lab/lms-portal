import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus, Role } from '@prisma/client';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) { }

  async submit(
    assignmentId: string,
    studentId: string,
    submissionText?: string,
    fileUrl?: string,
    fileName?: string,
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
        data: { 
          submissionText, 
          fileUrl, 
          fileName: fileName || existing.fileName,
          courseId: assignment.courseId,
          moduleId: assignment.weekId,
          createdAt: new Date(),
        },
      });
    } else {
      submission = await this.prisma.submission.create({
        data: {
          assignmentId,
          studentId,
          submissionText,
          fileUrl,
          fileName,
          courseId: assignment.courseId,
          moduleId: assignment.weekId,
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
      .catch(() => { });

    return submission;
  }

  async saveUpload(
    assignmentId: string,
    studentId: string,
    fileUrl: string,
    fileName: string,
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
        data: { 
          fileUrl, 
          fileName, 
          courseId: assignment.courseId, 
          moduleId: assignment.weekId, 
          createdAt: new Date() 
        },
      });
    } else {
      submission = await this.prisma.submission.create({
        data: {
          assignmentId,
          studentId,
          fileUrl,
          fileName,
          courseId: assignment.courseId,
          moduleId: assignment.weekId,
        },
      });
    }

    return submission;
  }

  async delete(id: string, userId: string, role: Role) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: {
          include: { course: true },
        },
      },
    });
    if (!submission) throw new NotFoundException('Submission not found');

    // Interns can only delete their own uploads
    if (role === Role.INTERN && submission.studentId !== userId) {
      throw new ForbiddenException('You can only delete your own submissions');
    }

    // Coordinators cannot delete student submissions
    if (role === Role.PROJECT_COORDINATOR) {
      throw new ForbiddenException('Coordinators cannot delete student submissions');
    }

    // Delete physical file from storage if stored locally
    if (submission.fileUrl) {
      try {
        const filename = submission.fileUrl.substring(submission.fileUrl.lastIndexOf('/') + 1);
        const filePath = join(process.cwd(), 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Failed to delete physical file:', err);
      }
    }

    await this.prisma.submission.delete({
      where: { id },
    });

    return { success: true };
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

    // Coordinators can only grade students assigned to their courses or domain.
    if (role !== Role.ADMIN) {
      const isCreator = submission.assignment.course.projectCoordinatorId === projectCoordinatorId;
      const coordinator = await this.prisma.user.findUnique({ where: { id: projectCoordinatorId } });
      const matchesDomain = !!(
        coordinator?.domain &&
        submission.assignment.course.domain &&
        submission.assignment.course.domain.toLowerCase() === coordinator.domain.toLowerCase()
      );

      if (!isCreator && !matchesDomain) {
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
      include: {
        student: { select: { name: true, email: true } },
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    const weeks = (updated.assignment.course.weeks as any[]) || [];
    const moduleObj = weeks.find(w => w.id === updated.assignment.weekId);
    const moduleName = moduleObj ? moduleObj.title : 'General';

    let projectFileName = updated.fileName || '';
    if (!projectFileName && updated.fileUrl) {
      const parts = updated.fileUrl.split('/');
      projectFileName = parts[parts.length - 1];
    }

    const mappedResponse = {
      id: updated.id,
      submissionText: updated.submissionText,
      fileUrl: updated.fileUrl,
      grade: updated.grade,
      feedback: updated.feedback,
      status: updated.status,
      studentId: updated.studentId,
      studentName: updated.student.name,
      studentEmail: updated.student.email,
      courseId: updated.assignment.courseId,
      courseName: updated.assignment.course.title,
      courseDomain: updated.assignment.course.domain,
      moduleId: updated.assignment.weekId,
      moduleName,
      projectFileName,
      assignmentId: updated.assignmentId,
      assignmentTitle: updated.assignment.title,
      assignmentInstruction: updated.assignment.instruction,
      isApproved: updated.isApproved,
      createdAt: updated.createdAt,
      gradedAt: updated.gradedAt,
    };

    // Trigger notification to student
    await this.prisma.notification
      .create({
        data: {
          userId: submission.studentId,
          title: 'Assignment Graded',
          message: `Your submission for "${submission.assignment.title}" has been graded: ${grade}/100.`,
        },
      })
      .catch(() => { });

    return mappedResponse;
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
    if (!projectCoordinator) return [];

    const myDomain = projectCoordinator.domain;

    const whereClause = {
      assignment: {
        course: {
          OR: [
            { projectCoordinatorId },
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
    };

    const submissions = await this.prisma.submission.findMany({
      where: whereClause,
      include: {
        student: { select: { name: true, email: true } },
        assignment: { 
          include: {
            course: true
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return submissions.map((s) => {
      // Find Module Name from course weeks JSON
      const weeks = (s.assignment.course.weeks as any[]) || [];
      const moduleObj = weeks.find(w => w.id === s.assignment.weekId);
      const moduleName = moduleObj ? moduleObj.title : 'General';

      // Find file name
      let projectFileName = s.fileName || '';
      if (!projectFileName && s.fileUrl) {
        const parts = s.fileUrl.split('/');
        projectFileName = parts[parts.length - 1];
      }

      return {
        id: s.id,
        submissionText: s.submissionText,
        fileUrl: s.fileUrl,
        grade: s.grade,
        feedback: s.feedback,
        status: s.status,
        studentId: s.studentId,
        studentName: s.student.name,
        studentEmail: s.student.email,
        courseId: s.assignment.courseId,
        courseName: s.assignment.course.title,
        courseDomain: s.assignment.course.domain,
        moduleId: s.assignment.weekId,
        moduleName,
        projectFileName,
        assignmentId: s.assignmentId,
        assignmentTitle: s.assignment.title,
        assignmentInstruction: s.assignment.instruction,
        isApproved: s.isApproved,
        createdAt: s.createdAt,
        gradedAt: s.gradedAt,
      };
    });
  }

  async getAllSubmissions() {
    const submissions = await this.prisma.submission.findMany({
      include: {
        student: { select: { name: true, email: true } },
        assignment: { 
          include: {
            course: true
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return submissions.map((s) => {
      const weeks = (s.assignment.course.weeks as any[]) || [];
      const moduleObj = weeks.find(w => w.id === s.assignment.weekId);
      const moduleName = moduleObj ? moduleObj.title : 'General';

      let projectFileName = s.fileName || '';
      if (!projectFileName && s.fileUrl) {
        const parts = s.fileUrl.split('/');
        projectFileName = parts[parts.length - 1];
      }

      return {
        id: s.id,
        submissionText: s.submissionText,
        fileUrl: s.fileUrl,
        grade: s.grade,
        feedback: s.feedback,
        status: s.status,
        studentId: s.studentId,
        studentName: s.student.name,
        studentEmail: s.student.email,
        courseId: s.assignment.courseId,
        courseName: s.assignment.course.title,
        moduleId: s.assignment.weekId,
        moduleName,
        projectFileName,
        assignmentId: s.assignmentId,
        assignmentTitle: s.assignment.title,
        isApproved: s.isApproved,
        createdAt: s.createdAt,
        gradedAt: s.gradedAt,
      };
    });
  }

  async getMySubmissions(studentId: string) {
    return this.prisma.submission.findMany({
      where: { studentId },
      include: {
        assignment: { 
          select: { 
            title: true,
            weekId: true,
            courseId: true,
          } 
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
