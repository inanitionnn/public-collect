import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, text, primaryKey } from 'drizzle-orm/pg-core';
import { films } from '../films';
import { series } from '../series';
import { comics } from '../comics';
import { books } from '../books';

export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  collectionsToMedia: many(collectionsToMedia),
}));

//#region Media
export const collectionsToMedia = pgTable(
  'collections_to_media',
  {
    filmId: uuid('film_id')
      .notNull()
      .references(() => films.id),
    serieId: uuid('serie_id')
      .notNull()
      .references(() => series.id),
    comicId: uuid('comic_id')
      .notNull()
      .references(() => comics.id),
    bookId: uuid('book_id')
      .notNull()
      .references(() => books.id),
    collectionsId: uuid('collections_id')
      .notNull()
      .references(() => collections.id),
  },
  (t) => ({
    pk: primaryKey(t.filmId, t.serieId, t.comicId, t.bookId, t.collectionsId),
  }),
);

export const collectionsToMediaRelations = relations(
  collectionsToMedia,
  ({ one }) => ({
    orders: one(collections, {
      fields: [collectionsToMedia.filmId],
      references: [collections.id],
    }),
    films: one(films, {
      fields: [collectionsToMedia.collectionsId],
      references: [films.id],
    }),
    series: one(series, {
      fields: [collectionsToMedia.collectionsId],
      references: [series.id],
    }),
    comics: one(comics, {
      fields: [collectionsToMedia.collectionsId],
      references: [comics.id],
    }),
    books: one(books, {
      fields: [collectionsToMedia.collectionsId],
      references: [books.id],
    }),
  }),
);
//#endregion Media
