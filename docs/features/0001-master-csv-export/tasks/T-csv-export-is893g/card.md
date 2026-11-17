---
approved_by: "Pramesh Karmacharya"
approved_at: "2026-11-17"
approved_sha256: "1202e32ca563d8238755a13da99160d9cd498a35e092465b9108a117f4a42c77"
---
## Task T-csv-export-is893g — Export all tasks as CSV from the board
**Parent:** story S-0001.01 · feature 0001 (docs/features/0001-master-csv-export/ — its BRIEFING.md + PRD.md + TSD.md)
**Slice:** `GET /api/tasks/export` returning the header and one row per task in board order, plus an "Export CSV" button on the board that downloads `tasks.csv`. Cell escaping beyond the basics is the next card.
**Acceptance criteria:**
- [ ] AC-1 [behavior]: `GET /api/tasks/export` responds 200 with `Content-Type: text/csv; charset=utf-8` and `Content-Disposition: attachment; filename="tasks.csv"`.
- [ ] AC-2 [behavior]: line 1 is `id,title,description,status,position,created_at,updated_at`, followed by one row per task, ordered by status then position as in `GET /api/tasks`; status is the raw value.
- [ ] AC-3 [behavior]: with no tasks, the response is 200 with only the header row.
- [ ] AC-4 [behavior]: `/api/tasks/export` is never read as a task id (no 422/404), and `GET /api/tasks/{id}` still returns that task.
- [ ] AC-5 [e2e]: a user clicks "Export CSV" on the running board and the browser saves `tasks.csv` with one row per task.
**End-to-end AC:** AC-5 [e2e]
**Tests:** AC-2 (tracer bullet), AC-3, AC-4, AC-1, AC-5
**Test scope:** tests/T-csv-export-is893g/
<!-- approval: written by `lane approve` as frontmatter (approved_by/at/sha256) after a human confirms — never hand-edit -->
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
