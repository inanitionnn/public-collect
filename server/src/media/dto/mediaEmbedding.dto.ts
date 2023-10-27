import { IsIn, IsNumber, IsPositive, IsString, Length } from 'class-validator';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class MediaEmbeddingDto {
  @ApiProperty()
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsString()
  @Length(1, 256)
  query: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  limit: number;
}
