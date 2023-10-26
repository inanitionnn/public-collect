import { ApiProperty } from '@nestjs/swagger';
import { FilmResponseDto, FilmResponseObject } from './filmResponse.dto';
import { ProgressResponseDto, ProgressResponseObject } from 'src/progress';

export const FilmProgressObject = {
  media: FilmResponseObject,
  progress: ProgressResponseObject,
};

export class FilmProgressDto {
  @ApiProperty()
  media: FilmResponseDto;

  @ApiProperty()
  progress: ProgressResponseDto;
}
