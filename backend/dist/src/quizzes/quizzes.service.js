"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizzesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let QuizzesService = class QuizzesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getByCourse(courseId) {
        return this.prisma.quiz.findMany({
            where: { courseId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(courseId, title, passingScore, questions, userId, role, timeLimit, weekId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (role !== client_1.Role.ADMIN && course.projectCoordinatorId !== userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const isSameDomain = user && user.role === client_1.Role.PROJECT_COORDINATOR && user.domain &&
                user.domain.toLowerCase() === course.domain.toLowerCase();
            if (!isSameDomain) {
                throw new common_1.ForbiddenException('You do not own or have domain permissions for this course');
            }
        }
        return this.prisma.quiz.create({
            data: {
                title,
                passingScore,
                questions,
                timeLimit: timeLimit ?? 30,
                weekId,
                courseId,
            },
        });
    }
    async update(id, data, userId, role) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        if (role !== client_1.Role.ADMIN && quiz.course.projectCoordinatorId !== userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const isSameDomain = user && user.role === client_1.Role.PROJECT_COORDINATOR && user.domain &&
                user.domain.toLowerCase() === quiz.course.domain.toLowerCase();
            if (!isSameDomain) {
                throw new common_1.ForbiddenException('You do not own or have domain permissions for this course');
            }
        }
        return this.prisma.quiz.update({
            where: { id },
            data,
        });
    }
    async delete(id, userId, role) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        if (role !== client_1.Role.ADMIN && quiz.course.projectCoordinatorId !== userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const isSameDomain = user && user.role === client_1.Role.PROJECT_COORDINATOR && user.domain &&
                user.domain.toLowerCase() === quiz.course.domain.toLowerCase();
            if (!isSameDomain) {
                throw new common_1.ForbiddenException('You do not own or have domain permissions for this course');
            }
        }
        await this.prisma.quiz.delete({ where: { id } });
        return { success: true };
    }
    async submitAnswers(quizId, studentId, answers) {
        const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        const questionsList = quiz.questions;
        if (!questionsList || questionsList.length === 0) {
            throw new common_1.BadRequestException('Quiz contains no questions');
        }
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
    async getMyResults(studentId) {
        return this.prisma.quizResult.findMany({
            where: { studentId },
            include: {
                quiz: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.QuizzesService = QuizzesService;
exports.QuizzesService = QuizzesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizzesService);
//# sourceMappingURL=quizzes.service.js.map