import { IsIn, IsInt, IsString, Length, Min } from 'class-validator';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class MediaEmbeddingDto {
  @ApiProperty({ enum: Object.values(MediaEnum) })
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsString()
  @Length(1, 256)
  query: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  limit: number;
}
