import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { FilmEnum, FilmType } from 'src/films';
import { SerieEnum, SerieType } from 'src/series';
import { ComicEnum, ComicType } from 'src/comics';
import { BookEnum, BookType } from 'src/books';

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
