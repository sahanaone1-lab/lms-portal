import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController, PublicCoursesController } from './courses.controller';

@Module({
  providers: [CoursesService],
  controllers: [CoursesController, PublicCoursesController],
  exports: [CoursesService],
})
export class CoursesModule {}
