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
var ProjectSubmissionsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const project_submissions_service_1 = require("./project-submissions.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
// Max file size: 50 MB
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/zip', // .zip
    'application/x-zip-compressed', // .zip (some systems)
    'application/x-zip', // .zip (some systems)
    'image/jpeg', // .jpg
    'image/png', // .png
];
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'jpg', 'jpeg', 'png'];
let ProjectSubmissionsController = ProjectSubmissionsController_1 = class ProjectSubmissionsController {
    constructor(projectSubmissionsService) {
        this.projectSubmissionsService = projectSubmissionsService;
        this.logger = new common_1.Logger(ProjectSubmissionsController_1.name);
    }
    /**
     * POST /project-submissions/upload
     * Intern uploads a project file (multipart/form-data).
     * File is stored in S3; DB record is created with coordinator auto-assigned by domain.
     */
    async uploadSubmission(file, projectId, title, description, req) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded. Please attach a file.');
        }
        if (!title || title.trim().length < 3) {
            throw new common_1.BadRequestException('Project title is required and must be at least 3 characters.');
        }
        if (!description || description.trim().length < 10) {
            throw new common_1.BadRequestException('Project description is required and must be at least 10 characters.');
        }
        // File size check
        if (file.size > MAX_FILE_SIZE_BYTES) {
            throw new common_1.BadRequestException(`File too large. Maximum allowed size is 50 MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`);
        }
        // File type check
        const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || '';
        const isMimeAllowed = ALLOWED_MIME_TYPES.includes(file.mimetype);
        const isExtAllowed = ALLOWED_EXTENSIONS.includes(fileExtension);
        if (!isMimeAllowed && !isExtAllowed) {
            throw new common_1.BadRequestException('Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, ZIP, JPG, PNG.');
        }
        this.logger.log(`[ProjectSubmission] Intern ${req.user.id} uploading "${title}" — ${file.originalname} (${(file.size / 1024).toFixed(1)} KB)`);
        try {
            const submission = await this.projectSubmissionsService.uploadAndSave(file, projectId || undefined, title.trim(), description.trim(), req.user.id);
            return {
                message: 'Project submitted successfully! Your coordinator has been notified.',
                submission,
            };
        }
        catch (err) {
            this.logger.error('[ProjectSubmission] Upload failed:', err?.message, err?.stack);
            // Re-throw known NestJS HTTP exceptions
            if (err?.status)
                throw err;
            throw new common_1.BadRequestException(err?.message || 'An unexpected error occurred. Please try again.');
        }
    }
    /**
     * GET /project-submissions
     * - INTERN: returns own submissions
     * - PROJECT_COORDINATOR: returns submissions for their domain
     * - ADMIN: returns all submissions
     */
    findAll(req) {
        return this.projectSubmissionsService.findAll(req.user.id, req.user.role);
    }
    /**
     * GET /project-submissions/my
     * Convenience alias for interns.
     */
    getMySubmissions(req) {
        return this.projectSubmissionsService.findAll(req.user.id, client_1.Role.INTERN);
    }
    /**
     * GET /project-submissions/coordinator
     * Convenience alias for coordinators.
     */
    getCoordinatorSubmissions(req) {
        return this.projectSubmissionsService.findAll(req.user.id, req.user.role);
    }
    /**
     * GET /project-submissions/:id
     * Get a specific submission (auth-gated).
     */
    findOne(id, req) {
        return this.projectSubmissionsService.findOne(id, req.user.id, req.user.role);
    }
    /**
     * PATCH /project-submissions/:id/review
     * Coordinator or Admin reviews a submission — sets status and remarks.
     */
    review(id, req, body) {
        if (!body.status) {
            throw new common_1.BadRequestException('Status is required');
        }
        return this.projectSubmissionsService.review(id, body.status, body.remarks, req.user.id, req.user.role);
    }
};
exports.ProjectSubmissionsController = ProjectSubmissionsController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: MAX_FILE_SIZE_BYTES },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('projectId')),
    __param(2, (0, common_1.Body)('title')),
    __param(3, (0, common_1.Body)('description')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ProjectSubmissionsController.prototype, "uploadSubmission", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.PROJECT_COORDINATOR, client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectSubmissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectSubmissionsController.prototype, "getMySubmissions", null);
__decorate([
    (0, common_1.Get)('coordinator'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectSubmissionsController.prototype, "getCoordinatorSubmissions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.PROJECT_COORDINATOR, client_1.Role.INTERN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectSubmissionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/review'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectSubmissionsController.prototype, "review", null);
exports.ProjectSubmissionsController = ProjectSubmissionsController = ProjectSubmissionsController_1 = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('project-submissions'),
    __metadata("design:paramtypes", [project_submissions_service_1.ProjectSubmissionsService])
], ProjectSubmissionsController);
//# sourceMappingURL=project-submissions.controller.js.map