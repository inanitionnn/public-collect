import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { drizzleProvider } from 'src/drizzle';

@Module({
  exports: [FilmsService],
  providers: [FilmsService, ...drizzleProvider],
})
export class FilmsModule {}
