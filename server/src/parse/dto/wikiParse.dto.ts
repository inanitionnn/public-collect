import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUrl } from 'class-validator';
import { MediaEnum, MediaType } from 'src/media';

export class WikiParseDto {
  @ApiProperty({ enum: Object.values(MediaEnum) })
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @ApiProperty()
  @IsUrl()
  link: string;
}
