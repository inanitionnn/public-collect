import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from 'src/media/types';

export class getImagesRequest {
  @ApiProperty()
  mediaType: MediaType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  count: number;
}
