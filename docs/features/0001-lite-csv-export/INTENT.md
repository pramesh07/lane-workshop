---
approved_by: "Pramesh Karmacharya"
approved_at: "2026-11-20"
approved_sha256: "48452becd5249316cc794694ee207b79a48209a5446e294d228737dc32bc545b"
---
# Intent 0001 — CSV export of tasks
> The SCOPING document: what changes, for whom, and why — settled before any technical shape is
> chosen. Keep it to what a reader has to agree with; the how belongs in the technical document
> this kind signs next. The signed scope is what bounds every task cut from it.
> How many signatures this kind collects, and which document comes next, are its definition's —
> run `lane`, which names them. Too big for this document? Say so when you hand the gate over;
> `lane kinds` lists what else this repo offers.

**Source:** Direct request from the project owner via `lane intake`: "implement the CSV export feature in this application" (no roadmap entry; `docs/ROADMAP.md` is an empty template).

**Assumptions (strike any that are wrong):**
- A1. Export covers all tasks on the board, with no filter. The product has no search or filtering today.
- A2. Export is triggered from the board UI and downloads a file in the browser.
- A3. Columns are the existing task fields: id, title, description, status, position, created_at, updated_at. Status is exported as its raw value (`todo`, `in_progress`, `in_review`, `done`).
- A4. No authentication applies, matching every other endpoint today.

## Why
Anyone using the TODO board can see their tasks only inside the app. There is no way to get them out for reporting, sharing with people who don't use the board, or a backup. A CSV download is the smallest universally usable format, and it opens directly in spreadsheet tools.

## What changes
- The board has an "Export CSV" action. Activating it downloads a `.csv` file containing every task, one row per task, with a header row.
- Rows are ordered by column (To Do, In Progress, In Review, Done), then by position within the column, so the file reads like the board.
- Text containing commas, quotes or line breaks (titles, descriptions) opens correctly in a spreadsheet, as one cell per field.
- With zero tasks, the download contains only the header row, and the user is not shown an error.
- If the export fails, the user sees a failure toast and no partial file is saved.

## What stays the same
- Existing task endpoints, their response shapes, and drag-and-drop, create, edit and delete behaviour.
- The `tasks` table and the `task_status` enum. Nothing is written to the database.
- Task data is not altered by exporting.

## Out of scope
- Importing CSV, or any other export format (JSON, XLSX, PDF).
- Filtering, selecting, or choosing columns for the export.
- Scheduled, emailed, or server-stored exports.
- Access control on the export (there is no auth in the product today).

## Done when
- [ ] With tasks across all four columns, a user clicks "Export CSV" in the running app and the downloaded file opens in a spreadsheet showing every task in board order, including a task whose title or description contains a comma, a quote and a line break.
