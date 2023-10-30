import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { ErrorsModule } from 'src/errors/errors.module';

@Module({
  imports: [DrizzleModule, ErrorsModule],
  exports: [BooksService],
  providers: [BooksService],
})
export class BooksModule {}
