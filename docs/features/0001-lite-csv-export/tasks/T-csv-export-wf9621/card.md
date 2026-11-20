## Task T-csv-export-wf9621 — Export endpoint returns all tasks as CSV
**Parent:** story S-0001.01 · feature 0001 (docs/features/0001-lite-csv-export/ — its INTENT.md + DESIGN.md)
**Slice:** a complete observable behavior end-to-end + tests (full vertical — a disconnected layer = smell)
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`; behavior ACs = observable outcome through an interface — NO "calls X / saves to table Y / uses lib Z")
- [ ] AC-1 [behavior]: `GET /api/tasks/export` returns `200` with `Content-Type: text/csv; charset=utf-8` and `Content-Disposition: attachment; filename="tasks.csv"`; the first row is `id,title,description,status,position,created_at,updated_at`. (INTENT "What changes" 1)
- [ ] AC-2 [behavior]: With tasks in all four columns, rows come in board order (To Do, In Progress, In Review, Done), then ascending position within a column, one row per task. (INTENT "What changes" 2)
- [ ] AC-3 [behavior]: A title or description containing a comma, a double quote and a line break parses back to exactly one row of seven cells with the original text; non-ASCII text survives. (INTENT "What changes" 3)
- [ ] AC-4 [behavior]: With zero tasks the response is `200` and the body is the header row only. (INTENT "What changes" 4)
- [ ] AC-5 [invariant]: `GET /api/tasks/{valid task id}` still returns that task, and calling export twice leaves every task's fields, including `updated_at`, unchanged. (INTENT "What stays the same")
- [ ] AC-6 [behavior]: A `title` or `description` starting with `=`, `+`, `-`, `@`, TAB or CR is written with a leading `'`; other fields are written as stored. (DESIGN S-0001.01 behavior 5)
- [ ] AC-7 [behavior]: If the database read fails, the response is a `5xx` and contains no CSV body. (INTENT "What changes" 5; the exact error body is not specified because no error shape is established)
- [ ] AC-8 [e2e]: Against the running stack, `curl` of the export endpoint with a seeded task whose title holds a comma, a quote and a line break returns a file that a CSV parser reads back as the seeded tasks in board order. (INTENT "Done when")
**End-to-end AC:** AC-8 [e2e] — reachable through the running app (required: green component/unit ≠ reachable)
**Tests:** AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8  ← ordered; first = tracer bullet
**Notes (not ACs):** The route returns a file response, not a `response_model`; that is a deliberate exception to the usual route convention. Query access and CSV building live outside the router function (the data read in `crud.py`), keeping the router thin. The export route must not be captured by the by-id route.
<!-- exception: Tests: N/A — reason: config | scaffolding | spike | tooling | integration.  Tests: refactor — <what stays green> for behaviour-preserving work (lane proves pass→pass) -->
**Test scope:** tests/T-csv-export-wf9621/   ← documentation: where this task's OWN tests live. Scope is NOT configured — red/green scope to the changed test files and `verify` derives it from the RED commits (ADR-0002); `review` runs the FULL suite. This line is a human pointer only.
<!-- approval: written by `lane approve` as frontmatter (approved_by/at/sha256) after a human confirms — never hand-edit -->
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
