import { ProgressResponseDto } from 'src/progress';
import { ComicResponseDto } from './comicResponse.dto';

export class ComicProgressDto {
  media: ComicResponseDto;
  progress: ProgressResponseDto;
}
