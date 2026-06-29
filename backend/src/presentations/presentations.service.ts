import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, PresentationStatus } from '@prisma/client';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';

@Injectable()
export class PresentationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePresentationDto, coordinatorId: string) {
    const presentation = await this.prisma.presentation.create({
      data: {
        title: dto.title,
        description: dto.description,
        presentationDate: new Date(dto.presentationDate),
        presentationTime: dto.presentationTime,
        status: (dto.status as PresentationStatus) ?? PresentationStatus.UPCOMING,
        coordinatorId,
      },
      include: {
        coordinator: { select: { id: true, name: true, email: true } },
      },
    });

    // Notify all interns
    const interns = await this.prisma.user.findMany({
      where: { role: Role.INTERN },
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

  async findAll(role: Role) {
    const where =
      role === Role.INTERN
        ? { isDeleted: false, status: PresentationStatus.UPCOMING }
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

  async findOne(id: string) {
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
      throw new NotFoundException('Presentation not found');
    }

    return presentation;
  }

  async update(
    id: string,
    dto: UpdatePresentationDto,
    userId: string,
    role: Role,
  ) {
    const presentation = await this.prisma.presentation.findUnique({
      where: { id },
    });

    if (!presentation || presentation.isDeleted) {
      throw new NotFoundException('Presentation not found');
    }

    if (
      role !== Role.ADMIN &&
      presentation.coordinatorId !== userId
    ) {
      throw new ForbiddenException(
        'You are not authorized to update this presentation',
      );
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.presentationDate !== undefined)
      data.presentationDate = new Date(dto.presentationDate);
    if (dto.presentationTime !== undefined)
      data.presentationTime = dto.presentationTime;
    if (dto.status !== undefined)
      data.status = dto.status as PresentationStatus;

    return this.prisma.presentation.update({
      where: { id },
      data,
      include: {
        coordinator: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async remove(id: string, userId: string, role: Role) {
    const presentation = await this.prisma.presentation.findUnique({
      where: { id },
    });

    if (!presentation || presentation.isDeleted) {
      throw new NotFoundException('Presentation not found');
    }

    if (
      role !== Role.ADMIN &&
      presentation.coordinatorId !== userId
    ) {
      throw new ForbiddenException(
        'You are not authorized to delete this presentation',
      );
    }

    // Soft delete
    return this.prisma.presentation.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
