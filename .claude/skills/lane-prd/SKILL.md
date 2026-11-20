---
name: lane-prd
description: Use only when lane's output has a Method line naming lane-prd (LANE's draft-prd or draft-ticket step) — writing user-outcome stories with testable acceptance criteria into PRD.md (or TICKET.md for a fix).
---

# lane-prd — say what users get, in terms a test can check

Advisory method for the `draft-prd` and `draft-ticket` steps. It enriches `lane next`; it
gates nothing. The only output is `docs/features/<FEAT>-<slug>/PRD.md` (or `TICKET.md`
for a fix), filled in the template's own shape. No code, no design, no task list is
written at this step. Approval is the human's: they run the stamp command, and a
hand-typed stamp does not count.

## Pick the right template

| `lane next` says | Kind | Input | Template |
|---|---|---|---|
| draft-prd, after an approved briefing | master | the approved `BRIEFING.md`; trace the PRD back to it on the Source line | `.lane/templates/PRD.md` |
| draft-prd, no briefing | enhancement | roadmap milestone or real-usage feedback; usually one story | `.lane/templates/PRD-MINI.md` |
| draft-ticket | fix | the known defect; no PRD exists for a fix | `TICKET.md`, scaffolded by `lane new fix` |

Read the input and `docs/context/PRODUCT.md` before writing. Scope is grounded there: what the
product is, who uses it, what it deliberately does not do. A story outside that boundary is
a product change to raise with the human. If `lane fold status` reports PRODUCT.md as a
stub, say so and proceed: on a greenfield repo the approved PRD is what first defines the
product (philosophy section 8), and a stub is not "no rules". For a master PRD, read the
approved BRIEFING's Open questions before drafting; its template says they are resolved
before the PRD, so raise any still open with the human.

## Surface assumptions first

Before writing, list in a few lines what you are assuming that the input does not say: who
the user is, what already exists, what counts as done. Put it to the human and let them
correct it. A guess that reaches the PRD becomes everything downstream. If nobody is
there to ask, write the assumption as a visible line in the document so the human can
strike it, never as a silent fact.

## A story is a user outcome

`As a <user> I want <capability> so that <value>.` The `so that` is the point: if you
cannot name who benefits and how they would notice, the story is a task in disguise.

- State what a person can do or see afterwards, not what the system does. "Admins can
  export the audit log" is a story; "add an export endpoint" is an implementation.
- One story, one outcome. A story with "and" in the capability is two stories.
- Keep the heading exactly as the template does, one per story: `## Story S-<FEAT>.NN — <title>`,
  with `<FEAT>` the feature number and `NN` counting from `01`. The TSD, the task cards and
  the Critic all anchor to these IDs, so never renumber a story once it is stamped.
- If the request bundles independent capabilities, tell the human instead of stuffing them in.

## Acceptance criteria a test can fail

Each AC is observable through an interface the user or caller has, and tagged as the template
lists: `behavior`, `invariant`, `non-functional` or `e2e`.

- Observable: write what you would see, not what the code does. "Calls X" and "writes row
  Y" describe a mechanism; the TSD owns those.
- Specific: a number, a message, a state. "Fast", "intuitive" and "handles errors well"
  cannot fail; "the list appears within 500 ms for 1,000 rows" can.
- Include the unhappy paths that matter: empty input, a denied user, a failure.
- Every story needs at least one `e2e` AC, reachable by a real user through the running system.
- Vague ask? Reframe it before you write it: "make it faster" becomes a target a stopwatch
  can check, and you confirm the target with the human.

## Success metrics must be falsifiable

The metric is how the team will know the story worked after release, and it must be able
to come out false. Name what is measured, where, against what number, by when: "at least
60 percent of new accounts finish setup in one session within 30 days". "Users are happy" is
not a metric. A metric no one can collect is a wish; say so and pick one that can be read.
PRD-MINI allows one line; the line must still be falsifiable.

## Non-goals

Add a short `**Non-goals:**` line or list above the first story, using plain bullets. It is
not in the template, and it is the cheapest protection against scope creep. Name what a
reader might reasonably expect but this feature will not do, and why: a different user,
a later milestone, an existing tool. Silent disagreement about what is not being built
is half of all misalignment.

## TICKET.md (fix)

A fix has no PRD; the question is only how to repair what is already wrong. Fill the
template's fields with what you can verify:

- **Current behavior:** the scenario that triggers the defect, in detail. An error message
  alone is not a scenario.
- **Reproduction:** numbered steps another person can run. If you cannot reproduce it, say
  so; do not invent steps.
- **Expected behavior:** what should happen instead, stated as an outcome.
- **Must NOT change:** the neighbouring behavior and contracts that must stay intact.
- Severity and Source are the human's facts; ask when you do not have them.
- Acceptance criteria prove the fix, with at least one `e2e`. If the fix needs a design
  change, the template says write an ADR first; flag that to the human.

## Replace every template placeholder

LANE reads a line that still carries a template token as unfilled. Replace all of them:

- the heading's `<feature title>`, `<enhancement title>` or `<short title>`;
- `<FEAT>` wherever it survives (hand-copied PRDs keep it; `lane new` scaffolds fill it);
- `<M>`, `<NNNN …>`, `<user>`, `<capability>`, `<value>`, and each AC and metric prompt;
- `Parent:` is optional: write the number, or remove the whole token (a master leaves it blank).

Delete stand-in stories and empty bullets you do not use. Then run `lane next`: it must
no longer say the file is still template before you tell the human it is ready. Never
touch the frontmatter stamp fields. They are written only by lane, and editing the file
after approval reopens the gate.

## Stop at the gate

Read it back: each outcome, the ACs, the metric, the non-goals, any assumption left in the
text. Ask whether it says what they want and fold in corrections. Then stop your turn. Tell the human it is ready for approval and hand the gate to your
human, who runs `lane approve`. Do not run it for them, and do not begin the TSD in the same
turn: `lane next` moves on only after the stamp.

## Red flags

- A story with no "so that", or a capability that is really a technology choice.
- An AC that mentions a function, table or endpoint instead of what the user sees.
- A story without an `e2e` AC, or a metric no measurement could disprove.
- No non-goals, or a ticket whose Reproduction is a guess.
- Design, a task list or code in the document, or any file written beyond PRD.md or TICKET.md.
- "Looks fine" or silence treated as the human's approval.

Adapted from addyosmani/agent-skills (spec-driven-development), MIT — see .lane/THIRD_PARTY_NOTICES.md.
