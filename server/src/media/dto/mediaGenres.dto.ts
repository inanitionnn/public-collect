import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MediaGenresDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  genres: string[];
}
