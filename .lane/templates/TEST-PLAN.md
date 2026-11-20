---
approved_by: ""
approved_at: ""
---
# Test Plan <FEAT> — <title>
**Source PRD:** <SOURCE:prd>
**Source TSD:** <SOURCE:tsd>

**Is the feature already built?** (tick exactly one)
- [ ] No — the dev team will build it (each QA task waits for the dev tasks to land)
- [ ] Yes — it is already on trunk (QA explores now)
**Answer:** <No or Yes>

> The QA track of an approved dev feature. Written FROM the PRD, never from the code: the tests
> this plan leads to are a second, independent check of what the developers build. `lane new --for`
> wrote the Source lines above and they are part of what you sign — amending the source PRD or TSD
> later reopens this gate. The answer decides when each case may start: No makes every case wait
> for the dev tasks to land; Yes is refused while the source still has open tasks.
> Gate 1 of 3 (test plan → test cases → per case: the QA report).

## Scope
**In:** <the PRD stories and flows this plan covers>
**Out:** <what is deliberately not tested here, and why>

## Stories under test
| Story | Acceptance criteria covered | Notes |
|-------|-----------------------------|-------|
| <S-NNNN.nn> | <AC-1, AC-2 …> | <risk, dependency, open question> |

## Test types
<which of: functional e2e · negative / boundary · accessibility · cross-browser · smoke — and what each covers>

## Environments and test data
<where the app runs for exploration and e2e (base URL, how it boots), browsers, seed data, accounts — all created by the run itself, never by hand>

## Entry and exit criteria
**Entry:** <what must be true before a case is explored — e.g. the PRD stamp, the dev tasks landed, the e2e harness on trunk>
**Exit:** <what "QA done" means — e.g. every P1 case explored PASS, its e2e green in CI, no open defect>

## Risks
<what could make these tests lie: flaky selectors, shared state, timing, third-party services — and the mitigation>

## Automation strategy
<which cases are automated (e2e) and which stay manual; retries: 0 so a flake fails loudly>
