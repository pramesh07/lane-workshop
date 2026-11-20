---
name: lane-plan
description: Use only when lane's output has a Method line naming lane-plan (LANE's draft-plan step) — writing exec-plan.md as small, TDD-ordered behaviors with exact files, then challenging it before the human approves.
---

# lane-plan — a plan the TDD loop can execute one behavior at a time

Advisory method for the `draft-plan` step. It enriches `lane next`; it gates nothing. The
output is `exec-plan.md` in the claimed task worktree (`lane start` scaffolded it at
`docs/features/<FEAT>/tasks/<T-ID>/`). No source or test code is written here, and the
plan waits for your human's approval.

A patch has no draft-plan step: `lane start` copies the plan out of the approved SPEC's
`## Execution Plan` section and carries the SPEC's stamp, so write that section while drafting
the SPEC. Editing the copied plan reopens its gate. Only when the SPEC had no usable plan
section does lane scaffold a blank plan, which then needs a stamp of its own.

## Read first

- `card.md`: the ACs and the `Tests:` line, tracer bullet first.
- `snapshot-TSD.md`: the TSD story frozen at `lane start`. It is the Critic's anchor and the
  contract, so you plan against it and never edit it. If it is silent or wrong on something
  the plan needs, that is a question for the human, not a decision for the plan.
- `behavior-spec.md`: lane seeds its B-N headings from the card's behavior and e2e ACs.
  Your B-N should line up with them. It is a starting point, so split or add as the plan needs.
- The code the behaviors will touch. Look facts up yourself; do not ask the human for them.

## Behaviors: B-1 through B-N

The plan's core is the **Behaviors (TDD order)** list. Each entry is one RED→GREEN cycle:

- one observable behavior, stated as an outcome through the interface the TSD names;
- its test: the file and a test name that reads as the behavior, plus what it asserts, with
  the expected value taken from the TSD or a worked example, never recomputed by the code;
- its exact files: the source files it will create or change and the test file, by path.

A behavior that needs two unrelated assertions is two behaviors. A behavior too small to
earn its own failing test (a rename, a constant) folds into the one that needs it.

**B-1 is a tracer bullet**: the thinnest path through every layer the story touches, so the
layers are proven to connect before anything is widened. Put risky or unknown work early,
while a surprise is cheap. Include the card's `e2e` behavior in the list.

## Order for TDD

lane-tdd runs the list top to bottom, one `lane red` then `lane green` per entry, so the order
is part of the plan:

- Each B-N must be able to fail on its own, using only what B-1..B-(N-1) already built.
  If B-3 cannot be tested until B-5 exists, swap them.
- Each B-N adds a small step of behavior, so its GREEN is minimal code.
- A behavior existing code already satisfies cannot go RED, so it is not a cycle. Plan it
  as a regression guard (recorded off-ledger with `lane red --regression`) and leave it out
  of the count.
- ACs tagged `invariant` or `non-functional` are not cycles either. Say which behavior they
  hold as a property of, or which guard or out-of-band check covers them.

## Set `planned_behaviors`

The plan's frontmatter has `planned_behaviors`. Set it to N, the number of RED→GREEN cycles.
That is the count `lane next` reads to know when the loop is finished.

- Left empty, lane falls back to the highest `B-N` label anywhere in the prose. That guesses
  high whenever the plan mentions a behavior that never takes a cycle, and `lane next` then
  keeps asking for a test that will not come.
- Count only real cycles, never guards. Label a guard G-n, never B-. Rewrite the template's
  "then B-2, B-3 …" Behaviors line so no `B-` number above N remains anywhere in the prose.
- Change only that field. The stamp fields in that frontmatter are lane's alone. Frontmatter edits
  need no re-approval, while an edit to the body does.
- A `Tests: N/A` card has no ledger and no cycles. List its work steps and the check the
  human will read, and skip `planned_behaviors`.

## Cover the TSD

Under **Will build**, map each AC to the B-N that delivers it, and check three ways:

- every behavior the TSD story specifies for this card, including its error cases and
  boundary rules, lands in at least one B-N;
- every B-N traces back to an AC or a TSD line, so no behavior is quietly added;
- **Boundaries & mocks** comes from the TSD: what is faked is an injected port, and when
  boundaries exist, name the smoke AC that hits the real one.

If the TSD leaves a hole, write it under **Open questions** and ask the human. Resolve
every open question before you hand the plan over. Put each as a numbered question with
your recommended answer worded so that "yes" accepts it, and ask the open ones together.

## Keep it small and exact

A plan is the set of decisions an implementer cannot make alone: files, names, signatures,
the test, the values the spec pins. **Approach** stays high level. Do not write function
bodies or implementation prescriptions; a plan longer than the code it describes has
written the code. "TBD", "handle edge cases" and "write tests for the above" decide
nothing, so replace each with the actual file, case or assertion. Fill **Path** (L, unless
two or more escalation signals hit, then R; overriding R to L needs the risk acknowledged
in the plan) and **PR will contain** with real paths.

## Self-grill before handing over

Challenge the draft as a skeptical reviewer would, and fix what you find:

- **Gaps:** which AC or TSD line has no behavior? Which behavior has no AC?
- **Ordering:** walk the list. Could each B-N go RED using only the earlier ones?
- **Untestable:** can every behavior fail by an assertion on observable output? One that
  can only be tested by mocking an internal collaborator needs redesign, or a question to
  the human about whether it is ceremony.
- **Size:** is any entry really two behaviors, or any pair really one?
- **Proportion:** is the plan several times longer than the TSD story? Cut it.

## Replace every template placeholder

LANE reads a plan that still looks like its scaffold as unfinished. Replace every `<…>`
token, fill or delete each empty `-` bullet, and pick one option on the `Path:` line. Leave
the `>` guidance lines and the unchecked refactor box as they are. Run `lane next`: it must
stop saying the exec plan is not yet drafted or still has placeholders before you tell the
human it is ready.

## Review before the gate

After the self-grill, once `lane next` no longer calls the plan unfinished, spawn
`lane-plan-reviewer` once, if installed. Give it file paths only, never your reasoning:
`exec-plan.md`, `snapshot-TSD.md` and `card.md`. Fix what you agree with; findings never go
into the plan. Re-run it only after the human asks for changes, never to check your own fixes. "No gaps found"
is not approval: the human's stamp is the outside check. Your hand-off says what it flagged,
what changed, and what you left alone and why.

## Stop at the gate

Reread the plan against the card and the frozen snapshot. Then stop your turn and tell the
human it is ready, handing the gate to your human, who runs `lane approve` once they
have read it. Do not run it for them, and do not write a test, run `lane red` or touch source
before their stamp. Once it is stamped, `lane next` names the write-test step (an N/A task
goes to `implement` instead) and lane-tdd takes over.

## Red flags

- Behaviors named for layers ("add the model") rather than outcomes.
- A B-1 that is not end to end, or an order that needs a later behavior first.
- `planned_behaviors` empty, or counting guards and invariants as cycles.
- A TSD behavior with no B-N, or a B-N with no source.
- Open questions left for "during implementation".

Adapted from obra/superpowers (writing-plans) and mattpocock/skills (grilling), MIT — see .lane/THIRD_PARTY_NOTICES.md.
