import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use Supabase database connection string provided by user (URL encode the password)
const supabaseDatabaseUrl = "postgresql://postgres:Jambojet24145%26@db.bmkoiaglbvkxszbipzul.supabase.co:5432/postgres";
let databaseUrl = supabaseDatabaseUrl;
console.log('Using Supabase database connection');

// Configure SSL for Supabase connection
const connectionConfig = {
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
};

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log('Connecting to database:', databaseUrl.substring(0, 50) + '...');
export const pool = new Pool(connectionConfig);
export const db = drizzle({ client: pool, schema });
