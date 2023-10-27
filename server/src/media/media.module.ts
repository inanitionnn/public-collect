import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { FilesModule } from 'src/files';
import { FilmsModule } from 'src/films';
import { ParseModule } from 'src/parse';
import { ComicsModule } from 'src/comics';
import { BooksService } from 'src/books';
import { SeriesModule } from 'src/series';
import { MediaController } from './media.controller';

@Module({
  imports: [
    FilesModule,
    FilmsModule,
    SeriesModule,
    ComicsModule,
    BooksService,
    ParseModule,
  ],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
