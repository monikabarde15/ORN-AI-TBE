import dns from "node:dns";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

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

const rawDatabaseUrl = process.env.DATABASE_URL;
const normalizedDatabaseUrl = rawDatabaseUrl
  ? rawDatabaseUrl
      .replace(/([?&])sslmode=[^&]*/gi, "")
      .replace(/[?&]$/, "")
  : undefined;

if (!normalizedDatabaseUrl) {
  throw new Error("DATABASE_URL is invalid");
}

const parsedDatabaseUrl = new URL(normalizedDatabaseUrl);

export const pool = new Pool({
  host: parsedDatabaseUrl.hostname,
  port: parsedDatabaseUrl.port ? Number(parsedDatabaseUrl.port) : undefined,
  user: decodeURIComponent(parsedDatabaseUrl.username),
  password: decodeURIComponent(parsedDatabaseUrl.password),
  database: parsedDatabaseUrl.pathname?.slice(1),
  ssl: resolveSslConfig(),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  lookup: (hostname, options, callback) => {
    if (typeof options === "function") {
      return dns.lookup(hostname, { family: 4 }, options);
    }
    return dns.lookup(hostname, { ...(options || {}), family: 4 }, callback);
  },
});
export const db = drizzle(pool, { schema });

export * from "./schema";
export { ensureSchema } from "./bootstrap";
