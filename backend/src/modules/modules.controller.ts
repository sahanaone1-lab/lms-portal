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
import { ModulesService } from './modules.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  // GET /modules/course/:courseId — all modules (with nested lessons)
  @Get('course/:courseId')
  getByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.getByCourse(courseId);
  }

  // POST /modules — create new module
  @Post()
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  create(@Req() req: any, @Body() body: any) {
    return this.modulesService.create(
      body.courseId,
      body.title,
      body.description,
      body.order,
      req.user.id,
      req.user.role,
    );
  }

  // PATCH /modules/:id — update module
  @Patch(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.modulesService.update(
      id,
      { title: body.title, description: body.description, order: body.order },
      req.user.id,
      req.user.role,
    );
  }

  // DELETE /modules/:id — delete module (lessons reassigned to sibling)
  @Delete(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  delete(@Param('id') id: string, @Req() req: any) {
    return this.modulesService.delete(id, req.user.id, req.user.role);
  }

  // POST /modules/reorder — reorder modules in a course
  @Post('reorder')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  reorder(@Req() req: any, @Body() body: { courseId: string; orderedIds: string[] }) {
    return this.modulesService.reorder(
      body.courseId,
      body.orderedIds,
      req.user.id,
      req.user.role,
    );
  }
}
