---
approved_by: "Pramesh Karmacharya"
approved_at: "2026-11-17"
# planned_behaviors — machine-read count of RED→GREEN cycles (B-N). Leave empty to let
# lane infer from B-N labels below; SET it when an AC becomes a regression guard so
# `lane next` knows the remaining count (frontmatter edits need no re-approval).
planned_behaviors: ""
approved_sha256: "f01cc5cc34d1df868c68e1bb8ad9ac920d110c2e2f0e5b617cbfcf57b46d5b7a"
---
## Exec Plan — Task T-csv-export-a7prk6
> Authored during planning, before any code. ★GATE where this kind signs the plan — run `lane` and read the step: at `approve-plan` a DEV/SA approves via `lane approve` BEFORE any code (lane writes the stamp). When `lane` says there is no plan gate on this kind, this document is drafted and never signed, and the approved spec is what bounds it. Resolve all ambiguities first either way.

**Will build:** (mapped to each AC)
- AC-1: pytest as a backend dev dependency (`dev` dependency group in `backend/pyproject.toml`, `uv.lock` updated) with a minimal config and `backend/tests/test_smoke.py` (one trivial passing test).
- AC-2: vitest as a frontend dev dependency (`frontend/package.json` + `package-lock.json`, `vitest` script, `test` config in `vite.config.ts`) and `frontend/src/smoke.test.ts` (one trivial passing test).
- AC-3: both runs work from a fresh checkout after `uv sync` / `npm ci`; README gets a short "Running tests" section.
**Approach:** add the two runners side by side with the smallest config that works. No product code changes. npm is the canonical frontend package manager (README); `pnpm-lock.yaml` is left untouched.
**Boundaries & mocks:** none — no external services, clock, randomness or filesystem are touched; the trivial tests assert a constant. Boundaries are empty, so no smoke AC is required.
- (none)
**Behaviors (TDD order):** `Tests: N/A — scaffolding (bootstrap)`: no RED/GREEN ledger. Verification is by running each runner and seeing at least one test executed (B-1 backend, B-2 frontend, B-3 fresh-checkout install). No e2e: tooling card with no user-facing surface.
- B-1 backend runner executes; B-2 frontend runner executes; B-3 fresh-checkout replay
**PR will contain:**
- `backend/pyproject.toml`, `backend/uv.lock`, `backend/tests/test_smoke.py`
- `frontend/package.json`, `frontend/package-lock.json`, `frontend/vite.config.ts` (test block), `frontend/src/smoke.test.ts`
- `README.md` (Running tests)
- NOT in this PR: `.lane/lane.config` (`test_cmd` / `runner.*` are policy keys and land on `main` as their own commit; see open questions)
**Open questions / ambiguities:** (MUST be resolved before execution)
- The `runner.*` entries in `.lane/lane.config` must land on `main` before red-green cards can start. Proposed values: `runner.api` root `backend`, `pytest`, pattern `collected [1-9]`; `runner.web` root `frontend`, `npx vitest run`, pattern `Tests +[0-9]+ (passed|failed)`. Needs the human to commit it (or ask me to), since `lane.config` already has an uncommitted `integration_branch` edit on `main`.
- Ratify `Tests: N/A` for this card (already flagged on the card).
**Path:** L (lean, default)
**Escalation signals hit (≥2 → R):** ambiguities≥3 · blast-radius≥3 · security · amendments≥2 · prior-fail · self-flag
**If overriding R→L:** risk acknowledged here + SA co-signs Verification.
- [ ] Refactor pass done (on green; tests unchanged) — before PR
