import { IsIn, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { MediaEnum, MediaType } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class MediaGetNearestDto {
  @ApiProperty()
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  limit: number;
}
