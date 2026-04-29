import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

/**
 * SSL config for Postgres.
 *
 * - Replit's built-in Postgres works without SSL.
 * - Render's managed Postgres (and most cloud Postgres providers) require SSL.
 *
 * We auto-enable SSL when:
 *   - NODE_ENV === "production", OR
 *   - the connection string contains `sslmode=require`, OR
 *   - PGSSLMODE is set explicitly.
 *
 * `rejectUnauthorized: false` is required for Render's self-signed cert chain.
 */
function resolveSslConfig(): pg.PoolConfig["ssl"] {
  const url = process.env.DATABASE_URL ?? "";
  const wantsSsl =
    process.env.NODE_ENV === "production" ||
    /sslmode=require/i.test(url) ||
    !!process.env.PGSSLMODE;
  if (!wantsSsl) return undefined;
  return { rejectUnauthorized: false };
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: resolveSslConfig(),
});
export const db = drizzle(pool, { schema });

export * from "./schema";
export { ensureSchema } from "./bootstrap";
