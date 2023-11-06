import { BookWikiType } from '@/types/book/bookWiki.type';
import { ComicWikiType } from '@/types/comic/comicWIki.type';
import { FilmWikiType } from '@/types/film/filmWiki.type';
import { MediaType } from '@/types/media/media.type';
import { SerieWikiDto } from '@/types/serie/serieWiki.type';
import { WikiParseType } from '@/types/wikiParse.type';
import axios from 'axios';

export const getWikiParse = async (
  query: string,
  mediaType: MediaType
): Promise<WikiParseType> => {
  const link = 'https://en.wikipedia.org/wiki/' + query;
  const { data } = await axios.get(
    `http://localhost:4000/api/parse/wiki/${mediaType}`,
    { params: { link } }
  );
  return data;
};
