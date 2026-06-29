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
exports.PresentationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PresentationsService = class PresentationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, coordinatorId) {
        const presentation = await this.prisma.presentation.create({
            data: {
                title: dto.title,
                description: dto.description,
                presentationDate: new Date(dto.presentationDate),
                presentationTime: dto.presentationTime,
                status: dto.status ?? client_1.PresentationStatus.UPCOMING,
                coordinatorId,
            },
            include: {
                coordinator: { select: { id: true, name: true, email: true } },
            },
        });
        // Notify all interns
        const interns = await this.prisma.user.findMany({
            where: { role: client_1.Role.INTERN },
            select: { id: true },
        });
        if (interns.length > 0) {
            await this.prisma.notification.createMany({
                data: interns.map((intern) => ({
                    userId: intern.id,
                    title: 'New Presentation Announced',
                    message: `A new presentation "${dto.title}" has been scheduled. Check it out and register!`,
                    type: 'presentation_announced',
                    entityId: presentation.id,
                })),
            });
        }
        return presentation;
    }
    async findAll(role) {
        const where = role === client_1.Role.INTERN
            ? { isDeleted: false, status: client_1.PresentationStatus.UPCOMING }
            : { isDeleted: false };
        return this.prisma.presentation.findMany({
            where,
            orderBy: { presentationDate: 'asc' },
            include: {
                coordinator: { select: { id: true, name: true, email: true } },
                _count: { select: { registrations: true } },
            },
        });
    }
    async findOne(id) {
        const presentation = await this.prisma.presentation.findUnique({
            where: { id },
            include: {
                coordinator: { select: { id: true, name: true, email: true } },
                registrations: {
                    include: {
                        intern: {
                            select: { id: true, name: true, email: true, domain: true },
                        },
                    },
                },
            },
        });
        if (!presentation || presentation.isDeleted) {
            throw new common_1.NotFoundException('Presentation not found');
        }
        return presentation;
    }
    async update(id, dto, userId, role) {
        const presentation = await this.prisma.presentation.findUnique({
            where: { id },
        });
        if (!presentation || presentation.isDeleted) {
            throw new common_1.NotFoundException('Presentation not found');
        }
        if (role !== client_1.Role.ADMIN &&
            presentation.coordinatorId !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to update this presentation');
        }
        const data = {};
        if (dto.title !== undefined)
            data.title = dto.title;
        if (dto.description !== undefined)
            data.description = dto.description;
        if (dto.presentationDate !== undefined)
            data.presentationDate = new Date(dto.presentationDate);
        if (dto.presentationTime !== undefined)
            data.presentationTime = dto.presentationTime;
        if (dto.status !== undefined)
            data.status = dto.status;
        return this.prisma.presentation.update({
            where: { id },
            data,
            include: {
                coordinator: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async remove(id, userId, role) {
        const presentation = await this.prisma.presentation.findUnique({
            where: { id },
        });
        if (!presentation || presentation.isDeleted) {
            throw new common_1.NotFoundException('Presentation not found');
        }
        if (role !== client_1.Role.ADMIN &&
            presentation.coordinatorId !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to delete this presentation');
        }
        // Soft delete
        return this.prisma.presentation.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
};
exports.PresentationsService = PresentationsService;
exports.PresentationsService = PresentationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PresentationsService);
//# sourceMappingURL=presentations.service.js.map