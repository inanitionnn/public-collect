import { BookInsert } from 'src/books';
import { ComicInsert } from 'src/comics';
import { FilmInsert } from 'src/films';
import { SerieInsert } from 'src/series';
import { MediaEnum } from './media.type';

export type CreateMediaInput =
  | {
      mediaType: typeof MediaEnum.film;
      media: FilmInsert;
    }
  | {
      mediaType: typeof MediaEnum.serie;
      media: SerieInsert;
    }
  | {
      mediaType: typeof MediaEnum.comic;
      media: ComicInsert;
    }
  | {
      mediaType: typeof MediaEnum.book;
      media: BookInsert;
    };
