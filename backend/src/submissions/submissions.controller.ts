import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post()
  @Roles(Role.INTERN)
  submit(@Req() req: any, @Body() body: any) {
    return this.submissionsService.submit(
      body.assignmentId,
      req.user.id,
      body.submissionText,
      body.fileUrl,
    );
  }

  @Post('upload')
  @Roles(Role.INTERN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (!fs.existsSync('./uploads')) {
            fs.mkdirSync('./uploads', { recursive: true });
          }
          cb(null, './uploads');
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `file-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file uploaded');
    const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${file.filename}`;
    return { fileUrl, originalName: file.originalname };
  }

  @Patch(':id/grade')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  grade(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.submissionsService.grade(
      id,
      body.grade,
      body.feedback,
      req.user.id,
      req.user.role,
      body.isApproved,
    );
  }

  @Get('assignment/:assignmentId')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  getByAssignment(
    @Param('assignmentId') assignmentId: string,
    @Req() req: any,
  ) {
    return this.submissionsService.getByAssignment(
      assignmentId,
      req.user.id,
      req.user.role,
    );
  }

  @Get('project-coordinator')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  getProjectCoordinatorSubmissions(@Req() req: any) {
    return this.submissionsService.getProjectCoordinatorSubmissions(req.user.id);
  }

  @Get('my')
  @Roles(Role.INTERN)
  getMySubmissions(@Req() req: any) {
    return this.submissionsService.getMySubmissions(req.user.id);
  }
}
