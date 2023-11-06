import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsString, Min } from 'class-validator';
import { MediaEnum, MediaType } from 'src/media';

export class SearchParseDto {
  @IsString()
  query: string;

  @ApiProperty({ enum: Object.values(MediaEnum) })
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;

  @IsInt()
  @Min(0)
  count: number;
}
