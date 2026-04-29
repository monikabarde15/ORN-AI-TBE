# ORN-AI Talent Infrastructure Platform

## Overview

A full-stack SaaS web application for ORN-AI — building Eastern & Central Europe's next-generation AI-enabled talent infrastructure. Candidates register, upload CVs, get AI-based career readiness scoring; recruiters and admins access dashboards over assessed and upskilled talent.

Phase 1 regions: Romania, Czechia, Hungary, Poland, Slovakia, Bulgaria, Serbia, Croatia.
Phase 2 regions: Italy, Spain, Portugal, Greece.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **TypeScript**: 5.9
- **Frontend**: React + Vite, Tailwind, shadcn/ui, Recharts, framer-motion, wouter, TanStack Query
- **Backend**: Express 5, Drizzle ORM, PostgreSQL
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)

## Artifacts

- `artifacts/orn-ai` — React + Vite web app served at `/`
- `artifacts/api-server` — Express API served at `/api`
- `artifacts/mockup-sandbox` — design canvas (preview only)

## Modules

1. Landing page with positioning headline and Phase 1 / Phase 2 country coverage.
2. Candidate registration form (name, email, phone, country, target role, experience, visa, English level, EU eligibility, LinkedIn URL).
3. CV upload page with drag-and-drop.
4. AI CV evaluation across 5 scores (CV quality, technical skill match, English readiness, Europe job readiness, upskilling needs) + overall + readiness tier.
5. Recruiter dashboard with summary metrics and filter sidebar (country, role, experience, English level, readiness).
6. Admin dashboard with pipeline analytics by country, skill, readiness, upskilling area, and monthly growth.
7. Investor demo journey with cinematic step-by-step animation.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Data

The API server seeds 64 dummy candidates across the Phase 1 countries on first start, plus 24 activity feed entries. All data is dummy / synthetic — there is no real candidate data on the platform.

The schema (`candidates`, `activity`) is created automatically on server start via `ensureSchema()` in `lib/db/src/bootstrap.ts` — no separate migration step is required for fresh databases.

## Environment Variables

See `.env.example` for the full list. Summary:

| Variable        | Required          | Purpose                                                                     |
| --------------- | ----------------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`  | yes               | PostgreSQL connection string. SSL is auto-enabled in production.            |
| `PORT`          | yes               | TCP port the API server binds to (Render injects this automatically).       |
| `BASE_PATH`     | web only          | Vite `base` for the SPA (`/` for root, `/app` for nested).                  |
| `NODE_ENV`      | recommended       | Set to `production` on hosted deployments. Enables SSL + CORS lockdown.     |
| `LOG_LEVEL`     | optional          | Pino log level (`info` default).                                            |
| `WEB_DIST_PATH` | Render single-svc | If set, Express serves the built SPA from this path (no separate web svc). |
| `WEB_ORIGIN`    | Render two-svc    | Lock CORS to this origin when SPA is hosted as a separate static site.      |

## Deployment

### Replit
The artifacts are configured for Replit's path-based reverse proxy via each artifact's `.replit-artifact/artifact.toml`. Use the publish flow in the workspace — no extra setup required.

### Render

The recommended pattern is **a single Render web service** that hosts both the API and the built SPA. This avoids cross-origin issues entirely.

1. **Create a managed Postgres** on Render. Copy the *Internal Database URL*.
2. **Create a Web Service** pointing at this repo. Settings:
   - **Runtime**: Node 24
   - **Build command**:
     ```
     corepack enable && pnpm install --frozen-lockfile \
       && pnpm --filter @workspace/api-server run build \
       && BASE_PATH=/ PORT=8080 pnpm --filter @workspace/orn-ai run build
     ```
     `PORT` is only needed at build time so Vite's config doesn't refuse to load; the actual runtime port comes from Render.
   - **Start command**:
     ```
     node --enable-source-maps artifacts/api-server/dist/index.mjs
     ```
   - **Health check path**: `/api/healthz`
   - **Environment variables**:
     - `DATABASE_URL` = (paste Render Postgres Internal URL)
     - `NODE_ENV` = `production`
     - `WEB_DIST_PATH` = `artifacts/orn-ai/dist/public`
     - `BASE_PATH` = `/` (only consumed during build)
     - `LOG_LEVEL` = `info` (optional)
3. Deploy. On first boot, `ensureSchema()` creates the tables and the seed populates 64 demo candidates.

If you'd rather run the SPA as a separate Render Static Site, omit `WEB_DIST_PATH`, deploy the SPA build (`artifacts/orn-ai/dist/public`) as a Static Site with a SPA rewrite rule (`/* → /index.html`), and set `WEB_ORIGIN` on the API service to that site's URL.
