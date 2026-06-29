import { Module } from '@nestjs/common';
import { PresentationRegistrationsController } from './presentation-registrations.controller';
import { PresentationRegistrationsService } from './presentation-registrations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PresentationRegistrationsController],
  providers: [PresentationRegistrationsService],
})
export class PresentationRegistrationsModule {}
