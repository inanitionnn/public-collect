import { FilmCreateDto } from 'src/films';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { ComicCreateDto } from 'src/comics';
import { BookCreateDto } from 'src/books';
import { SerieCreateDto } from 'src/series';
import { IsIn } from 'class-validator';

export class MediaCreateDto {
  @ApiProperty()
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  media: FilmCreateDto | SerieCreateDto | ComicCreateDto | BookCreateDto;
}
