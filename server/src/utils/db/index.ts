import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';

const queryClient = postgres(process.env.DB_URL);
const db: PostgresJsDatabase = drizzle(queryClient);
export default db;