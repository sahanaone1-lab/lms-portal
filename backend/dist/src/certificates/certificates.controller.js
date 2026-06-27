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
exports.CertificatesController = void 0;
const common_1 = require("@nestjs/common");
const certificates_service_1 = require("./certificates.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let CertificatesController = class CertificatesController {
    certificatesService;
    constructor(certificatesService) {
        this.certificatesService = certificatesService;
    }
    getMyCertificates(req) {
        return this.certificatesService.getMyCertificates(req.user.id);
    }
    claim(req, courseId) {
        return this.certificatesService.claim(req.user.id, courseId);
    }
    getDomainCertificateRequests(req) {
        return this.certificatesService.getDomainCertificateRequests(req.user.id);
    }
    approveRequest(id) {
        return this.certificatesService.approveRequest(id);
    }
    rejectRequest(id) {
        return this.certificatesService.rejectRequest(id);
    }
    async downloadPdf(id, res) {
        try {
            const cert = await this.certificatesService.getById(id);
            const html = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8fafc; color: #1e293b; }
              .certificate { border: 10px double #e2e8f0; padding: 40px; background-color: white; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
              h1 { font-size: 32px; color: #7c3aed; margin-bottom: 5px; }
              h2 { font-size: 18px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 30px; }
              p { font-size: 16px; margin: 15px 0; }
              .name { font-size: 24px; font-weight: bold; border-bottom: 2px solid #e2e8f0; display: inline-block; padding-bottom: 5px; margin: 10px 0 20px; }
              .code { font-family: monospace; font-size: 12px; color: #94a3b8; margin-top: 45px; }
            </style>
          </head>
          <body>
            <div class="certificate">
              <h1>ELEVATE ACADEMY</h1>
              <h2>Certificate of Course Completion</h2>
              <p>This document proudly certifies that</p>
              <div class="name">${cert.student.name}</div>
              <p>has successfully met all instructional criteria and completed the learning course</p>
              <p style="font-weight: bold; font-size: 18px; color: #1e293b;">${cert.course.title}</p>
              <p>on this day, ${new Date(cert.issuedAt).toLocaleDateString()}</p>
              <div class="code">Verification ID: ${cert.certificateCode}</div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `;
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        }
        catch (err) {
            res.status(404).send('Certificate not found');
        }
    }
};
exports.CertificatesController = CertificatesController;
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "getMyCertificates", null);
__decorate([
    (0, common_1.Post)('claim/:courseId'),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "claim", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "getDomainCertificateRequests", null);
__decorate([
    (0, common_1.Post)('approve/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "approveRequest", null);
__decorate([
    (0, common_1.Post)('reject/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "rejectRequest", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "downloadPdf", null);
exports.CertificatesController = CertificatesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('certificates'),
    __metadata("design:paramtypes", [certificates_service_1.CertificatesService])
], CertificatesController);
//# sourceMappingURL=certificates.controller.js.map