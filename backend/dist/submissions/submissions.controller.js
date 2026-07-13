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
exports.SubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const submissions_service_1 = require("./submissions.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const s3_service_1 = require("../aws/s3.service");
let SubmissionsController = class SubmissionsController {
    constructor(submissionsService, s3Service) {
        this.submissionsService = submissionsService;
        this.s3Service = s3Service;
    }
    submit(req, body) {
        return this.submissionsService.submit(body.assignmentId, req.user.id, body.submissionText, body.fileUrl, body.fileName);
    }
    async uploadFile(file, assignmentId, req) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        if (!assignmentId)
            throw new common_1.BadRequestException('assignmentId is required');
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
        // Upload to S3 directly with 'file-' prefix so AuthGuard handles it correctly
        const s3ObjectKey = await this.s3Service.uploadFile(file, 'file-');
        const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${encodeURIComponent(s3ObjectKey)}`;
        // Save record to database permanently immediately upon upload
        const submission = await this.submissionsService.saveUpload(assignmentId, req.user.id, fileUrl, file.originalname);
        return { fileUrl, originalName: file.originalname, submission };
    }
    delete(id, req) {
        return this.submissionsService.delete(id, req.user.id, req.user.role);
    }
    findAll(req) {
        if (req.user.role === client_1.Role.INTERN) {
            return this.submissionsService.getMySubmissions(req.user.id);
        }
        else if (req.user.role === client_1.Role.PROJECT_COORDINATOR) {
            return this.submissionsService.getProjectCoordinatorSubmissions(req.user.id);
        }
        else {
            return this.submissionsService.getAllSubmissions();
        }
    }
    grade(id, req, body) {
        return this.submissionsService.grade(id, body.grade, body.feedback, req.user.id, req.user.role, body.isApproved);
    }
    getByAssignment(assignmentId, req) {
        return this.submissionsService.getByAssignment(assignmentId, req.user.id, req.user.role);
    }
    getProjectCoordinatorSubmissions(req) {
        return this.submissionsService.getProjectCoordinatorSubmissions(req.user.id);
    }
    getMySubmissions(req) {
        return this.submissionsService.getMySubmissions(req.user.id);
    }
};
exports.SubmissionsController = SubmissionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('assignmentId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.INTERN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.PROJECT_COORDINATOR, client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/grade'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "grade", null);
__decorate([
    (0, common_1.Get)('assignment/:assignmentId'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "getByAssignment", null);
__decorate([
    (0, common_1.Get)('project-coordinator'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "getProjectCoordinatorSubmissions", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "getMySubmissions", null);
exports.SubmissionsController = SubmissionsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('submissions'),
    __metadata("design:paramtypes", [submissions_service_1.SubmissionsService,
        s3_service_1.S3Service])
], SubmissionsController);
//# sourceMappingURL=submissions.controller.js.map