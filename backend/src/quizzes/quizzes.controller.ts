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
import { QuizzesService } from './quizzes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quizzes')
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}

  @Get('course/:courseId')
  getByCourse(@Param('courseId') courseId: string) {
    return this.quizzesService.getByCourse(courseId);
  }

  @Post()
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  create(@Req() req: any, @Body() body: any) {
    return this.quizzesService.create(
      body.courseId,
      body.title,
      body.passingScore,
      body.questions,
      req.user.id,
      req.user.role,
      body.timeLimit,
      body.weekId,
    );
  }
  @Patch(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.quizzesService.update(id, body, req.user.id, req.user.role);
  }

  @Delete(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  delete(@Param('id') id: string, @Req() req: any) {
    return this.quizzesService.delete(id, req.user.id, req.user.role);
  }

  @Post(':id/submit')
  @Roles(Role.INTERN)
  submitAnswers(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.quizzesService.submitAnswers(id, req.user.id, body.answers);
  }

  @Get('results/my')
  @Roles(Role.INTERN)
  getMyResults(@Req() req: any) {
    return this.quizzesService.getMyResults(req.user.id);
  }
}
