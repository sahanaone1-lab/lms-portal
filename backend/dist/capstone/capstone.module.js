"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapstoneModule = void 0;
const common_1 = require("@nestjs/common");
const capstone_controller_1 = require("./capstone.controller");
const capstone_service_1 = require("./capstone.service");
const prisma_module_1 = require("../prisma/prisma.module");
const aws_module_1 = require("../aws/aws.module");
let CapstoneModule = class CapstoneModule {
};
exports.CapstoneModule = CapstoneModule;
exports.CapstoneModule = CapstoneModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, aws_module_1.AwsModule],
        controllers: [capstone_controller_1.CapstoneController],
        providers: [capstone_service_1.CapstoneService],
        exports: [capstone_service_1.CapstoneService],
    })
], CapstoneModule);
//# sourceMappingURL=capstone.module.js.map