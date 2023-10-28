import {
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WatchedEnum, WatchedType } from '../types';
import { ProgressDto } from './progress.dto';

export class ProgressResponseDto
  implements
    Omit<ProgressDto, 'filmId' | 'serieId' | 'comicId' | 'bookId' | 'id'>
{
  @ApiProperty()
  @IsOptional()
  @IsIn(Object.values(WatchedEnum))
  watched?: WatchedType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 256)
  finishedOn?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  rate?: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  createdAt?: Date;
}
