import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeasonsModule } from 'src/seasons';

@Module({
  imports: [SeasonsModule],
  exports: [SeriesService],
  providers: [SeriesService],
})
export class SeriesModule {}
