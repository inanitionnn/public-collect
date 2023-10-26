import { Module } from '@nestjs/common';
import { BooksService } from './books.service';

@Module({
  exports: [BooksService],
  providers: [BooksService],
})
export class BooksModule {}
