import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from 'src/media/types';

export class TitleParseRequest {
  @ApiProperty()
  mediaType: MediaType;

  @ApiProperty()
  query: string;
}
