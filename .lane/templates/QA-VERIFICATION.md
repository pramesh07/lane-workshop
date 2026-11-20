## Verification — Task <T-ID> — <date>
> The QA report of one case — the task's only stamp. `lane review` writes it from this template
> (the qa kind names it) and fills the `<T-ID>`/`<date>` above; every other token here is yours.
> The QA Critic (`lane-qa-critic`) reads the e2e TEST and the storyboard against the frozen case
> (`snapshot-TSD.md`) — not against the product code. Who ticks the checklist follows
> `critic_mode`: under `subagent` the session ticks each box it verified or found not applicable,
> with an indented note (what it checked, or `N/A — <why>`); under `human` the human ticks.
> ★GATE: the human runs `lane approve <T-ID>`. The stamp hashes this report, and this report
> names the storyboard's sha256, so the stamp binds the storyboard and its evidence too.

**Case:** S-NNNN.nn — TC-nn: case title
**Storyboard:** `STORYBOARD.md` — Outcome PASS — sha256 64-hex (the `approved_sha256` lane wrote into STORYBOARD.md's frontmatter at the storyboard stamp, copied from there)
**Test:** `e2e/…/tc-nn-….spec.ts`

✅ **Conformant:** each step and expected result of the case, and where the test asserts it
- Step 1 — … → `spec line N`

⚠️ **Divergent:** the test asserts something other than the case says + severity (shallow/deep)
- none

❌ **Missing:** a step or expected result of the case the test does not assert
- none

**Runs:**
| Run | Command | Result |
|-----|---------|--------|
| this test alone | `…` | `N passed` |
| whole e2e suite | `…` | `N passed` |

**Reviewer checklist:** (ticked per `critic_mode` — `lane approve` refuses while one is open)
- [ ] The storyboard reads Outcome PASS, every step heading is the case's clause verbatim, every step has a verdict and a screenshot
- [ ] The storyboard sha256 above is the `approved_sha256` in the committed `STORYBOARD.md`'s frontmatter, and its evidence manifest matches the files in `exploration/`
- [ ] Every expected result of the case is asserted — through the UI or the public API only
- [ ] The test walks the storyboard's steps, and every asserted value comes from the CASE — never from a storyboard "Saw" line
- [ ] The test sets up its own data (no hand-made state, no other test's leftovers)
- [ ] No product code changed — test files, page objects, fixtures, harness config only
- [ ] No fixed sleeps; selectors are user-facing (role, label, text)
- [ ] The test passes alone AND with the whole e2e suite

**Human verdict:** the lane approve stamp records who signed
**Outcome:** clean → `lane done`, CI, land | divergence → fix the test, re-run `lane review` | the case is wrong → amend TEST-CASES.md (gate 2 reopens)
