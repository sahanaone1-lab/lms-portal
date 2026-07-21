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
  Logger,
} from '@nestjs/common';
import { CapstoneService } from './capstone.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { S3Service } from '../aws/s3.service';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-zip',
  'image/jpeg',
  'image/png',
];

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'jpg', 'jpeg', 'png'];

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('capstone')
export class CapstoneController {
  private readonly logger = new Logger(CapstoneController.name);

  constructor(
    private readonly capstoneService: CapstoneService,
    private readonly s3Service: S3Service,
  ) { }

  // ---------------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------------

  @Get('projects/course/:courseId')
  getProjectsByCourse(@Param('courseId') courseId: string) {
    return this.capstoneService.getProjectsByCourse(courseId);
  }

  @Post('projects')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  createProject(@Req() req: any, @Body() body: any) {
    return this.capstoneService.createProject(
      body.courseId,
      body.title,
      body.problemStatement,
      body.objectives,
      body.requiredTech,
      body.deliverables,
      body.instructions,
      req.user.id,
      req.user.role,
    );
  }

  @Patch('projects/:id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  updateProject(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.capstoneService.updateProject(id, body, req.user.id, req.user.role);
  }

  @Delete('projects/:id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  deleteProject(@Param('id') id: string, @Req() req: any) {
    return this.capstoneService.deleteProject(id, req.user.id, req.user.role);
  }

  // ---------------------------------------------------------------------------
  // Submissions
  // ---------------------------------------------------------------------------

  @Get('submissions/my')
  @Roles(Role.INTERN)
  getMySubmissions(@Req() req: any) {
    return this.capstoneService.getMySubmissions(req.user.id);
  }

  @Get('submissions/course/:courseId')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  getSubmissionsByCourse(
    @Param('courseId') courseId: string,
    @Req() req: any,
  ) {
    return this.capstoneService.getSubmissionsByCourse(
      courseId,
      req.user.id,
      req.user.role,
    );
  }

  @Post('submissions/upload')
  @Roles(Role.INTERN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  async uploadSubmission(
    @UploadedFile() file: any,
    @Body('projectId') projectId: string,
    @Req() req: any,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!projectId) throw new BadRequestException('projectId is required');

    // File size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `File too large. Maximum allowed size is 50 MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`,
      );
    }

    // File type check
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || '';
    const isMimeAllowed = ALLOWED_MIME_TYPES.includes(file.mimetype);
    const isExtAllowed = ALLOWED_EXTENSIONS.includes(fileExtension);

    if (!isMimeAllowed && !isExtAllowed) {
      throw new BadRequestException(
        'Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, ZIP, JPG, PNG.',
      );
    }

    try {
      // Upload directly to S3 with 'file-' prefix to enforce access control
      const s3ObjectKey = await this.s3Service.uploadFile(file, 'file-');
      const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${encodeURIComponent(s3ObjectKey)}`;

      const submission = await this.capstoneService.saveSubmission(
        projectId,
        req.user.id,
        fileUrl,
        file.originalname,
      );

      return { fileUrl, originalName: file.originalname, submission };
    } catch (err: any) {
      this.logger.error('[CapstoneUpload] Error during upload:', err?.message, err?.stack);
      // Re-throw known NestJS exceptions as-is, wrap unknown ones
      if (err?.status) throw err;
      throw new BadRequestException(err?.message || 'Upload failed. Please try again.');
    }
  }

  @Patch('submissions/:id/review')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  reviewSubmission(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.capstoneService.reviewSubmission(
      id,
      body.marks,
      body.remarks,
      body.status,
      req.user.id,
      req.user.role,
    );
  }

  @Get('submissions/coordinator')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  getCoordinatorSubmissions(@Req() req: any) {
    return this.capstoneService.getCoordinatorSubmissions(req.user.id);
  }
}
