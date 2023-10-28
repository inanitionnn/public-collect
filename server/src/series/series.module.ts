import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeasonsModule } from 'src/seasons';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [SeasonsModule, DrizzleModule],
  exports: [SeriesService],
  providers: [SeriesService],
})
export class SeriesModule {}
