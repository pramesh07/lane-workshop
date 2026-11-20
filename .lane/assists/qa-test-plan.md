Project specifics for the QA test plan. The method is the `lane-qa-plan` skill (lane's
`Method:` line names it). This file holds only what differs per project: edit it to match
yours; lane writes it once and never overwrites it.

- **How the app boots** for exploration and for the e2e: the project's own dev or preview
  command (see its README), on a test build with test data only. Put the command and the
  base URL in TEST-PLAN § Environments and test data.
- **The e2e folder and runner:** `e2e/<qa-slug>/`, run with Playwright Test
  (`npx playwright test`).
- **The recording tool** for exploration: the Playwright CLI (`npx @playwright/cli`), which
  records a trace and a video.
