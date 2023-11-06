import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ErrorsModule } from 'src/errors/errors.module';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [ErrorsModule, DrizzleModule],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
