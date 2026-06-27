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
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SubmissionsService = class SubmissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submit(assignmentId, studentId, submissionText, fileUrl) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: { course: true },
        });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                studentId_courseId: { studentId, courseId: assignment.courseId },
            },
        });
        if (!enrollment)
            throw new common_1.BadRequestException('You are not enrolled in this course');
        const existing = await this.prisma.submission.findFirst({
            where: { assignmentId, studentId },
        });
        let submission;
        if (existing) {
            if (existing.status === client_1.SubmissionStatus.GRADED) {
                throw new common_1.BadRequestException('Cannot edit a graded submission');
            }
            submission = await this.prisma.submission.update({
                where: { id: existing.id },
                data: { submissionText, fileUrl, createdAt: new Date() },
            });
        }
        else {
            submission = await this.prisma.submission.create({
                data: {
                    assignmentId,
                    studentId,
                    submissionText,
                    fileUrl,
                },
            });
        }
        await this.prisma.notification
            .create({
            data: {
                userId: assignment.course.projectCoordinatorId,
                title: 'New Assignment Submission',
                message: `A student submitted answers for assignment "${assignment.title}".`,
            },
        })
            .catch(() => { });
        return submission;
    }
    async grade(submissionId, grade, feedback, projectCoordinatorId, role, isApproved) {
        const submission = await this.prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                assignment: {
                    include: { course: true },
                },
            },
        });
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        if (role !== client_1.Role.ADMIN && submission.assignment.course.projectCoordinatorId !== projectCoordinatorId) {
            const projectCoordinator = await this.prisma.user.findUnique({
                where: { id: projectCoordinatorId },
                select: { domain: true },
            });
            const courseDomain = submission.assignment.course.domain;
            if (!projectCoordinator ||
                !projectCoordinator.domain ||
                !courseDomain ||
                projectCoordinator.domain.toLowerCase() !== courseDomain.toLowerCase()) {
                throw new common_1.ForbiddenException('You do not have permission to grade this submission');
            }
        }
        const updated = await this.prisma.submission.update({
            where: { id: submissionId },
            data: {
                grade,
                feedback,
                status: client_1.SubmissionStatus.GRADED,
                gradedAt: new Date(),
                isApproved: isApproved !== undefined ? isApproved : true,
            },
        });
        await this.prisma.notification
            .create({
            data: {
                userId: submission.studentId,
                title: 'Assignment Graded',
                message: `Your submission for "${submission.assignment.title}" has been graded: ${grade}/100.`,
            },
        })
            .catch(() => { });
        return updated;
    }
    async getByAssignment(assignmentId, userId, role) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: { course: true },
        });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        if (role !== client_1.Role.ADMIN && assignment.course.projectCoordinatorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.submission.findMany({
            where: { assignmentId },
            include: {
                student: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getProjectCoordinatorSubmissions(projectCoordinatorId) {
        const projectCoordinator = await this.prisma.user.findUnique({
            where: { id: projectCoordinatorId },
        });
        let whereClause = {
            assignment: {
                course: {
                    projectCoordinatorId,
                },
            },
        };
        if (projectCoordinator && projectCoordinator.role === client_1.Role.PROJECT_COORDINATOR && projectCoordinator.domain) {
            whereClause = {
                assignment: {
                    course: {
                        domain: projectCoordinator.domain,
                    },
                },
            };
        }
        const submissions = await this.prisma.submission.findMany({
            where: whereClause,
            include: {
                student: { select: { name: true } },
                assignment: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return submissions.map((s) => ({
            id: s.id,
            submissionText: s.submissionText,
            fileUrl: s.fileUrl,
            grade: s.grade,
            feedback: s.feedback,
            status: s.status,
            studentId: s.studentId,
            studentName: s.student.name,
            assignmentId: s.assignmentId,
            assignmentTitle: s.assignment.title,
            isApproved: s.isApproved,
            createdAt: s.createdAt,
            gradedAt: s.gradedAt,
        }));
    }
    async getMySubmissions(studentId) {
        return this.prisma.submission.findMany({
            where: { studentId },
            include: {
                assignment: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map