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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const youtube_service_1 = require("./youtube.service");
let LessonsService = class LessonsService {
    prisma;
    youtubeService;
    constructor(prisma, youtubeService) {
        this.prisma = prisma;
        this.youtubeService = youtubeService;
    }
    async getByCourse(courseId) {
        return this.prisma.lesson.findMany({
            where: { courseId },
            orderBy: { order: 'asc' },
        });
    }
    async create(courseId, title, content, videoUrl, order, userId, role, attachmentUrl, pdfResource, duration, weekId) {
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
        let finalVideoUrl = videoUrl;
        if (finalVideoUrl) {
            const validation = await this.youtubeService.validateUrl(finalVideoUrl);
            if (!validation.isValid) {
                const query = `${title} tutorial in English`;
                const replacement = await this.youtubeService.searchAlternative(query);
                if (replacement) {
                    finalVideoUrl = replacement.videoUrl;
                }
                else {
                    throw new common_1.BadRequestException(`The YouTube video is unavailable (${validation.reason}) and no suitable replacement could be found.`);
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
    async update(id, data, userId, role) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        if (role !== client_1.Role.ADMIN && lesson.course.projectCoordinatorId !== userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const isSameDomain = user && user.role === client_1.Role.PROJECT_COORDINATOR && user.domain &&
                user.domain.toLowerCase() === lesson.course.domain.toLowerCase();
            if (!isSameDomain) {
                throw new common_1.ForbiddenException('You do not own or have domain permissions for this course');
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
                }
                else {
                    throw new common_1.BadRequestException(`The YouTube video is unavailable (${validation.reason}) and no suitable replacement could be found.`);
                }
            }
        }
        return this.prisma.lesson.update({
            where: { id },
            data: updatedData,
        });
    }
    async delete(id, userId, role) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        if (role !== client_1.Role.ADMIN && lesson.course.projectCoordinatorId !== userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const isSameDomain = user && user.role === client_1.Role.PROJECT_COORDINATOR && user.domain &&
                user.domain.toLowerCase() === lesson.course.domain.toLowerCase();
            if (!isSameDomain) {
                throw new common_1.ForbiddenException('You do not own or have domain permissions for this course');
            }
        }
        await this.prisma.lesson.delete({ where: { id } });
        return { success: true };
    }
    async toggleProgress(lessonId, studentId, completed) {
        if (completed) {
            return this.prisma.lessonProgress.upsert({
                where: { studentId_lessonId: { studentId, lessonId } },
                update: {},
                create: { studentId, lessonId },
            });
        }
        else {
            return this.prisma.lessonProgress.deleteMany({
                where: { studentId, lessonId },
            });
        }
    }
    async getProgress(studentId) {
        const records = await this.prisma.lessonProgress.findMany({
            where: { studentId },
            select: { lessonId: true },
        });
        return records.map((r) => r.lessonId);
    }
    async suggestReplacement(id) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        const query = `${lesson.title} tutorial in English`;
        const replacement = await this.youtubeService.searchAlternative(query);
        if (!replacement) {
            throw new common_1.NotFoundException('No suitable alternative video could be found.');
        }
        return replacement;
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        youtube_service_1.YoutubeService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map