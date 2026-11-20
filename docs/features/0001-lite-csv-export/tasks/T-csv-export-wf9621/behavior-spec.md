# Behavior Spec — T-csv-export-wf9621: Export endpoint returns all tasks as CSV
> Source: task card ACs + docs/features/0001-lite-csv-export/tasks/T-csv-export-wf9621/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: `GET /api/tasks/export` returns `200` with `Content-Type: text/csv; charset=utf-8` and `Content-Disposition: attachment; filename="tasks.csv"`; the first row is `id,title,description,status,position,created_at,updated_at`. (INTENT "What changes" 1)
- Given: tasks seeded in the test database, one with a null description
- When: GET /api/tasks/export
- Then: 200, text/csv; charset=utf-8, attachment filename tasks.csv, exact header line, CRLF row endings, raw status values, decimal position, ISO 8601 timestamps with offset, empty cell for null description

## B-2: AC-2 [behavior]: With tasks in all four columns, rows come in board order (To Do, In Progress, In Review, Done), then ascending position within a column, one row per task. (INTENT "What changes" 2)
- Given: (plan B-2, the AC-6 formula-prefix behavior) titles/descriptions starting with =, +, -, @, TAB or CR, and a plain value
- When: the value goes through the CSV helper, or GET /api/tasks/export is called
- Then: prefixed values get a leading ', all other values and fields are written as stored

## B-3: AC-3 [behavior]: A title or description containing a comma, a double quote and a line break parses back to exactly one row of seven cells with the original text; non-ASCII text survives. (INTENT "What changes" 3)
- Given:
- When:
- Then:

## B-4: AC-4 [behavior]: With zero tasks the response is `200` and the body is the header row only. (INTENT "What changes" 4)
- Given:
- When:
- Then:

## B-5: AC-6 [behavior]: A `title` or `description` starting with `=`, `+`, `-`, `@`, TAB or CR is written with a leading `'`; other fields are written as stored. (DESIGN S-0001.01 behavior 5)
- Given:
- When:
- Then:

## B-6: AC-7 [behavior]: If the database read fails, the response is a `5xx` and contains no CSV body. (INTENT "What changes" 5; the exact error body is not specified because no error shape is established)
- Given:
- When:
- Then:

## B-7: AC-8 [e2e]: Against the running stack, `curl` of the export endpoint with a seeded task whose title holds a comma, a quote and a line break returns a file that a CSV parser reads back as the seeded tasks in board order. (INTENT "Done when")
- Given:
- When:
- Then:

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-5 [invariant]: `GET /api/tasks/{valid task id}` still returns that task, and calling export twice leaves every task's fields, including `updated_at`, unchanged. (INTENT "What stays the same") — coverage:

