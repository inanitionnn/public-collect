import {
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WatchedEnum, WatchedType } from '../progress.entity';

export class ProgressDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  filmId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  serieId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  comicId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  bookId?: string;

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
