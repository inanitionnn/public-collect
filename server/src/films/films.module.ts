import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';

@Module({
  exports: [FilmsService],
  providers: [FilmsService],
})
export class FilmsModule {}
