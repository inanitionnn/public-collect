import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, index, smallint } from 'drizzle-orm/pg-core';
import { series } from '../series';

export const seasons = pgTable(
  'seasons',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    seriesId: uuid('serie_id').notNull(),
    number: smallint('number').notNull(),
    title: varchar('title', { length: 256 }),
    episodes: smallint('episodes'),
    rate: smallint('rate'),
  },
  (table) => {
    return {
      seriesId: index('seasons_series_id_idx').on(table.seriesId),
    };
  },
);

export const seasonsRelations = relations(seasons, ({ one }) => ({
  serie: one(series, {
    fields: [seasons.seriesId],
    references: [series.id],
  }),
}));

// export type SeasonSelect = InferSelectModel<typeof seasons>;
// export type SeasonInsert = InferInsertModel<typeof seasons>;
