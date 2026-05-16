import pg from "pg";
import { env } from "../config/env.js";

export const pool = new pg.Pool({
  connectionString: env.databaseUrl
});

export async function checkDatabaseConnection(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("select 1");
  } finally {
    client.release();
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  await pool.end();
}

