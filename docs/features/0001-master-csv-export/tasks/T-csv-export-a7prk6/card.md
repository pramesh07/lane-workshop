---
approved_by: "Pramesh Karmacharya"
approved_at: "2026-11-17"
approved_sha256: "17c2c1ad85e2d41b0fb4c02eb3c53e4b8861123c6067b0bc7e8c859c14dbfb09"
---
## Task T-csv-export-a7prk6 — Test toolchain bootstrap
**Parent:** story none (enabler for S-0001.01–.03) · feature 0001 (docs/features/0001-master-csv-export/ — its BRIEFING.md + PRD.md + TSD.md)
**Slice:** commit a working test toolchain for both tiers so every later red-green card can claim and replay: pytest in `backend/`, vitest in `frontend/`, each with its config, a trivial passing test, and the needed ignores. (Scaffolding — no product behavior.)
**Acceptance criteria:**
- [ ] AC-1 [behavior]: running the backend test command from `backend/` exits 0 and reports at least one test executed.
- [ ] AC-2 [behavior]: running the frontend test command from `frontend/` exits 0 and reports at least one test executed.
- [ ] AC-3 [behavior]: both commands work from a fresh checkout after the documented install steps (`uv sync`, `npm ci`), with no manual setup.
**End-to-end AC:** N/A — tooling card, no user-facing surface.
**Tests:** N/A — reason: scaffolding (bootstrap). The trivial tests exist only to prove each runner executes. ⚠ Needs human ratification at the breakdown gate.
**Notes:** `test_cmd` / `runner.*` in `.lane/lane.config` are policy keys and must land on `main` as their own commit (the copy on a task branch is inert). Suggested: `runner.api` (root `backend`, `pytest`, pattern `collected [1-9]`) and `runner.web` (root `frontend`, `npx vitest run`, pattern `Tests +[0-9]+ (passed|failed)`).
**Test scope:** n/a
<!-- approval: written by `lane approve` as frontmatter (approved_by/at/sha256) after a human confirms — never hand-edit -->
**Done =** reviewable PR, both runners pass on a fresh checkout, links to chain. One PR per task (default).
