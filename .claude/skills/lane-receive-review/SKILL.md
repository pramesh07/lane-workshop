---
name: lane-receive-review
description: Use only when lane's output has a Method line naming lane-receive-review (LANE's resolve-flags step, or its review hand-off) — weigh each point against the code before changing anything, and revise the artifact, not the reviewer.
---

# lane-receive-review — weigh the note, then change the artifact

Advisory method for two moments: the Stop hook hands you a human's dashboard review of a
gated artifact, or a Critic's verification report has open flags. It enriches that
instruction; it gates nothing. The artifact stays unapproved until the human stamps it.

## What you were handed

The guard's message says either `The human REQUESTED CHANGES on <path> via the dashboard` or
`The human REJECTED <path> via the dashboard`, and adds `it was NOT approved`. Below it,
each note reads `path:Lstart-Lend > "quote" — the note`: the lines and text the human was
looking at, then what they said. A note without a range is about the whole document.

- Notes are consume-once. The guard deletes them from the queue as it delivers them, so
  the message in front of you is the only copy. Number them in your first reply.
- Line numbers are the file as the human read it. If you edited since, find the passage
  by its quote (long quotes arrive shortened).
- A bare reject carries `(no note was given — …ask what they want changed)`. Ask. Do
  not guess a fix and re-present it.

## The pattern

1. **Read all of it first.** Every note, before touching the file. Notes overlap, and
   two of them can pull in opposite directions.
2. **Restate each in your own words.** If you cannot say what it asks for, it is unclear.
3. **Check it against reality.** Open the passage it cites, then the code and the spec it
   rests on: the approved artifact this one descends from (the PRD for a TSD, the TSD
   for the plan), or the frozen `snapshot-TSD.md` for a Critic flag. Is the point true
   here, and does the change break something already approved?
4. **Decide per note:** right, wrong, or unclear.
5. **Act on the right ones, one at a time**, rereading each edited passage.
6. **Report note by note** (see below).

## Unclear means stop

If any note is unclear, ask before changing anything. Items are often related, and
revising the clear half on a partial reading builds the wrong thing. Name which notes you
understood and which you need explained, and end your turn.

## When you think a note is wrong

Say so. Do not silently skip it, and do not quietly do half of it.

- Give the evidence: the file and line, the spec section, the test output, the constraint
  that makes the note not hold.
- Ask the specific question that would settle it ("the TSD fixes this at 30s in §4;
  do you want §4 changed, or this note withdrawn?").
- Leave that passage as it is until the human answers. They may send it again, withdraw
  it, or tell you the context you were missing. They decide, not you.
- If you pushed back and were wrong, say so plainly, then fix it. No apology paragraph.

## No performative agreement

Skip "You're absolutely right", "Great catch", "Thanks for the review". The revised
artifact is the acknowledgment. State what changed and where, or state the requirement and
act. A reviewer being a human does not make every note correct, and being right does not
need ceremony.

## Dashboard reject means rethink

`REQUESTED CHANGES` asks for edits to the noted passages. `REJECTED` asks for more: the
human does not want this artifact as it stands. Patching only the cited lines is the wrong
response, because the notes are symptoms of how it was built.

- Reread the whole artifact against what the human said and what the step needs.
- Ask what premise they are rejecting: the scope, the approach, a missing constraint.
- Rework the sections that rest on that premise. Say so if the problem sits upstream, in
  an artifact already approved; editing that reopens its own gate, so raise it with the
  human first.
- No note given? Ask what they want changed before you revise.

## Critic flags

The report (`verification.md`) holds two kinds of `- [ ]` line: the Critic's findings,
under Divergent, Suspected hallucination and Missing, and the template's fixed Critic
checklist (mocks at boundaries only, each AC verified, and so on). `lane next` stays on
the resolve-flags step while any remain. Weigh each like a dashboard note, against the
frozen spec and the diff. A suspected hallucination may be a false positive; show what
you checked either way. Who ticks depends on `critic_mode`:

- **subagent:** resolving the flags is your job. Tick each one you FIXED (code, through
  `lane red` and `lane green`, or the wrong artifact), VERIFIED (a checklist property, or a
  claim you re-checked holds) or found NOT APPLICABLE (a checklist box this task cannot
  meet, such as e2e or mocks on a `Tests: N/A` card), with a one-line note: what changed,
  what you checked, or `N/A — <why>`. A Critic finding you believe is wrong is always a
  DISPUTE: leave it unticked, with the evidence on an indented line below; never edit it.
- **human:** the flags are the human's to tick, in `lane dashboard` or in the file. Fix
  what you are asked to fix and report back; do not tick.
- **critic_mode unset:** whoever reviews resolves every flag; the human still stamps.
- Either way, never edit or delete the Critic's findings themselves; revise the artifact,
  not the reviewer. Never stamp. The human reviews every flag, ticked or not, and runs the
  stamp; `lane done` requires it.

## Re-present, do not approve

When the revision is done, run `lane next` to see where the artifact stands, then reply:

- one line per note: addressed (and where), disagreed (and the evidence), or asked;
- anything you left out of scope, so the human is not surprised.

Then stop your turn and hand the gate to your human, who runs `lane approve` once satisfied.
Never run it, never pipe input into it, never write the stamp fields. The stamp is the
only gate, and revising the artifact leaves it unapproved.

## Red flags

- Editing before every note has been read.
- A note missing from your report because you decided it was wrong.
- Acting on three notes and "will ask about" the fourth later.
- Treating a reject as a request for small edits.
- Ticking a flag without having fixed or verified it.

Adapted from obra/superpowers (receiving-code-review), MIT — see .lane/THIRD_PARTY_NOTICES.md.
