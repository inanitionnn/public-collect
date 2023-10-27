import { ApiProperty } from '@nestjs/swagger';
import { SeasonDto } from './season.dto';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class SeasonWikiDto
  implements Omit<SeasonDto, 'id' | 'seriesId' | 'rate'>
{
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
}