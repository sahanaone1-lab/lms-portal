import { Module } from '@nestjs/common';
import { ProjectSubmissionsController } from './project-submissions.controller';
import { ProjectSubmissionsService } from './project-submissions.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [PrismaModule, AwsModule],
  controllers: [ProjectSubmissionsController],
  providers: [ProjectSubmissionsService],
  exports: [ProjectSubmissionsService],
})
export class ProjectSubmissionsModule {}
