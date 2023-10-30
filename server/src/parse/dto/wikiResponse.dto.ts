import {
  ApiExtraModels,
  ApiProperty,
  getSchemaPath,
  refs,
} from '@nestjs/swagger';
import { BookWikiDto } from 'src/books';
import { ComicWikiDto } from 'src/comics';
import { FilmWikiDto } from 'src/films';
import { SerieWikiDto } from 'src/series';

@ApiExtraModels(FilmWikiDto, SerieWikiDto, ComicWikiDto, BookWikiDto)
export class WikiResponseDto {
  @ApiProperty({
    oneOf: refs(FilmWikiDto, SerieWikiDto, ComicWikiDto, BookWikiDto),
  })
  media: FilmWikiDto | SerieWikiDto | ComicWikiDto | BookWikiDto;
}
