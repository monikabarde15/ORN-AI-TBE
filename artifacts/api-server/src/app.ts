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

// CORS: in dev allow any origin (so the Vite dev server can call /api freely);
// in production restrict to WEB_ORIGIN if it's set, otherwise allow same-origin
// only. When WEB_DIST_PATH is set the SPA is served from this same Express
// process, so no CORS is needed at all.
const webOrigin = process.env.WEB_ORIGIN;
const corsOptions =
  process.env.NODE_ENV === "production"
    ? webOrigin
      ? { origin: webOrigin, credentials: true }
      : { origin: false as const }
    : {};
app.use(cors(corsOptions));

app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));
app.use(cookieParser());
app.use(attachUser);
app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});
app.use("/api", router);

// Optional: serve the built SPA from the same Express process. This lets a
// single Render web service host both the API and the React app, avoiding the
// cross-origin problem that would otherwise need CORS + a separate static
// site service. Set WEB_DIST_PATH to the absolute or repo-relative path of
// the Vite build output (e.g. `artifacts/orn-ai/dist/public`).
const webDistPath = process.env.WEB_DIST_PATH;
if (webDistPath) {
  const resolved = path.isAbsolute(webDistPath)
    ? webDistPath
    : path.resolve(process.cwd(), webDistPath);
  if (existsSync(resolved)) {
    logger.info({ path: resolved }, "Serving SPA from disk");
    app.use(express.static(resolved, { index: false, maxAge: "1h" }));
    // SPA fallback: only intercept HTML navigation requests (no file extension
    // and Accept includes text/html). This way missing JS/CSS/image assets
    // still return real 404s instead of being silently rewritten to
    // index.html — which would otherwise mask broken bundles with HTML
    // payloads that the browser tries to parse as JavaScript.
    app.use((req, res, next) => {
      if (req.method !== "GET") return next();
      if (req.path.startsWith("/api")) return next();
      if (path.extname(req.path) !== "") return next();
      const accept = req.headers.accept ?? "";
      if (!accept.includes("text/html")) return next();
      res.sendFile(path.join(resolved, "index.html"));
    });
  } else {
    logger.warn(
      { path: resolved },
      "WEB_DIST_PATH is set but the directory does not exist; not serving SPA",
    );
  }
}

export default app;
