import { IsIn, IsString, Length, min } from 'class-validator';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class MediaSearchDto {
  @ApiProperty()
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsString()
  @Length(1, 256)
  query: string;
}
