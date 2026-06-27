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
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Get('course/:courseId')
  getByCourse(@Param('courseId') courseId: string) {
    return this.assignmentsService.getByCourse(courseId);
  }

  @Post()
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  create(@Req() req: any, @Body() body: any) {
    return this.assignmentsService.create(
      body.courseId,
      body.title,
      body.instruction,
      body.dueDate,
      req.user.id,
      req.user.role,
      body.attachmentUrl,
      body.weekId,
    );
  }
  @Patch(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.assignmentsService.update(id, body, req.user.id, req.user.role);
  }

  @Delete(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  delete(@Param('id') id: string, @Req() req: any) {
    return this.assignmentsService.delete(id, req.user.id, req.user.role);
  }
}
