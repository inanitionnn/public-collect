import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { FilesModule } from 'src/files';
import { FilmsModule } from 'src/films';
import { ParseModule } from 'src/parse';
import { ComicsModule } from 'src/comics';
import { BooksModule } from 'src/books';
import { SeriesModule } from 'src/series';
import { MediaController } from './media.controller';
import { ErrorsModule } from 'src/errors/errors.module';
import { ProgressModule } from 'src/progress';

@Module({
  imports: [
    ErrorsModule,
    FilesModule,
    FilmsModule,
    SeriesModule,
    ComicsModule,
    BooksModule,
    ParseModule,
    ProgressModule,
  ],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
