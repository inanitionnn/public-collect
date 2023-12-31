import { relations } from 'drizzle-orm';
import {
  pgTable,
  primaryKey,
  smallint,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { films } from './films.schema';
import { series } from './series.schema';
import { comics } from './comics.schema';
import { books } from './books.schema';

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  orderToMedias: many(orderToMedia),
}));

export const orderToMedia = pgTable(
  'orders_to_media',
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
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id),
    number: smallint('number').notNull(),
  },
  (t) => ({
    pk: primaryKey(t.filmId, t.serieId, t.comicId, t.bookId, t.orderId),
  }),
);

export const orderToMediaRelations = relations(orderToMedia, ({ one }) => ({
  orders: one(orders, {
    fields: [orderToMedia.filmId],
    references: [orders.id],
  }),
  films: one(films, {
    fields: [orderToMedia.orderId],
    references: [films.id],
  }),
  series: one(series, {
    fields: [orderToMedia.orderId],
    references: [series.id],
  }),
  comics: one(comics, {
    fields: [orderToMedia.orderId],
    references: [comics.id],
  }),
  books: one(books, {
    fields: [orderToMedia.orderId],
    references: [books.id],
  }),
}));
