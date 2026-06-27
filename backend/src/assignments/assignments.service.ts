import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async getByCourse(courseId: string) {
    return this.prisma.assignment.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(
    courseId: string,
    title: string,
    instruction: string,
    dueDate: Date,
    userId: string,
    role: Role,
    attachmentUrl?: string,
    weekId?: string,
  ) {
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

    return this.prisma.assignment.create({
      data: {
        title,
        instruction,
        attachmentUrl,
        dueDate: new Date(dueDate),
        weekId,
        courseId,
      },
    });
  }

  async update(
    id: string,
    data: { title?: string; instruction?: string; dueDate?: Date; weekId?: string },
    userId: string,
    role: Role,
  ) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');

    if (role !== Role.ADMIN && assignment.course.projectCoordinatorId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const isSameDomain = user && user.role === Role.PROJECT_COORDINATOR && user.domain && 
        user.domain.toLowerCase() === assignment.course.domain.toLowerCase();
      if (!isSameDomain) {
        throw new ForbiddenException('You do not own or have domain permissions for this course');
      }
    }

    return this.prisma.assignment.update({
      where: { id },
      data: data.dueDate ? { ...data, dueDate: new Date(data.dueDate) } : data,
    });
  }

  async delete(id: string, userId: string, role: Role) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');

    if (role !== Role.ADMIN && assignment.course.projectCoordinatorId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const isSameDomain = user && user.role === Role.PROJECT_COORDINATOR && user.domain && 
        user.domain.toLowerCase() === assignment.course.domain.toLowerCase();
      if (!isSameDomain) {
        throw new ForbiddenException('You do not own or have domain permissions for this course');
      }
    }

    await this.prisma.assignment.delete({ where: { id } });
    return { success: true };
  }
}
