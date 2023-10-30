import type { Config } from 'drizzle-kit';

export default {
  schema: ['./src/drizzle/schemas/*'],
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
  out: './drizzle',
} satisfies Config;
