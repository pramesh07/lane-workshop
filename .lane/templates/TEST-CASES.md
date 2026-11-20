---
approved_by: ""
approved_at: ""
---
# Test Cases <FEAT> — <title>
> One `## TSD S-<FEAT>.nn — TC-nn: <title>` section per test case, each with its OWN story id
> (S-<FEAT>.01, S-<FEAT>.02, … — never repeated). Each section becomes ONE QA task, and
> `lane start` freezes that section as the task's `snapshot-TSD.md` — the case the exploration
> and the e2e are judged against. Use `###` (never `##`) inside a case: a `##` heading ends the
> section. Black-box only: every expected result is observable through the UI or the public API
> — never through the code's internals. Gate 2 of 3: signing this document makes lane create
> one task per `## TSD` section (Tests: N/A), each waiting on the dev tasks when the test plan
> answered No.

## TSD S-<FEAT>.01 — TC-01: <title>
| Field | Value |
|-------|-------|
| Covers | <source story + AC, e.g. S-0003.01 AC-2> |
| Priority | <P1 / P2 / P3> |
| Automation | <automated / manual> |
| Preconditions / Test data | <state the run sets up for itself> |
| Steps (Given / When / Then) | <Given … / When … / And … / Then … — one clause per step of the exploration storyboard> |
| Expected result | <observable through the UI or API only> |
