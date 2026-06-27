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
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AssignmentsService = class AssignmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getByCourse(courseId) {
        return this.prisma.assignment.findMany({
            where: { courseId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(courseId, title, instruction, dueDate, userId, role, attachmentUrl, weekId) {
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
    async update(id, data, userId, role) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        if (role !== client_1.Role.ADMIN && assignment.course.projectCoordinatorId !== userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const isSameDomain = user && user.role === client_1.Role.PROJECT_COORDINATOR && user.domain &&
                user.domain.toLowerCase() === assignment.course.domain.toLowerCase();
            if (!isSameDomain) {
                throw new common_1.ForbiddenException('You do not own or have domain permissions for this course');
            }
        }
        return this.prisma.assignment.update({
            where: { id },
            data: data.dueDate ? { ...data, dueDate: new Date(data.dueDate) } : data,
        });
    }
    async delete(id, userId, role) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        if (role !== client_1.Role.ADMIN && assignment.course.projectCoordinatorId !== userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const isSameDomain = user && user.role === client_1.Role.PROJECT_COORDINATOR && user.domain &&
                user.domain.toLowerCase() === assignment.course.domain.toLowerCase();
            if (!isSameDomain) {
                throw new common_1.ForbiddenException('You do not own or have domain permissions for this course');
            }
        }
        await this.prisma.assignment.delete({ where: { id } });
        return { success: true };
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map