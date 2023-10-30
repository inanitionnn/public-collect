import { ApiExtraModels, ApiProperty, refs } from '@nestjs/swagger';
import { BookProgressDto } from 'src/books';
import { ComicProgressDto } from 'src/comics';
import { FilmProgressDto } from 'src/films';
import { SerieProgressDto } from 'src/series';

@ApiExtraModels(
  FilmProgressDto,
  SerieProgressDto,
  ComicProgressDto,
  BookProgressDto,
)
export class MediaProgressDto {
  @ApiProperty({
    oneOf: refs(
      FilmProgressDto,
      SerieProgressDto,
      ComicProgressDto,
      BookProgressDto,
    ),
  })
  media:
    | FilmProgressDto
    | SerieProgressDto
    | ComicProgressDto
    | BookProgressDto;
}

@ApiExtraModels(
  FilmProgressDto,
  SerieProgressDto,
  ComicProgressDto,
  BookProgressDto,
)
export class MediaProgressArrayDto {
  @ApiProperty({
    oneOf: refs(
      FilmProgressDto,
      SerieProgressDto,
      ComicProgressDto,
      BookProgressDto,
    ),
    isArray: true,
  })
  media:
    | FilmProgressDto[]
    | SerieProgressDto[]
    | ComicProgressDto[]
    | BookProgressDto[];
}
