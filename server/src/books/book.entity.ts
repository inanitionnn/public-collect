import { relations, sql } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  index,
  smallint,
  text,
} from 'drizzle-orm/pg-core';
import { vector } from 'pgvector/drizzle-orm';
import { collectionsToMedia } from '../collections';
import { progress } from '../progress';
import { orderToMedia } from 'src/orders';

export const BookEnum = pgEnum('bookType', ['fiction', 'nonFiction']);

export const books = pgTable(
  'books',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: BookEnum('bookType').default('nonFiction').notNull(),
    title: varchar('title', { length: 256 }).notNull(),
    year: smallint('year'),
    country: varchar('country', { length: 256 }).array(),
    description: text('description'),
    author: varchar('author', { length: 256 }).array(),
    language: varchar('language', { length: 256 }).array(),
    pages: smallint('pages'),
    genres: varchar('genres', { length: 256 }).array(),
    tags: varchar('tags', { length: 256 }).array(),
    image: text('image'),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => {
    return {
      yearIndex: index('books_year_idx').on(table.year),
      typeIndex: index('books_type_idx').on(table.type),
      titleIndex: index('books_title_idx')
        .on(table.title)
        .using(sql`GIN (to_tsvector('english', ${table.title}))`),
      genresIndex: index('books_genres_idx')
        .on(table.genres)
        .using(sql`GIN(${table.genres})`),
    };
  },
);

export const booksRelations = relations(books, ({ many, one }) => ({
  progress: one(progress, {
    fields: [books.id],
    references: [progress.bookId],
  }),
  orderToBooks: many(orderToMedia),
  collectionsToBooks: many(collectionsToMedia),
}));

export type BookType = (typeof BookEnum.enumValues)[number];

// export type BookSelect = InferSelectModel<typeof books>;
// export type BookInsert = InferInsertModel<typeof books>;
