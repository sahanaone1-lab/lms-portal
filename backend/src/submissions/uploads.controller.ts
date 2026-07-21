import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  Injectable,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { Role } from '@prisma/client';
import { S3Service } from '../aws/s3.service';

// File prefixes that require authentication
const PROTECTED_PREFIXES = ['file-', 'proj-submission-'];

@Injectable()
export class UploadsAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const filename = request.params.filename as string;

    // If the file does NOT start with a protected prefix, it's a public brochure
    const isProtected = filename && PROTECTED_PREFIXES.some((p) => filename.startsWith(p));
    if (!isProtected) {
      return true; // Bypass authentication for public files
    }

    return super.canActivate(context);
  }
}

@Controller('uploads')
export class UploadsController {
  private readonly logger = new Logger(UploadsController.name);

  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  @Get(':filename')
  @UseGuards(UploadsAuthGuard)
  async serveFile(
    @Param('filename') filename: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const isProtected = PROTECTED_PREFIXES.some((p) => filename.startsWith(p));

    if (isProtected) {
      const user = req.user;
      if (!user) {
        throw new ForbiddenException('Authentication required for this file');
      }

      // ── Assignment submission files (file- prefix) ──
      if (filename.startsWith('file-')) {
        const submission = await this.prisma.submission.findFirst({
          where: { fileUrl: { contains: filename } },
          include: { assignment: { include: { course: true } } },
        });

        if (submission) {
          const isOwner = submission.studentId === user.id;
          const isAdmin = user.role === Role.ADMIN;
          let isCoordinator = submission.assignment.course.projectCoordinatorId === user.id;

          if (!isCoordinator && user.role === Role.PROJECT_COORDINATOR) {
            const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
            const userDomain = dbUser?.domain;
            const courseDomain = submission.assignment.course.domain;
            if (
              userDomain &&
              courseDomain &&
              userDomain.toLowerCase() === courseDomain.toLowerCase()
            ) {
              isCoordinator = true;
            }
          }

          if (!isOwner && !isCoordinator && !isAdmin) {
            throw new ForbiddenException('Unauthorized access to this project file');
          }
        }
      }

      // ── Project submission files (proj-submission- prefix) ──
      if (filename.startsWith('proj-submission-')) {
        const projectSub = await this.prisma.projectSubmission.findFirst({
          where: { fileUrl: { contains: filename } },
        });

        if (projectSub) {
          const isOwner = projectSub.studentId === user.id;
          const isAdmin = user.role === Role.ADMIN;
          let isCoordinator = projectSub.projectCoordinatorId === user.id;

          if (!isCoordinator && user.role === Role.PROJECT_COORDINATOR) {
            const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
            const userDomain = dbUser?.domain;
            if (
              userDomain &&
              projectSub.domain.toLowerCase() === userDomain.toLowerCase()
            ) {
              isCoordinator = true;
            }
          }

          if (!isOwner && !isCoordinator && !isAdmin) {
            throw new ForbiddenException('Unauthorized access to this project submission file');
          }
        }
      }

      // ── Capstone submission files (file- prefix shared) ──
      if (filename.startsWith('file-')) {
        const capstoneSub = await this.prisma.capstoneSubmission.findFirst({
          where: { fileUrl: { contains: filename } },
          include: { project: { include: { course: true } } },
        });

        if (capstoneSub) {
          const isOwner = capstoneSub.studentId === user.id;
          const isAdmin = user.role === Role.ADMIN;
          let isCoordinator = false;

          if (!isAdmin && !isOwner && user.role === Role.PROJECT_COORDINATOR) {
            const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
            const userDomain = dbUser?.domain;
            const courseDomain = capstoneSub.project.course?.domain;
            if (userDomain && courseDomain && userDomain.toLowerCase() === courseDomain.toLowerCase()) {
              isCoordinator = true;
            }
          }

          if (!isOwner && !isCoordinator && !isAdmin) {
            throw new ForbiddenException('Unauthorized access to this capstone file');
          }
        }
      }
    }

    // Try local file first
    const filePath = join(process.cwd(), 'uploads', filename);
    const isLocalFile = fs.existsSync(filePath);

    if (isLocalFile) {
      res.setHeader('Content-Disposition', 'inline');
      return res.sendFile(filePath);
    }

    // Fall back to S3
    try {
      const s3Url = await this.s3Service.getPresignedUrl(filename);
      return res.redirect(s3Url);
    } catch (err) {
      this.logger.warn(`File not found locally or in S3: ${filename}`);
      throw new NotFoundException('File not found');
    }
  }
}
