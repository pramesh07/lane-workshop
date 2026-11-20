---
approved_by: "Pramesh Karmacharya"
approved_at: "2026-11-20"
approved_sha256: "87878f10ea0c824c31e7bc42864d3e29af3032494ebaedd5ee93388e14e80e9c"
---
# Design 0001 — CSV export of tasks
> The technical design for the document this kind places before it, in behaviour + contract terms — never the library, method
> or pattern. One `## TSD S-0001.nn` section per group of behaviours; each task card names ONE
> of them as its story and the Critic anchors to that section, frozen at `lane start`. The
> `0001` prefix resolves this folder, so the header must match the story id exactly.

## Approach
Add one read-only backend resource that returns every task as a CSV file, and one board action that downloads it. The backend side follows the existing layering (router for HTTP, `crud` for the query, no new table, no schema change). The frontend side follows the existing rule that all HTTP goes through `lib/api.ts` and that failures surface as toasts from the hook layer. No new container, no new dependency on an external service, and no change to the context docs.

## TSD S-0001.01 — Export endpoint returns all tasks as CSV
| Aspect | Spec |
|--------|------|
| Interfaces | New `GET /api/tasks/export`, no parameters. Success: `200`, `Content-Type: text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="tasks.csv"`. Body: header row `id,title,description,status,position,created_at,updated_at`, then one row per task. Existing `/api/tasks` routes keep their paths, shapes and status codes; in particular `GET /api/tasks/{task_id}` must still resolve by id, and `export` must not be read as an id. |
| Data / State | Read-only. Touches no table definition, enum or row. Each field is the stored value: `id` as the UUID string, `status` as its raw value (`todo`, `in_progress`, `in_review`, `done`), `position` as a decimal number, `created_at` / `updated_at` as ISO 8601 timestamps with offset, a null `description` as an empty cell. |
| Behavior | 1. Rows are ordered by column in board order (To Do, In Progress, In Review, Done), then ascending `position` within a column. 2. Fields are quoted per RFC 4180 where they contain a comma, double quote, CR or LF, with embedded double quotes doubled, so every task is exactly one row of exactly seven cells when parsed. 3. Rows end with CRLF; the file is UTF-8, and non-ASCII titles survive a round trip. 4. With zero tasks the body is the header row only and the status is still `200`. 5. A `title` or `description` whose first character is `=`, `+`, `-`, `@`, TAB or CR is written with a leading `'` so a spreadsheet does not evaluate it as a formula; no other field is altered. 6. If the database read fails, the response is a `5xx` with the existing JSON error shape and no partial CSV body. 7. Exporting changes no task: `updated_at` and every other field read the same before and after. |
| Access | Open, like every other task endpoint today (no authentication exists; see BLUEPRINT "Identity"). No new trust boundary. Untrusted input: task titles and descriptions were entered by any visitor, and are treated as hostile when written to the file (behaviors 2 and 5). No secrets or personal data beyond what tasks already hold; nothing is logged beyond the usual request log. |
| Boundaries | The database is ours, and integration tests use a real one. No external service. |
| Tests | Unit: the row/quoting/neutralizing logic over fixed task values (comma, quote, CR/LF, leading `=` `+` `-` `@`, null description, non-ASCII). Integration: a seeded database with tasks in all four columns returns board order and the exact header; an empty database returns the header only; `GET /api/tasks/{valid uuid}` still returns the task; exporting twice leaves `updated_at` unchanged; a failing read gives a `5xx` with no CSV body. Smoke: against the running stack, `curl` the endpoint and confirm the content type, the attachment name and a parseable body. |

**Out of scope:** filtering, column selection, pagination, and any format other than CSV; any authentication or per-user restriction; a configurable file name.

## TSD S-0001.02 — Board action downloads the export
| Aspect | Spec |
|--------|------|
| Interfaces | Consumes `GET /api/tasks/export` from S-0001.01 through the existing API client module only; components do not call the network directly. Adds an "Export CSV" button to the board. No change to the task types or to the existing hook return values other than what the button needs. |
| Data / State | One transient in-progress flag while an export is running. Nothing is persisted, and the displayed task list is not modified. |
| Behavior | 1. Clicking "Export CSV" saves a file named `tasks.csv` through the browser's normal download, containing exactly the server's response body. 2. While the export runs the button is disabled and cannot start a second download; it is enabled again on success or failure. 3. If the request fails (network error or non-2xx), a failure toast is shown ("Failed to export tasks", or the server's `detail` message when one exists), no file is saved, and the board is unchanged. 4. With an empty board the click still saves a header-only file with no error. 5. The button is available whenever the board has loaded; it is not shown in the load-error state. 6. Create, edit, move and delete behave exactly as before. |
| Access | Open, matching S-0001.01. No new trust boundary; the file contents are the server's response, saved unmodified. |
| Boundaries | The browser's file-save mechanism and the backend HTTP API. Both are faked in unit tests (a stubbed client response and a stubbed download hand-off). |
| Tests | Unit (hook/client level): success hands the response body to the download step with the name `tasks.csv`; failure shows the toast and downloads nothing; the in-progress flag blocks a second click and resets after both outcomes. Component: the button renders after load, not in the error state, and is disabled while exporting. End to end: in the running app, with tasks in all four columns including one whose title has a comma, a quote and a line break, click the button and open the downloaded file to see every task in board order. |

**Out of scope:** previewing the file, remembering past exports, progress for very large boards, and a keyboard shortcut.

## Tasks
- Backend export endpoint: delivers S-0001.01 (red-green; needs a backend test runner configured first).
- Board "Export CSV" action: delivers S-0001.02 (red-green; needs a frontend test runner configured first).
- Test runners: setting `test_cmd` / `runner.*` in `.lane/lane.config` is a policy change landed on `main` by a human as its own commit, before either task starts; it is not a task card.
