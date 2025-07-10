import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use environment DATABASE_URL 
let databaseUrl = process.env.DATABASE_URL;
console.log('Using environment DATABASE_URL');

// Configure connection
const connectionConfig = {
  connectionString: databaseUrl
};

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log('Connecting to database:', databaseUrl.substring(0, 50) + '...');
export const pool = new Pool(connectionConfig);
export const db = drizzle({ client: pool, schema });
