import { ApiProperty } from '@nestjs/swagger';

export class TitleParseResponse {
  @ApiProperty()
  title: string;

  @ApiProperty()
  year: number;
}
