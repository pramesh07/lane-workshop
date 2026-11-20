---
name: lane-tdd
description: Use only when lane's output has a Method line naming lane-tdd (LANE's write-test or write-impl step) — test-first discipline for the RED→GREEN→REFACTOR cycle, where lane red / lane green / lane refactor make every commit.
---

# lane-tdd — test first, and let lane prove it

Advisory method for the TDD steps of a LANE task. It enriches `lane next`; it gates
nothing. The only gates are the human stamps, and the only commit paths are
`lane red`, `lane green` and `lane refactor`.

## The iron law

```
NO IMPLEMENTATION WITHOUT A FAILING TEST FIRST
```

Wrote implementation before the test? Do not keep it "as reference" and do not adapt it
while writing the test. Set it aside, write the test from the behavior spec, and build
the code fresh from the failure. LANE does not take your word that the test came first:
the ledger replays it, so the order is checked either way. Cheating only costs you the
rework.

## One behavior at a time

Work in vertical slices: one behavior from the exec plan, one test, one minimal
implementation, then the next. Never write every test up front and then every
implementation — bulk tests verify an imagined shape, and each cycle should teach the next.

A good test:

- asserts observable behavior through the public interface the TSD names, so it survives
  a refactor;
- takes its expected value from the spec or a worked example, never by recomputing it the
  way the code will (that passes by construction and can never disagree with the code);
- does not mock internal collaborators, and does not assert on a mock instead of the product;
- covers one thing, with a name that reads as the behavior.

## RED — watch it fail

1. Write one test for the next behavior.
2. Run `lane red <T-ID>`. lane commits the test and records the failure.

A RED only has to NOT PASS. A failed assertion is valid. So is a test that cannot even
load because the code does not exist yet (an import or compile error) — that means the
behavior is absent, which is exactly what RED claims. **Do not stub the module just to
dodge the error**; write the test against the code you are about to build and let it fail.

Read the failure. It must fail for the reason you expect (feature missing), not a typo in
the test. A test that passes at RED is refused: it proves nothing was built. To fix your
own wrong test, edit it and run `lane red` again — the ledger anchors to the last RED.

## GREEN — minimal code

Write the simplest implementation that makes this one test pass. No extra options, no
neighbouring cleanup, nothing the test does not demand.

- Leave the implementation files **uncommitted**. `lane green <T-ID>` commits them, with a
  printed manifest. lane makes the commit; never commit source by hand — a plain source
  commit is caught by the coverage audit at the next checkpoint.
- The implementation flips the test, never the reverse. `lane green` refuses a test that
  was edited since its RED. If the test really was wrong, restore the anchor text or run
  `lane red` again; do not bend the test to fit the code.
- If other tests broke, fix the code now. Run the project's whole suite before you report
  anything done, and name every failure it shows, including ones you did not cause.

## REFACTOR — only on green

With everything passing, remove duplication, improve names, extract helpers. Add no
behavior. Run `lane refactor <T-ID>`; it refuses if any test file changed (rename and
delete count). Cleanup that needs a test change is a new behavior: go back to RED.

## Hermetic tests

`lane verify` replays the ledger in a fresh worktree, like a teammate's clone. A test must
pass given only `setup_cmd` and `replay_env` from `lane.config`. If it leans on your shell
env, a seeded database, a running service, or the network, it passes at GREEN and fails
the replay. `lane red` re-runs the test against the committed state alone, so a missing
dependency surfaces at the checkpoint.

## Stuck?

| Problem | Move |
|---|---|
| Unsure how to test it | Write the call you wish existed, then the assertion, then build toward it. |
| Test needs elaborate setup | The interface is too wide. Simplify the design, not the assertion. |
| Must mock everything | The code is too coupled. Inject the dependency. |
| A bug turned up | Reproduce it as a failing test first (`lane red`), then fix it (`lane green`). |

## Not for `Tests: N/A` tasks

A card that opted out with `**Tests:** N/A — <reason>` has no ledger: `lane red`,
`lane green` and `lane refactor` refuse it, and `lane next` routes it to `implement`
instead of here. Do not use this skill there. If you think a card is ceremony, say so to
the human — the opt-out is theirs to ratify.

Adapted from obra/superpowers (test-driven-development) and mattpocock/skills (tdd), MIT — see .lane/THIRD_PARTY_NOTICES.md.
