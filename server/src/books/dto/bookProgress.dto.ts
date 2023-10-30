import { ProgressResponseDto } from 'src/progress';
import { BookResponseDto } from './bookResponse.dto';

export class BookProgressDto {
  media: BookResponseDto;
  progress: ProgressResponseDto;
}
