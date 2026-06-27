import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { UploadsController } from './uploads.controller';

@Module({
  providers: [SubmissionsService],
  controllers: [SubmissionsController, UploadsController],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
