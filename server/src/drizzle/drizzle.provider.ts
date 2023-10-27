import { Injectable } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import { DrizzleSchema } from './schema';

export const DrizzleAsyncProvider = 'drizzleProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: async () => {
      const client = postgres(process.env.DB_URL);
      const db = drizzle(client, { schema: DrizzleSchema });
      return db;
    },
    exports: [DrizzleAsyncProvider],
  },
];
