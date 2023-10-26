import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from 'src/media/types';

export class GetFieldsRequest {
  @ApiProperty()
  mediaType: MediaType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  keys: string[];
}
