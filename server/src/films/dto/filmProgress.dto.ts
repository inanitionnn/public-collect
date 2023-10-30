import { FilmResponseDto } from './filmResponse.dto';
import { ProgressResponseDto } from 'src/progress';

export class FilmProgressDto {
  media: FilmResponseDto;
  progress: ProgressResponseDto;
}
