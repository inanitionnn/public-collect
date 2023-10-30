import { Module } from '@nestjs/common';
import { ErrorsService } from './errors.service';

@Module({
  exports: [ErrorsService],
  providers: [ErrorsService],
})
export class ErrorsModule {}
