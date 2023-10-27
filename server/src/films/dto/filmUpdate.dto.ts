import { FilmDto } from './film.dto';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { filmEnum, FilmType } from '../film.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FilmUpdateDto implements Omit<FilmDto, 'id'> {
  // @ApiProperty()
  // @IsOptional()
  // @IsIn(filmEnum.enumValues)
  // type?: FilmType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 256)
  title?: string;

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

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  embedding?: number[];
}
