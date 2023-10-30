import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class SearchParseDto {
  @ApiProperty()
  @IsString()
  query: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  count: number;
}
