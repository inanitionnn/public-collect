import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { MediaEnum, MediaType } from 'src/media';

export class ProgressDeleteDto {
  @IsOptional()
  @IsUUID()
  filmId?: string;

  @IsOptional()
  @IsUUID()
  serieId?: string;

  @IsOptional()
  @IsUUID()
  comicId?: string;

  @IsOptional()
  @IsUUID()
  bookId?: string;

  @IsOptional()
  @IsIn(Object.values(MediaEnum))
  mediaType: MediaType;
}
