import { FilmUpdateDto } from 'src/films';
import { MediaEnum, MediaType } from '../types';
import { ApiExtraModels, ApiProperty, refs } from '@nestjs/swagger';
import { ComicUpdateDto } from 'src/comics';
import { BookUpdateDto } from 'src/books';
import { SerieUpdateDto } from 'src/series';
import { IsIn, IsUUID } from 'class-validator';

@ApiExtraModels(FilmUpdateDto, SerieUpdateDto, ComicUpdateDto, BookUpdateDto)
export class MediaUpdateDto {
  @ApiProperty({ enum: Object.values(MediaEnum) })
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({
    oneOf: refs(FilmUpdateDto, SerieUpdateDto, ComicUpdateDto, BookUpdateDto),
  })
  media: FilmUpdateDto | SerieUpdateDto | ComicUpdateDto | BookUpdateDto;
}
