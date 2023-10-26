import { ApiProperty } from '@nestjs/swagger';
import { ProgressResponseDto, ProgressResponseObject } from 'src/progress';
import { BookResponseDto, BookResponseObject } from './bookResponse.dto';

export const BookProgressObject = {
  media: BookResponseObject,
  progress: ProgressResponseObject,
};

export class BookProgressDto {
  @ApiProperty()
  media: BookResponseDto;

  @ApiProperty()
  progress: ProgressResponseDto;
}
