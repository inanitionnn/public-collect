import { BookSelect } from 'src/books';
import { ComicSelect } from 'src/comics';
import { FilmSelect } from 'src/films';
import { SeasonSelect } from 'src/seasons';
import { SerieSelect } from 'src/series';

export class WikiResponse {
  media:
    | Omit<FilmSelect, 'embedding' | 'id'>
    | (Omit<SerieSelect, 'embedding' | 'id'> & {
        seasons: Array<Pick<SeasonSelect, 'title' | 'episodes' | 'number'>>;
      })
    | Omit<ComicSelect, 'embedding' | 'id'>
    | Omit<BookSelect, 'embedding' | 'id'>;
}
