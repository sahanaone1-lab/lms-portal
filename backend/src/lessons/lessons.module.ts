import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { YoutubeService } from './youtube.service';

@Module({
  providers: [LessonsService, YoutubeService],
  controllers: [LessonsController],
  exports: [LessonsService, YoutubeService],
})
export class LessonsModule {}
