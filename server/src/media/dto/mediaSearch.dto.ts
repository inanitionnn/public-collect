import { IsIn, IsString, Length, min } from 'class-validator';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class MediaSearchDto {
  @ApiProperty({ enum: Object.values(MediaEnum) })
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsString()
  @Length(1, 256)
  query: string;
}
