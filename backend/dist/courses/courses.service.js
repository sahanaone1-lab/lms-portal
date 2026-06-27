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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(userId, role) {
        if (role === client_1.Role.INTERN) {
            throw new common_1.ForbiddenException('Interns are not permitted to browse the course catalog');
        }
        return this.prisma.course.findMany({
            include: {
                projectCoordinator: {
                    select: { name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getById(id, userId, role) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                projectCoordinator: { select: { name: true } },
                lessons: { orderBy: { order: 'asc' } },
                assignments: true,
                quizzes: true,
            },
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (role === client_1.Role.INTERN) {
            const enrollment = await this.prisma.enrollment.findUnique({
                where: {
                    studentId_courseId: {
                        studentId: userId,
                        courseId: id,
                    },
                },
            });
            if (!enrollment) {
                throw new common_1.ForbiddenException('You must be enrolled in this course to access it');
            }
        }
        return course;
    }
    async create(data) {
        const { title, description, coverImage, projectCoordinatorId, domain, ...extra } = data;
        const activeDomain = domain
            ? await this.prisma.domain.findFirst({
                where: {
                    name: {
                        equals: domain,
                        mode: 'insensitive',
                    },
                },
            })
            : null;
        const normalizedDomain = activeDomain ? activeDomain.name : (domain || 'Full Stack');
        const course = await this.prisma.course.create({
            data: {
                title,
                description,
                coverImage,
                projectCoordinatorId,
                domain: normalizedDomain,
                ...extra,
            },
        });
        // Auto-enroll matching interns
        const interns = await this.prisma.user.findMany({
            where: {
                role: client_1.Role.INTERN,
                domain: {
                    equals: course.domain,
                    mode: 'insensitive',
                },
            },
        });
        for (const intern of interns) {
            await this.prisma.enrollment.upsert({
                where: {
                    studentId_courseId: {
                        studentId: intern.id,
                        courseId: course.id,
                    },
                },
                update: {},
                create: {
                    studentId: intern.id,
                    courseId: course.id,
                },
            }).catch(() => { });
        }
        return course;
    }
    async update(id, data, userId, role) {
        const course = await this.prisma.course.findUnique({ where: { id } });
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
        return this.prisma.course.update({
            where: { id },
            data,
        });
    }
    async delete(id, userId, role) {
        const course = await this.prisma.course.findUnique({ where: { id } });
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
        await this.prisma.course.delete({ where: { id } });
        return { success: true };
    }
    async enroll(studentId, courseId) {
        // Check if course exists
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return this.prisma.enrollment.create({
            data: {
                studentId,
                courseId,
            },
        });
    }
    async getMyEnrolled(studentId) {
        const student = await this.prisma.user.findUnique({
            where: { id: studentId },
            select: { domain: true },
        });
        const domain = student?.domain || 'Full Stack';
        const enrollments = await this.prisma.enrollment.findMany({
            where: {
                studentId,
                course: {
                    domain: {
                        equals: domain,
                        mode: 'insensitive',
                    },
                },
            },
            include: {
                course: {
                    include: {
                        projectCoordinator: { select: { name: true } },
                    },
                },
            },
        });
        return enrollments.map((e) => e.course);
    }
    async getMyCreated(projectCoordinatorId) {
        const projectCoordinator = await this.prisma.user.findUnique({
            where: { id: projectCoordinatorId },
        });
        if (projectCoordinator && projectCoordinator.role === client_1.Role.PROJECT_COORDINATOR && projectCoordinator.domain) {
            return this.prisma.course.findMany({
                where: {
                    domain: {
                        equals: projectCoordinator.domain,
                        mode: 'insensitive',
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        return this.prisma.course.findMany({
            where: { projectCoordinatorId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async uploadBrochure(id, brochureUrl, brochureName, brochureMimeType, userId, role) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (role !== client_1.Role.ADMIN && course.projectCoordinatorId !== userId) {
            const isSameDomain = user && user.role === client_1.Role.PROJECT_COORDINATOR && user.domain &&
                user.domain.toLowerCase() === course.domain.toLowerCase();
            if (!isSameDomain) {
                throw new common_1.ForbiddenException('You do not own or have domain permissions for this course');
            }
        }
        return this.prisma.course.update({
            where: { id },
            data: {
                brochureUrl,
                brochureName,
                brochureFileName: brochureName,
                brochureMimeType,
                uploadedBy: user.name,
                uploadedAt: new Date(),
            },
        });
    }
    async deleteBrochure(id, userId, role) {
        const course = await this.prisma.course.findUnique({ where: { id } });
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
        return this.prisma.course.update({
            where: { id },
            data: {
                brochureUrl: null,
                brochureName: null,
                brochureFileName: null,
                brochureMimeType: null,
                uploadedBy: null,
                uploadedAt: null,
            },
        });
    }
    async getDomainBrochures() {
        const courses = await this.prisma.course.findMany({
            where: {
                brochureUrl: { not: null },
            },
            orderBy: { createdAt: 'desc' },
            select: {
                domain: true,
                brochureUrl: true,
                brochureName: true,
            },
        });
        const brochureMap = {};
        for (const course of courses) {
            if (course.domain && !brochureMap[course.domain]) {
                brochureMap[course.domain] = {
                    brochureUrl: course.brochureUrl,
                    brochureName: course.brochureName,
                };
            }
        }
        return brochureMap;
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map