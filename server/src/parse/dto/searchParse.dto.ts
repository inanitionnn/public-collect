import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SearchParseDto {
  @ApiProperty()
  @IsString()
  query: string;

  @ApiProperty()
  @IsNumber()
  count: number;
}
