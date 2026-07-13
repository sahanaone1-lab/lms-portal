import { Module } from '@nestjs/common';
import { CapstoneController } from './capstone.controller';
import { CapstoneService } from './capstone.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [PrismaModule, AwsModule],
  controllers: [CapstoneController],
  providers: [CapstoneService],
  exports: [CapstoneService],
})
export class CapstoneModule {}
