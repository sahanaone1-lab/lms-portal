import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async getByCourse(courseId: string) {
    return this.prisma.quiz.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
  }
  async create(
    courseId: string,
    title: string,
    passingScore: number,
    questions: any,
    userId: string,
    role: Role,
    timeLimit?: number,
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

    return this.prisma.quiz.create({
      data: {
        title,
        passingScore,
        questions, // JSON array of questions
        timeLimit: timeLimit ?? 30,
        weekId,
        courseId,
      },
    });
  }

  async update(
    id: string,
    data: { title?: string; passingScore?: number; questions?: any; timeLimit?: number; weekId?: string },
    userId: string,
    role: Role,
  ) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');

    if (role !== Role.ADMIN && quiz.course.projectCoordinatorId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const isSameDomain = user && user.role === Role.PROJECT_COORDINATOR && user.domain && 
        user.domain.toLowerCase() === quiz.course.domain.toLowerCase();
      if (!isSameDomain) {
        throw new ForbiddenException('You do not own or have domain permissions for this course');
      }
    }

    return this.prisma.quiz.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string, role: Role) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');

    if (role !== Role.ADMIN && quiz.course.projectCoordinatorId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const isSameDomain = user && user.role === Role.PROJECT_COORDINATOR && user.domain && 
        user.domain.toLowerCase() === quiz.course.domain.toLowerCase();
      if (!isSameDomain) {
        throw new ForbiddenException('You do not own or have domain permissions for this course');
      }
    }

    await this.prisma.quiz.delete({ where: { id } });
    return { success: true };
  }
  async submitAnswers(
    quizId: string,
    studentId: string,
    answers: { questionId: string; selectedOption: number }[],
  ) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz not found');

    const questionsList = quiz.questions as any[];
    if (!questionsList || questionsList.length === 0) {
      throw new BadRequestException('Quiz contains no questions');
    }

    // Grade options
    let correctCount = 0;
    questionsList.forEach((q) => {
      const submitted = answers.find((a) => a.questionId === q.id);
      if (submitted && submitted.selectedOption === q.correctOption) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questionsList.length) * 100);
    const passed = score >= quiz.passingScore;

    return this.prisma.quizResult.create({
      data: {
        score,
        passed,
        studentId,
        quizId,
      },
    });
  }

  async getMyResults(studentId: string) {
    return this.prisma.quizResult.findMany({
      where: { studentId },
      include: {
        quiz: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
