---
name: lane-tsd
description: Use only when lane's output has a Method line naming lane-tsd (LANE's draft-tsd or draft-spec step) — turning each approved PRD story into a testable technical spec in TSD.md (or the TSD section of a patch SPEC.md).
---

# lane-tsd — specify the behavior and the contracts, nothing else

Advisory method for the `draft-tsd` and `draft-spec` steps. It enriches `lane next`; it
gates nothing. For master, enhancement and fix the only output is
`docs/features/<FEAT>-<slug>/TSD.md`: no code, task cards or plan yet. A patch is different;
see "Patch kind". The Critic later reads this spec as its frozen anchor, so write what a test
can check and leave the how to the implementer. Approval is the human's.

## Ground it before you write

Read the approved `PRD.md` (a fix: `TICKET.md`; a patch: the ticket facts in `SPEC.md`),
then `docs/context/BLUEPRINT.md`, `CONSTITUTION.md` and `PRODUCT.md`. They hold the
architecture, stack and hard rules; the TSD conforms to them and invents no rival design.
Read the code the story extends too, and match its conventions.

- `lane fold status` reports each context doc as absent, stub or filled. The TSD gate
  refuses approval while any is a stub or absent, so `lane next` sends you to
  `hydrate-context` first: run `lane hydrate`, and the human reviews what it drafts.
- A story that needs what the context docs do not cover (a new container, a new external
  service, a contradicted rule) is not yours to decide silently. Tell the human: it is a
  context-doc change first, or an ADR they choose to write.

## One section per story, in the template's exact shape

Copy the heading shape from `.lane/templates/TSD.md` (a patch: `PATCH-SPEC.md`):
`## TSD S-<FEAT>.NN — <title>  (PRD §S-<FEAT>.NN)`, with the story ID matching the PRD
character for character. LANE parses these headings to find the folder and to freeze the
per-task snapshot the Critic reads, and it cuts a section at the next `## ` line.

- One section per PRD story, same order; never renumber, merge or split stories.
- Inside a section use the table and bold lines only; a stray `## ` heading ends it early.
- Keep the template's table rows. A patch has no Access row; put access rules under Interfaces or
  Behavior there.
- A patch is one story with at most about three behaviors. A second `## TSD` section means it has
  outgrown a patch: tell the human, who decides between `lane new fix` and `lane new enhancement`.

## What each facet carries

Behavior and contracts only. Never name a library, framework, method or pattern; that is
over-spec and it blinds the Critic to alternatives that would also satisfy the story.

- **Interfaces:** contracts the story exposes or consumes — signatures, inputs, outputs,
  error modes, ordering and idempotency expectations. Define the contract before the
  behavior. Prefer adding to an existing interface over changing it, and say what current
  callers must keep seeing, because anything observable becomes a promise.
- **Data / State:** what persists or is held, its shape, compatibility with existing data;
  `none` when the story touches none.
- **Behavior:** the observable outcomes. Cover every PRD AC of the story, then the unhappy
  paths: invalid input, a denied caller, a failing boundary. Use numbers, states and
  messages a test can compare, and the error shape existing interfaces already use.
- **Access:** who or what may invoke it, and what is refused. `N/A` only when truly open.
- **Boundaries:** external things we do not own — network, clock, randomness, filesystem,
  another team's service — named as a *what* ("external mail provider"), never a vendor
  SDK. They are injected as ports and faked in unit and integration tests.
- **Tests:** which logic is unit-tested, which flows are integration-tested, and the smoke
  test. Smoke is required whenever Boundaries is non-empty: it exercises the real
  boundary in a realistic setting. Every PRD AC maps to at least one test named here.

## Keep interfaces deep

Aim for a small surface in front of hidden complexity: a caller learns little, gets a lot.

- Fewer entry points, parameters and modes. If callers need a paragraph on the order to
  use things in, the interface is too wide.
- Hide choices the caller has no business making. Validate once at the edge.
- An interface nearly as complicated as what sits behind it is shallow: merge it into a
  neighbour or push detail inside, and write the simpler one into the spec.
- Keep seams where the Boundaries row puts them, so tests can fake them there.

## Security pass, per story

Ask these of every story and put the answers in the facets that own them, with no extra
row. A story with no new exposure says so in Access ("no new trust boundary").

- **Input trust:** where does untrusted data enter — a request, file, webhook, third-party
  reply, tool or model output, environment value? What is accepted, what is rejected, and
  what does the caller see on rejection? Data from a boundary we do not own is untrusted.
- **Authz:** authenticated is not authorized. May *this* caller act on *this* resource?
  State the refusal behavior and give it a test; one misuse case per story is a good start.
- **Secrets:** credentials come from configuration, never the spec or code, and are never
  logged or echoed back. Name where the story reads them from.
- **PII:** which personal data is read, stored, shown or logged. Collect the least, and
  state any audit or retention rule CONSTITUTION.md sets.
- A new login flow, a new category of sensitive data, or a new external integration is the
  human's call. Raise it before you write it down as settled.

## Say what is out of scope

Under each story's table add one `**Out of scope:**` line (inside the section, so it freezes
with the snapshot): what a reader could reasonably expect that this story does not specify
or build, carrying over the PRD's non-goals. If it is truly empty, write `nothing beyond
the PRD non-goals`. Leave out generic scalability or performance essays; state a number
only where a PRD AC has one.

## Patch kind (`draft-spec`)

A patch has no separate PRD, TSD, card or plan: `SPEC.md` is all of them under one stamp, and
`draft-spec` fills the whole file, in this order, consistent with one another:
- the ticket facts: Current behavior, Expected behavior, Must NOT change. Severity, Source and any
  fact you cannot verify come from the human; ask, do not guess;
- the `## TSD` section, written as above;
- the `## Task` section: one card whose ACs map to the TSD behaviors, with its `Tests:` line (or a
  `Tests: N/A — <reason>` the human must ratify at the stamp);
- the `## Execution Plan`: behaviors in TDD order, approach, boundaries, open questions. Number only
  real RED→GREEN cycles, B-1..B-N contiguous; label a guard or invariant check G-1, G-2 …, never B-.
  A patch plan has no `planned_behaviors`: lane counts the highest B-number as the cycle count.
- Once the SPEC is complete, spawn both reviewers (as below), paths only: `lane-tsd-reviewer` gets
  the `## TSD` section, ticket facts and context docs; `lane-plan-reviewer` gets the
  `## Execution Plan` with its `## TSD` section and `## Task` card.

## Replace every template placeholder

LANE reads a line that still carries a template token as unfilled, and the step will not
advance. Replace all of them: the heading's `<feature title>` (a patch: `<short title>`), each
`<FEAT>` and `<title>`, and each table row's guidance text, with that story's spec. In a patch
SPEC do the same for every section; `lane new patch` already filled `<FEAT>` and `<T-ID>`.
Delete empty bullets and unused example rows. Then run `lane next`: it must stop saying the
file (a patch: the SPEC) is still template before you tell the human it is ready. Never touch
the frontmatter stamp fields; lane alone writes them, and editing after approval reopens the
gate.

## Review before the gate

Once `lane next` no longer calls the draft template, spawn `lane-tsd-reviewer` once, if installed.
Give it file paths only, never your reasoning: the TSD, the approved PRD (a fix: TICKET.md) and the
three context docs. Fix what you agree with; findings never go into the TSD. Re-run it only after
the human asks for changes, never to check your own fixes. "No gaps found" is not approval: the
human's stamp is the outside check. Your hand-off says what it flagged, what changed, and what you left alone and why.

## Stop at the gate

Read it back story by story (interfaces, behavior, boundaries, the security answers, the
out-of-scope lines, open questions) and fold in corrections. Then stop your turn and tell your human
it is ready; the human runs `lane approve` (a patch: one stamp over the whole SPEC). Do not run it
for them. Outside a patch, start no task cards this turn: `lane next` moves on only after the stamp.

## Red flags

- A PRD AC with no behavior or test, an invented story ID, or Boundaries with no smoke test.
- Authorization described as "logged-in users" only; secrets or personal data unmentioned.
- A named library, class or method in the spec, or a component the BLUEPRINT lacks decided silently.
- A stray `## ` heading inside a story section, or a template token left in the file.
- An ADR or a scalability plan in the file, or (outside a patch) a task breakdown.

Adapted from addyosmani/agent-skills (api-and-interface-design, security-and-hardening), mattpocock/skills (codebase-design) and affaan-m/ecc (architect), MIT — see .lane/THIRD_PARTY_NOTICES.md.
