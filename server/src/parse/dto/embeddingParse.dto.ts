import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EmbeddingParseDto {
  @ApiProperty()
  @IsString()
  query: string;
}
