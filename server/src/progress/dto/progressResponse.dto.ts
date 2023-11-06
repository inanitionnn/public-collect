import {
  IsDate,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WatchedEnum, WatchedType } from '../types';

export class ProgressResponseDto {
  @ApiProperty({ enum: Object.values(WatchedEnum) })
  @IsOptional()
  @IsIn(Object.values(WatchedEnum))
  watched?: WatchedType;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  finishedOn?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rate?: number;

  @IsOptional()
  @IsDate()
  createdAt?: Date;
}
