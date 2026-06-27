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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicCoursesController = exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const courses_service_1 = require("./courses.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = __importStar(require("fs"));
let CoursesController = class CoursesController {
    coursesService;
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    getMyEnrolled(req) {
        return this.coursesService.getMyEnrolled(req.user.id);
    }
    async uploadBrochure(id, req, file) {
        if (!file)
            throw new common_1.BadRequestException('No brochure file uploaded');
        const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${file.filename}`;
        return this.coursesService.uploadBrochure(id, fileUrl, file.originalname, file.mimetype, req.user.id, req.user.role);
    }
    getMyCreated(req) {
        return this.coursesService.getMyCreated(req.user.id);
    }
    getById(id, req) {
        return this.coursesService.getById(id, req.user?.id, req.user?.role);
    }
    getAll(req) {
        return this.coursesService.getAll(req.user.id, req.user.role);
    }
    create(req, body) {
        return this.coursesService.create({
            ...body,
            projectCoordinatorId: req.user.id,
        });
    }
    update(id, req, body) {
        return this.coursesService.update(id, body, req.user.id, req.user.role);
    }
    delete(id, req) {
        return this.coursesService.delete(id, req.user.id, req.user.role);
    }
    enroll(req, courseId) {
        return this.coursesService.enroll(req.user.id, courseId);
    }
    deleteBrochure(id, req) {
        return this.coursesService.deleteBrochure(id, req.user.id, req.user.role);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Get)('enrolled'),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getMyEnrolled", null);
__decorate([
    (0, common_1.Post)(':id/brochure'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                if (!fs.existsSync('./uploads')) {
                    fs.mkdirSync('./uploads', { recursive: true });
                }
                cb(null, './uploads');
            },
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `brochure-${uniqueSuffix}${ext}`);
            },
        }),
        limits: {},
        fileFilter: (req, file, callback) => {
            const ext = (0, path_1.extname)(file.originalname).toLowerCase();
            const allowedExts = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
            if (!allowedExts.includes(ext)) {
                return callback(new common_1.BadRequestException('Only PDF and image files (PNG, JPG, JPEG, WEBP) are allowed'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "uploadBrochure", null);
__decorate([
    (0, common_1.Get)('created'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getMyCreated", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/enroll'),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "enroll", null);
__decorate([
    (0, common_1.Delete)(':id/brochure'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "deleteBrochure", null);
exports.CoursesController = CoursesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
let PublicCoursesController = class PublicCoursesController {
    coursesService;
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    getDomainBrochures() {
        return this.coursesService.getDomainBrochures();
    }
};
exports.PublicCoursesController = PublicCoursesController;
__decorate([
    (0, common_1.Get)('domain-brochures'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicCoursesController.prototype, "getDomainBrochures", null);
exports.PublicCoursesController = PublicCoursesController = __decorate([
    (0, common_1.Controller)('public-courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], PublicCoursesController);
//# sourceMappingURL=courses.controller.js.map