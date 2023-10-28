import { IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { MediaEnum, MediaType, SortEnum, SortType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { FilmEnum, FilmType } from 'src/films';
import { SerieEnum, SerieType } from 'src/series';
import { ComicEnum, ComicType } from 'src/comics';
import { BookEnum, BookType } from 'src/books';
import { WatchedEnum, WatchedType } from 'src/progress';

export class MediaGetManyDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  limit: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @ApiProperty()
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsOptional()
  @IsIn(Object.values(SortEnum))
  sortType?: SortType;

  @ApiProperty()
  @IsOptional()
  @IsIn([Object.values(WatchedEnum), 'rated'])
  watched?: WatchedType | 'rated';

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
