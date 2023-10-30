import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { SerieEnum, SerieType } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { SeasonResponseDto } from 'src/seasons';

export class SerieResponseDto {
  @IsUUID()
  id: string;

  @ApiProperty({ enum: Object.values(SerieEnum) })
  @IsIn(Object.values(SerieEnum))
  type: SerieType;

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
  seasons?: SeasonResponseDto[];

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
