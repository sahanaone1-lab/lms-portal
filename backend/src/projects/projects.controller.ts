import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @Roles(Role.PROJECT_COORDINATOR)
  create(@Req() req: any, @Body() body: { title: string; description: string; domain: string }) {
    return this.projectsService.create(
      body.title,
      body.description,
      body.domain,
      req.user.id,
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROJECT_COORDINATOR, Role.INTERN)
  findAll(@Req() req: any) {
    return this.projectsService.findAll(
      req.user.id,
      req.user.role,
      req.user.domain, // Might be undefined depending on jwt strategy, handled in service lookup
    );
  }

  @Post(':id/register')
  @Roles(Role.INTERN)
  registerInterest(@Param('id') id: string, @Req() req: any) {
    return this.projectsService.registerInterest(id, req.user.id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PROJECT_COORDINATOR)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.projectsService.remove(id, req.user.id, req.user.role);
  }
}
