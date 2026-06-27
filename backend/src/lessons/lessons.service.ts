import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { YoutubeService } from './youtube.service';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private youtubeService: YoutubeService,
  ) {}

  async getByCourse(courseId: string) {
    return this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }
  async create(
    courseId: string,
    title: string,
    content: string,
    videoUrl: string | undefined,
    order: number,
    userId: string,
    role: Role,
    attachmentUrl?: string,
    pdfResource?: string,
    duration?: string,
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

    let finalVideoUrl = videoUrl;
    if (finalVideoUrl) {
      const validation = await this.youtubeService.validateUrl(finalVideoUrl);
      if (!validation.isValid) {
        const query = `${title} tutorial in English`;
        const replacement = await this.youtubeService.searchAlternative(query);
        if (replacement) {
          finalVideoUrl = replacement.videoUrl;
        } else {
          throw new BadRequestException(
            `The YouTube video is unavailable (${validation.reason}) and no suitable replacement could be found.`,
          );
        }
      }
    }

    return this.prisma.lesson.create({
      data: {
        title,
        content,
        videoUrl: finalVideoUrl,
        attachmentUrl,
        pdfResource,
        duration,
        weekId,
        order,
        courseId,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      content?: string;
      videoUrl?: string;
      pdfResource?: string;
      duration?: string;
      weekId?: string;
      order?: number;
    },
    userId: string,
    role: Role,
  ) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    if (role !== Role.ADMIN && lesson.course.projectCoordinatorId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const isSameDomain = user && user.role === Role.PROJECT_COORDINATOR && user.domain && 
        user.domain.toLowerCase() === lesson.course.domain.toLowerCase();
      if (!isSameDomain) {
        throw new ForbiddenException('You do not own or have domain permissions for this course');
      }
    }

    const updatedData = { ...data };
    if (updatedData.videoUrl) {
      const validation = await this.youtubeService.validateUrl(updatedData.videoUrl);
      if (!validation.isValid) {
        const query = `${updatedData.title || lesson.title} tutorial in English`;
        const replacement = await this.youtubeService.searchAlternative(query);
        if (replacement) {
          updatedData.videoUrl = replacement.videoUrl;
        } else {
          throw new BadRequestException(
            `The YouTube video is unavailable (${validation.reason}) and no suitable replacement could be found.`,
          );
        }
      }
    }

    return this.prisma.lesson.update({
      where: { id },
      data: updatedData,
    });
  }

  async delete(id: string, userId: string, role: Role) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    if (role !== Role.ADMIN && lesson.course.projectCoordinatorId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const isSameDomain = user && user.role === Role.PROJECT_COORDINATOR && user.domain && 
        user.domain.toLowerCase() === lesson.course.domain.toLowerCase();
      if (!isSameDomain) {
        throw new ForbiddenException('You do not own or have domain permissions for this course');
      }
    }

    await this.prisma.lesson.delete({ where: { id } });
    return { success: true };
  }
  async toggleProgress(lessonId: string, studentId: string, completed: boolean) {
    if (completed) {
      return this.prisma.lessonProgress.upsert({
        where: { studentId_lessonId: { studentId, lessonId } },
        update: {},
        create: { studentId, lessonId },
      });
    } else {
      return this.prisma.lessonProgress.deleteMany({
        where: { studentId, lessonId },
      });
    }
  }

  async getProgress(studentId: string) {
    const records = await this.prisma.lessonProgress.findMany({
      where: { studentId },
      select: { lessonId: true },
    });
    return records.map((r) => r.lessonId);
  }

  async suggestReplacement(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    const query = `${lesson.title} tutorial in English`;
    const replacement = await this.youtubeService.searchAlternative(query);
    if (!replacement) {
      throw new NotFoundException('No suitable alternative video could be found.');
    }
    return replacement;
  }
}
