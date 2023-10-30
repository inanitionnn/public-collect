import { FilmCreateDto } from 'src/films';
import { MediaEnum, MediaType } from '../types';
import { ApiExtraModels, ApiProperty, refs } from '@nestjs/swagger';
import { ComicCreateDto } from 'src/comics';
import { BookCreateDto } from 'src/books';
import { SerieCreateDto } from 'src/series';
import { IsIn } from 'class-validator';

@ApiExtraModels(FilmCreateDto, SerieCreateDto, ComicCreateDto, BookCreateDto)
export class MediaCreateDto {
  @ApiProperty({ enum: Object.values(MediaEnum) })
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty({
    oneOf: refs(FilmCreateDto, SerieCreateDto, ComicCreateDto, BookCreateDto),
  })
  media: FilmCreateDto | SerieCreateDto | ComicCreateDto | BookCreateDto;
}
