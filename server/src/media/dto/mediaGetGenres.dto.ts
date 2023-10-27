import { IsIn, IsOptional } from 'class-validator';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { filmEnum, FilmType } from 'src/films';
import { serieEnum, SerieType } from 'src/series';
import { comicEnum, ComicType } from 'src/comics';
import { bookEnum, BookType } from 'src/books';

export class MediaGetGenresDto {
  @ApiProperty()
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsOptional()
  @IsIn(filmEnum.enumValues)
  filmType?: FilmType;

  @ApiProperty()
  @IsOptional()
  @IsIn(serieEnum.enumValues)
  serieType?: SerieType;

  @ApiProperty()
  @IsOptional()
  @IsIn(comicEnum.enumValues)
  comicType?: ComicType;

  @ApiProperty()
  @IsOptional()
  @IsIn(bookEnum.enumValues)
  bookType?: BookType;
}
