import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsString } from 'class-validator';
import { MediaEnum, MediaType } from 'src/media/types';

export class FieldsParseDto {
  @ApiProperty({ enum: Object.values(MediaEnum) })
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  keys: string[];
}
