import { IsIn, IsOptional } from 'class-validator';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { FilmEnum, FilmType } from 'src/films';
import { SerieEnum, SerieType } from 'src/series';
import { ComicEnum, ComicType } from 'src/comics';
import { BookEnum, BookType } from 'src/books';

export class MediaGetGenresDto {
  @ApiProperty()
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsOptional()
  @IsIn(Object.values(FilmEnum))
  filmType?: FilmType;

  @ApiProperty()
  @IsOptional()
  @IsIn(Object.values(SerieEnum))
  serieType?: SerieType;

  @ApiProperty()
  @IsOptional()
  @IsIn(Object.values(ComicEnum))
  comicType?: ComicType;

  @ApiProperty()
  @IsOptional()
  @IsIn(Object.values(BookEnum))
  bookType?: BookType;
}
