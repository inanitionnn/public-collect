import * as books from '../books/book.entity';
import * as comics from '../comics/comic.entity';
import * as films from '../films/film.entity';
import * as series from '../series/series.entity';
import * as seasons from '../seasons/seasons.entity';
import * as orders from '../orders/order.entity';
import * as progress from '../progress/progress.entity';
import * as collections from '../collections/collection.entity';

export const DrizzleSchema = {
  books,
  comics,
  films,
  series,
  seasons,
  collections,
  progress,
  orders,
};
