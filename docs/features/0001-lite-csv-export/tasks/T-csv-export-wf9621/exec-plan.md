---
approved_by: ""
approved_at: ""
# planned_behaviors — machine-read count of RED→GREEN cycles (B-N). Leave empty to let
# lane infer from B-N labels below; SET it when an AC becomes a regression guard so
# `lane next` knows the remaining count (frontmatter edits need no re-approval).
planned_behaviors: "2"
---
## Exec Plan — Task T-csv-export-wf9621
> Authored during planning, before any code. ★GATE where this kind signs the plan — run `lane` and read the step: at `approve-plan` a DEV/SA approves via `lane approve` BEFORE any code (lane writes the stamp). When `lane` says there is no plan gate on this kind, this document is drafted and never signed, and the approved spec is what bounds it. Resolve all ambiguities first either way.

**Will build:** (mapped to each AC)
- AC-1 (headers, header row), the per-field formats, CRLF row endings and a null description as an empty cell → B-1
- AC-6 (leading `'` on formula-looking title/description) → B-2
- AC-2 (board order) → guard G-1: the existing task listing already sorts by column then position, and B-1 reuses it, so this cannot go RED
- AC-3 (comma/quote/line break, non-ASCII, one row of seven cells) → guard G-2: B-1 builds rows with a CSV writer, which quotes correctly
- AC-4 (empty board → header only) → guard G-3: the header row is always written
- AC-7 (database read fails → 5xx, no CSV body) → guard G-4: an exception in the read already yields a 500 with no CSV body, once the client is set not to re-raise server errors
- AC-8 (e2e round trip through the API, parsed back in board order) → guard G-5, plus a manual `curl` smoke on the running stack
- AC-5 (by-id route still works; two exports leave `updated_at` unchanged) → guard G-6

**Approach:** One new read-only route, `GET /api/tasks/export`, declared ahead of the by-id route. It returns a file response rather than a `response_model` (a deliberate exception, noted in the card). The task read stays in `crud.py`; the CSV text is built by a small helper module so the router stays thin. Tests run against a real Postgres, because the models use Postgres-only types. Only B-1 and B-2 are true RED→GREEN cycles; the other ACs are locked in as off-ledger regression guards once the code they exercise exists.

**Boundaries & mocks:** (from the approved spec's Boundaries section)
- Database: REAL for B-1, B-2 and G-1..G-3, G-5, G-6. It is a separate database `todo_test` on the compose Postgres, created and emptied by a test fixture, never the dev data.
- G-4 fakes the database read by overriding the `get_db` dependency with a session whose read raises, and uses a client that returns server errors instead of re-raising them. That is the existing seam, so no new port is added.
- No external service. The smoke is the manual `curl` against the running compose stack, recorded in the review notes.

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2. The e2e behavior is G-5, a guard, because it is made only of B-1 and B-2's output and cannot fail first.
- **B-1 (tracer):** with seeded tasks (one with a null description), `GET /api/tasks/export` returns 200, `text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="tasks.csv"`; the first line is exactly `id,title,description,status,position,created_at,updated_at`; every row ends with CRLF; each data row holds the UUID string, the raw status value (`todo`, `in_progress`, `in_review`, `done`), the position as a decimal number, ISO 8601 timestamps with offset, and an empty cell for the null description. Test: `backend/tests/test_export.py::test_export_returns_csv_with_header_and_rows`. Files: `backend/app/routers/tasks.py`, `backend/app/crud.py`, `backend/app/csv_export.py` (new), `backend/tests/conftest.py` (new, test database fixture), `backend/tests/test_export.py` (new).
- **B-2:** a title or description starting with `=`, `+`, `-`, `@`, TAB or CR is written with a leading `'`, and other fields are written as stored. Tests: `backend/tests/test_csv_export.py::test_neutralizes_formula_prefixes` (unit, on the helper over fixed values, one case per prefix plus a plain value left unchanged) and `test_export_neutralizes_formula_prefixes` in `test_export.py` (through the endpoint, on the parsed cell). Files: `backend/app/csv_export.py`, `backend/tests/test_csv_export.py` (new), `backend/tests/test_export.py`.
- **G-1 (guard):** tasks seeded out of order across all four columns come back To Do, In Progress, In Review, Done, ascending position within a column. Test `test_export_rows_in_board_order`.
- **G-2 (guard):** a title and a description holding a comma, a double quote and a line break, plus a non-ASCII title, parse back to exactly one row of seven cells with the original text. Test `test_export_quotes_special_characters`.
- **G-3 (guard):** with no tasks, 200 and the header row only. Test `test_export_empty_board_is_header_only`.
- **G-4 (guard):** when the database read raises, the status is 5xx and the body holds no CSV header row. The error body is not asserted. Test `test_export_database_failure_returns_5xx_without_csv`.
- **G-5 (guard, e2e):** seed tasks across all columns, one with a comma, quote and line break; export through the full app, parse the body, and compare to the seeded tasks in board order. Test `test_export_round_trip_through_the_app`.
- **G-6 (guard):** `GET /api/tasks/{id}` still returns that task, and two exports leave every task's fields, including `updated_at`, unchanged. Test `test_export_leaves_tasks_untouched_and_by_id_route_works`.
- If a guard unexpectedly fails when written, it is a defect in B-1 or B-2's code: fix it as an extra cycle, raise `planned_behaviors`, and note it in the review.

**PR will contain:**
- `backend/app/routers/tasks.py`, `backend/app/crud.py`, `backend/app/csv_export.py` (new)
- `backend/tests/conftest.py` (new), `backend/tests/test_export.py` (new), `backend/tests/test_csv_export.py` (new)
- `backend/pyproject.toml`, `backend/uv.lock` (add `httpx==0.28.1` to the dev group; FastAPI's `TestClient` needs it)
- Test setup note: `conftest.py` sets `DATABASE_URL` to the `todo_test` database before importing `app` (the engine is built at import), and creates that database through an admin connection to the compose Postgres.
- Spec mapping: this plan's B-1 is `behavior-spec.md` B-1 (headers, formats); this plan's B-2 is the spec's formula-prefix entry; the spec's other entries are the guards G-1..G-6.
- Not in this PR: `.lane/lane.config`. Adding `replay_env` is a policy change the human lands on `main` as its own commit.

**Open questions / ambiguities:** (MUST be resolved before execution)
1. Should tests use a separate `todo_test` database on the compose Postgres, set up and emptied by a fixture, with the human landing `replay_env: docker compose up -d db` in `.lane/lane.config` on `main` so `lane verify` can replay them? Recommended: yes.
2. Is AC-8's literal "`curl` against the running stack" satisfied by the automated round-trip guard G-5 plus one manual `curl` whose output goes in the review notes, with no separate e2e harness? Recommended: yes.
3. The design says a failed read returns "the existing JSON error shape", but no such shape exists and the card says it is unspecified. Should this task assert only "5xx and no CSV body"? Recommended: yes.

**Path:** L
**Escalation signals hit (≥2 → R):** ambiguities≥3 · blast-radius≥3 · security · amendments≥2 · prior-fail · self-flag — one hit (security: untrusted text written to a file), so Path L.
**If overriding R→L:** not overriding; fewer than two signals hit.
- [ ] Refactor pass done (on green; tests unchanged) — before PR
