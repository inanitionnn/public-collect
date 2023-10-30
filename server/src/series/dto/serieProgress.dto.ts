import { SerieResponseDto } from './serieResponse.dto';
import { ProgressResponseDto } from 'src/progress';

export class SerieProgressDto {
  media: SerieResponseDto;
  progress: ProgressResponseDto;
}
