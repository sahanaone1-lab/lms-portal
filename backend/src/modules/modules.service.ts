import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  // ─── Get all modules for a course (ordered) ──────────────────────────────
  async getByCourse(courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    return this.prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            content: true,
            videoUrl: true,
            duration: true,
            order: true,
            weekId: true,
            moduleId: true,
            courseId: true,
            createdAt: true,
          },
        },
      },
    });
  }

  // ─── Create a new module ──────────────────────────────────────────────────
  async create(
    courseId: string,
    title: string,
    description: string | undefined,
    order: number | undefined,
    userId: string,
    role: Role,
  ) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    await this.checkCoursePermission(course, userId, role);

    // Auto-assign order if not provided
    if (order === undefined || order === null) {
      const count = await this.prisma.module.count({ where: { courseId } });
      order = count + 1;
    }

    const newModule = await this.prisma.module.create({
      data: {
        courseId,
        title,
        description,
        order,
      },
      include: {
        lessons: { orderBy: { order: 'asc' } },
      },
    });

    // Also keep course.weeks JSON in sync for backward compat
    await this.syncCourseWeeks(courseId);

    return newModule;
  }

  // ─── Update a module ──────────────────────────────────────────────────────
  async update(
    id: string,
    data: { title?: string; description?: string; order?: number },
    userId: string,
    role: Role,
  ) {
    const mod = await this.prisma.module.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!mod) throw new NotFoundException('Module not found');

    await this.checkCoursePermission(mod.course, userId, role);

    const updated = await this.prisma.module.update({
      where: { id },
      data,
      include: {
        lessons: { orderBy: { order: 'asc' } },
      },
    });

    // Sync course.weeks JSON
    await this.syncCourseWeeks(mod.courseId);

    return updated;
  }

  // ─── Delete a module ──────────────────────────────────────────────────────
  async delete(id: string, userId: string, role: Role) {
    const mod = await this.prisma.module.findUnique({
      where: { id },
      include: { course: true, lessons: true },
    });
    if (!mod) throw new NotFoundException('Module not found');

    await this.checkCoursePermission(mod.course, userId, role);

    // Reassign lessons to the next available module (or null)
    if (mod.lessons.length > 0) {
      const sibling = await this.prisma.module.findFirst({
        where: { courseId: mod.courseId, id: { not: id } },
        orderBy: { order: 'asc' },
      });
      await this.prisma.lesson.updateMany({
        where: { moduleId: id },
        data: { moduleId: sibling?.id ?? null, weekId: sibling?.id ?? null },
      });
    }

    await this.prisma.module.delete({ where: { id } });

    // Re-number remaining modules
    const remaining = await this.prisma.module.findMany({
      where: { courseId: mod.courseId },
      orderBy: { order: 'asc' },
    });
    for (let i = 0; i < remaining.length; i++) {
      await this.prisma.module.update({
        where: { id: remaining[i].id },
        data: { order: i + 1 },
      });
    }

    // Sync course.weeks JSON
    await this.syncCourseWeeks(mod.courseId);

    return { success: true };
  }

  // ─── Reorder modules ──────────────────────────────────────────────────────
  async reorder(
    courseId: string,
    orderedIds: string[],
    userId: string,
    role: Role,
  ) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    await this.checkCoursePermission(course, userId, role);

    for (let i = 0; i < orderedIds.length; i++) {
      await this.prisma.module.updateMany({
        where: { id: orderedIds[i], courseId },
        data: { order: i + 1 },
      });
    }

    await this.syncCourseWeeks(courseId);
    return { success: true };
  }

  // ─── Sync Course.weeks JSON for backward compatibility ────────────────────
  private async syncCourseWeeks(courseId: string) {
    const modules = await this.prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
    const weeks = modules.map((m, idx) => ({
      id: m.id,
      number: idx + 1,
      title: m.title,
    }));
    await this.prisma.course.update({
      where: { id: courseId },
      data: { weeks: weeks as any },
    });
  }

  // ─── Permission helper ────────────────────────────────────────────────────
  private async checkCoursePermission(course: any, userId: string, role: Role) {
    if (role === Role.ADMIN) return;
    if (course.projectCoordinatorId === userId) return;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const isSameDomain =
      user &&
      user.role === Role.PROJECT_COORDINATOR &&
      user.domain &&
      user.domain.toLowerCase() === course.domain.toLowerCase();

    if (!isSameDomain) {
      throw new ForbiddenException(
        'You do not have permission to manage modules for this course',
      );
    }
  }
}
