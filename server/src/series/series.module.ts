import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeasonsModule } from 'src/seasons';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { ErrorsModule } from 'src/errors/errors.module';

@Module({
  imports: [SeasonsModule, DrizzleModule, ErrorsModule],
  exports: [SeriesService],
  providers: [SeriesService],
})
export class SeriesModule {}
