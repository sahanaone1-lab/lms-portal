import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PresentationRegistrationsService } from './presentation-registrations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreatePresentationRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('presentation-registrations')
export class PresentationRegistrationsController {
  constructor(
    private registrationsService: PresentationRegistrationsService,
  ) {}

  @Post()
  @Roles(Role.INTERN)
  create(@Req() req: any, @Body() dto: CreatePresentationRegistrationDto) {
    return this.registrationsService.create(dto, req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROJECT_COORDINATOR)
  findAll(
    @Req() req: any,
    @Query('presentationId') presentationId?: string,
    @Query('internId') internId?: string,
    @Query('date') date?: string,
  ) {
    return this.registrationsService.findAll(req.user.id, req.user.role, {
      presentationId,
      internId,
      date,
    });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PROJECT_COORDINATOR)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.registrationsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRegistrationDto,
    @Req() req: any,
  ) {
    return this.registrationsService.update(
      id,
      dto,
      req.user.id,
      req.user.role,
    );
  }

  @Get(':id/pdf')
  @Roles(Role.ADMIN, Role.PROJECT_COORDINATOR)
  async downloadPdf(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const pdf = await this.registrationsService.generatePdf(
      id,
      req.user.id,
      req.user.role,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="presentation-registration-${id}.pdf"`,
      'Content-Length': pdf.length,
    });

    res.end(pdf);
  }
}
