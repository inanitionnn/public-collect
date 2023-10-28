import { Module } from '@nestjs/common';
import * as postgres from 'postgres';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';

export const PG_CONNECTION = 'PG_CONNECTION';

@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      useFactory: async () => {
        const client = postgres(process.env.DB_URL);

        return drizzle(client, { schema: schema });
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
