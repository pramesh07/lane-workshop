---
approved_by: "Pramesh Karmacharya"
approved_at: "2026-11-17"
approved_sha256: "0f4b7cad1895b8e06aa3291f19c0e6b678adbcd1b2047efd92bbc83680037034"
---
# TSD 0001 — CSV export of tasks
> Behavior + contracts ONLY. Never name the library/method/pattern (over-spec = defeats spec-first).
> One section per PRD story. Critic anchors to this as the external executable spec.
> Story IDs are S-<FEAT>.nn — the <FEAT> prefix is what resolves this folder (docs/features/<FEAT>-*/),
> so the `## TSD S-<FEAT>.nn` header below must match the story ID exactly.

## TSD S-0001.01 — Download all tasks as a CSV file  (PRD §S-0001.01)
| Aspect | Spec |
|--------|------|
| Interfaces | **Consumes/exposes:** `GET /api/tasks/export`, no parameters. Success: 200, `Content-Type: text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="tasks.csv"`. The path is a fixed segment and must never be read as a task id; `GET /api/tasks/{id}` is unchanged. **Frontend:** the API client gains an export call that yields the file contents; the board header shows an "Export CSV" action next to the existing actions. |
| Data / State | Reads the existing task data only; no schema change, nothing stored. Output: line 1 is the header `id,title,description,status,position,created_at,updated_at`; then one line per task in that column order. `status` is the raw value (`todo`, `in_progress`, `in_review`, `done`); `position` is the stored number; timestamps are ISO-8601 with offset. Rows are ordered by status, then position, identical to `GET /api/tasks`. Lines end with CRLF. No byte-order mark. |
| Behavior | Returns every task exactly once. With zero tasks, returns 200 and only the header line. The call has no side effects: repeated calls return the same content while data is unchanged. Clicking "Export CSV" makes the browser save `tasks.csv` containing the same tasks the board shows after a fresh load. |
| Access | Same as `GET /api/tasks`: unauthenticated, no roles. |
| Boundaries | The browser's file-download mechanism (saving a response as a file on the user's machine) — not ours. The network between frontend and backend. The database is owned by this system and is not a boundary. |
| Tests | **Unit:** row ordering and header composition from a set of tasks, including the empty set. **Integration:** export against a populated database returns the exact header, rows, order, status raw values and response headers; an empty database returns header only; `GET /api/tasks/export` returns 200 while `GET /api/tasks/<valid id>` still returns that task and an invalid id still returns 422. **Smoke (required, boundary non-empty):** start the real stack, create tasks through the UI, click "Export CSV", and verify a `tasks.csv` file lands in the browser's download location with one row per task; this covers PRD AC-5 [e2e]. |

## TSD S-0001.02 — Exported data opens correctly and safely in a spreadsheet  (PRD §S-0001.02)
| Aspect | Spec |
|--------|------|
| Interfaces | Same endpoint as S-0001.01; no new surface. Internally, one escaping rule is applied to every cell of every row (header excluded), so no column can skip it. |
| Data / State | Cell rules, in order: (1) an absent value becomes an empty cell, never the text `None` or `null`; (2) a text value whose first character is `=`, `+`, `-` or `@` gets a single leading `'`; (3) a cell containing a comma, double quote, CR or LF is wrapped in double quotes with embedded double quotes doubled. Rule 2 applies to text columns (title, description) before rule 3. Values that do not start with a trigger character are otherwise unchanged. Encoding is UTF-8; no BOM. |
| Behavior | Parsing the file with a standards-compliant CSV reader returns the original titles and descriptions, except that values starting with a trigger character come back with the single leading `'`. Non-ASCII text such as `Café 任务` survives byte-for-byte. A title like `=HYPERLINK("http://example.com")` is displayed as literal text by a spreadsheet, not evaluated. Multi-line descriptions stay in one record. |
| Access | Same as S-0001.01. |
| Boundaries | A spreadsheet application opening the file — not ours; we control only the file contents. |
| Tests | **Unit (the bulk of this story):** each cell rule on its own and combined — commas, quotes, newlines, CRLF, Unicode, empty and absent values, each of the four trigger prefixes, a trigger character that is not first (unchanged), and a value that needs both the leading `'` and quoting. **Integration:** create tasks with hostile and Unicode content, call the endpoint, parse the response with a standard CSV reader, and compare to the inputs (the 12 fixture cases from the PRD metric); assert the `charset=utf-8` content type. **Smoke (required, boundary non-empty):** create `=HYPERLINK("http://example.com")` in the UI, export, open the file in a real spreadsheet application, and confirm it shows as text (PRD AC-6 [e2e]). Manual step is acceptable for this one smoke. |

## TSD S-0001.03 — Know when the export fails  (PRD §S-0001.03)
| Aspect | Spec |
|--------|------|
| Interfaces | Consumes `GET /api/tasks/export`. Failure surface: an error toast with a human-readable message. Server errors use the existing error body shape (`detail`), so the message is the server's `detail` when present, otherwise a generic "Failed to export tasks". |
| Data / State | Transient UI state only: an "exporting" flag true from click until the request settles. Nothing persisted. |
| Behavior | On a non-2xx response or a network error: show an error toast, trigger no download, leave the board fully usable and its tasks unchanged. While exporting, the "Export CSV" action is disabled; it re-enables when the request settles, on success or failure. Failure feedback appears within 5 seconds of the failure. The action is keyboard-focusable and activates with Enter/Space, with the accessible name "Export CSV". |
| Access | Same as S-0001.01. |
| Boundaries | The network and the backend's availability — not ours; the failure case is simulated by faking the request or stopping the real backend. |
| Tests | **Unit:** with the request faked to fail (server error body, network error), assert the toast message, no download, and the flag clearing; with a pending request, assert the action is disabled and a second activation sends no second request. **Integration:** the board renders the action with the accessible name and it can be reached and activated by keyboard. **Smoke (required, boundary non-empty):** with the real backend stopped, click "Export CSV" in the running app and confirm the failure toast appears and the board remains usable (PRD AC-4 [e2e]). |

---

## Cross-cutting notes
- **Invariants:** no money movement, PII handling policy, or external side effects beyond the file download, so no idempotency or audit requirements apply. Data handling is as in the PRD: generated per request, not stored.
- **Scale:** all tasks are produced in one response; the target is the PRD benchmark of 200 tasks in under 2 seconds.
- **Prerequisite:** every Tests row above needs runners configured (`test_cmd` / `runner.*` in `.lane/lane.config`) before the breakdown can claim tasks that need tests. Not product scope.
