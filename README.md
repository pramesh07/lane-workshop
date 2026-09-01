# TODO Board

A Jira-style TODO app: FastAPI backend, React + Tailwind + shadcn/ui frontend, PostgreSQL database, drag-and-drop board with `To Do`, `In Progress`, `In Review`, and `Done` columns.

## Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, dnd-kit
- **Infra**: Docker Compose

## Run with Docker Compose

```bash
docker compose up
```

- Frontend: http://localhost:5174
- Backend API: http://localhost:8000 (docs at http://localhost:8000/docs)
- Postgres: localhost:5432

The database schema is created automatically on backend startup.

## Local development (without Docker)

### Backend

Requires [uv](https://docs.astral.sh/uv/) and a running Postgres reachable at the `DATABASE_URL` below (e.g. `docker compose --env-file backend/.env up db`, or a local install).

```bash
cd backend
cp .env.example .env
uv sync
uv run uvicorn app.main:app --reload
```

Backend API: http://localhost:8000 (docs at http://localhost:8000/docs)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API

| Method | Path                    | Description                    |
| ------ | ------------------------ | ------------------------------ |
| GET    | `/api/tasks`             | List all tasks                 |
| POST   | `/api/tasks`              | Create a task                  |
| GET    | `/api/tasks/{id}`         | Get a task                     |
| PUT    | `/api/tasks/{id}`         | Update a task                  |
| PATCH  | `/api/tasks/{id}/move`    | Move a task (status + position) |
| DELETE | `/api/tasks/{id}`         | Delete a task                  |
