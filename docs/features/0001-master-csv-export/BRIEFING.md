---
approved_by: "Pramesh Karmacharya"
approved_at: "2026-11-17"
approved_sha256: "c346f99c290eb169657eaee7bcfb5793d25f52d31c554fa785e1d54ee04eff9d"
---
# Briefing 0001 — CSV export of tasks
> Scratch pad — flesh the idea out before committing to a PRD.
> ★ Gate: stakeholder (PM / SA / client) approves before any PRD work begins.
> Approve by running `lane approve` — lane writes the stamp after your y/N confirm.
> Do NOT edit the frontmatter fields by hand; a hand-typed stamp does not count.

## Summary
Add a CSV export of all tasks: one new read-only endpoint, `GET /api/tasks/export`, and an "Export CSV" button on the board. No schema change, no new container, no auth. Out of scope: import, filtered export, other formats. Four open questions below (which tasks, status format, BOM, test runners) need answers before the PRD.

## Why
Tasks live only inside the board UI. Users cannot take their data out for reporting, sharing, or backup (PRODUCT.md: no export, no search/filtering). A CSV download is the simplest way to get tasks into a spreadsheet.

## Hypothesis
Add a read-only export that returns all tasks as a CSV file, and an "Export CSV" button on the board that downloads it. It reuses the existing `tasks` table and the router → `crud` → `models` layering (BLUEPRINT.md); no schema change, no new container.

## Mocks / references
- Existing list endpoint: `GET /api/tasks` (`backend/app/routers/tasks.py`)
- Board header with the Create and Refresh actions: `frontend/src/components/board.tsx`

## Scope hints
**Probably in:**
- A new `GET /api/tasks/export` endpoint (CSV, `Content-Disposition: attachment`), declared before `/{task_id}` so it is not captured as an id
- Columns: id, title, description, status, position, created_at, updated_at
- Rows ordered the same as the board (status, then position)
- Safe CSV quoting for commas, quotes and newlines in titles and descriptions, plus a guard against spreadsheet formula injection (cells starting with `=`, `+`, `-`, `@`)
- An "Export CSV" button on the board, with a toast on failure
- First tests for the repo (backend and frontend), which means setting `test_cmd` / `runner.*`

**Probably out:**
- CSV import
- Filtered or per-column export
- Other formats (XLSX, JSON)
- Auth, scheduled exports, streaming for very large datasets

## Open questions
<!-- Must be resolved before PRD. Delete each line when answered. -->
- Export every task, or only the tasks in the visible columns? (Draft assumes all.)
- Human-readable status labels ("In Progress") or raw values (`in_progress`)? (Draft assumes raw values, which round-trip better.)
- Should the file include a UTF-8 BOM so Excel reads non-ASCII text correctly?
- Which test runners should be used (pytest and vitest are the likely fit)? `test_cmd` is empty and blocks red/green tasks.

## Approval
Run `lane approve` — lane stamps the frontmatter (name, date, content hash) after you confirm.
Editing this file after approval invalidates the stamp and reopens the gate.
