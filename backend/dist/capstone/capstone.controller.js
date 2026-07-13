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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapstoneController = void 0;
const common_1 = require("@nestjs/common");
const capstone_service_1 = require("./capstone.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const s3_service_1 = require("../aws/s3.service");
let CapstoneController = class CapstoneController {
    constructor(capstoneService, s3Service) {
        this.capstoneService = capstoneService;
        this.s3Service = s3Service;
    }
    // ---------------------------------------------------------------------------
    // Projects
    // ---------------------------------------------------------------------------
    getProjectsByCourse(courseId) {
        return this.capstoneService.getProjectsByCourse(courseId);
    }
    createProject(req, body) {
        return this.capstoneService.createProject(body.courseId, body.title, body.problemStatement, body.objectives, body.requiredTech, body.deliverables, body.instructions, req.user.id, req.user.role);
    }
    updateProject(id, req, body) {
        return this.capstoneService.updateProject(id, body, req.user.id, req.user.role);
    }
    deleteProject(id, req) {
        return this.capstoneService.deleteProject(id, req.user.id, req.user.role);
    }
    // ---------------------------------------------------------------------------
    // Submissions
    // ---------------------------------------------------------------------------
    getMySubmissions(req) {
        return this.capstoneService.getMySubmissions(req.user.id);
    }
    getSubmissionsByCourse(courseId, req) {
        return this.capstoneService.getSubmissionsByCourse(courseId, req.user.id, req.user.role);
    }
    async uploadSubmission(file, projectId, req) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        if (!projectId)
            throw new common_1.BadRequestException('projectId is required');
        // Validate file type (PDF, DOC, DOCX only)
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        const allowedExtensions = ['pdf', 'doc', 'docx'];
        const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
        if (!allowedMimeTypes.includes(file.mimetype) && !allowedExtensions.includes(fileExtension || '')) {
            throw new common_1.BadRequestException('Only PDF (.pdf) and Microsoft Word (.doc, .docx) files are allowed');
        }
        // Upload directly to S3 with 'file-' prefix to enforce access control
        const s3ObjectKey = await this.s3Service.uploadFile(file, 'file-');
        const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${encodeURIComponent(s3ObjectKey)}`;
        const submission = await this.capstoneService.saveSubmission(projectId, req.user.id, fileUrl, file.originalname);
        return { fileUrl, originalName: file.originalname, submission };
    }
    reviewSubmission(id, req, body) {
        return this.capstoneService.reviewSubmission(id, body.marks, body.remarks, body.status, req.user.id, req.user.role);
    }
    getCoordinatorSubmissions(req) {
        return this.capstoneService.getCoordinatorSubmissions(req.user.id);
    }
};
exports.CapstoneController = CapstoneController;
__decorate([
    (0, common_1.Get)('projects/course/:courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CapstoneController.prototype, "getProjectsByCourse", null);
__decorate([
    (0, common_1.Post)('projects'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CapstoneController.prototype, "createProject", null);
__decorate([
    (0, common_1.Patch)('projects/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], CapstoneController.prototype, "updateProject", null);
__decorate([
    (0, common_1.Delete)('projects/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CapstoneController.prototype, "deleteProject", null);
__decorate([
    (0, common_1.Get)('submissions/my'),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CapstoneController.prototype, "getMySubmissions", null);
__decorate([
    (0, common_1.Get)('submissions/course/:courseId'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CapstoneController.prototype, "getSubmissionsByCourse", null);
__decorate([
    (0, common_1.Post)('submissions/upload'),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('projectId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CapstoneController.prototype, "uploadSubmission", null);
__decorate([
    (0, common_1.Patch)('submissions/:id/review'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], CapstoneController.prototype, "reviewSubmission", null);
__decorate([
    (0, common_1.Get)('submissions/coordinator'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CapstoneController.prototype, "getCoordinatorSubmissions", null);
exports.CapstoneController = CapstoneController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('capstone'),
    __metadata("design:paramtypes", [capstone_service_1.CapstoneService,
        s3_service_1.S3Service])
], CapstoneController);
//# sourceMappingURL=capstone.controller.js.map