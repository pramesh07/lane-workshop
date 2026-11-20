---
name: lane-qa-e2e
description: Use only when lane's output has a Method line naming lane-qa-e2e (a QA task's implement step) — automating a storyboard QA stamped as a PASS as one e2e test, its assertions from the case, never from the build.
---

# lane-qa-e2e — automate what QA confirmed, and nothing the build merely did

Advisory method for a QA task's `implement` step. It enriches `lane next`; it gates nothing.
The output is ONE e2e test for this task's case, committed on the task branch, then
`lane review`. The e2e folder, the runner and its commands are in the step's assist and the
signed TEST-PLAN § Environments. The task is `Tests: N/A`: there is no RED/GREEN ledger, and
the proof is the storyboard, this test and the QA report.

## Check the storyboard is a PASS first

Lane reaches this step only after the human stamped the storyboard. A stamp is not the same
as a PASS, so re-read the committed `STORYBOARD.md` now; do not go from memory:

- its `**Outcome:**` line reads exactly `PASS`;
- every step's `**Verdict:**` is `pass`: none `fail`, none `blocked`;
- every step has its screenshot, and the evidence manifest is filled.

If any of these is false, this is not a PASS: write no test, and tell your human what the
storyboard actually says. Never write the e2e "provisionally" to fix up after a later PASS,
and never keep one written against an exploration that has since failed.

A `manual` case (its card's `Tests:` line says so) gets no e2e at all. Your human runs it by
hand, and the outcome is recorded in the verification report, which still goes through
`lane review` and the human's stamp. So your next move is `lane review <T-ID>` (below), with
no e2e commit.

## Write one test for the case

One spec file for this case, in the e2e folder the assist names, e.g.
`e2e/<qa-slug>/tc-NN-<what>.spec.ts`. It walks the storyboard's steps in order, one test step
per storyboard step, so a reader can lay the two side by side.

- **Assertions come from the case.** Every expected value is taken from `snapshot-TSD.md`:
  its Then clauses and its **Expected result**. Never from a storyboard **Saw** line and
  never from running the build and copying what it showed. A value the case does not state
  is not asserted; a test that asserts what the build happens to do proves nothing.
- **Through the UI or the public API only**, as the case is written: never a database read,
  a log line or an internal call.
- **Black box.** Never open the product's source or its unit tests, to find a selector or
  for anything else. Selectors come from what the storyboard's screenshots and the running
  UI show.
- **User-facing selectors:** role, label, visible text. Not CSS classes, not generated ids.
- **No fixed sleeps.** Wait for what the user would wait for: the element, the message, the
  response.
- **Its own data.** The test creates what the case's preconditions need and does not depend
  on another test, a seed script or a shared account. It runs alone and in any order.
- **No retries to hide a flake.** The plan sets retries to 0: a flake fails loudly and is
  fixed, not absorbed.

## What the task may change

The task folder, test files, page objects and fixtures, and harness config only under the
e2e runner's root. A config change outside that root (a root-level `playwright.config.ts`,
say) is a finding for your human, not an edit. Never product code: not to add a test id, not
to fix a bug the test found, not a one-line tweak. Lane refuses `lane review` and `lane done`
on a branch that touches anything else. A selector you cannot reach without changing the
product is a finding for your human.

## Run it, alone and with the suite

Run the one test alone, then the whole e2e suite, with the commands the assist names. Both
must pass, and you keep their summary lines (command and result): the QA report's Runs table
asks for them.

When the test fails on a build the storyboard showed passing, check the test first: the
selector, the wait, the data. Never loosen or delete an assertion that came from the case to
make it pass. If the app really behaves differently now from what the storyboard recorded,
that is a finding, not a test to adjust: stop and tell your human, who decides whether the
case is explored again.

## Commit the test side

Before you commit, check `git status --short`: only e2e-side files (and nothing outside the
task's allowed paths). Commit them on the task branch as `test(<T-ID>): e2e for TC-nn`. No
product file is ever part of it.

## Then lane review, and the report is someone else's

Run `lane review <T-ID>` and fix anything it refuses. It scaffolds the task's
`verification.md` from the QA report template and names who writes the report: a read-only
reviewer agent, a configured command, or your human. Follow what it prints. You do not write the Conformant / Divergent / Missing body about your
own test: the report on an e2e must come from someone who did not write it.

Then stop your turn. Who ticks the report's checklist follows `critic_mode`, as `lane review`
prints it: under `subagent` the session that resolves the flags ticks each box it verified or
found not applicable, with a note (what it checked, or `N/A — <why>`); under `human` your human
ticks them. Either way the stamp is the human's: your human runs `lane approve <T-ID>`, never
you. If the review raises flags, the resolve-flags step that follows has its own method; a fix
to the test is a new commit, and `lane review` runs again.

## Red flags

- An expected value copied from a **Saw** line or from the running build.
- A test written before the storyboard stamp, or against a FAIL or BLOCKED storyboard.
- A product file in the diff, or a `data-testid` added to the app "just for the test".
- A selector found by reading the product's source instead of the running UI.
- A fixed sleep, a CSS-class selector, or a retry count above 0.
- A test that only passes after another test, or on data it did not create.
- An assertion loosened or removed because the build disagreed with the case.
- The QA report filled in by the session that wrote the test.

Adapted from the QA pack's storyboard assist (packs/qa, LANE's own), no third-party text.
