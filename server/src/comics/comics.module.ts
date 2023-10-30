import { Module } from '@nestjs/common';
import { ComicsService } from './comics.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { ErrorsModule } from 'src/errors/errors.module';

@Module({
  imports: [DrizzleModule, ErrorsModule],
  exports: [ComicsService],
  providers: [ComicsService],
})
export class ComicsModule {}
