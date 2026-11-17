# Engineering Constitution — TODO Board

> Human-maintained. No frontmatter baseline — update when conventions change, review when onboarding.
> DRAFT hydrated from code on 2026-11-17. Items marked (inferred) come from one example; items under "Open questions" are not established.

## Stack
- Runtime: Python 3.12 (backend, `requires-python >=3.12`); Node (frontend, version not pinned)
- Language: Python 3.12; TypeScript ~6.0 (strict via tsconfig project refs)
- Framework: FastAPI 0.115 + SQLAlchemy 2.0 + pydantic 2 (backend); React 19 + Vite 8 + Tailwind 4 + shadcn/ui + dnd-kit (frontend)
- DB: PostgreSQL 16 (psycopg2)
- Package managers: `uv` (`backend/uv.lock`); `npm` (`frontend/package-lock.json`; a stale `pnpm-lock.yaml` also exists)
- Lint: `oxlint` (frontend, `npm run lint`); backend: none configured
- Test runner: **none configured** (`test_cmd` in `.lane/lane.config` is empty; no test files exist)
- Infra: Docker Compose (`docker compose up`); `Makefile` has `run`, `run-be`, `run-fe` for non-Docker dev

## Conventions
1. Backend dependencies are pinned exactly in `backend/pyproject.toml` and locked with `uv.lock` — NOT: unpinned ranges or `pip install` ad hoc.
2. Routes are thin; DB access and commits live in `app/crud.py` — NOT: queries or `db.commit()` inside a router function.
3. Request/response bodies are pydantic models; routes declare `response_model` (`TaskOut` uses `from_attributes`) — NOT: returning ORM objects or bare dicts (the health check is the only dict).
4. Partial updates use `model_dump(exclude_unset=True)` — NOT: overwriting unset fields with `None`.
5. ORM uses SQLAlchemy 2.0 typed style (`Mapped[...]`, `mapped_column`, `select()`) — NOT: legacy `Column(...)` / `session.query`.
6. Primary keys are UUIDs; statuses are a `str` enum mirrored in `frontend/src/types.ts` (`TASK_STATUSES`) — NOT: integer ids, or adding a status in only one tier.
7. Config comes from env via `pydantic_settings.Settings` (`app/config.py`) — NOT: `os.environ` reads scattered through code or hard-coded URLs.
8. Frontend imports use the `@/` alias — NOT: deep relative `../../` paths.
9. Frontend files are kebab-case (`task-dialog.tsx`, `use-tasks.ts`); components are named exports; hooks in `src/hooks/` (inferred) — NOT: PascalCase filenames or default-exported components (except `App`).
10. User-visible mutation feedback uses `sonner` toasts from the hook layer; failed deletes roll back optimistically, failed moves reload from the server — NOT: silent failures or `alert()`.
11. UI primitives come from shadcn in `src/components/ui/` (config: `components.json`) and use `cn()` from `lib/utils.ts` — NOT: hand-rolled duplicates of existing primitives.

## Hard Rules
- Never put secrets in the repo — `.env`, `frontend/.env`, `backend/.env` are git-ignored; add new settings to `.env.example` instead. (`.gitignore`)
- Never call the backend from components directly — go through `lib/api.ts` so errors surface as `Error(detail)`.
- Always take DB sessions via `Depends(get_db)` — keeps sessions closed per request.
- Always keep the PG enum `task_status`, `TaskStatus` (Python) and `TASK_STATUSES` (TS) in sync — `create_all` will NOT alter an existing enum or table, so changing the schema on an existing DB needs a migration plan (none exists; raise it before touching `models.py`).
- Never edit `docs/context/*` during active feature work (LANE rule) — change them in a standalone PR.
- `certs/cloudflare-ca.crt` is only for development image builds (`BUILD_ENV=development`); keep production builds free of it.

## File Organization
- `backend/app/main.py` → app wiring (CORS, routers, startup `create_all`, health)
- `backend/app/routers/` → one module per resource, HTTP only
- `backend/app/crud.py` → data access; `models.py` → ORM; `schemas.py` → pydantic; `database.py` → engine/session; `config.py` → settings
- `frontend/src/components/` → feature components; `components/ui/` → shadcn primitives
- `frontend/src/hooks/` → data/state hooks; `frontend/src/lib/` → `api.ts`, `utils.ts`; `frontend/src/types.ts` → shared types/labels
- `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile` → local container stack
- `docs/` → LANE artifacts (specs, tasks, context, ADRs)

## Open questions (human to answer — code is silent)
1. Test layout and runner: pytest for backend and vitest for frontend would fit, but nothing is set up. Set `test_cmd`/`runner.*` in `.lane/lane.config` before the first `lane red`.
2. Migrations: adopt Alembic, or keep `create_all` for now?
3. Backend lint/format/type-check tool (ruff? mypy?) — none configured.
4. Which frontend lockfile is canonical, npm or pnpm? Both are committed; the README says npm.
5. Error taxonomy and API versioning — only `HTTPException(404, "Task not found")` exists.
6. Known defects spotted while reading (not rules): `Makefile` `run-be` passes `--reaload` (typo, and `app.main` ignores argv); README says Postgres is on 5432 but Compose publishes 5435; the Compose JWT/seed-user env vars are unused.
