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
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get('progress')
  @Roles(Role.INTERN)
  getProgress(@Req() req: any) {
    return this.lessonsService.getProgress(req.user.id);
  }

  @Post(':id/progress')
  @Roles(Role.INTERN)
  toggleProgress(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { completed: boolean },
  ) {
    return this.lessonsService.toggleProgress(id, req.user.id, body.completed);
  }

  @Get('course/:courseId')
  getByCourse(@Param('courseId') courseId: string) {
    return this.lessonsService.getByCourse(courseId);
  }

  @Post()
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  create(@Req() req: any, @Body() body: any) {
    return this.lessonsService.create(
      body.courseId,
      body.title,
      body.content,
      body.videoUrl,
      body.order,
      req.user.id,
      req.user.role,
      body.attachmentUrl,
      body.pdfResource,
      body.duration,
      body.weekId,
    );
  }
  @Patch(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.lessonsService.update(id, body, req.user.id, req.user.role);
  }

  @Delete(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  delete(@Param('id') id: string, @Req() req: any) {
    return this.lessonsService.delete(id, req.user.id, req.user.role);
  }

  @Get(':id/suggest-video')
  suggestVideo(@Param('id') id: string) {
    return this.lessonsService.suggestReplacement(id);
  }
}
