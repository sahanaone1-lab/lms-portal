import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('presentations')
export class PresentationsController {
  constructor(private presentationsService: PresentationsService) {}

  @Post()
  @Roles(Role.PROJECT_COORDINATOR)
  create(@Req() req: any, @Body() dto: CreatePresentationDto) {
    return this.presentationsService.create(dto, req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROJECT_COORDINATOR, Role.INTERN)
  findAll(@Req() req: any) {
    return this.presentationsService.findAll(req.user.role);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PROJECT_COORDINATOR, Role.INTERN)
  findOne(@Param('id') id: string) {
    return this.presentationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePresentationDto,
    @Req() req: any,
  ) {
    return this.presentationsService.update(id, dto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.presentationsService.remove(id, req.user.id, req.user.role);
  }
}
