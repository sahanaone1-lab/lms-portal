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
exports.ModulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ModulesService = class ModulesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ─── Get all modules for a course (ordered) ──────────────────────────────
    async getByCourse(courseId) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
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
    async create(courseId, title, description, order, userId, role) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
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
    async update(id, data, userId, role) {
        const mod = await this.prisma.module.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!mod)
            throw new common_1.NotFoundException('Module not found');
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
    async delete(id, userId, role) {
        const mod = await this.prisma.module.findUnique({
            where: { id },
            include: { course: true, lessons: true },
        });
        if (!mod)
            throw new common_1.NotFoundException('Module not found');
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
    async reorder(courseId, orderedIds, userId, role) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
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
    async syncCourseWeeks(courseId) {
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
            data: { weeks: weeks },
        });
    }
    // ─── Permission helper ────────────────────────────────────────────────────
    async checkCoursePermission(course, userId, role) {
        if (role === client_1.Role.ADMIN)
            return;
        if (course.projectCoordinatorId === userId)
            return;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const isSameDomain = user &&
            user.role === client_1.Role.PROJECT_COORDINATOR &&
            user.domain &&
            user.domain.toLowerCase() === course.domain.toLowerCase();
        if (!isSameDomain) {
            throw new common_1.ForbiddenException('You do not have permission to manage modules for this course');
        }
    }
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ModulesService);
//# sourceMappingURL=modules.service.js.map