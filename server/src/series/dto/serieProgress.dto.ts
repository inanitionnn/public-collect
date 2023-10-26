import { ApiProperty } from '@nestjs/swagger';
import { SerieResponseDto, SerieResponseObject } from './serieResponse.dto';
import { ProgressResponseDto, ProgressResponseObject } from 'src/progress';

export const SerieProgressObject = {
  media: SerieResponseObject,
  progress: ProgressResponseObject,
};

export class SerieProgressDto {
  @ApiProperty()
  media: SerieResponseDto;

  @ApiProperty()
  progress: ProgressResponseDto;
}
