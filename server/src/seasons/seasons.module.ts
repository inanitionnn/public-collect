import { Module } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  exports: [SeasonsService],
  providers: [SeasonsService],
})
export class SeasonsModule {}
