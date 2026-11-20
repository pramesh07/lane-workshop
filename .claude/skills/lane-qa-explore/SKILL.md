---
name: lane-qa-explore
description: Use only when lane's output has a Method line naming lane-qa-explore (a QA task's storyboard step) — walking the frozen case on the running app as a black box and recording a STORYBOARD.md, a screenshot per step.
---

# lane-qa-explore — walk the case by hand, write down what the app did

Advisory method for a QA task's `draft-storyboard` step. It enriches `lane next`; it gates
nothing. You are a manual tester holding the case sheet, not a test author. The output is the
task's `STORYBOARD.md` and its `exploration/` evidence, in this task's worktree only, where
`lane start` scaffolded the storyboard beside `snapshot-TSD.md`, the frozen case. How the app
boots and which recording tool to use are in the step's assist and the signed TEST-PLAN.

## Rules that never bend

- **The case is frozen.** Never reword its steps or its expected result. An unclear or wrong
  case is a finding for QA (classification `case`), not something to reinterpret.
- **Black box.** The app's behaviour is the evidence. Never read the product's source or its
  unit tests to decide a verdict, and never use a "self-healing" tool that rewrites expected
  values to match what it found.
- **No product code.** A QA task changes only its task folder and the e2e side. Lane refuses
  `lane review` and `lane done` on a branch that touches anything else.
- **Never close a gate.** The stamps are the human's: the human runs `lane approve`, never you,
  and the frontmatter stamp fields are lane's.
- **No e2e before a PASS.** Exploring and automating are two phases, in that order. While
  exploring you write no test file: no spec, no page object, no fixture, no script meant to be
  run again, not as a draft and not "to save time later". You drive the app and record what
  you saw. Lane refuses the storyboard stamp once a test file was committed before it.

## Explore

`lane start` already waited for dev to land what this case needs; you start from there.

1. **Where the build is.** Record **Explored-At**: the full sha of the integration-branch
   commit this worktree contains, and the branch name. Exploring again after a dev fix
   landed? Bring the task branch up to the integration branch first (merge it in), then
   record the new sha.
2. **The headings.** Read `snapshot-TSD.md`. Split its **Steps** on ` / ` into clauses and
   write one `## Step N — <clause>` per clause, copied verbatim, then a last
   `## Step K — Expected result: <expected result>`, also verbatim.
3. **The header.** Fill **Case**, **Source** (the source feature and the dev tasks landed, or
   `none — already built`), **Environment** (base URL, browser and version, viewport) and
   **Explorer** (agent, tool and version, or a person).
4. **Boot the app** the way TEST-PLAN § Environments and the assist say. Use the case's own
   preconditions and test data, created by this run; never state a previous run left behind.
5. **Start the evidence** into `exploration/` beside the storyboard: a trace and a video,
   with the tool the assist names.
6. **For each step, in order:** mark it in the recording if the tool can; do what it says;
   read the page again after anything that changes it; take a screenshot to
   `exploration/NN-<what-it-shows>.png` (NN two digits; `NNa-`, `NNb-` for several); then write
   **Did:** (the actions, briefly), **Saw:** (what the app showed, in plain words),
   **Verdict:** and the image line.
7. **Judge only against the step's heading.** Any difference is `fail`, never "pass with a
   note". A step you could not perform is `blocked`; say why under Obstacles.
8. **Stop the evidence:** the trace and the video end up as single files in `exploration/`.
9. **Outcome** from the verdicts: any `fail` → FAIL; else any `blocked` → BLOCKED; else PASS.
   On FAIL or BLOCKED fill **Classification**, **Bug** and **Obstacles** (below). On PASS,
   Classification is `—`, Bug and Obstacles say `none`.
10. **Evidence manifest:** one row per file in `exploration/`, its sha256 from
    `sha256sum exploration/*`, run after the last file was written.
11. **Check what you are about to commit.** `git status --short` shows only this task's folder
    (STORYBOARD.md and `exploration/`). A test file or an e2e-folder change at this point
    breaks the order above: delete it.
12. **Commit the task folder alone**, on the task branch, as its own commit:
    `docs(<T-ID>): exploration storyboard — <OUTCOME>`. It comes before any e2e commit.

A trace records network traffic (headers, cookies, tokens) and is committed: explore a test
build with test data only.

## Classify a FAIL or BLOCKED

- `product` — the app does something other than the case says. **Bug** is the fix ticket's
  evidence: the problem (not a solution), the failing step numbers, expected (from the case)
  and actual (what you saw).
- `case` — the case itself is wrong or cannot be walked as written.
- `not-built` — the feature is simply not in the app yet. That is not a bug.
- `environment` — the app, its data or the tool failed, not the feature.

## After the exploration commit

- **PASS:** run `lane next <T-ID>`. It reports the storyboard stamp: stop your turn and tell
  your human the storyboard is ready, the human runs `lane approve <T-ID>` after reading it.
  The e2e is the next step, after that stamp; do not start it this turn. Editing the
  storyboard after the stamp reopens it.
- **FAIL or BLOCKED:** stop; never write the e2e, and never present the storyboard for the
  stamp as if it passed. Tell your human the outcome and the classification, then:
  - `product` → propose a dev fix, `lane new fix <slug>`, whose ticket quotes the Bug section
    and links this STORYBOARD.md. Create it only after your human says yes. This task stays
    open; once the fix lands, explore again from step 1 and rewrite this file.
  - `not-built` → say that the source feature has not landed it yet; explore again once it has.
  - `case` → the case needs amending in TEST-CASES.md, which reopens gate 2: that is QA's call.
  - `environment` → fix the environment (never the product), then explore again.

## Red flags

- A step heading reworded, merged or split "for clarity".
- A verdict decided from the code, a log line or a unit test rather than the screen.
- "Pass, but…": a difference written as a note instead of a `fail`.
- A spec, page object or helper script written while exploring.
- A screenshot missing for a step, or a manifest hashed before the last file was written.
- Data a previous run, a seed script or a shared account left behind.
- An e2e started on a FAIL or BLOCKED storyboard, or before the storyboard stamp.

Adapted from the QA pack's storyboard assist (packs/qa, LANE's own), no third-party text.
