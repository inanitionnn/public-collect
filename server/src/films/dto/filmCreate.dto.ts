import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { FilmEnum, FilmType } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class FilmCreateDto {
  @ApiProperty({ enum: Object.values(FilmEnum) })
  @IsOptional()
  @IsIn(Object.values(FilmEnum))
  type?: FilmType;

  @IsString()
  @Length(1, 256)
  title: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(new Date().getFullYear() + 20)
  year?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  country?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  directedBy?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  starring?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  language?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  runTime?: number;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  boxOffice?: string;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  budget?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  genres?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  image?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  embedding: number[];
}
