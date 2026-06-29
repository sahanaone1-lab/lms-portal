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
exports.PresentationsController = void 0;
const common_1 = require("@nestjs/common");
const presentations_service_1 = require("./presentations.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const create_presentation_dto_1 = require("./dto/create-presentation.dto");
const update_presentation_dto_1 = require("./dto/update-presentation.dto");
let PresentationsController = class PresentationsController {
    constructor(presentationsService) {
        this.presentationsService = presentationsService;
    }
    create(req, dto) {
        return this.presentationsService.create(dto, req.user.id);
    }
    findAll(req) {
        return this.presentationsService.findAll(req.user.role);
    }
    findOne(id) {
        return this.presentationsService.findOne(id);
    }
    update(id, dto, req) {
        return this.presentationsService.update(id, dto, req.user.id, req.user.role);
    }
    remove(id, req) {
        return this.presentationsService.remove(id, req.user.id, req.user.role);
    }
};
exports.PresentationsController = PresentationsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_presentation_dto_1.CreatePresentationDto]),
    __metadata("design:returntype", void 0)
], PresentationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.PROJECT_COORDINATOR, client_1.Role.INTERN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PresentationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.PROJECT_COORDINATOR, client_1.Role.INTERN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PresentationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_presentation_dto_1.UpdatePresentationDto, Object]),
    __metadata("design:returntype", void 0)
], PresentationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PresentationsController.prototype, "remove", null);
exports.PresentationsController = PresentationsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('presentations'),
    __metadata("design:paramtypes", [presentations_service_1.PresentationsService])
], PresentationsController);
//# sourceMappingURL=presentations.controller.js.map