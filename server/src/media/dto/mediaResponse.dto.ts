import { ApiProperty } from '@nestjs/swagger';
import { BookResponseDto } from 'src/books';
import { ComicResponseDto } from 'src/comics';
import { FilmResponseDto } from 'src/films';
import { SerieSeasonsDto } from 'src/series';

export class MediaResponseDto {
  @ApiProperty()
  media: FilmResponseDto | SerieSeasonsDto | ComicResponseDto | BookResponseDto;
}
