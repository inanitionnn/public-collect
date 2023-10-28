import { ApiProperty } from '@nestjs/swagger';
import { ProgressResponseDto } from 'src/progress';
import { ComicResponseDto } from './comicResponse.dto';

export class ComicProgressDto {
  @ApiProperty()
  media: ComicResponseDto;

  @ApiProperty()
  progress: ProgressResponseDto;
}
