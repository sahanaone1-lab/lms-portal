import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { UploadsController } from './uploads.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [PrismaModule, AwsModule],
  providers: [SubmissionsService],
  controllers: [SubmissionsController, UploadsController],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
