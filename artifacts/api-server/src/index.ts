import dns from "node:dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

import { ensureSchema } from "@workspace/db";
import app from "./app";
import { logger } from "./lib/logger";
import { ensureSeedData } from "./lib/seed";
import { execSync } from "node:child_process";

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

function freePortIfBusy(portNum: number) {
  try {
    if (process.platform === "win32") {
      const output = execSync(`netstat -ano | findstr :${portNum}`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      });
      const lines = output.trim().split("\n");
      const currentPid = process.pid;
      for (const line of lines) {
        if (line.includes("LISTENING")) {
          const parts = line.trim().split(/\s+/);
          const pid = Number(parts[parts.length - 1]);
          if (pid && pid !== currentPid) {
            try {
              execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
              logger.info(`Freed occupied port ${portNum} by terminating PID ${pid}`);
            } catch {}
          }
        }
      }
    }
  } catch {}
}

async function bootstrap(): Promise<void> {
  try {
    await ensureSchema();
    logger.info("Database schema verified");
  } catch (err: any) {
    logger.warn({ err: err?.message || err }, "Database schema verification deferred");
  }

  // Seed is non-fatal — production may legitimately want an empty DB.
  ensureSeedData().catch((err) => {
    logger.error({ err }, "Failed to seed initial data");
  });

  // Auto-free port if any dead/orphan node process is holding it
  freePortIfBusy(port);

  const server = app.listen(port, () => {
    logger.info({ port }, "Server listening");
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      logger.warn(`Port ${port} in use, freeing port and retrying...`);
      freePortIfBusy(port);
      setTimeout(() => {
        app.listen(port, () => {
          logger.info({ port }, "Server listening successfully");
        });
      }, 1000);
    } else {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
  });
}

bootstrap();
