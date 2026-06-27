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
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) { }

  @Get('enrolled')
  @Roles(Role.INTERN)
  getMyEnrolled(@Req() req: any) {
    return this.coursesService.getMyEnrolled(req.user.id);
  }

  @Post(':id/brochure')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
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
          callback(null, `brochure-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {},
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname).toLowerCase();
        const allowedExts = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
        if (!allowedExts.includes(ext)) {
          return callback(new BadRequestException('Only PDF and image files (PNG, JPG, JPEG, WEBP) are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadBrochure(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFile() file: any,
  ) {
    if (!file) throw new BadRequestException('No brochure file uploaded');
    const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${file.filename}`;
    return this.coursesService.uploadBrochure(
      id,
      fileUrl,
      file.originalname,
      file.mimetype,
      req.user.id,
      req.user.role,
    );
  }

  @Get('created')
  @Roles(Role.PROJECT_COORDINATOR)
  getMyCreated(@Req() req: any) {
    return this.coursesService.getMyCreated(req.user.id);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.getById(id, req.user?.id, req.user?.role);
  }

  @Get()
  getAll(@Req() req: any) {
    return this.coursesService.getAll(req.user.id, req.user.role);
  }

  @Post()
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  create(@Req() req: any, @Body() body: any) {
    return this.coursesService.create({
      ...body,
      projectCoordinatorId: req.user.id,
    });
  }

  @Patch(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.coursesService.update(id, body, req.user.id, req.user.role);
  }

  @Delete(':id')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  delete(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.delete(id, req.user.id, req.user.role);
  }

  @Post(':id/enroll')
  @Roles(Role.INTERN)
  enroll(@Req() req: any, @Param('id') courseId: string) {
    return this.coursesService.enroll(req.user.id, courseId);
  }

  @Delete(':id/brochure')
  @Roles(Role.PROJECT_COORDINATOR, Role.ADMIN)
  deleteBrochure(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.deleteBrochure(id, req.user.id, req.user.role);
  }
}

@Controller('public-courses')
export class PublicCoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get('domain-brochures')
  getDomainBrochures() {
    return this.coursesService.getDomainBrochures();
  }
}
