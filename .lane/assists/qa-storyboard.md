Project specifics for a QA case: exploring it into STORYBOARD.md, then automating a PASS as
one e2e. The method is the `lane-qa-explore` skill at the storyboard step and the
`lane-qa-e2e` skill at the implement step (lane's `Method:` line names each). This file holds
only what differs per project: edit it to match yours; lane writes it once and never
overwrites it.

- **How the app boots:** the way TEST-PLAN § Environments says, on a test build with test
  data only (a committed trace records network traffic: headers, cookies, tokens).
- **The recording tool:** the Playwright CLI (`npx @playwright/cli`), unless TEST-PLAN names
  another. Evidence goes to `exploration/` beside STORYBOARD.md: one screenshot per step
  (`NN-<what-it-shows>.png`), `trace.zip` and `video.webm`. Open a trace with
  `npx playwright show-trace exploration/trace.zip`.
- **The e2e folder and runner:** `e2e/<qa-slug>/tc-NN-<what>.spec.ts`, Playwright Test.
  One test alone: `npx playwright test e2e/<qa-slug>/tc-NN-<what>.spec.ts`; the whole suite:
  `npx playwright test`.
