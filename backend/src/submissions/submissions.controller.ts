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
  constructor(private submissionsService: SubmissionsService) { }

  @Post()
  @Roles(Role.INTERN)
  submit(@Req() req: any, @Body() body: any) {
    return this.submissionsService.submit(
      body.assignmentId,
      req.user.id,
      body.submissionText,
      body.fileUrl,
      body.fileName,
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
  async uploadFile(
    @UploadedFile() file: any,
    @Body('assignmentId') assignmentId: string,
    @Req() req: any,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!assignmentId) throw new BadRequestException('assignmentId is required');
    const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${file.filename}`;
    
    // Save record to database permanently immediately upon upload
    const submission = await this.submissionsService.saveUpload(
      assignmentId,
      req.user.id,
      fileUrl,
      file.originalname,
    );

    return { fileUrl, originalName: file.originalname, submission };
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.INTERN)
  delete(@Param('id') id: string, @Req() req: any) {
    return this.submissionsService.delete(id, req.user.id, req.user.role);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROJECT_COORDINATOR, Role.INTERN)
  findAll(@Req() req: any) {
    if (req.user.role === Role.INTERN) {
      return this.submissionsService.getMySubmissions(req.user.id);
    } else if (req.user.role === Role.PROJECT_COORDINATOR) {
      return this.submissionsService.getProjectCoordinatorSubmissions(req.user.id);
    } else {
      return this.submissionsService.getAllSubmissions();
    }
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
