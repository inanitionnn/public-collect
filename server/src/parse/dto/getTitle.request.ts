import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from 'src/media/types';

export class GetTitleRequest {
  @ApiProperty()
  mediaType: MediaType;

  @ApiProperty()
  query: string;
}
