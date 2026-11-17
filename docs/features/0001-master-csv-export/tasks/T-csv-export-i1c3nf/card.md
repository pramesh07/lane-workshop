---
approved_by: "Pramesh Karmacharya"
approved_at: "2026-11-17"
approved_sha256: "a09ad03e9d80e806e9aab79305c73005c87c5a23a57fc0d631825536ae80cc85"
---
## Task T-csv-export-i1c3nf — Export failure feedback
**Parent:** story S-0001.03 · feature 0001 (docs/features/0001-master-csv-export/ — its BRIEFING.md + PRD.md + TSD.md)
**Slice:** the board's export action reports failures with a toast, disables itself while a request is in flight, and is keyboard-operable.
**Acceptance criteria:**
- [ ] AC-1 [behavior]: on a server error or network error, an error toast shows the server's `detail` (else "Failed to export tasks"), no file is downloaded, and the board stays usable and unchanged.
- [ ] AC-2 [behavior]: while the request is pending the "Export CSV" action is disabled, a second activation sends no second request, and it re-enables when the request settles.
- [ ] AC-3 [non-functional]: the action is keyboard-focusable, activates with Enter/Space, and has the accessible name "Export CSV".
- [ ] AC-4 [e2e]: with the backend stopped, clicking "Export CSV" in the running app shows the failure toast within 5 seconds and the board stays usable.
**End-to-end AC:** AC-4 [e2e]
**Tests:** AC-1 (tracer bullet), AC-2, AC-3, AC-4
**Test scope:** tests/T-csv-export-i1c3nf/
<!-- approval: written by `lane approve` as frontmatter (approved_by/at/sha256) after a human confirms — never hand-edit -->
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
