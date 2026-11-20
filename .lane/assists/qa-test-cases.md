Project specifics for the QA test cases. The method is the `lane-qa-cases` skill (lane's
`Method:` line names it). This file holds only what differs per project: edit it to match
yours; lane writes it once and never overwrites it.

- **Automated** means an e2e test in the folder TEST-PLAN names (default `e2e/<qa-slug>/`,
  Playwright Test). **Manual** is for what a person has to judge: a visual check, a physical
  device.
- **Priority:** P1 / P2 / P3, P1 being what the plan's exit criteria need.
