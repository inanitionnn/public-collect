import { Module } from '@nestjs/common';
import { ComicsService } from './comics.service';

@Module({
  exports: [ComicsService],
  providers: [ComicsService],
})
export class ComicsModule {}
