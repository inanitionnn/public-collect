import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComicEnum, ComicType } from '../types';

export class ComicResponseDto {
  @IsUUID()
  id: string;

  @ApiProperty({ enum: Object.values(ComicEnum) })
  @IsIn(Object.values(ComicEnum))
  type: ComicType;

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
  author?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  language?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  volumes?: number;

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
}
