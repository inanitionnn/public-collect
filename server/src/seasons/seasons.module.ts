import { Module } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { ErrorsModule } from 'src/errors/errors.module';

@Module({
  imports: [DrizzleModule, ErrorsModule],
  exports: [SeasonsService],
  providers: [SeasonsService],
})
export class SeasonsModule {}
