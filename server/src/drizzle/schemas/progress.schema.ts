import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { films } from './films.schema';
import { series } from './series.schema';
import { comics } from './comics.schema';
import { books } from './books.schema';
import { relations } from 'drizzle-orm';

export const watchedEnum = pgEnum('watched', [
  'reviewing',
  'viewing',
  'completed',
  'abandoned',
  'paused',
  'planned',
]);

export const progress = pgTable(
  'progress',
  {
    id: uuid('id').defaultRandom(),
    filmId: uuid('film_id').references(() => films.id),
    serieId: uuid('serie_id').references(() => series.id),
    comicId: uuid('comic_id').references(() => comics.id),
    bookId: uuid('book_id').references(() => books.id),
    watched: watchedEnum('watched').default('planned').notNull(),
    finishedOn: varchar('finished_on', { length: 256 }),
    note: text('note'),
    rate: smallint('rate'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey(t.filmId, t.serieId, t.comicId, t.bookId, t.id),
    yearIndex: index('films_year_idx').on(
      t.bookId,
      t.comicId,
      t.filmId,
      t.serieId,
      t.rate,
      t.watched,
      t.createdAt,
    ),
  }),
);

export const progressRelations = relations(progress, ({ many }) => ({
  films: many(films),
  series: many(series),
  comics: many(comics),
  books: many(books),
}));
