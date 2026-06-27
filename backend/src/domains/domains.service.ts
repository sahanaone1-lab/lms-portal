import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {}

  async getAll(all = false) {
    return this.prisma.domain.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(name: string, description?: string) {
    const existing = await this.prisma.domain.findUnique({
      where: { name },
    });
    if (existing) {
      throw new BadRequestException('Domain name already exists');
    }

    return this.prisma.domain.create({
      data: { name, description },
    });
  }

  async update(
    id: string,
    data: { name?: string; description?: string; isActive?: boolean },
  ) {
    const domain = await this.prisma.domain.findUnique({
      where: { id },
    });
    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    if (data.name && data.name !== domain.name) {
      const existing = await this.prisma.domain.findUnique({
        where: { name: data.name },
      });
      if (existing) {
        throw new BadRequestException('Domain name already exists');
      }
    }

    const updated = await this.prisma.domain.update({
      where: { id },
      data,
    });

    // If domain name was updated, cascade changes to users and courses
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
        where: { role: Role.PROJECT_COORDINATOR, domain: d.name },
      });
      const internsCount = await this.prisma.user.count({
        where: { role: Role.INTERN, domain: d.name },
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
}
