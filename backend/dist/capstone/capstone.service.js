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
exports.CapstoneService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CapstoneService = class CapstoneService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkCoursePermission(courseId, userId, role) {
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
        return course;
    }
    // ---------------------------------------------------------------------------
    // Capstone Projects
    // ---------------------------------------------------------------------------
    async getProjectsByCourse(courseId) {
        return this.prisma.capstoneProject.findMany({
            where: { courseId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createProject(courseId, title, problemStatement, objectives, requiredTech, deliverables, instructions, userId, role) {
        await this.checkCoursePermission(courseId, userId, role);
        return this.prisma.capstoneProject.create({
            data: {
                title,
                problemStatement,
                objectives,
                requiredTech,
                deliverables,
                instructions,
                courseId,
            },
        });
    }
    async updateProject(id, data, userId, role) {
        const project = await this.prisma.capstoneProject.findUnique({
            where: { id },
        });
        if (!project)
            throw new common_1.NotFoundException('Capstone project not found');
        await this.checkCoursePermission(project.courseId, userId, role);
        return this.prisma.capstoneProject.update({
            where: { id },
            data,
        });
    }
    async deleteProject(id, userId, role) {
        const project = await this.prisma.capstoneProject.findUnique({
            where: { id },
        });
        if (!project)
            throw new common_1.NotFoundException('Capstone project not found');
        await this.checkCoursePermission(project.courseId, userId, role);
        await this.prisma.capstoneProject.delete({
            where: { id },
        });
        return { success: true };
    }
    // ---------------------------------------------------------------------------
    // Capstone Submissions
    // ---------------------------------------------------------------------------
    async getMySubmissions(studentId) {
        return this.prisma.capstoneSubmission.findMany({
            where: { studentId },
            include: {
                project: {
                    select: {
                        title: true,
                        courseId: true,
                    },
                },
            },
            orderBy: { submittedAt: 'desc' },
        });
    }
    async getSubmissionsByCourse(courseId, userId, role) {
        await this.checkCoursePermission(courseId, userId, role);
        return this.prisma.capstoneSubmission.findMany({
            where: {
                project: { courseId },
            },
            include: {
                student: {
                    select: {
                        name: true,
                        email: true,
                        employeeId: true,
                        domain: true,
                    },
                },
                project: {
                    select: {
                        title: true,
                        courseId: true,
                    },
                },
            },
            orderBy: { submittedAt: 'desc' },
        });
    }
    async saveSubmission(projectId, studentId, fileUrl, fileName) {
        const project = await this.prisma.capstoneProject.findUnique({
            where: { id: projectId },
            include: { course: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Capstone project not found');
        // Verify enrollment
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId,
                    courseId: project.courseId,
                },
            },
        });
        if (!enrollment) {
            throw new common_1.ForbiddenException('You must be enrolled in this course to submit a project');
        }
        return this.prisma.capstoneSubmission.upsert({
            where: {
                studentId_projectId: { studentId, projectId },
            },
            update: {
                fileUrl,
                fileName,
                status: 'PENDING',
                submittedAt: new Date(),
                marks: null,
                remarks: null,
                reviewedAt: null,
            },
            create: {
                studentId,
                projectId,
                fileUrl,
                fileName,
            },
        });
    }
    async reviewSubmission(submissionId, marks, remarks, status, userId, role) {
        const submission = await this.prisma.capstoneSubmission.findUnique({
            where: { id: submissionId },
            include: {
                project: true,
                student: { select: { name: true } },
            },
        });
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        await this.checkCoursePermission(submission.project.courseId, userId, role);
        if (status !== 'APPROVED' && status !== 'REJECTED') {
            throw new common_1.BadRequestException('Invalid status. Must be APPROVED or REJECTED');
        }
        const updated = await this.prisma.capstoneSubmission.update({
            where: { id: submissionId },
            data: {
                marks,
                remarks,
                status,
                reviewedAt: new Date(),
            },
        });
        // Notify the student
        await this.prisma.notification.create({
            data: {
                userId: submission.studentId,
                title: status === 'APPROVED' ? 'Capstone Project Approved! 🎉' : 'Capstone Project Needs Work ❌',
                message: status === 'APPROVED'
                    ? `Your Capstone Project "${submission.project.title}" has been reviewed and APPROVED with ${marks} marks.`
                    : `Your Capstone Project "${submission.project.title}" needs revisions. Coordinator remarks: "${remarks}"`,
                type: 'capstone_reviewed',
                entityId: submission.project.courseId,
            },
        }).catch(() => { });
        return updated;
    }
    async getCoordinatorSubmissions(coordinatorId) {
        const coordinator = await this.prisma.user.findUnique({
            where: { id: coordinatorId },
        });
        if (!coordinator)
            return [];
        const myDomain = coordinator.domain;
        return this.prisma.capstoneSubmission.findMany({
            where: {
                project: {
                    course: {
                        OR: [
                            { projectCoordinatorId: coordinatorId },
                            ...(myDomain
                                ? [
                                    {
                                        domain: {
                                            equals: myDomain,
                                            mode: 'insensitive',
                                        },
                                    },
                                ]
                                : []),
                        ],
                    },
                },
            },
            include: {
                student: {
                    select: {
                        name: true,
                        email: true,
                        employeeId: true,
                        domain: true,
                    },
                },
                project: {
                    select: {
                        title: true,
                        courseId: true,
                        course: {
                            select: {
                                title: true,
                                domain: true,
                            },
                        },
                    },
                },
            },
            orderBy: { submittedAt: 'desc' },
        });
    }
};
exports.CapstoneService = CapstoneService;
exports.CapstoneService = CapstoneService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CapstoneService);
//# sourceMappingURL=capstone.service.js.map