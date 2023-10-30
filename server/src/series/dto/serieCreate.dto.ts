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
import { SerieEnum, SerieType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { SeasonCreateDto } from 'src/seasons';

export class SerieCreateDto {
  @ApiProperty({ enum: Object.values(SerieEnum) })
  @IsOptional()
  @IsIn(Object.values(SerieEnum))
  type?: SerieType;

  @IsString()
  @Length(1, 256)
  title: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(new Date().getFullYear() + 20)
  startYear?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(new Date().getFullYear() + 20)
  endYear?: number;

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
  @IsArray()
  seasons?: SeasonCreateDto[];

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
