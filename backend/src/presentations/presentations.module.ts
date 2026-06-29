import { Module } from '@nestjs/common';
import { PresentationsController } from './presentations.controller';
import { PresentationsService } from './presentations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PresentationsController],
  providers: [PresentationsService],
  exports: [PresentationsService],
})
export class PresentationsModule {}
