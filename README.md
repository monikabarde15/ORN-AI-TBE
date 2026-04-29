# ORN-AI Talent Infrastructure Platform

A full-stack SaaS web application for ORN-AI — building Eastern & Central Europe's next-generation AI-enabled talent infrastructure. Candidates register, upload CVs, get AI-based career-readiness scoring across five dimensions; recruiters and admins access dashboards over assessed and upskilled talent.

> **Status:** Investor-ready demo. All candidate data is synthetic — no real applicant data is processed.

---

## 1. Project overview

The platform covers four user surfaces:

| Surface             | Route                       | Purpose                                                                                       |
| ------------------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| Landing             | `/`                         | Brand positioning, Phase 1/Phase 2 country coverage, calls-to-action.                         |
| Candidate journey   | `/register` → `/candidate/:id/upload` → `/candidate/:id/evaluation` | Multi-step registration, CV upload (metadata), AI-scored readiness card. |
| Recruiter dashboard | `/recruiter`                | Filterable talent search with country/role/experience/English/readiness filters and statuses. |
| Admin dashboard     | `/admin`                    | Investor-grade analytics: KPIs, monthly pipeline, country/skill/readiness breakdowns, live activity feed. |
| Investor demo       | `/demo`                     | Cinematic, step-by-step journey for live presentations.                                       |

**Phase 1 regions:** Romania, Czechia, Hungary, Poland, Slovakia, Bulgaria, Serbia, Croatia.
**Phase 2 regions:** Italy, Spain, Portugal, Greece.

---

## 2. Tech stack

- **Monorepo:** pnpm workspaces
- **Runtime:** Node.js 24, TypeScript 5.9 (strict)
- **Frontend:** React 18 + Vite, Tailwind CSS v4, shadcn/ui, Recharts, Framer Motion, wouter (routing), TanStack Query
- **Backend:** Express 5, Drizzle ORM, PostgreSQL, pino + pino-http (structured logging)
- **Validation:** Zod (`zod/v4`), `drizzle-zod`
- **API contract:** OpenAPI 3 → Orval codegen (React Query hooks + Zod schemas, shared between client and server)
- **Build:** Vite (web), esbuild (API server bundle)

### Workspace layout

```
artifacts/
  orn-ai/           React + Vite SPA, served at /
  api-server/       Express API, served at /api
  mockup-sandbox/   Design playground (preview only, not deployed)
lib/
  db/               Drizzle schema, pg pool, schema bootstrap
  api-spec/         OpenAPI source of truth + Orval config
  api-client-react/ Generated React Query hooks + custom fetch
  api-zod/          Generated Zod request/response schemas
scripts/            Repo utility scripts
```

---

## 3. Required environment variables

Copy `.env.example` to `.env` (or set these in your hosting provider's UI).

| Variable        | Required          | Purpose                                                                          |
| --------------- | ----------------- | -------------------------------------------------------------------------------- |
| `DATABASE_URL`  | yes               | PostgreSQL connection string. SSL is auto-enabled in production.                 |
| `PORT`          | yes               | TCP port the API server binds to (Render injects this automatically).            |
| `BASE_PATH`     | web build only    | Vite `base` for the SPA (`/` for root, `/app` for nested).                       |
| `NODE_ENV`      | recommended       | Set to `production` on hosted deployments. Enables Postgres SSL + CORS lockdown. |
| `LOG_LEVEL`     | optional          | Pino log level (`info` default).                                                 |
| `WEB_DIST_PATH` | Render single-svc | If set, Express serves the built SPA from this path (no separate web service).   |
| `WEB_ORIGIN`    | Render two-svc    | Lock CORS to this origin when SPA is hosted as a separate static site.           |

### How SSL is decided

The Postgres pool auto-enables SSL (`rejectUnauthorized: false` for self-signed cert chains) when **any** of these is true:

- `NODE_ENV === "production"`
- `DATABASE_URL` contains `sslmode=require`
- `PGSSLMODE` is set

Locally on Replit none of these conditions are met, so SSL stays off and the built-in Postgres works as-is.

---

## 4. Local setup

### Prerequisites

- Node.js 24 (use `nvm install 24` if needed)
- pnpm 9+ (`corepack enable && corepack use pnpm@latest`)
- A PostgreSQL database (local or hosted)

### Steps

```bash
# 1. Clone
git clone <repo-url>
cd <repo>

# 2. Install dependencies
pnpm install

# 3. Configure env
cp .env.example .env
# then edit .env and set DATABASE_URL

# 4. Verify everything typechecks
pnpm run typecheck

# 5. Build (optional but recommended for first-time setup)
pnpm run build
```

---

## 5. Database setup

The schema (`candidates`, `activity`) is created automatically on API server startup via `ensureSchema()` in `lib/db/src/bootstrap.ts`. **No manual migration step is required for fresh databases** — just point `DATABASE_URL` at an empty database and start the server.

On first start the API also seeds 64 dummy candidates and 24 activity feed entries. The seed is idempotent — restarting the server does not duplicate data.

If you change the schema during development, you can use Drizzle's interactive push to sync your local database without writing migrations:

```bash
pnpm --filter @workspace/db run push
```

### Resetting the seed

To clear the seeded data:

```sql
TRUNCATE candidates, activity;
```

The next API restart will reseed.

### Regenerating the API client/Zod schemas

Edit `lib/api-spec/openapi.yaml`, then run:

```bash
pnpm --filter @workspace/api-spec run codegen
```

This regenerates `lib/api-client-react/src/generated` (React Query hooks) and `lib/api-zod/src/generated` (Zod schemas).

---

## 6. Running the frontend and backend

### On Replit

Three workflows are pre-configured and run automatically:

- `artifacts/api-server: API Server` — Express at port 8080, served at `/api`
- `artifacts/orn-ai: web` — Vite at port 22745, served at `/`
- `artifacts/mockup-sandbox: Component Preview Server` — design playground only

Replit's path-based reverse proxy routes `/api/*` to the API and everything else to the SPA. Open the preview pane to interact.

### Locally (outside Replit)

You'll need two terminals plus `PORT` and `BASE_PATH` set in `.env`:

```bash
# Terminal 1 — API server
PORT=8080 pnpm --filter @workspace/api-server run dev

# Terminal 2 — web app
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/orn-ai run dev
```

The Vite dev server makes relative `/api/*` calls. To make those reach the API server, either:

- Run both services behind a single reverse proxy (Caddy/Nginx) routing `/api` to `:8080` and everything else to `:5173`, **or**
- Build the SPA once (`pnpm --filter @workspace/orn-ai run build`) and serve everything from the API process by setting `WEB_DIST_PATH=artifacts/orn-ai/dist/public` (see Render single-service pattern below).

### Useful root commands

| Command                                                          | Purpose                                         |
| ---------------------------------------------------------------- | ----------------------------------------------- |
| `pnpm run typecheck`                                             | Full monorepo typecheck (libs + leaf packages). |
| `pnpm run build`                                                 | Typecheck + build everything.                   |
| `pnpm --filter @workspace/api-spec run codegen`                  | Regenerate API hooks + Zod schemas.             |
| `pnpm --filter @workspace/db run push`                           | Push schema changes to dev database.            |
| `pnpm --filter @workspace/api-server run build`                  | Build the API bundle.                           |
| `pnpm --filter @workspace/orn-ai run build`                      | Build the SPA to `artifacts/orn-ai/dist/public`.|

---

## 7. Deploying on Render

The recommended pattern is **a single Render web service** that hosts both the API and the built SPA. This avoids cross-origin issues entirely (no CORS, no separate static site).

### Step 1 — Provision Postgres

1. In Render, create a new **PostgreSQL** add-on.
2. Wait for it to become available, then copy the **Internal Database URL** (it auto-resolves SSL on Render's network).

### Step 2 — Create the Web Service

1. New → **Web Service** → connect this repository.
2. Configure:

   - **Runtime:** Node 24
   - **Build command:**
     ```
     corepack enable && pnpm install --frozen-lockfile \
       && pnpm --filter @workspace/api-server run build \
       && BASE_PATH=/ PORT=8080 pnpm --filter @workspace/orn-ai run build
     ```
     `PORT` is consumed only at build time so Vite's config loads cleanly; runtime `PORT` is injected by Render.
   - **Start command:**
     ```
     node --enable-source-maps artifacts/api-server/dist/index.mjs
     ```
   - **Health check path:** `/api/healthz`
   - **Environment variables:**
     - `DATABASE_URL` — paste the Postgres Internal URL from step 1
     - `NODE_ENV` = `production`
     - `WEB_DIST_PATH` = `artifacts/orn-ai/dist/public`
     - `BASE_PATH` = `/` (only consumed during build)
     - `LOG_LEVEL` = `info` (optional)

3. Deploy. On first boot:
   - `ensureSchema()` creates the `candidates` and `activity` tables (and the `pgcrypto` extension for `gen_random_uuid()`).
   - The seed populates 64 demo candidates + 24 activity rows.
   - Express serves the React build for any non-`/api` route, with a SPA fallback that only intercepts HTML navigation requests (so missing static assets still return real 404s).

### Two-service pattern (alternative)

If you prefer the SPA on Render Static Sites:

1. Deploy the SPA build (`artifacts/orn-ai/dist/public`) as a **Static Site** with rewrite rule `/* → /index.html`.
2. Deploy the API as above, but **omit** `WEB_DIST_PATH` and **set** `WEB_ORIGIN` to the static site's full URL (e.g. `https://orn-ai.onrender.com`). The API will then accept cross-origin requests only from that origin.

### Verifying a deploy

After the service goes live:

- `GET https://<your-service>.onrender.com/api/healthz` → `{ "status": "ok" }`
- Open `https://<your-service>.onrender.com/` → landing page.
- Open `/admin` → dashboard with KPIs and 64 candidates.

---

## 8. Known limitations

These are intentional trade-offs for the current "investor-ready demo" phase. Plan for them before any production rollout with real users.

1. **No authentication.** All routes — including `/admin`, `/recruiter`, and write endpoints like `POST /api/candidates` and `POST /api/demo/seed` — are publicly accessible. The `SESSION_SECRET` env var exists but is not consumed.
2. **CV upload is metadata-only.** `POST /api/candidates/:id/cv` persists `{fileName, fileSize, contentSummary}` as JSONB. The actual file bytes are never uploaded or stored, and there's no PDF/DOCX parsing.
3. **AI evaluation is deterministic, not real.** The five-dimension score is computed by `lib/evaluation.ts` using deterministic heuristics over the candidate's structured fields. There is no LLM call.
4. **No rate limiting.** `POST /api/candidates`, `POST /api/demo/seed`, and `POST /api/candidates/:id/evaluation` can be flooded by anyone with the URL.
5. **No security headers (helmet).** Missing CSP, `X-Frame-Options`, HSTS, etc.
6. **Schema bootstrap, not migrations.** The schema is created via `CREATE TABLE IF NOT EXISTS` on startup. This is fine for the current 2-table schema but does not handle column changes — replace with `drizzle-kit migrate` if the schema starts evolving.
7. **External avatar dependency.** Candidate avatars are loaded from `randomuser.me`. If that service is down, every avatar 404s.
8. **`POST /api/demo/seed` writes real DB rows.** Calling it inflates the candidate pool; consider gating it behind a token before public deploy.
9. **Slow API dev loop.** The API's `dev` script does a full esbuild bundle + restart on each invocation (no file-watcher). Functional, just not snappy.
10. **The `mockup-sandbox` artifact is design-only** and is not part of the production deploy.

---

## License

Proprietary. © ORN-AI.
