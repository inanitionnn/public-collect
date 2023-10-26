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
import { WatchedEnum, WatchedType, progress } from '../progress.entity';
import { ProgressDto } from './progress.dto';

export const ProgressResponseObject = {
  watched: progress.watched,
  finishedOn: progress.finishedOn,
  note: progress.note,
  rate: progress.rate,
  createdAt: progress.createdAt,
};

export class ProgressResponseDto
  implements
    Omit<ProgressDto, 'filmId' | 'serieId' | 'comicId' | 'bookId' | 'id'>
{
  @ApiProperty()
  @IsOptional()
  @IsIn(WatchedEnum.enumValues)
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
