import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { BookProgressDto, BookResponseDto } from 'src/books';
import { ComicProgressDto, ComicResponseDto } from 'src/comics';
import { FilmProgressDto, FilmResponseDto } from 'src/films';
import { SerieProgressDto, SerieResponseDto } from 'src/series';

export class MediaResponseDto {
  @ApiProperty()
  media:
    | FilmResponseDto
    | SerieResponseDto
    | ComicResponseDto
    | BookResponseDto;
}

export class MediaResponseArrayDto {
  @ApiProperty()
  @IsArray()
  media:
    | FilmResponseDto[]
    | SerieResponseDto[]
    | ComicResponseDto[]
    | BookResponseDto[];
}
