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
  @IsInt()
  @Min(1)
  @Max(10)
  rate?: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  createdAt?: Date;
}
