---
name: lane-breakdown
description: Use only when lane's output has a Method line naming lane-breakdown (LANE's breakdown step) — slicing approved TSD stories into vertical, independently testable task cards with declared dependencies.
---

# lane-breakdown — slice the TSD into cards that each prove a behavior

Advisory method for the `breakdown` step of a master, enhancement or fix. It enriches
`lane next`; it gates nothing. The output is task cards under
`docs/features/<FEAT>-<slug>/tasks/<T-ID>/`: `card.md` (the definition the human stamps)
and `task.yaml` (the registry record). No source code is written here. A patch has one
task that lane creates itself, and `lane new card` refuses on it; this step never runs for
a patch.

## Read first

The approved `TSD.md` (every `## TSD S-…` section) and the `PRD.md` or `TICKET.md` behind
it, plus the code the stories extend. A card slices what the TSD already specified: a
design question you meet is for the human, not for the card to settle.

## Slice vertically, one tracer bullet at a time

A card is a complete, observable behavior through every layer it touches, with its own
tests: schema, logic, interface and wiring together, so a person or caller can see it work.
Ask of each card: could I demo it alone? If the answer is "only after the next card", it is
a layer, not a slice.

- Reject horizontal layers ("build the data model", "all the endpoints", "the UI"). They
  have no behavior an AC can assert, so their tests would assert the tool, not the product.
- One card is one PR. If it needs many ACs, or spans two independent subsystems, split it
  into two slices that each still deliver something observable.
- Default to one card per TSD story (the step's hint says so). A story too big for one PR
  becomes several cards citing the same story, each a slice of it.
- Put the thinnest end-to-end path first: it is the tracer bullet that tells the team the
  layers connect. Risky or unknown work goes early so it fails while it is cheap.
- A wide mechanical change (a rename or retype that touches the whole codebase) cannot
  land as one slice. Sequence it: a card that adds the new form beside the old, migration
  cards blocked by it, and a final card blocked by all of them that removes the old form.
  Those cards add no behavior: propose `Tests: refactor — <what stays green>`, the anchor
  that must already pass at `lane red`, and let the human judge (see ceremony below).

## Cite the story and the AC

Every card names its TSD story and the PRD acceptance criteria it delivers:

- `lane new card --story S-NNNN.nn` anchors the card to the TSD section the Critic will
  read. It checks the section exists and refuses otherwise.
- Rewrite the card's `Parent:` line with the real story ID (the scaffold leaves a
  `S-…nn` stand-in) and end each AC with the PRD AC it serves, e.g. `(PRD S-0001.01 AC-2)`.
- ACs are observable outcomes through an interface, tagged `behavior`, `invariant`,
  `non-functional` or `e2e`. Behavior and e2e ACs seed the behavior spec; the card needs an
  `e2e` AC reachable through the running system. Never write "calls X" or "saves to table Y".
- Before you hand over, check coverage both ways: every TSD story has a card, and every PRD
  AC lands in some card's ACs. Report any gap to the human rather than inventing a card.

## Declare dependencies

A blocking edge is a card that must be done before this one can start. Write it in the
card's `task.yaml` as `depends_on: [T-a, T-b]`, a list of task IDs. It is the one field you
set by hand there; lane fills `task_id`, `seq`, `status`, `parent` and `story`.

lane has no command that records dependencies, so your `depends_on` edit sits uncommitted
in the working tree. Make these edits once the cards exist and before the human approves
the cards, so the human sees one tidy set of changes. Then say this plainly to the human:

- The edges take effect only for `lane start` and `lane ready` on this checkout. `lane land`,
  the task branch and teammates see only committed state, so they will not see them.
- A dirty `task.yaml` can block `lane start`.
- They should commit the `task.yaml` edits themselves, together with the approved cards,
  before starting any task. Do not do it for them.

- Add an edge only when the later card truly cannot start without the earlier one's
  behavior in its base. Everything else stays free to run in parallel; do not chain cards
  just to give them an order.
- A dependency counts as satisfied only once that card is merged into the base. `lane start`
  refuses a card whose blockers are not, and a cycle is refused, so keep the graph acyclic.
- Task IDs are global: they name the branch and worktree. Omit the ID so `lane new card`
  allocates `T-<feature-slug>-<random>`; it refuses one another feature already uses. The
  suffix is random, so create blockers first to learn the ID the dependent card names.
- `lane ready` lists what can start; the dependency shape should leave something startable.

## Call out ceremony, never decide it

`Tests: N/A — <reason>` opts a card out of the red/green ledger. Propose it only where
there is no behavior to assert: project scaffolding, config, a spike. Doubt means it is a
test; a refactor declares `Tests: refactor — <what stays green>`. Philosophy 2b explains.

- Put the proposal in front of the human with its reason; the human ratifies it at the card
  gate or rejects it, and the digest shows the line they sign.
- A bare `N/A` with no reason is refused outright, so always give the reason.
- With no committed test runner yet, lane routes a red-green card to the bootstrap step.
  Propose a first `Tests: N/A — bootstrap` scaffold card that commits the toolchain.

## Propose, then scaffold

`lane new card` writes the files and records the scaffold itself, so confirm the plan first.
Show the human a short list: per card the title, its story, what it blocks on, what
observable behavior it delivers and its `Tests:` line. Ask whether the granularity and the
edges are right, adjust, and only then run `lane new card --story …` for each card (`lane use <FEAT-NUM>`
first when no feature is in context). Apply the project's breakdown assist too when `lane next` names one.

## Replace every template placeholder

LANE reads a card that still carries a template token as unfilled. In each `card.md`
replace the heading's `<title>`, the AC prompt `<observable outcome through interface>`,
the e2e line's `<n>`, and the `Parent:` stand-in; fill or delete empty bullets. List real
AC IDs in the `Tests:` line, first the tracer bullet. Run `lane next`: it must stop saying
cards are still template scaffolds before you tell the human they are ready. Never touch
the stamp fields lane writes; editing an approved card reopens its gate.

## Stop at the gate

Read the cards back against the TSD and PRD. Then stop your turn, tell the human they are
ready, and hand the gate to your human, who runs `lane approve`; it stamps each card, and
refuses cards still template and N/A cards without a reason. Do not run it for them and do
not start any task in the same turn. A card added after this gate needs its own stamp.

## Red flags

- A card named for a layer, or one whose tests would only check wiring.
- A card with no story, no PRD AC, or no `e2e` AC (an N/A scaffold card is exempt).
- A dependency added for tidiness, a cycle, or a hand-picked task ID.
- `Tests: N/A` chosen silently, given no reason, or used to skip a hard test.
- Cards that quietly add scope the TSD does not carry.
- Cards for stories that were never approved, or a card made on a patch.

Adapted from mattpocock/skills (to-tickets) and addyosmani/agent-skills (planning-and-task-breakdown), MIT — see .lane/THIRD_PARTY_NOTICES.md.
