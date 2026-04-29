import { ensureSchema } from "@workspace/db";
import app from "./app";
import { logger } from "./lib/logger";
import { ensureSeedData } from "./lib/seed";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function bootstrap(): Promise<void> {
  // Run schema creation BEFORE listening so a fresh database (e.g. on Render's
  // first deploy) is initialized before any traffic arrives. Failure here is
  // fatal — there's no point starting if the DB isn't usable.
  try {
    await ensureSchema();
    logger.info("Database schema verified");
  } catch (err) {
    logger.error({ err }, "Failed to ensure database schema");
    process.exit(1);
  }

  // Seed is non-fatal — production may legitimately want an empty DB.
  ensureSeedData().catch((err) => {
    logger.error({ err }, "Failed to seed initial data");
  });

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

bootstrap();
