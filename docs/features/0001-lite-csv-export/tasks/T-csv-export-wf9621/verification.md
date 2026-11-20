---
approved_by: "Pramesh Karmacharya"
approved_at: "2026-11-20"
approved_sha256: "b0d7cf6045c7722a42235bb4ec2643feb62c3a5f84e5fc3086848047e9696254"
---
## Verification — Task T-csv-export-wf9621 — 2026-11-20
> Critic anchored to the frozen story snapshot (the external spec — `snapshot-TSD.md`), NOT to the code. ★GATE: owner confirms/dismisses every flag.

✅ **Conformant:** items matching spec
- [x] Route, headers, header row, CRLF, null description as empty cell, raw status, ISO timestamps, UUID string — spec Interfaces, Data/State, Behavior 3; backend/app/csv_export.py:23-39, backend/app/routers/tasks.py:27-35
  - Verified: `test_export_returns_csv_with_header_and_rows` and the new unit tests pass; smoke output below.
- [x] `/export` is declared before the by-id route, so it is not read as an id — spec Interfaces
  - Verified: the route sits above `/{task_id}` in tasks.py, and the by-id guard test passes.
- [x] Board order comes from the existing `crud.get_tasks` ordering, which relies on the enum being declared in board order — spec Behavior 1
  - Verified: models.py declares todo, in_progress, in_review, done, and `test_export_rows_in_board_order` passes.
- [x] RFC 4180 quoting through the CSV writer with CRLF, and a non-ASCII round trip — spec Behavior 2 and 3
  - Verified: endpoint test plus a new unit round trip.
- [x] Empty board gives 200 and the header only — spec Behavior 4
- [x] Formula-prefix neutralization applies to title and description only, for all six prefixes — spec Behavior 5
  - Verified: unit test covers all six prefixes.
- [x] Read-only; two exports leave the task unchanged — spec Behavior 7
  - Verified: `schemas.TaskOut` includes `updated_at` (schemas.py:37), so the before/after comparison covers it.

⚠️ **Divergent:** deviation + severity (shallow/deep)
- [x] Behavior 6 asks for a 5xx "with the existing JSON error shape", and the diff does not check the body. The test only asserts `500 <= status < 600` and that the header is absent, and the plan's open question 3 dropped the shape. If the spec is wrong that a shape exists, the spec should say so. — spec Behavior 6; test_export.py:263-280
  - Disputed as a code defect, accepted as a spec issue: the human ratified asserting only "5xx and no CSV body" (plan open question 3) because no JSON error shape exists in the codebase (CONSTITUTION open question 5). DESIGN.md S-0001.01 behavior 6 is worded wrongly; it is approved, so correcting it needs the human to reopen it.
  - Dismissed by the human: accepted as is; the design wording is not being reopened.
- [x] The failure test uses a `Broken` fake session that raises from `execute`. It exercises the dependency seam, not a real database failure. The spec says integration tests use a real database. — spec Boundaries, Tests
  - Verified: the plan fakes this at the `get_db` seam on purpose (a real database cannot be made to fail on demand); every other integration test uses a real Postgres.
- [x] The Behavior 7 test compares task JSON through the API instead of the stored rows. — spec Behavior 7
  - Verified: `TaskOut` includes `updated_at`, so an `updated_at` change would fail the comparison.
- [x] Test-DB setup hardcodes credentials and port `localhost:5435` and creates a database as a side effect of import. conftest.py overwrites `DATABASE_URL` unconditionally. — spec Boundaries; backend/tests/conftest.py
  - Disputed in part: the values match the compose defaults already in `config.py`, and overwriting is deliberate so tests can never touch dev data. The side-effect-at-import point is fair and left as is; it is test-only and the plan asked for this setup. Human to judge whether to harden it (read the admin URL from the environment).
  - Dismissed by the human: accepted as is; no change to `conftest.py`.

🚨 **Suspected hallucination:** flag for human (false positives expected — do NOT reject PR on this alone)
- [x] Unit tests cover only `neutralize_formula`; `tasks_to_csv` has no unit test. — spec Tests
  - Fixed: added unit tests for null description, raw values and untouched non-formula fields, and the quote/comma/line-break/non-ASCII round trip (committed as a regression guard).
- [x] Scope creep, minor: the diff adds docs scaffolding; the `behavior-spec.md` B-2 Given/When/Then does not match its AC-2 heading. — spec absent
  - Verified: the docs files are lane's own task artifacts, not product scope. The heading mismatch is real and recorded in the exec plan's spec-mapping note (plan B-2 is the formula-prefix behavior); the spec's other entries are the guards. Left as is, since editing the seeded headings was not part of the plan.

❌ **Missing:** acceptance criteria not addressed
- [x] No unit test that a null description is an empty cell, and no endpoint test of `+`, `-`, TAB or CR. — spec Behavior 5
  - Fixed: null-description unit test added. `+`, `-`, TAB and CR are covered by the parametrized unit test; the endpoint test uses `=` and `@`. That is enough because the endpoint calls the same function.
- [x] No test that non-formula fields (`status`, `id`) are never altered. — spec Behavior 5
  - Fixed: the new row-values unit test asserts every field exactly.
- [x] No test that a title with a leading `'` is left as-is. — spec Behavior 5
  - Fixed: unit test added.
- [x] Smoke test: `curl` against the running stack. — spec Tests (Smoke)
  - Done manually, against the real app over HTTP (uvicorn on port 8011, `todo_test` database, not the compose backend container): `HTTP/1.1 200 OK`, `content-type: text/csv; charset=utf-8`, `content-disposition: attachment; filename="tasks.csv"`; a seeded title `=SUM(A1), "x"` plus a line break parsed back as one row of 7 cells, written as `'=SUM(A1), "x"\nline2`; rows in board order (todo before done).
- [x] The Behavior 6 test does not check "no partial CSV body" for a failure after some rows are built. — spec Behavior 6
  - Verified: the body is built whole before the response is returned (`tasks_to_csv` runs to completion first), so no partial body is possible today. No test guards a future switch to streaming; accepted as out of scope.
- [x] Unit-test list lacks null description and non-ASCII over fixed values. — spec Tests (Unit)
  - Fixed: see the added unit tests.

**TDD cycle log:**
| Behavior | RED ✅ | GREEN ✅ | Test = behavior not impl | Public interface only | Mocks @ boundary only |
|----------|--------|---------|--------------------------|----------------------|----------------------|
| B-1: headers, formats, CRLF, null description | ✅ 2f6690a | ✅ 5eb5b7a | ✅ asserts parsed CSV | ✅ HTTP only | ✅ real Postgres |
| B-2: formula-prefix neutralizing | ✅ 84ad471 | ✅ 3ec0d6c | ✅ asserts cell values | ✅ HTTP plus the helper's function | ✅ no mocks |
| G-1..G-6 guards (order, quoting, empty, failure, round trip, by-id) | n/a, guard | n/a, guard | ✅ | ✅ HTTP only | ✅ only `get_db` faked, in G-4 |
| Added review guards (row builder unit tests) | n/a, guard | n/a, guard | ✅ | ✅ | ✅ no mocks |

**Critic checklist:** (checkboxes — `done` only enforces checkboxes; resolve each)
- [x] Mocks only at boundaries — no asserts on internal collaborators / call-counts
  - Checked: the only fake is the `get_db` override in the failure test; no call-count asserts.
- [x] Each AC verified per its tag (behavior→interface · invariant→property · non-functional→harness)
  - Checked: AC-1..AC-7 map to B-1, B-2 and G-1..G-6 through the endpoint; AC-5 holds as a property in G-6.
- [x] Boundary contract asserted richly (args/content), not bare "was called"
  - Checked: tests parse the CSV body and compare cell values.
- [x] ≥1 `e2e` AC present and GREEN (reachable through the running system)
  - Checked: AC-8 is G-5 (full app round trip) plus the manual smoke above. No separate e2e harness exists; the human ratified this in plan open question 2.
- [x] Boundaries non-empty ⇒ a smoke AC exists (real boundary, staging)
  - Checked: the manual smoke above. It ran against the real app over HTTP and a real Postgres, not the compose backend container.

**Human verdict:** each item confirmed/dismissed (Path R: + SA) — the lane approve stamp records who signed
**Outcome:** clean → merge | divergence → Amendment (.lane/templates/AMENDMENT.md) → re-spec → re-run
