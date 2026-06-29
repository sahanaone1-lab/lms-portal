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
exports.PresentationRegistrationsController = void 0;
const common_1 = require("@nestjs/common");
const presentation_registrations_service_1 = require("./presentation-registrations.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const create_registration_dto_1 = require("./dto/create-registration.dto");
const update_registration_dto_1 = require("./dto/update-registration.dto");
let PresentationRegistrationsController = class PresentationRegistrationsController {
    constructor(registrationsService) {
        this.registrationsService = registrationsService;
    }
    create(req, dto) {
        return this.registrationsService.create(dto, req.user.id);
    }
    findAll(req, presentationId, internId, date) {
        return this.registrationsService.findAll(req.user.id, req.user.role, {
            presentationId,
            internId,
            date,
        });
    }
    findOne(id, req) {
        return this.registrationsService.findOne(id, req.user.id, req.user.role);
    }
    update(id, dto, req) {
        return this.registrationsService.update(id, dto, req.user.id, req.user.role);
    }
    async downloadPdf(id, req, res) {
        const pdf = await this.registrationsService.generatePdf(id, req.user.id, req.user.role);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="presentation-registration-${id}.pdf"`,
            'Content-Length': pdf.length,
        });
        res.end(pdf);
    }
};
exports.PresentationRegistrationsController = PresentationRegistrationsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_registration_dto_1.CreatePresentationRegistrationDto]),
    __metadata("design:returntype", void 0)
], PresentationRegistrationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.PROJECT_COORDINATOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('presentationId')),
    __param(2, (0, common_1.Query)('internId')),
    __param(3, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], PresentationRegistrationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.PROJECT_COORDINATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PresentationRegistrationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_registration_dto_1.UpdateRegistrationDto, Object]),
    __metadata("design:returntype", void 0)
], PresentationRegistrationsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.PROJECT_COORDINATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PresentationRegistrationsController.prototype, "downloadPdf", null);
exports.PresentationRegistrationsController = PresentationRegistrationsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('presentation-registrations'),
    __metadata("design:paramtypes", [presentation_registrations_service_1.PresentationRegistrationsService])
], PresentationRegistrationsController);
//# sourceMappingURL=presentation-registrations.controller.js.map