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
import { orderToMedia } from '../orders';
import { collectionsToMedia } from '../collections';
import { progress } from '../progress';

export const ComicEnum = pgEnum('comicType', ['manga', 'comic']);

export const comics = pgTable(
  'comics',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: ComicEnum('comicType').default('comic').notNull(),
    title: varchar('title', { length: 256 }).notNull(),
    startYear: smallint('start_year'),
    endYear: smallint('end_year'),
    country: varchar('country', { length: 256 }).array(),
    description: text('description'),
    author: varchar('author', { length: 256 }).array(),
    language: varchar('language', { length: 256 }).array(),
    volumes: smallint('volumes'),
    genres: varchar('genres', { length: 256 }).array(),
    tags: varchar('tags', { length: 256 }).array(),
    image: text('image'),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => {
    return {
      yearIndex: index('comics_year_idx').on(table.startYear, table.endYear),
      typeIndex: index('comics_type_idx').on(table.type),
      titleIndex: index('comics_title_idx')
        .on(table.title)
        .using(sql`GIN (to_tsvector('english', ${table.title}))`),
      genresIndex: index('comics_genres_idx')
        .on(table.genres)
        .using(sql`GIN(${table.genres})`),
    };
  },
);

export const comicsRelations = relations(comics, ({ many, one }) => ({
  progress: one(progress, {
    fields: [comics.id],
    references: [progress.comicId],
  }),
  orderToComics: many(orderToMedia),
  collectionsToComics: many(collectionsToMedia),
}));

export type ComicType = (typeof ComicEnum.enumValues)[number];

// export type ComicSelect = InferSelectModel<typeof comics>;

// export type ComicInsert = InferInsertModel<typeof comics>;
