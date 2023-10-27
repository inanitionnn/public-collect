import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { MediaEnum, MediaType, SortEnum, SortType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { filmEnum, FilmType } from 'src/films';
import { serieEnum, SerieType } from 'src/series';
import { comicEnum, ComicType } from 'src/comics';
import { bookEnum, BookType } from 'src/books';
import { WatchedEnum, WatchedType } from 'src/progress';

export class MediaGetRandomDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  limit: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  fromYear?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  toYear?: number;

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
