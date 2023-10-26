import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SeasonDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  seriesId?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  number?: number;

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
