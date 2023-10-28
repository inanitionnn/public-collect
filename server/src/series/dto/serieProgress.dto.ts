import { ApiProperty } from '@nestjs/swagger';
import { SerieResponseDto } from './serieResponse.dto';
import { ProgressResponseDto } from 'src/progress';

export class SerieProgressDto {
  @ApiProperty()
  media: SerieResponseDto;

  @ApiProperty()
  progress: ProgressResponseDto;
}
