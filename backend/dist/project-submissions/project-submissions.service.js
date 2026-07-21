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
var ProjectSubmissionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const s3_service_1 = require("../aws/s3.service");
let ProjectSubmissionsService = ProjectSubmissionsService_1 = class ProjectSubmissionsService {
    constructor(prisma, s3Service) {
        this.prisma = prisma;
        this.s3Service = s3Service;
        this.logger = new common_1.Logger(ProjectSubmissionsService_1.name);
    }
    /**
     * Find the correct Project Coordinator for the given domain.
     * Searches by exact domain match (case-insensitive), prefers coordinators
     * who own courses in that domain — falls back to any coordinator with matching domain field.
     */
    async findCoordinatorByDomain(domain) {
        // Try to find coordinator who owns a course in this domain
        const courseWithCoord = await this.prisma.course.findFirst({
            where: {
                domain: { equals: domain, mode: 'insensitive' },
            },
            include: {
                projectCoordinator: {
                    select: { id: true, role: true },
                },
            },
        });
        if (courseWithCoord?.projectCoordinator &&
            courseWithCoord.projectCoordinator.role === client_1.Role.PROJECT_COORDINATOR) {
            return courseWithCoord.projectCoordinator.id;
        }
        // Fall back: find any coordinator whose domain field matches
        const coordinator = await this.prisma.user.findFirst({
            where: {
                role: client_1.Role.PROJECT_COORDINATOR,
                domain: { equals: domain, mode: 'insensitive' },
            },
            select: { id: true },
        });
        if (coordinator) {
            return coordinator.id;
        }
        // Last resort: any coordinator
        const anyCoordinator = await this.prisma.user.findFirst({
            where: { role: client_1.Role.PROJECT_COORDINATOR },
            select: { id: true },
        });
        if (anyCoordinator) {
            this.logger.warn(`No coordinator found for domain "${domain}", falling back to first available coordinator`);
            return anyCoordinator.id;
        }
        throw new common_1.NotFoundException(`No Project Coordinator found for domain "${domain}". Please contact an administrator.`);
    }
    /**
     * Upload a file to S3 and save the submission record in the database.
     * Auto-assigns the correct Project Coordinator based on the intern's domain.
     */
    async uploadAndSave(file, projectId, title, description, studentId) {
        // Load student info
        const student = await this.prisma.user.findUnique({
            where: { id: studentId },
            select: { id: true, name: true, email: true, domain: true, role: true },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        if (student.role !== client_1.Role.INTERN) {
            throw new common_1.ForbiddenException('Only interns can submit projects');
        }
        const internDomain = student.domain;
        if (!internDomain) {
            throw new common_1.BadRequestException('Your account does not have a domain assigned. Please contact an administrator.');
        }
        // Validate projectId if provided
        let resolvedCourseId = null;
        if (projectId) {
            const project = await this.prisma.project.findUnique({
                where: { id: projectId },
            });
            if (!project) {
                throw new common_1.NotFoundException('Project not found');
            }
            // Verify intern's domain matches project's domain
            if (project.domain.toLowerCase() !== internDomain.toLowerCase()) {
                throw new common_1.ForbiddenException('You can only submit for projects in your domain');
            }
        }
        // Resolve coordinator by domain
        const projectCoordinatorId = await this.findCoordinatorByDomain(internDomain);
        // Upload file to S3
        let s3ObjectKey;
        try {
            s3ObjectKey = await this.s3Service.uploadFile(file, 'proj-submission-');
        }
        catch (err) {
            this.logger.error('S3 upload failed:', err);
            throw new common_1.InternalServerErrorException('File upload to S3 failed. Please try again.');
        }
        // Build the backend-proxied file URL (auth-gated via /uploads/:key)
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
        const fileUrl = `${backendUrl}/uploads/${encodeURIComponent(s3ObjectKey)}`;
        // Save submission to database
        try {
            const submission = await this.prisma.projectSubmission.create({
                data: {
                    title,
                    description,
                    studentId,
                    studentName: student.name,
                    studentEmail: student.email,
                    domain: internDomain,
                    courseId: resolvedCourseId,
                    projectCoordinatorId,
                    projectId: projectId || null,
                    fileUrl,
                    fileName: file.originalname,
                    status: client_1.ProjectSubmissionStatus.SUBMITTED,
                },
                include: {
                    student: { select: { name: true, email: true, domain: true } },
                    projectCoordinator: { select: { name: true, email: true } },
                    project: { select: { title: true } },
                },
            });
            // Notify the coordinator
            await this.prisma.notification
                .create({
                data: {
                    userId: projectCoordinatorId,
                    title: '📁 New Project Submission',
                    message: `Intern "${student.name}" (${internDomain}) submitted project: "${title}".`,
                    type: 'project_submission',
                    entityId: submission.id,
                },
            })
                .catch((err) => {
                this.logger.warn('Failed to send coordinator notification:', err?.message);
            });
            return submission;
        }
        catch (err) {
            this.logger.error('Database save failed after S3 upload:', err);
            throw new common_1.InternalServerErrorException('File uploaded to S3 but database save failed. Please contact support.');
        }
    }
    /**
     * Get submissions — role-based:
     * - INTERN: sees only own submissions
     * - PROJECT_COORDINATOR: sees domain-matched submissions
     * - ADMIN: sees all submissions
     */
    async findAll(userId, role) {
        if (role === client_1.Role.INTERN) {
            return this.prisma.projectSubmission.findMany({
                where: { studentId: userId },
                include: {
                    projectCoordinator: { select: { name: true, email: true } },
                    project: { select: { title: true, domain: true } },
                },
                orderBy: { submittedAt: 'desc' },
            });
        }
        if (role === client_1.Role.PROJECT_COORDINATOR) {
            const coordinator = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { domain: true },
            });
            const myDomain = coordinator?.domain;
            return this.prisma.projectSubmission.findMany({
                where: {
                    OR: [
                        { projectCoordinatorId: userId },
                        ...(myDomain
                            ? [{ domain: { equals: myDomain, mode: 'insensitive' } }]
                            : []),
                    ],
                },
                include: {
                    student: { select: { name: true, email: true, domain: true, employeeId: true } },
                    project: { select: { title: true, domain: true } },
                },
                orderBy: { submittedAt: 'desc' },
            });
        }
        if (role === client_1.Role.ADMIN) {
            return this.prisma.projectSubmission.findMany({
                include: {
                    student: { select: { name: true, email: true, domain: true, employeeId: true } },
                    projectCoordinator: { select: { name: true, email: true } },
                    project: { select: { title: true, domain: true } },
                },
                orderBy: { submittedAt: 'desc' },
            });
        }
        throw new common_1.ForbiddenException('Access denied');
    }
    /**
     * Coordinator or admin reviews a submission — updates status and remarks.
     */
    async review(submissionId, status, remarks, reviewerId, role) {
        const submission = await this.prisma.projectSubmission.findUnique({
            where: { id: submissionId },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Project submission not found');
        }
        // Authorization check
        if (role !== client_1.Role.ADMIN) {
            const coordinator = await this.prisma.user.findUnique({
                where: { id: reviewerId },
                select: { domain: true },
            });
            const isAssigned = submission.projectCoordinatorId === reviewerId;
            const isSameDomain = coordinator?.domain &&
                submission.domain.toLowerCase() === coordinator.domain.toLowerCase();
            if (!isAssigned && !isSameDomain) {
                throw new common_1.ForbiddenException('You do not have permission to review this submission');
            }
        }
        if (!['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
            throw new common_1.BadRequestException('Invalid status. Must be SUBMITTED, UNDER_REVIEW, APPROVED, or REJECTED');
        }
        const updated = await this.prisma.projectSubmission.update({
            where: { id: submissionId },
            data: {
                status,
                remarks: remarks ?? submission.remarks,
                reviewedAt: new Date(),
            },
            include: {
                student: { select: { name: true, email: true } },
                projectCoordinator: { select: { name: true, email: true } },
                project: { select: { title: true } },
            },
        });
        // Notify the intern
        const statusLabel = status === client_1.ProjectSubmissionStatus.APPROVED
            ? 'Approved ✅'
            : status === client_1.ProjectSubmissionStatus.REJECTED
                ? 'Rejected ❌'
                : status === client_1.ProjectSubmissionStatus.UNDER_REVIEW
                    ? 'Under Review 🔍'
                    : 'Updated';
        await this.prisma.notification
            .create({
            data: {
                userId: submission.studentId,
                title: `Project Submission ${statusLabel}`,
                message: remarks
                    ? `Your project "${submission.title}" status updated to ${status}. Remarks: "${remarks}"`
                    : `Your project "${submission.title}" status updated to ${status}.`,
                type: 'project_submission_reviewed',
                entityId: submissionId,
            },
        })
            .catch((err) => {
            this.logger.warn('Failed to send intern notification:', err?.message);
        });
        return updated;
    }
    /**
     * Get a single submission by ID (for file access / download URL generation).
     */
    async findOne(submissionId, userId, role) {
        const submission = await this.prisma.projectSubmission.findUnique({
            where: { id: submissionId },
            include: {
                student: { select: { name: true, email: true } },
                projectCoordinator: { select: { name: true, email: true } },
                project: { select: { title: true } },
            },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Project submission not found');
        }
        // Access control
        if (role === client_1.Role.INTERN && submission.studentId !== userId) {
            throw new common_1.ForbiddenException('You can only view your own submissions');
        }
        if (role === client_1.Role.PROJECT_COORDINATOR) {
            const coordinator = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { domain: true },
            });
            const hasAccess = submission.projectCoordinatorId === userId ||
                (coordinator?.domain &&
                    submission.domain.toLowerCase() === coordinator.domain.toLowerCase());
            if (!hasAccess) {
                throw new common_1.ForbiddenException('You do not have access to this submission');
            }
        }
        return submission;
    }
};
exports.ProjectSubmissionsService = ProjectSubmissionsService;
exports.ProjectSubmissionsService = ProjectSubmissionsService = ProjectSubmissionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service])
], ProjectSubmissionsService);
//# sourceMappingURL=project-submissions.service.js.map