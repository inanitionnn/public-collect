import { BookWikiType } from './book/bookWiki.type';
import { ComicWikiType } from './comic/comicWIki.type';
import { FilmWikiType } from './film/filmWiki.type';
import { SerieWikiDto } from './serie/serieWiki.type';

export type WikiParseType = {
  media: FilmWikiType | SerieWikiDto | ComicWikiType | BookWikiType;
};
