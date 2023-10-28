import { Module } from '@nestjs/common';
import { ComicsService } from './comics.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  exports: [ComicsService],
  providers: [ComicsService],
})
export class ComicsModule {}
