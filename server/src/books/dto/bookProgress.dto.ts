import { ApiProperty } from '@nestjs/swagger';
import { ProgressResponseDto } from 'src/progress';
import { BookResponseDto } from './bookResponse.dto';

export class BookProgressDto {
  @ApiProperty()
  media: BookResponseDto;

  @ApiProperty()
  progress: ProgressResponseDto;
}
