"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path_1 = require("path");
let SubmissionsService = class SubmissionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submit(assignmentId, studentId, submissionText, fileUrl, fileName) {
        // Verify assignment exists
        const assignment = await this.prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: { course: true },
        });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        // Check if user is enrolled
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                studentId_courseId: { studentId, courseId: assignment.courseId },
            },
        });
        if (!enrollment)
            throw new common_1.BadRequestException('You are not enrolled in this course');
        // Create or update submission
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
                data: {
                    submissionText,
                    fileUrl,
                    fileName: fileName || existing.fileName,
                    courseId: assignment.courseId,
                    moduleId: assignment.weekId,
                    createdAt: new Date(),
                },
            });
        }
        else {
            submission = await this.prisma.submission.create({
                data: {
                    assignmentId,
                    studentId,
                    submissionText,
                    fileUrl,
                    fileName,
                    courseId: assignment.courseId,
                    moduleId: assignment.weekId,
                },
            });
        }
        // Trigger notification to project coordinator
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
    async saveUpload(assignmentId, studentId, fileUrl, fileName) {
        // Verify assignment exists
        const assignment = await this.prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: { course: true },
        });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        // Check if user is enrolled
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                studentId_courseId: { studentId, courseId: assignment.courseId },
            },
        });
        if (!enrollment)
            throw new common_1.BadRequestException('You are not enrolled in this course');
        // Create or update submission
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
                data: {
                    fileUrl,
                    fileName,
                    courseId: assignment.courseId,
                    moduleId: assignment.weekId,
                    createdAt: new Date()
                },
            });
        }
        else {
            submission = await this.prisma.submission.create({
                data: {
                    assignmentId,
                    studentId,
                    fileUrl,
                    fileName,
                    courseId: assignment.courseId,
                    moduleId: assignment.weekId,
                },
            });
        }
        return submission;
    }
    async delete(id, userId, role) {
        const submission = await this.prisma.submission.findUnique({
            where: { id },
            include: {
                assignment: {
                    include: { course: true },
                },
            },
        });
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        // Interns can only delete their own uploads
        if (role === client_1.Role.INTERN && submission.studentId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own submissions');
        }
        // Coordinators cannot delete student submissions
        if (role === client_1.Role.PROJECT_COORDINATOR) {
            throw new common_1.ForbiddenException('Coordinators cannot delete student submissions');
        }
        // Delete physical file from storage if stored locally
        if (submission.fileUrl) {
            try {
                const filename = submission.fileUrl.substring(submission.fileUrl.lastIndexOf('/') + 1);
                const filePath = (0, path_1.join)(process.cwd(), 'uploads', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            catch (err) {
                console.error('Failed to delete physical file:', err);
            }
        }
        await this.prisma.submission.delete({
            where: { id },
        });
        return { success: true };
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
        // Coordinators can only grade students assigned to their courses or domain.
        if (role !== client_1.Role.ADMIN) {
            const isCreator = submission.assignment.course.projectCoordinatorId === projectCoordinatorId;
            const coordinator = await this.prisma.user.findUnique({ where: { id: projectCoordinatorId } });
            const matchesDomain = !!(coordinator?.domain &&
                submission.assignment.course.domain &&
                submission.assignment.course.domain.toLowerCase() === coordinator.domain.toLowerCase());
            if (!isCreator && !matchesDomain) {
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
            include: {
                student: { select: { name: true, email: true } },
                assignment: {
                    include: {
                        course: true,
                    },
                },
            },
        });
        const weeks = updated.assignment.course.weeks || [];
        const moduleObj = weeks.find(w => w.id === updated.assignment.weekId);
        const moduleName = moduleObj ? moduleObj.title : 'General';
        let projectFileName = updated.fileName || '';
        if (!projectFileName && updated.fileUrl) {
            const parts = updated.fileUrl.split('/');
            projectFileName = parts[parts.length - 1];
        }
        const mappedResponse = {
            id: updated.id,
            submissionText: updated.submissionText,
            fileUrl: updated.fileUrl,
            grade: updated.grade,
            feedback: updated.feedback,
            status: updated.status,
            studentId: updated.studentId,
            studentName: updated.student.name,
            studentEmail: updated.student.email,
            courseId: updated.assignment.courseId,
            courseName: updated.assignment.course.title,
            courseDomain: updated.assignment.course.domain,
            moduleId: updated.assignment.weekId,
            moduleName,
            projectFileName,
            assignmentId: updated.assignmentId,
            assignmentTitle: updated.assignment.title,
            assignmentInstruction: updated.assignment.instruction,
            isApproved: updated.isApproved,
            createdAt: updated.createdAt,
            gradedAt: updated.gradedAt,
        };
        // Trigger notification to student
        await this.prisma.notification
            .create({
            data: {
                userId: submission.studentId,
                title: 'Assignment Graded',
                message: `Your submission for "${submission.assignment.title}" has been graded: ${grade}/100.`,
            },
        })
            .catch(() => { });
        return mappedResponse;
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
        if (!projectCoordinator)
            return [];
        const myDomain = projectCoordinator.domain;
        const whereClause = {
            assignment: {
                course: {
                    OR: [
                        { projectCoordinatorId },
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
        };
        const submissions = await this.prisma.submission.findMany({
            where: whereClause,
            include: {
                student: { select: { name: true, email: true } },
                assignment: {
                    include: {
                        course: true
                    }
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return submissions.map((s) => {
            // Find Module Name from course weeks JSON
            const weeks = s.assignment.course.weeks || [];
            const moduleObj = weeks.find(w => w.id === s.assignment.weekId);
            const moduleName = moduleObj ? moduleObj.title : 'General';
            // Find file name
            let projectFileName = s.fileName || '';
            if (!projectFileName && s.fileUrl) {
                const parts = s.fileUrl.split('/');
                projectFileName = parts[parts.length - 1];
            }
            return {
                id: s.id,
                submissionText: s.submissionText,
                fileUrl: s.fileUrl,
                grade: s.grade,
                feedback: s.feedback,
                status: s.status,
                studentId: s.studentId,
                studentName: s.student.name,
                studentEmail: s.student.email,
                courseId: s.assignment.courseId,
                courseName: s.assignment.course.title,
                courseDomain: s.assignment.course.domain,
                moduleId: s.assignment.weekId,
                moduleName,
                projectFileName,
                assignmentId: s.assignmentId,
                assignmentTitle: s.assignment.title,
                assignmentInstruction: s.assignment.instruction,
                isApproved: s.isApproved,
                createdAt: s.createdAt,
                gradedAt: s.gradedAt,
            };
        });
    }
    async getAllSubmissions() {
        const submissions = await this.prisma.submission.findMany({
            include: {
                student: { select: { name: true, email: true } },
                assignment: {
                    include: {
                        course: true
                    }
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return submissions.map((s) => {
            const weeks = s.assignment.course.weeks || [];
            const moduleObj = weeks.find(w => w.id === s.assignment.weekId);
            const moduleName = moduleObj ? moduleObj.title : 'General';
            let projectFileName = s.fileName || '';
            if (!projectFileName && s.fileUrl) {
                const parts = s.fileUrl.split('/');
                projectFileName = parts[parts.length - 1];
            }
            return {
                id: s.id,
                submissionText: s.submissionText,
                fileUrl: s.fileUrl,
                grade: s.grade,
                feedback: s.feedback,
                status: s.status,
                studentId: s.studentId,
                studentName: s.student.name,
                studentEmail: s.student.email,
                courseId: s.assignment.courseId,
                courseName: s.assignment.course.title,
                moduleId: s.assignment.weekId,
                moduleName,
                projectFileName,
                assignmentId: s.assignmentId,
                assignmentTitle: s.assignment.title,
                isApproved: s.isApproved,
                createdAt: s.createdAt,
                gradedAt: s.gradedAt,
            };
        });
    }
    async getMySubmissions(studentId) {
        return this.prisma.submission.findMany({
            where: { studentId },
            include: {
                assignment: {
                    select: {
                        title: true,
                        weekId: true,
                        courseId: true,
                    }
                },
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