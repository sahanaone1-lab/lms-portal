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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CertificatesService = class CertificatesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyCertificates(studentId) {
        const certs = await this.prisma.certificate.findMany({
            where: { studentId },
            include: {
                course: { select: { title: true } },
                student: { select: { name: true } },
            },
            orderBy: { issuedAt: 'desc' },
        });
        const approved = certs.map(c => ({
            id: c.id,
            certificateCode: c.certificateCode,
            studentId: c.studentId,
            courseId: c.courseId,
            issuedAt: c.issuedAt,
            status: 'Approved',
            studentName: c.student.name,
            courseTitle: c.course.title
        }));
        const requests = await this.prisma.certificateRequest.findMany({
            where: { studentId, status: { in: ['PENDING', 'REJECTED'] } },
            include: {
                course: { select: { title: true } },
                student: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        const pendingRejected = requests.map((r) => ({
            id: r.id,
            certificateCode: '',
            studentId: r.studentId,
            courseId: r.courseId,
            issuedAt: null,
            status: r.status === 'PENDING' ? 'Pending Approval' : 'Rejected',
            studentName: r.student.name,
            courseTitle: r.course.title,
            requestDate: r.createdAt
        }));
        return [...pendingRejected, ...approved];
    }
    async claim(studentId, courseId) {
        // 1. Verify enrollment
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { studentId_courseId: { studentId, courseId } },
        });
        if (!enrollment)
            throw new common_1.BadRequestException('You are not enrolled in this course');
        // 2. Check if already claimed
        const existingReq = await this.prisma.certificateRequest.findUnique({
            where: { studentId_courseId: { studentId, courseId } },
        });
        if (existingReq) {
            if (existingReq.status === 'APPROVED') {
                throw new common_1.BadRequestException('Certificate has already been approved and issued.');
            }
            if (existingReq.status === 'PENDING') {
                return existingReq;
            }
            // If rejected, set back to PENDING to allow re-claiming
            if (existingReq.status === 'REJECTED') {
                return this.prisma.certificateRequest.update({
                    where: { id: existingReq.id },
                    data: { status: 'PENDING' },
                });
            }
        }
        // 3. Verify course weeks and projects
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        const weeks = course.weeks || [];
        const projectWeekIds = weeks.filter((w) => w.type === 'Project').map((w) => w.id);
        const assignments = await this.prisma.assignment.findMany({
            where: { courseId },
        });
        for (const assignment of assignments) {
            const submission = await this.prisma.submission.findFirst({
                where: { assignmentId: assignment.id, studentId },
            });
            const isProject = assignment.weekId && projectWeekIds.includes(assignment.weekId);
            if (isProject) {
                if (!submission) {
                    throw new common_1.BadRequestException(`Cannot claim certificate. Please submit project: ${assignment.title}`);
                }
                if (!submission.isApproved) {
                    throw new common_1.BadRequestException(`Cannot claim certificate. Project "${assignment.title}" is pending project coordinator approval.`);
                }
            }
            else {
                // Regular assignment just needs submission
                if (!submission) {
                    throw new common_1.BadRequestException(`Cannot claim certificate. Please submit assignment: ${assignment.title}`);
                }
            }
        }
        // 4. Verify all quizzes passed
        const quizzes = await this.prisma.quiz.findMany({ where: { courseId } });
        for (const quiz of quizzes) {
            const passedResult = await this.prisma.quizResult.findFirst({
                where: { quizId: quiz.id, studentId, passed: true },
            });
            if (!passedResult) {
                throw new common_1.BadRequestException(`Cannot claim certificate. Please pass quiz: ${quiz.title}`);
            }
        }
        // Create the CertificateRequest in PENDING status
        return this.prisma.certificateRequest.create({
            data: {
                studentId,
                courseId,
                status: 'PENDING',
            },
        });
    }
    async getDomainCertificateRequests(projectCoordinatorId) {
        const projectCoordinator = await this.prisma.user.findUnique({
            where: { id: projectCoordinatorId },
        });
        if (!projectCoordinator || projectCoordinator.role !== 'PROJECT_COORDINATOR' || !projectCoordinator.domain) {
            return [];
        }
        const domain = projectCoordinator.domain;
        const requests = await this.prisma.certificateRequest.findMany({
            where: {
                course: {
                    domain: {
                        equals: domain,
                        mode: 'insensitive',
                    },
                },
            },
            include: {
                student: { select: { name: true, employeeId: true } },
                course: { select: { title: true, domain: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return requests.map((r) => ({
            id: r.id,
            studentId: r.studentId,
            studentName: r.student.name,
            studentEmployeeId: r.student.employeeId,
            courseId: r.courseId,
            courseTitle: r.course.title,
            courseDomain: r.course.domain,
            requestDate: r.createdAt,
            status: r.status === 'PENDING' ? 'Pending Approval' : (r.status === 'APPROVED' ? 'Approved' : 'Rejected')
        }));
    }
    async approveRequest(requestId) {
        const req = await this.prisma.certificateRequest.findUnique({
            where: { id: requestId },
            include: {
                course: { select: { title: true } },
                student: { select: { name: true } }
            }
        });
        if (!req)
            throw new common_1.NotFoundException('Certificate request not found');
        if (req.status !== 'PENDING') {
            throw new common_1.BadRequestException('Request is not in pending status');
        }
        // 1. Update request status to APPROVED
        await this.prisma.certificateRequest.update({
            where: { id: requestId },
            data: { status: 'APPROVED' }
        });
        // 2. Generate certificate code
        const uniqueCode = 'CERT-' +
            Math.random().toString(36).substring(2, 8).toUpperCase() +
            '-' +
            Date.now().toString().slice(-4);
        // 3. Create Certificate record
        const cert = await this.prisma.certificate.create({
            data: {
                certificateCode: uniqueCode,
                studentId: req.studentId,
                courseId: req.courseId,
            },
            include: {
                course: { select: { title: true } },
                student: { select: { name: true } },
            },
        });
        // 4. Notify student
        await this.prisma.notification.create({
            data: {
                userId: req.studentId,
                title: 'Certificate Approved! 🎓',
                message: `Congratulations! Your certificate request for "${req.course.title}" has been approved. You can now download it.`,
                type: 'certificate_approved',
                entityId: req.courseId,
            },
        }).catch(() => { });
        return cert;
    }
    async rejectRequest(requestId) {
        const req = await this.prisma.certificateRequest.findUnique({
            where: { id: requestId },
            include: {
                course: { select: { title: true } }
            }
        });
        if (!req)
            throw new common_1.NotFoundException('Certificate request not found');
        if (req.status !== 'PENDING') {
            throw new common_1.BadRequestException('Request is not in pending status');
        }
        // Update status to REJECTED
        await this.prisma.certificateRequest.update({
            where: { id: requestId },
            data: { status: 'REJECTED' }
        });
        // Notify student
        await this.prisma.notification.create({
            data: {
                userId: req.studentId,
                title: 'Certificate Request Rejected ❌',
                message: `Your certificate request for "${req.course.title}" was rejected. Please review completion criteria and try again.`,
                type: 'certificate_rejected',
                entityId: req.courseId,
            },
        }).catch(() => { });
        return { success: true };
    }
    async getById(id) {
        const cert = await this.prisma.certificate.findUnique({
            where: { id },
            include: {
                course: { select: { title: true } },
                student: { select: { name: true } },
            },
        });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found');
        return cert;
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map