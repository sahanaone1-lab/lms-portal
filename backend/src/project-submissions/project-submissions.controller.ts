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
  Logger,
} from '@nestjs/common';
import { ProjectSubmissionsService } from './project-submissions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, ProjectSubmissionStatus } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

// Max file size: 50 MB
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/zip', // .zip
  'application/x-zip-compressed', // .zip (some systems)
  'application/x-zip', // .zip (some systems)
  'image/jpeg', // .jpg
  'image/png', // .png
];

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'jpg', 'jpeg', 'png'];

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('project-submissions')
export class ProjectSubmissionsController {
  private readonly logger = new Logger(ProjectSubmissionsController.name);

  constructor(private readonly projectSubmissionsService: ProjectSubmissionsService) {}

  /**
   * POST /project-submissions/upload
   * Intern uploads a project file (multipart/form-data).
   * File is stored in S3; DB record is created with coordinator auto-assigned by domain.
   */
  @Post('upload')
  @Roles(Role.INTERN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  async uploadSubmission(
    @UploadedFile() file: Express.Multer.File,
    @Body('projectId') projectId: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded. Please attach a file.');
    }

    if (!title || title.trim().length < 3) {
      throw new BadRequestException(
        'Project title is required and must be at least 3 characters.',
      );
    }

    if (!description || description.trim().length < 10) {
      throw new BadRequestException(
        'Project description is required and must be at least 10 characters.',
      );
    }

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

    this.logger.log(
      `[ProjectSubmission] Intern ${req.user.id} uploading "${title}" — ${file.originalname} (${(file.size / 1024).toFixed(1)} KB)`,
    );

    try {
      const submission = await this.projectSubmissionsService.uploadAndSave(
        file,
        projectId || undefined,
        title.trim(),
        description.trim(),
        req.user.id,
      );

      return {
        message: 'Project submitted successfully! Your coordinator has been notified.',
        submission,
      };
    } catch (err) {
      this.logger.error('[ProjectSubmission] Upload failed:', err?.message, err?.stack);
      // Re-throw known NestJS HTTP exceptions
      if (err?.status) throw err;
      throw new BadRequestException(
        err?.message || 'An unexpected error occurred. Please try again.',
      );
    }
  }

  /**
   * GET /project-submissions
   * - INTERN: returns own submissions
   * - PROJECT_COORDINATOR: returns submissions for their domain
   * - ADMIN: returns all submissions
   */
  @Get()
  @Roles(Role.ADMIN, Role.PROJECT_COORDINATOR, Role.INTERN)
  findAll(@Req() req: any) {
    return this.projectSubmissionsService.findAll(req.user.id, req.user.role);
  }

  /**
   * GET /project-submissions/my
   * Convenience alias for interns.
   */
  @Get('my')
  @Roles(Role.INTERN)
  getMySubmissions(@Req() req: any) {
    return this.projectSubmissionsService.findAll(req.user.id, Role.INTERN);
  }

  /**
   * GET /project-submissions/coordinator
   * Convenience alias for coordinators.
   */
  @Get('coordinator')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  getCoordinatorSubmissions(@Req() req: any) {
    return this.projectSubmissionsService.findAll(req.user.id, req.user.role);
  }

  /**
   * GET /project-submissions/:id
   * Get a specific submission (auth-gated).
   */
  @Get(':id')
  @Roles(Role.ADMIN, Role.PROJECT_COORDINATOR, Role.INTERN)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.projectSubmissionsService.findOne(id, req.user.id, req.user.role);
  }

  /**
   * PATCH /project-submissions/:id/review
   * Coordinator or Admin reviews a submission — sets status and remarks.
   */
  @Patch(':id/review')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  review(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { status: ProjectSubmissionStatus; remarks?: string },
  ) {
    if (!body.status) {
      throw new BadRequestException('Status is required');
    }
    return this.projectSubmissionsService.review(
      id,
      body.status,
      body.remarks,
      req.user.id,
      req.user.role,
    );
  }
}
