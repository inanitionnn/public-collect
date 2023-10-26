import { ApiProperty } from '@nestjs/swagger';

export class SearchResponse {
  @ApiProperty()
  link: string;
  @ApiProperty()
  image: string | null | undefined;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
}
