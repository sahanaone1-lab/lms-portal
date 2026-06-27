import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(title: string, description: string, domain: string, projectCoordinatorId: string) {
    // Verify project coordinator exists
    const projectCoordinator = await this.prisma.user.findUnique({
      where: { id: projectCoordinatorId },
    });
    if (!projectCoordinator || projectCoordinator.role !== Role.PROJECT_COORDINATOR) {
      throw new ForbiddenException('Only project coordinators can create projects');
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

  async findAll(userId: string, role: Role, domain?: string) {
    if (role === Role.ADMIN) {
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

    if (role === Role.PROJECT_COORDINATOR) {
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

    if (role === Role.INTERN) {
      let internDomain = domain;
      if (!internDomain) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { domain: true },
        });
        internDomain = user?.domain || undefined;
      }

      if (!internDomain) {
        throw new ForbiddenException('Intern must belong to a domain to view projects');
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

    throw new ForbiddenException('Invalid role');
  }

  async registerInterest(projectId: string, internId: string) {
    // Check if project exists
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if intern exists and is actually an intern
    const intern = await this.prisma.user.findUnique({
      where: { id: internId },
    });
    if (!intern || intern.role !== Role.INTERN) {
      throw new ForbiddenException('Only interns can register interest in projects');
    }

    // Ensure intern belongs to the project's domain
    if (intern.domain !== project.domain) {
      throw new ForbiddenException('You can only register for projects in your domain');
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
      throw new ConflictException('You have already registered for this project');
    }

    // Create registration
    return this.prisma.projectRegistration.create({
      data: {
        projectId,
        internId,
      },
      include: {
        project: true,
      },
    });
  }

  async remove(id: string, userId: string, role: Role) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (role !== Role.ADMIN && project.projectCoordinatorId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this project');
    }

    await this.prisma.project.delete({
      where: { id },
    });
    return { success: true };
  }
}
