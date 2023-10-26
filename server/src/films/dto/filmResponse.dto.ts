import { FilmDto } from './film.dto';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { FilmEnum, FilmType, films } from '../film.entity';
import { ApiProperty } from '@nestjs/swagger';

export const FilmResponseObject = {
  id: films.id,
  type: films.type,
  title: films.title,
  year: films.year,
  country: films.country,
  description: films.description,
  directedBy: films.directedBy,
  starring: films.starring,
  language: films.language,
  runTime: films.runTime,
  boxOffice: films.boxOffice,
  budget: films.budget,
  genres: films.genres,
  tags: films.tags,
  image: films.image,
};

export class FilmResponseDto implements Omit<FilmDto, 'embedding'> {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsIn(FilmEnum.enumValues)
  type: FilmType;

  @ApiProperty()
  @IsString()
  @Length(1, 256)
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  year?: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  country?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  directedBy?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  starring?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  language?: string[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  runTime?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 256)
  boxOffice?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 256)
  budget?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  genres?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  tags?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;

  // constructor(films: FilmDto) {
  //   this.id = films.id;
  //   this.type = films.type;
  //   this.title = films.title;
  //   this.year = films.year;
  //   this.country = films.country;
  //   this.description = films.description;
  //   this.directedBy = films.directedBy;
  //   this.starring = films.starring;
  //   this.language = films.language;
  //   this.runTime = films.runTime;
  //   this.boxOffice = films.boxOffice;
  //   this.budget = films.budget;
  //   this.genres = films.genres;
  //   this.tags = films.tags;
  //   this.image = films.image;
  // }
}
