import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  exports: [FilmsService],
  providers: [FilmsService],
})
export class FilmsModule {}
