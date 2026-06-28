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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(title, description, domain, projectCoordinatorId) {
        // Verify project coordinator exists
        const projectCoordinator = await this.prisma.user.findUnique({
            where: { id: projectCoordinatorId },
        });
        if (!projectCoordinator || projectCoordinator.role !== client_1.Role.PROJECT_COORDINATOR) {
            throw new common_1.ForbiddenException('Only project coordinators can create projects');
        }
        return this.prisma.project.create({
            data: {
                title,
                description,
                domain,
                projectCoordinatorId,
            },
        });
    }
    async findAll(userId, role, domain) {
        if (role === client_1.Role.ADMIN) {
            return this.prisma.project.findMany({
                include: {
                    projectCoordinator: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    registrations: {
                        include: {
                            intern: {
                                select: {
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
        }
        if (role === client_1.Role.PROJECT_COORDINATOR) {
            // Project coordinators see the projects they created, along with registered interns
            return this.prisma.project.findMany({
                where: { projectCoordinatorId: userId },
                include: {
                    registrations: {
                        include: {
                            intern: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
        }
        if (role === client_1.Role.INTERN) {
            let internDomain = domain;
            if (!internDomain) {
                const user = await this.prisma.user.findUnique({
                    where: { id: userId },
                    select: { domain: true },
                });
                internDomain = user?.domain || undefined;
            }
            if (!internDomain) {
                throw new common_1.ForbiddenException('Intern must belong to a domain to view projects');
            }
            // Interns see projects in their domain
            const projects = await this.prisma.project.findMany({
                where: { domain: internDomain },
                include: {
                    projectCoordinator: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    registrations: {
                        where: { internId: userId },
                    },
                },
            });
            // Map isRegistered flag
            return projects.map((p) => {
                const { registrations, ...rest } = p;
                return {
                    ...rest,
                    isRegistered: registrations.length > 0,
                };
            });
        }
        throw new common_1.ForbiddenException('Invalid role');
    }
    async registerInterest(projectId, internId) {
        // Check if project exists
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        // Check if intern exists and is actually an intern
        const intern = await this.prisma.user.findUnique({
            where: { id: internId },
        });
        if (!intern || intern.role !== client_1.Role.INTERN) {
            throw new common_1.ForbiddenException('Only interns can register interest in projects');
        }
        // Ensure intern belongs to the project's domain
        if (intern.domain !== project.domain) {
            throw new common_1.ForbiddenException('You can only register for projects in your domain');
        }
        // Check if already registered
        const existingRegistration = await this.prisma.projectRegistration.findUnique({
            where: {
                projectId_internId: {
                    projectId,
                    internId,
                },
            },
        });
        if (existingRegistration) {
            throw new common_1.ConflictException('You have already registered for this project');
        }
        // Create registration
        const registration = await this.prisma.projectRegistration.create({
            data: {
                projectId,
                internId,
            },
            include: {
                project: true,
                intern: true,
            },
        });
        // Notify the project coordinator
        await this.prisma.notification.create({
            data: {
                userId: registration.project.projectCoordinatorId,
                title: 'Project Assigned',
                message: `Intern "${registration.intern.name}" has registered for your project "${registration.project.title}".`,
                type: 'project_assigned',
                entityId: projectId,
            },
        }).catch(() => { });
        return registration;
    }
    async remove(id, userId, role) {
        const project = await this.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (role !== client_1.Role.ADMIN && project.projectCoordinatorId !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to delete this project');
        }
        await this.prisma.project.delete({
            where: { id },
        });
        return { success: true };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map