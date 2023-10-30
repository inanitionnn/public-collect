import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { MediaEnum, MediaType, SortEnum, SortType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { FilmEnum, FilmType } from 'src/films';
import { SerieEnum, SerieType } from 'src/series';
import { ComicEnum, ComicType } from 'src/comics';
import { BookEnum, BookType } from 'src/books';
import { WatchedEnum, WatchedType } from 'src/progress';

export class MediaGetManyDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  limit: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number;

  @ApiProperty({ enum: Object.values(MediaEnum) })
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty({ enum: Object.values(SortEnum) })
  @IsOptional()
  @IsIn(Object.values(SortEnum))
  sortType?: SortType;

  @ApiProperty({ enum: [...Object.values(WatchedEnum), 'rated'] })
  @IsOptional()
  @IsIn([Object.values(WatchedEnum), 'rated'])
  watched?: WatchedType | 'rated';

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
