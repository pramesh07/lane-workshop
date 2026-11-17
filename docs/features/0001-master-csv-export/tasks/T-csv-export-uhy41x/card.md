---
approved_by: "Pramesh Karmacharya"
approved_at: "2026-11-17"
approved_sha256: "892b404b46963c5abd609e8b22cae616984110f75c253ceede3d58fe525cdf04"
---
## Task T-csv-export-uhy41x — Safe, lossless CSV cell contents
**Parent:** story S-0001.02 · feature 0001 (docs/features/0001-master-csv-export/ — its BRIEFING.md + PRD.md + TSD.md)
**Slice:** every cell of every exported row passes through one escaping rule, verified through the endpoint with the PRD's 12 fixture cases.
**Acceptance criteria:**
- [ ] AC-1 [behavior]: titles and descriptions with commas, double quotes, or CR/LF round-trip through a standard CSV reader to the original text.
- [ ] AC-2 [behavior]: a text value starting with `=`, `+`, `-` or `@` is exported with a single leading `'`; a trigger character not in first position is unchanged; a value needing both the `'` and quoting gets both.
- [ ] AC-3 [behavior]: an absent description exports as an empty cell, never `None` or `null`.
- [ ] AC-4 [behavior]: non-ASCII text such as `Café 任务` survives byte-for-byte as UTF-8.
- [ ] AC-5 [invariant]: no column bypasses the escaping — a trigger value placed in any text column is guarded.
- [ ] AC-6 [e2e]: a task titled `=HYPERLINK("http://example.com")` created in the UI, exported and opened in a spreadsheet shows as literal text (manual smoke accepted).
**End-to-end AC:** AC-6 [e2e]
**Tests:** AC-1 (tracer bullet), AC-2, AC-3, AC-4, AC-5, AC-6
**Test scope:** tests/T-csv-export-uhy41x/
<!-- approval: written by `lane approve` as frontmatter (approved_by/at/sha256) after a human confirms — never hand-edit -->
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
