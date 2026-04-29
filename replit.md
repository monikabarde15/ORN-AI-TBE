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
