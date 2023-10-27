import { FilmUpdateDto } from 'src/films';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { ComicUpdateDto } from 'src/comics';
import { BookUpdateDto } from 'src/books';
import { SerieUpdateDto } from 'src/series';
import { IsIn, IsUUID } from 'class-validator';

export class MediaUpdateDto {
  @ApiProperty()
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  media: FilmUpdateDto | SerieUpdateDto | ComicUpdateDto | BookUpdateDto;
}
