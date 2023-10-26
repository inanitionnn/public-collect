import { ApiProperty } from '@nestjs/swagger';

export class GetTitleResponse {
  @ApiProperty()
  title: string;

  @ApiProperty()
  year: number;
}
