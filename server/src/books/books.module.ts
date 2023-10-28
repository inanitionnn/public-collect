import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  exports: [BooksService],
  providers: [BooksService],
})
export class BooksModule {}
