import { Module } from '@nestjs/common';
import { SeasonsService } from './seasons.service';

@Module({
  exports: [SeasonsService],
  providers: [SeasonsService],
})
export class SeasonsModule {}
