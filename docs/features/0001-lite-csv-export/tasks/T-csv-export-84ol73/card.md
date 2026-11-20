## Task T-csv-export-84ol73 — Board "Export CSV" button downloads the file
**Parent:** story S-0001.02 · feature 0001 (docs/features/0001-lite-csv-export/ — its INTENT.md + DESIGN.md)
**Slice:** a complete observable behavior end-to-end + tests (full vertical — a disconnected layer = smell)
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`; behavior ACs = observable outcome through an interface — NO "calls X / saves to table Y / uses lib Z")
- [ ] AC-1 [behavior]: Once the board has loaded, an "Export CSV" button is visible; it is not shown in the load-error state. (DESIGN S-0001.02 behavior 5)
- [ ] AC-2 [behavior]: Clicking it saves a file named `tasks.csv` whose contents are exactly the server's export response. (INTENT "What changes" 1)
- [ ] AC-3 [behavior]: While an export is running the button is disabled and a second click starts no second download; it is enabled again after success or failure. (DESIGN S-0001.02 behavior 2)
- [ ] AC-4 [behavior]: If the request fails (network error or non-2xx), a failure toast appears showing the server's `detail` when there is one and "Failed to export tasks" otherwise; no file is saved and the board is unchanged. (INTENT "What changes" 5)
- [ ] AC-5 [behavior]: With an empty board the click saves a header-only file and shows no error. (INTENT "What changes" 4)
- [ ] AC-6 [invariant]: Create, edit, move and delete behave exactly as before. (INTENT "What stays the same")
- [ ] AC-7 [e2e]: In the running app with tasks in all four columns, including one whose title has a comma, a quote and a line break, clicking "Export CSV" downloads a file that opens in a spreadsheet showing every task in board order. (INTENT "Done when")
**End-to-end AC:** AC-7 [e2e] — reachable through the running app (required: green component/unit ≠ reachable)
**Tests:** AC-2, AC-4, AC-3, AC-1, AC-5, AC-6, AC-7  ← ordered; first = tracer bullet
**Notes (not ACs):** The file name `tasks.csv` is set by the client when saving; the server's `Content-Disposition` is not relied on. The request goes through `lib/api.ts` only. The button is disabled, not hidden, while the board is reloading.
<!-- exception: Tests: N/A — reason: config | scaffolding | spike | tooling | integration.  Tests: refactor — <what stays green> for behaviour-preserving work (lane proves pass→pass) -->
**Test scope:** tests/T-csv-export-84ol73/   ← documentation: where this task's OWN tests live. Scope is NOT configured — red/green scope to the changed test files and `verify` derives it from the RED commits (ADR-0002); `review` runs the FULL suite. This line is a human pointer only.
<!-- approval: written by `lane approve` as frontmatter (approved_by/at/sha256) after a human confirms — never hand-edit -->
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
