import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { ErrorsModule } from 'src/errors/errors.module';

@Module({
  imports: [DrizzleModule, ErrorsModule],
  exports: [FilmsService],
  providers: [FilmsService],
})
export class FilmsModule {}
