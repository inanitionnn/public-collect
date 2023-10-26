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
import { SerieEnum, SerieType, series } from '../series.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SerieDto } from './serie.dto';
import { SeasonResponseDto } from 'src/seasons';

export const SerieResponseObject = {
  id: series.id,
  type: series.type,
  title: series.title,
  startYear: series.startYear,
  endYear: series.endYear,
  country: series.country,
  description: series.description,
  directedBy: series.directedBy,
  starring: series.starring,
  language: series.language,
  genres: series.genres,
  tags: series.tags,
  image: series.image,
};

export class SerieResponseDto implements Omit<SerieDto, 'embedding'> {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsIn(SerieEnum.enumValues)
  type: SerieType;

  @ApiProperty()
  @IsString()
  @Length(1, 256)
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  startYear?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  endYear?: number;

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
  @IsArray()
  seasons?: SeasonResponseDto[];

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
}
