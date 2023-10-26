import { ApiProperty } from '@nestjs/swagger';
import { SeasonDto } from './season.dto';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { seasons } from '../seasons.entity';

export const SeasonResponseObject = {
  id: seasons.id,
  number: seasons.number,
  episodes: seasons.episodes,
  title: seasons.title,
  rate: seasons.rate,
};

export class SeasonResponseDto implements Omit<SeasonDto, 'seriesId'> {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  number: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 256)
  title?: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  episodes?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  rate?: number;
}
