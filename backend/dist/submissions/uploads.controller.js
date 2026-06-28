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
exports.UploadsController = exports.UploadsAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const prisma_service_1 = require("../prisma/prisma.service");
const express = __importStar(require("express"));
const path_1 = require("path");
const fs = __importStar(require("fs"));
const client_1 = require("@prisma/client");
let UploadsAuthGuard = class UploadsAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const filename = request.params.filename;
        // If the file is a public brochure (does not start with 'file-')
        if (filename && !filename.startsWith('file-')) {
            return true; // Bypass authentication
        }
        return super.canActivate(context);
    }
};
exports.UploadsAuthGuard = UploadsAuthGuard;
exports.UploadsAuthGuard = UploadsAuthGuard = __decorate([
    (0, common_1.Injectable)()
], UploadsAuthGuard);
let UploadsController = class UploadsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async serveFile(filename, req, res) {
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', filename);
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException('File not found');
        }
        const user = req.user;
        // If it is a project file
        if (filename.startsWith('file-')) {
            if (!user) {
                throw new common_1.ForbiddenException('Authentication required for this file');
            }
            const submission = await this.prisma.submission.findFirst({
                where: {
                    fileUrl: {
                        contains: filename,
                    },
                },
                include: {
                    assignment: {
                        include: {
                            course: true,
                        },
                    },
                },
            });
            if (submission) {
                const isOwner = submission.studentId === user.id;
                const isAdmin = user.role === client_1.Role.ADMIN;
                let isCoordinator = submission.assignment.course.projectCoordinatorId === user.id;
                if (!isCoordinator && user.role === client_1.Role.PROJECT_COORDINATOR) {
                    const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
                    const userDomain = dbUser?.domain;
                    const courseDomain = submission.assignment.course.domain;
                    if (userDomain && courseDomain && userDomain.toLowerCase() === courseDomain.toLowerCase()) {
                        isCoordinator = true;
                    }
                }
                if (!isOwner && !isCoordinator && !isAdmin) {
                    throw new common_1.ForbiddenException('Unauthorized access to this project file');
                }
            }
        }
        res.setHeader('Content-Disposition', 'inline');
        return res.sendFile(filePath);
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Get)(':filename'),
    (0, common_1.UseGuards)(UploadsAuthGuard),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "serveFile", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map