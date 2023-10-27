import { ApiProperty } from '@nestjs/swagger';
import { BookProgressDto } from 'src/books';
import { ComicProgressDto } from 'src/comics';
import { FilmProgressDto } from 'src/films';
import { SerieProgressDto } from 'src/series';

export class MediaProgressDto {
  @ApiProperty()
  media:
    | FilmProgressDto
    | SerieProgressDto
    | ComicProgressDto
    | BookProgressDto;
}

export class MediaProgressArrayDto {
  @ApiProperty()
  media:
    | FilmProgressDto[]
    | SerieProgressDto[]
    | ComicProgressDto[]
    | BookProgressDto[];
}
