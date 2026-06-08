import { existsSync } from "node:fs";
import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

import router from "./routes";
import { logger } from "./lib/logger";
import { attachUser } from "./lib/auth";

const app: Express = express();

/**
 * Logging
 */
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

/**
 * Trust proxy
 * Required on Render / Railway / Nginx etc.
 */
app.set("trust proxy", 1);

/**
 * CORS
 */
const webOrigin = process.env.WEB_ORIGIN;

const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: [
          "https://orn-ai.com",
          "http://orn-ai.com",
          "http://85.217.171.42",
          "http://103.176.85.169:8080",
        ],
        credentials: true,
      }
    : {
        origin: [
          "http://localhost:5173",
          "http://127.0.0.1:5173",
        ],
        credentials: true,
      }; 

app.use(cors(corsOptions));

/**
 * Body parsers
 */
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));

/**
 * Cookies
 */
app.use(cookieParser());

/**
 * Auth middleware
 */
app.use(attachUser);

/**
 * Health route
 */
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Backend running",
  });
});
router.get("/test", (_req, res) => {
  res.json({ success: true });
});

/**
 * API routes
 */
app.use("/api", router);

/**
 * Serve Frontend (Vite build)
 */
const webDistPath = process.env.WEB_DIST_PATH;

if (webDistPath) {
  const resolved = path.isAbsolute(webDistPath)
    ? webDistPath
    : path.resolve(process.cwd(), webDistPath);

  if (existsSync(resolved)) {
    logger.info(
      { path: resolved },
      "Serving SPA from disk",
    );

    app.use(
      express.static(resolved, {
        index: false,
        maxAge: "1h",
      }),
    );

    /**
     * SPA fallback
     */
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }

      if (path.extname(req.path) !== "") {
        return next();
      }

      const accept = req.headers.accept ?? "";

      if (!accept.includes("text/html")) {
        return next();
      }

      res.sendFile(path.join(resolved, "index.html"));
    });
  } else {
    logger.warn(
      { path: resolved },
      "WEB_DIST_PATH directory does not exist",
    );
  }
}

/**
 * 404 handler
 */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

/**
 * Global error handler
 */
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    logger.error(err);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  },
);

export default app;