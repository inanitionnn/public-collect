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
import { seasons } from '../seasons';
import { collectionsToMedia } from '../collections';
import { progress } from '../progress';

export const SerieEnum = pgEnum('serieType', ['tv', 'anime', 'animated']);

export const series = pgTable(
  'series',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: SerieEnum('serieType').default('tv').notNull(),
    title: varchar('title', { length: 256 }).notNull(),
    startYear: smallint('start_year'),
    endYear: smallint('end_year'),
    country: varchar('country', { length: 256 }).array(),
    description: text('description'),
    directedBy: varchar('directed_by', { length: 256 }).array(),
    starring: varchar('starring', { length: 256 }).array(),
    language: varchar('language', { length: 256 }).array(),
    genres: varchar('genres', { length: 256 }).array(),
    tags: varchar('tags', { length: 256 }).array(),
    image: text('image'),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => {
    return {
      yearIndex: index('series_year_idx').on(table.startYear, table.endYear),
      typeIndex: index('series_type_idx').on(table.type),
      titleIndex: index('series_title_idx')
        .on(table.title)
        .using(sql`GIN (to_tsvector('english', ${table.title}))`),
      genresIndex: index('series_genres_idx')
        .on(table.genres)
        .using(sql`GIN(${table.genres})`),
    };
  },
);

export const seriesRelations = relations(series, ({ many, one }) => ({
  progress: one(progress, {
    fields: [series.id],
    references: [progress.serieId],
  }),
  orderToSeries: many(orderToMedia),
  collectionsToSeries: many(collectionsToMedia),
  seasons: many(seasons),
}));

export type SerieType = (typeof SerieEnum.enumValues)[number];

// export type SerieSelect = InferSelectModel<typeof series>;
// export type SerieInsert = InferInsertModel<typeof series>;
