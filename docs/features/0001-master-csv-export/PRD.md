---
approved_by: "Pramesh Karmacharya"
approved_at: "2026-11-17"
approved_sha256: "d3a028dc16a4223d6f15bb0992623323e280ead61bc12e0cfd96ceca47d6d67d"
---
# PRD 0001 — CSV export of tasks
> User stories + acceptance criteria + success metrics. Signed off by PM + SA + DS.
> Feature-scoped (LANE §8): one PRD per feature/milestone, under docs/features/<FEAT>-<slug>/.

**Source:** the discovery document 0001 (`BRIEFING.md`, approved 2026-11-17)
**Parent:** none — this feature is the umbrella

Assumptions taken from the approved briefing (flagged for confirmation at the PRD gate): export covers **all** tasks; the status column uses **raw values** (`todo`, `in_progress`, `in_review`, `done`); **no** UTF-8 BOM.

---

## Story S-0001.01 — Download all tasks as a CSV file
As a board user I want to download every task as a CSV file so that I can open it in a spreadsheet for reporting, sharing, or backup.

**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
- [ ] AC-1 [behavior] — `GET /api/tasks/export` responds 200 with `Content-Type: text/csv` and `Content-Disposition: attachment; filename="tasks.csv"`.
- [ ] AC-2 [behavior] — The first line is the header `id,title,description,status,position,created_at,updated_at`, followed by one row per task, ordered by status then position (same as `GET /api/tasks`).
- [ ] AC-3 [behavior] — With no tasks, the response is 200 and contains only the header row.
- [ ] AC-4 [behavior] — `GET /api/tasks/export` is never interpreted as a task id (no 422 or 404), and `GET /api/tasks/{id}` still works.
- [ ] AC-5 [e2e] — A user clicks "Export CSV" on the board and the browser downloads `tasks.csv` containing the tasks currently shown on the board.

**Success metric:** 100% of tasks present in the database appear exactly once in the downloaded file, checked on a board of 200 tasks. The export completes in under 2 seconds at that size.

## Story S-0001.02 — Exported data opens correctly and safely in a spreadsheet
As a board user I want titles and descriptions with commas, quotes, line breaks, or non-ASCII text to export intact, and I want exported cells never to run as formulas, so that my data is accurate and opening the file is safe.

**Acceptance criteria:**
- [ ] AC-1 [behavior] — A title or description containing commas, double quotes, or newlines round-trips through a standard CSV parser to the original text.
- [ ] AC-2 [behavior] — A title or description starting with `=`, `+`, `-`, or `@` is exported with a leading `'` so spreadsheets treat it as text. All other values are unchanged.
- [ ] AC-3 [behavior] — A task with no description exports an empty description cell, not the text `None` or `null`.
- [ ] AC-4 [behavior] — Non-ASCII text (for example `Café 任务`) is encoded as UTF-8 and the content type declares `charset=utf-8`.
- [ ] AC-5 [invariant] — Every cell of every row passes through a single escaping function, so no column can bypass the formula guard.
- [ ] AC-6 [e2e] — A task titled `=HYPERLINK("http://example.com")` is created in the UI, exported, and shown in a spreadsheet as literal text, not a live formula.

**Success metric:** 0 of the 12 fixture cases (commas, quotes, newlines, Unicode, empty values, and each formula prefix) are altered or executed in the round-trip test.

## Story S-0001.03 — Know when the export fails
As a board user I want to see a clear message when the export fails so that I am not left waiting for a download that never arrives.

**Acceptance criteria:**
- [ ] AC-1 [behavior] — When the request fails (server error or network error), the board shows an error toast and no file is downloaded.
- [ ] AC-2 [behavior] — While the export request is in flight, the "Export CSV" button is disabled so repeated clicks do not trigger duplicate downloads.
- [ ] AC-3 [non-functional] — The button is reachable and operable by keyboard and has an accessible name ("Export CSV").
- [ ] AC-4 [e2e] — With the backend stopped, clicking "Export CSV" shows the failure toast and the board stays usable.

**Success metric:** In the failure scenario, the user sees feedback within 5 seconds in 100% of test runs.

---

## Non-functional and compliance notes
- **Auth / access:** none exists today (PRODUCT.md). The export is as open as `GET /api/tasks`; anyone who can list tasks can export them. Adding auth is out of scope and would need an ADR.
- **Data handling:** exports may contain whatever users typed into tasks. The file is generated per request, not stored server-side, and nothing is logged beyond normal request logs.
- **Scale:** the export loads all tasks in one request. Streaming for very large datasets is out of scope. Acceptable up to the 200-task benchmark above.
- **Consistency with context docs:**
  - No schema change; reuses `Task`/`TaskStatus`.
  - The route lives under `/api/` in `routers/tasks.py`, queries go through `crud.py`, and the frontend calls go through `lib/api.ts` (BLUEPRINT.md and CONSTITUTION.md).
  - PRODUCT.md currently lists "no export" under what the product does not do. It must be updated in a standalone docs PR after this feature lands, not during it.

## Out of scope
CSV import, filtered or per-column export, other formats (XLSX, JSON), scheduled exports, auth.

## Open questions for the PRD gate
1. Confirm "all tasks", raw status values, and no UTF-8 BOM. (Excel can mis-read non-ASCII text without a BOM.)
2. Test runners: `test_cmd` is empty, and every red/green task needs it set. This is a prerequisite for the breakdown, not part of the product scope.
