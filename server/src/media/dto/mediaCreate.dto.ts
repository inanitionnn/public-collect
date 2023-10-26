import { FilmCreateDto } from 'src/films';
import { MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { ComicCreateDto } from 'src/comics';
import { BookCreateDto } from 'src/books';
import { SerieSeasonsCreateDto } from 'src/series';

export class MediaCreateDto {
  @ApiProperty()
  mediaType: MediaType;

  @ApiProperty()
  media: FilmCreateDto | SerieSeasonsCreateDto | ComicCreateDto | BookCreateDto;
}
