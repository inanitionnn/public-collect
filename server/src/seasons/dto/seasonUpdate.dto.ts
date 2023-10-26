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

export class SeasonUpdateDto implements Omit<SeasonDto, 'seriesId'> {
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
  @IsOptional()
  @IsNumber()
  @IsPositive()
  episodes?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  rate?: number;
}
