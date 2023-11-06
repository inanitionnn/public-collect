import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class TitleParseDto {
  @ApiProperty()
  @IsString()
  query: string;
}
