import { ApiProperty } from '@nestjs/swagger';
import { BookWikiDto } from 'src/books';
import { ComicWikiDto } from 'src/comics';
import { FilmWikiDto } from 'src/films';
import { SerieWikiDto } from 'src/series';

export class WikiResponseDto {
  @ApiProperty()
  media: FilmWikiDto | SerieWikiDto | ComicWikiDto | BookWikiDto;
}
