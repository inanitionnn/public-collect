import { IsIn, IsOptional } from 'class-validator';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { FilmEnum, FilmType } from 'src/films';
import { SerieEnum, SerieType } from 'src/series';
import { ComicEnum, ComicType } from 'src/comics';
import { BookEnum, BookType } from 'src/books';

export class MediaGetGenresDto {
  @ApiProperty({ enum: Object.values(MediaEnum) })
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty({ enum: Object.values(FilmEnum) })
  @IsOptional()
  @IsIn(Object.values(FilmEnum))
  filmType?: FilmType;

  @ApiProperty({ enum: Object.values(SerieEnum) })
  @IsOptional()
  @IsIn(Object.values(SerieEnum))
  serieType?: SerieType;

  @ApiProperty({ enum: Object.values(ComicEnum) })
  @IsOptional()
  @IsIn(Object.values(ComicEnum))
  comicType?: ComicType;

  @ApiProperty({ enum: Object.values(BookEnum) })
  @IsOptional()
  @IsIn(Object.values(BookEnum))
  bookType?: BookType;
}
