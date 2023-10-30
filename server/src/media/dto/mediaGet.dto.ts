import { IsIn, IsUUID } from 'class-validator';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class MediaGetDto {
  @ApiProperty({ enum: Object.values(MediaEnum) })
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsUUID()
  id: string;
}
