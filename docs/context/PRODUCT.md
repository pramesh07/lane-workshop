# Product — TODO Board

> Absolute truth of the current product. Update when the product meaningfully changes.
> Human-maintained — `lane fold` does not write to this file.
> DRAFT (hydrated from code; see "Open questions" at the bottom for what only a human can confirm).

## What it is
A Jira-style TODO app: a single drag-and-drop kanban board of tasks across four fixed columns — To Do, In Progress, In Review, Done (`README.md`, `backend/app/models.py` `TaskStatus`).

## Who uses it
Anyone who opens the web UI. There are no accounts, roles or access control in the code today: every API endpoint is open and all tasks are shared by all visitors (`backend/app/routers/tasks.py` has no auth dependency). Target audience beyond that is not stated in the repo (see open questions).

## What it does
Vocabulary: **Task** (title, optional description), **Status** (`todo` | `in_progress` | `in_review` | `done`), **Position** (float ordering within a column), **Board** / **Column**.

- Create a task (title 1–200 chars, optional description, initial status) — `POST /api/tasks`.
- View the board: all tasks grouped by status, sorted by position — `GET /api/tasks`, `frontend/src/components/board.tsx`.
- Edit a task's title, description or status — `PUT /api/tasks/{id}` via `task-dialog.tsx`.
- Drag a task between or within columns; the move is persisted (status + position) — `PATCH /api/tasks/{id}/move`.
- Delete a task, after a confirm dialog — `DELETE /api/tasks/{id}`.
- Toast feedback for success/failure, a reload action, and a load-error state.
- Health probe — `GET /api/health`.

## What it doesn't do
Confirmed absent from the code:
- No authentication, users, assignees, ownership or per-user boards. (Docker Compose passes JWT/seed-user env vars to the backend, but no code reads them — see open questions.)
- No multiple boards/projects, custom columns, labels, priorities, due dates, comments, attachments, search or filtering.
- No real-time sync between clients (state is fetched on load/reload only).
- No automated tests exist yet (backend or frontend).

## Open questions (human to answer)
1. Who is the intended user, and is this a demo/workshop app or a product? (repo is `lane-workshop`.)
2. Is auth planned? `docker-compose.yml` already wires `JWT_SECRET`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS`, `REFRESH_COOKIE_SECURE`, `SEED_USER_*` but nothing consumes them.
3. What is on the roadmap? `docs/ROADMAP.md` is still the empty template.
