import { ApiExtraModels, ApiProperty, refs } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { BookResponseDto } from 'src/books';
import { ComicResponseDto } from 'src/comics';
import { FilmResponseDto } from 'src/films';
import { SerieResponseDto } from 'src/series';

@ApiExtraModels(
  FilmResponseDto,
  SerieResponseDto,
  ComicResponseDto,
  BookResponseDto,
)
export class MediaResponseDto {
  @ApiProperty({
    oneOf: refs(
      FilmResponseDto,
      SerieResponseDto,
      ComicResponseDto,
      BookResponseDto,
    ),
  })
  media:
    | FilmResponseDto
    | SerieResponseDto
    | ComicResponseDto
    | BookResponseDto;
}

@ApiExtraModels(
  FilmResponseDto,
  SerieResponseDto,
  ComicResponseDto,
  BookResponseDto,
)
export class MediaResponseArrayDto {
  @ApiProperty({
    oneOf: refs(
      FilmResponseDto,
      SerieResponseDto,
      ComicResponseDto,
      BookResponseDto,
    ),
    isArray: true,
  })
  @IsArray()
  media:
    | FilmResponseDto[]
    | SerieResponseDto[]
    | ComicResponseDto[]
    | BookResponseDto[];
}
