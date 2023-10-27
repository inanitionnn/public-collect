import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUrl } from 'class-validator';

export class ImagesResponseDto {
  @ApiProperty()
  @IsArray()
  @IsUrl({}, { each: true })
  links: string[];
}
