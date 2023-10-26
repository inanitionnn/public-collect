import { ApiProperty } from '@nestjs/swagger';
import { ProgressResponseDto, ProgressResponseObject } from 'src/progress';
import { ComicResponseDto, ComicResponseObject } from './comicResponse.dto';

export const ComicProgressObject = {
  media: ComicResponseObject,
  progress: ProgressResponseObject,
};

export class ComicProgressDto {
  @ApiProperty()
  media: ComicResponseDto;

  @ApiProperty()
  progress: ProgressResponseDto;
}
