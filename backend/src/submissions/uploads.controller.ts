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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { Role } from '@prisma/client';

@Injectable()
export class UploadsAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const filename = request.params.filename;
    
    // If the file is a public brochure (does not start with 'file-')
    if (filename && !filename.startsWith('file-')) {
      return true; // Bypass authentication
    }
    
    return super.canActivate(context);
  }
}

@Controller('uploads')
export class UploadsController {
  constructor(private prisma: PrismaService) {}

  @Get(':filename')
  @UseGuards(UploadsAuthGuard)
  async serveFile(
    @Param('filename') filename: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const filePath = join(process.cwd(), 'uploads', filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const user = req.user;

    // If it is a project file
    if (filename.startsWith('file-')) {
      if (!user) {
        throw new ForbiddenException('Authentication required for this file');
      }
      const submission = await this.prisma.submission.findFirst({
        where: {
          fileUrl: {
            contains: filename,
          },
        },
        include: {
          assignment: {
            include: {
              course: true,
            },
          },
        },
      });

      if (submission) {
        const isOwner = submission.studentId === user.id;
        const isAdmin = user.role === Role.ADMIN;
        
        let isCoordinator = submission.assignment.course.projectCoordinatorId === user.id;
        if (!isCoordinator && user.role === Role.PROJECT_COORDINATOR) {
          const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
          const userDomain = dbUser?.domain;
          const courseDomain = submission.assignment.course.domain;
          if (userDomain && courseDomain && userDomain.toLowerCase() === courseDomain.toLowerCase()) {
            isCoordinator = true;
          }
        }

        if (!isOwner && !isCoordinator && !isAdmin) {
          throw new ForbiddenException(
            'Unauthorized access to this project file',
          );
        }
      }
    }

    res.setHeader('Content-Disposition', 'inline');
    return res.sendFile(filePath);
  }
}
