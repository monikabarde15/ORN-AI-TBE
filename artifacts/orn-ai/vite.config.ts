import 'dotenv/config';
import fs from "fs";
import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
  react(),
  tailwindcss(),

  {
    name: "orn-ai-fallback",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {

        if (
          req.url?.startsWith("/orn-ai") &&
          !req.url.includes(".js") &&
          !req.url.includes(".css")
        ) {

          // const fs = require("fs");

          const filePath = path.resolve(
            import.meta.dirname,
            "public",
            "orn-ai",
            "index.html"
          );

          const html = fs.readFileSync(filePath, "utf-8");

          res.setHeader("Content-Type", "text/html");
          res.end(html);

          return;
        }

        next();
      });
    },
  },

  runtimeErrorOverlay(),
],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
