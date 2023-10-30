import { relations, sql } from 'drizzle-orm';
import {
  index,
  pgEnum,
  pgTable,
  smallint,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { vector } from 'pgvector/drizzle-orm';
import { progress } from './progress.schema';
import { collectionsToMedia } from './collections.shema';
import { orderToMedia } from './orders.schema';

export const filmEnum = pgEnum('filmType', ['movie', 'anime', 'animated']);

export const films = pgTable(
  'films',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: filmEnum('filmType').default('movie').notNull(),
    title: varchar('title', { length: 256 }).notNull(),
    year: smallint('year'),
    country: varchar('country', { length: 256 }).array(),
    description: text('description'),
    directedBy: varchar('directed_by', { length: 256 }).array(),
    starring: varchar('starring', { length: 256 }).array(),
    language: varchar('language', { length: 256 }).array(),
    runTime: smallint('run_time'),
    boxOffice: varchar('box_office', { length: 256 }),
    budget: varchar('budget', { length: 256 }),
    genres: varchar('genres', { length: 256 }).array(),
    tags: varchar('tags', { length: 256 }).array(),
    image: text('image'),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => {
    return {
      yearIndex: index('films_year_idx').on(table.year),
      typeIndex: index('films_type_idx').on(table.type),
      titleIndex: index('films_title_idx')
        .on(table.title)
        .using(sql`GIN (to_tsvector('english', ${table.title}))`),
      genresIndex: index('films_genres_idx')
        .on(table.genres)
        .using(sql`GIN(${table.genres})`),
    };
  },
);

export const filmsRelations = relations(films, ({ many, one }) => ({
  progress: one(progress, {
    fields: [films.id],
    references: [progress.filmId],
  }),
  orderToFilms: many(orderToMedia),
  collectionsToFilms: many(collectionsToMedia),
}));
