import { ApiProperty } from '@nestjs/swagger';
import { FilmResponseDto } from './filmResponse.dto';
import { ProgressResponseDto } from 'src/progress';

export class FilmProgressDto {
  @ApiProperty()
  media: FilmResponseDto;

  @ApiProperty()
  progress: ProgressResponseDto;
}
