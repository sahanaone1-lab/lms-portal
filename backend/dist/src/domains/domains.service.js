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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DomainsService = class DomainsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(all = false) {
        return this.prisma.domain.findMany({
            where: all ? {} : { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async create(name, description) {
        const existing = await this.prisma.domain.findUnique({
            where: { name },
        });
        if (existing) {
            throw new common_1.BadRequestException('Domain name already exists');
        }
        return this.prisma.domain.create({
            data: { name, description },
        });
    }
    async update(id, data) {
        const domain = await this.prisma.domain.findUnique({
            where: { id },
        });
        if (!domain) {
            throw new common_1.NotFoundException('Domain not found');
        }
        if (data.name && data.name !== domain.name) {
            const existing = await this.prisma.domain.findUnique({
                where: { name: data.name },
            });
            if (existing) {
                throw new common_1.BadRequestException('Domain name already exists');
            }
        }
        const updated = await this.prisma.domain.update({
            where: { id },
            data,
        });
        if (data.name && data.name !== domain.name) {
            await this.prisma.user.updateMany({
                where: { domain: domain.name },
                data: { domain: data.name },
            });
            await this.prisma.course.updateMany({
                where: { domain: domain.name },
                data: { domain: data.name },
            });
        }
        return updated;
    }
    async getStats() {
        const domains = await this.prisma.domain.findMany({
            orderBy: { name: 'asc' },
        });
        const result = [];
        for (const d of domains) {
            const projectCoordinatorsCount = await this.prisma.user.count({
                where: { role: client_1.Role.PROJECT_COORDINATOR, domain: d.name },
            });
            const internsCount = await this.prisma.user.count({
                where: { role: client_1.Role.INTERN, domain: d.name },
            });
            result.push({
                id: d.id,
                name: d.name,
                description: d.description,
                isActive: d.isActive,
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
                projectCoordinatorsCount,
                internsCount,
            });
        }
        return result;
    }
};
exports.DomainsService = DomainsService;
exports.DomainsService = DomainsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DomainsService);
//# sourceMappingURL=domains.service.js.map