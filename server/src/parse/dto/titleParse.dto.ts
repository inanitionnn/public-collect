import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { MediaEnum, MediaType } from 'src/media/types';

export class TitleParseDto {
  @ApiProperty()
  @IsString()
  query: string;
}
