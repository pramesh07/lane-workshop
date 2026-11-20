---
name: lane-verify-claims
description: Use only when lane's output has a Method line naming lane-verify-claims (LANE's run-done step) — evidence before assertion; run the command, read its output, then claim.
---

# lane-verify-claims — run it, read it, then say it

Advisory method for the run-done step: the claims you make there, that a piece of work is
done, fixed or passing. It enriches `lane next`; it gates nothing. The gates are
`lane verify` and `lane done` (which refuse) and the human's stamp on the report.

## The iron law

```
NO "DONE", "FIXED" OR "PASSING" WITHOUT FRESH OUTPUT FROM THIS SESSION
```

Fresh means: the command ran after your last change to what it covers, and you read what
it printed. A run from before your last edit, a teammate's or subagent's "it passes", and
"it should work now" are not evidence. Confidence is not either. Words like *should*,
*probably* and *seems* are the tell: stop and run the command.

## The loop, for every claim

1. **Identify** the command that would show the claim false.
2. **Run** it in full, not a slice that happens to be quick.
3. **Read** the whole output and the exit status. Count failures; do not skim to a green line.
4. **Compare** the output with the claim. Does it say what you are about to say?
5. **Then** make the claim, with the output attached. If it disagrees, state the real status.

## Proportion: evidence per claim, not per edit

Verification is not a ritual after every keystroke. While working, run the narrow check for
the behavior in hand (the one test, the one file). Run the expensive proofs once, at the
claim, and again only if you changed something that claim covers. `lane verify` replays the
whole ledger in a fresh worktree; one clean run at the end beats five mid-way. Editing after
a clean run makes that run stale for the changed part: re-run, do not reason about it.

## What proves what, in LANE

| You want to claim | Evidence |
|---|---|
| The tests pass | The project suite's own output, read, with failures counted (including ones you did not cause). |
| The TDD cycle is sound | `lane verify <T-ID>`: its coverage audit and replay result, as printed. |
| The task clears its gates | `lane done <T-ID>`: it re-runs verify, then checks the report. Only its pass line counts. |
| Where the task stands | `lane next`, never memory. |

A `Tests: N/A` task prints that replay and coverage were skipped. There, claim only what
ran: the human-stamped report is the remaining gate, and "TDD verified" is false.

## A refusal is the answer

When `lane verify` or `lane done` refuses, that is the result, not an obstacle. Report it
as printed and act on what it says. Do not edit around it: no deleting or loosening tests so
the replay passes, no hand-setting the registry to `done`, no plain commit of source, no
retry loop hoping it flips. `lane verify` and `lane done` are recomputed from scratch each
run, and `lane land` re-runs them at the merge boundary, so a faked field gains nothing.

| `lane done` / `lane verify` says | Meaning | Your move |
|---|---|---|
| ledger coverage FAILED | Source changed outside red/green/refactor. | Use the exact safe exit it prints; send the work back through `lane red` / `lane green`. |
| TDD replay FAILED | A behavior did not go fail→pass with the test unchanged. | Read the per-behavior lines; if it names non-hermetic tests, fix the test's setup, not the replay. |
| no Verification Report | The review has not produced a report. | Run `lane review <T-ID>` as the hint says; it names who performs the review. |
| still has a template placeholder | The report is the scaffold. | Fill the named token on its line. |
| unresolved flags (`- [ ]`) | Flags are open. | Not done. See below. |
| filled but not approved | Needs the human's stamp. | Stop; see below. |

## Open flags mean not done

Any `- [ ]` left in the verification report means the task is not done, however green the
suite is. By run-done the report should be stamped, and ticking a flag now edits the body
and reopens the gate. So do not tick here: an open flag means the task belongs back at
resolve-flags, where lane-receive-review applies (subagent mode: the agent ticks what it
fixed or verified; human mode: the human ticks). Lay out each open flag with the output or
code location that bears on it and say plainly that it remains open.

## Report what ran and what it printed

State the claim together with its evidence, in the order you ran things:

- the command, exactly as run;
- the result line it printed (counts, the ✅ or ❌ lines);
- anything it warned about, and anything you did not run, said as not run.

"All green" with no command behind it is not a report. "`lane done T-02` refused: Verification
Report has unresolved flags; two remain" is.

## The stamp is the human's

A report that is filled and flag-free still needs the human's stamp before `lane done`
passes. Stop your turn and hand the gate to your human, who runs `lane approve <T-ID>` after
reading the report. Do not run it for them, pipe input into it, or write the stamp fields:
a hand-typed stamp validates nowhere. Editing the report after the stamp reopens the gate,
so do not touch it once stamped; ask first.

After `lane done` passes, say exactly that: gates passed, status recorded on the branch.
Completion is the merge into the integration branch, which belongs to your human (PR review,
or `lane land` from the main checkout; lane prints that path for them). `lane next` and
`lane done` mention `lane land` whether or not `auto_land` is set, so seeing it is not
permission. Only when the project set `auto_land` does the Stop hook itself direct `lane land`;
otherwise do not run it. Do not call the task merged until lane or the human shows it.

## Red flags

- "Done!" or "Perfect!" typed before the command returned.
- Citing an earlier run after you edited the code or the report.
- Summarizing a subagent's report without checking the diff or `lane next`.
- Treating a lint pass as a build pass, or one passing test as the whole suite.
- Rewording a refusal into something milder.
- Re-running the whole suite after every small edit "to be safe".

Adapted from obra/superpowers (verification-before-completion), MIT — see .lane/THIRD_PARTY_NOTICES.md.
