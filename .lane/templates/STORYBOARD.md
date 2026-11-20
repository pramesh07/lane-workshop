# Exploration storyboard — Task <T-ID> — <TC-nn: case title>
> The frozen case (`snapshot-TSD.md`, beside this file) walked on the running app, one section
> per step, a screenshot each. A task step of the `qa` kind: `lane done` refuses while this file
> is missing or still carries a `<…>` placeholder. QA stamps it (`lane approve <T-ID>`) before any
> e2e is committed — lane refuses the stamp once one was — and `verification.md` carries its sha256.
> How to explore: the `lane-qa-explore` skill (lane's `Method:` line names it); the project's
> specifics are in `.lane/assists/qa-storyboard.md`.

**Case:** <S-NNNN.nn — TC-nn> (frozen in `snapshot-TSD.md`)
**Explored-At:** <full sha of the integration branch tip> (<branch name>)
**Source:** <NNNN-kind-slug> — dev tasks landed: <T-…, T-… | none — already built>
**Environment:** <base URL> · <browser + version> · <viewport>
**Explorer:** <agent + tool and version, or a person>

## Step 1 — <Given … (verbatim from the case)>
**Did:** <the commands, briefly>
**Saw:** <what the app showed, in plain words>
**Verdict:** <pass | fail | blocked>
![step 1](exploration/01-<what-it-shows>.png)

## Step 2 — <When … (verbatim from the case)>
**Did:** <…>
**Saw:** <…>
**Verdict:** <pass | fail | blocked>
![step 2](exploration/02-<what-it-shows>.png)

## Step K — Expected result: <… (verbatim from the case)>
**Did:** <…>
**Saw:** <…>
**Verdict:** <pass | fail | blocked>
![step K](exploration/0K-<what-it-shows>.png)

## Outcome
**Outcome:** <PASS | FAIL | BLOCKED>
**Classification:** <only on FAIL / BLOCKED: product | case | not-built | environment — one line why; "—" on PASS>
> The e2e does not exist yet and is NOT written while exploring. Commit this file first.
> PASS (committed, every verdict pass) → QA stamps this storyboard (`lane approve <T-ID>`); only then
> the e2e is written, at the implement step (the `lane-qa-e2e` skill — lane's `Method:` line names it).
> FAIL / BLOCKED → stop here; the `lane-qa-explore` skill says what happens next. Never write the e2e.

### Bug
<only on FAIL — the fix ticket's evidence: summary (the problem, not a solution) · the failing step numbers · expected (from the case) / actual (what was seen); "none" on PASS>

### Obstacles
- <what limited the exploration itself (missing data, a flaky boot) — never a product bug; "none">

### Artifacts
- [video](exploration/video.webm) — one chapter per step
- [trace](exploration/trace.zip) — open with `npx playwright show-trace exploration/trace.zip`

## Evidence manifest
| File | sha256 |
|------|--------|
| exploration/<file> | <64 hex> |
