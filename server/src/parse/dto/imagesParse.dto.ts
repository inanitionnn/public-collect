import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';
import { MediaEnum, MediaType } from 'src/media';

export class ImagesParseDto {
  @ApiProperty()
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsString()
  query: string;

  @ApiProperty()
  @IsNumber()
  count: number;
}
