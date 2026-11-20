---
name: lane-interview
description: Use only when lane's output has a Method line naming lane-interview (LANE's draft-briefing step) — one-question-at-a-time discovery that turns a raw idea into a filled BRIEFING.md before the human approves it.
---

# lane-interview — find what they want, then fill the briefing

Advisory method for the `draft-briefing` step. It enriches `lane next`; it gates nothing.
The only output is `docs/features/<FEAT>/BRIEFING.md`, filled in the template's own
sections. Approval is the human's: they run the stamp command, and a hand-typed stamp does
not count.

## Why interview first

People ask for what is conventional ("a dashboard", "make it faster"), not always for what
solves their problem. The briefing is the cheapest place to find that gap: before a PRD,
a TSD or a line of code exists, a wrong premise costs one sentence to fix. Later it costs
a rework, and the human will have talked themselves into the wrong thing by then.

This needs a live human. If you cannot ask anyone, do not guess your way to a finished
briefing: fill what the raw idea supports, put the rest in Open questions, and say so.

## Look up facts, ask for decisions

Before the first question, read what already exists: the raw idea as given, `docs/context/`
(product, blueprint, constitution), sibling features, and code the idea touches. A fact you
can find, you find; never spend the human's attention on it. The decisions are theirs: who
it is for, why now, what success is, what is out. Put each to them and wait.

## The loop

1. **State your read first.** One sentence: what you currently think they want, and how
   sure you are. Name what is still missing when you are not sure. This is the thing they
   correct.
2. **Ask one question at a time.** Send one, attach your guess and why you guess it, and
   stop. Wait for the answer before the next. Several questions at once get skimmed, and
   the second question usually depends on the first answer. End the turn with the question
   itself as its last line, ending in `?`: the guess goes before it and nothing comes after.
   lane's Stop hook reads that last line to tell you are waiting for an answer.
3. **Update the read.** Say what the answer changed. A good interview often turns the
   request into a different one ("a dashboard" becomes "a list I do not have").
4. **Stop when you can predict them.** If you can say what they would answer to your next
   three questions, you understand the idea; go and write. If several rounds pass and you
   still cannot, something foundational is missing: say that, and offer to step back.

Useful questions, in the order they usually unlock things: who exactly is this for; what
hurts today and what do they do about it now; why now; what would make this a success you
could observe; what is the binding limit (time, money, a system we cannot change); what
would you refuse to build even if it were free.

## Want, not should-want

Distrust answers that sound like a good answer. Warning signs: best-practice words with no
specifics ("scalable", "clean", "modern"), deference to convention ("the way everyone does
it"), and "I should probably". When you hear one, ask: **"If you did not have to justify
this to anyone, what would you actually want?"** One such question often does more than
five others.

A reply of "whatever you think" is delegation, not a decision. Re-ask it as a choice
between two concrete options, each with a consequence.

## Diverge, then converge

Do not jump from the first answer to a hypothesis.

- **Diverge.** Once you know who and why, offer a few genuinely different shapes of the
  solution, not variations on one theme: the simplest possible version, the version for a
  different user, the opposite approach, the thing that makes the feature unnecessary.
  Five or six at most, each with the reason it exists. Ask which ones resonate and why.
- **Converge.** Cluster what resonated into two or three directions. Test each against user
  value, cost and the hardest part, and name what you are betting is true but have not
  checked. Be honest rather than supportive: if a direction is weak, say so kindly. Then
  agree on one sharp hypothesis.

## Fill the briefing from the answers

Write each section from what the human said, in their words where you can. The template's
HTML comments are prompts: delete them as you fill each section.

| Section | What goes in it |
|---|---|
| Why | The problem, for whom, and why now, as the human told it. |
| Hypothesis | Two or three sentences: what we think we are building. Not a spec. |
| Mocks / references | Links, sketches, prior art they gave you or you found in the repo. |
| Scope hints | **Probably in** and **Probably out**. Fill "out" too: silent disagreement about what is not being built is half of all misalignment. |
| Open questions | Everything still unresolved. |
| Approval | Leave exactly as the template has it. |

The heading `# Briefing <FEAT> — <title>` counts too: replace `<title>` with a short feature
name. Any other `<…>` token the template left, and any empty `-` bullet (Mocks / references,
Scope hints), is filled or deleted: lane reads a line that still carries a template token as
unfilled. Run `lane next` before you call the briefing ready; it must no longer say the file
is still template.

Never touch the frontmatter stamp fields. They are written only by lane after the human's
confirmation, and editing the file after approval reopens the gate.

## Unresolved goes in Open questions

If the human did not answer, said "not sure", or the answer depends on something outside
the conversation, write the question down. Do not invent an answer to make a section look
complete, and do not present your guess as their decision. An honest list of open
questions is a better briefing than a smooth one with hidden assumptions. Each line must
be answerable by someone, and the human removes a line once it is settled.

## Stop at the gate

When every section is filled and you cannot predict anything new, read the briefing back:
the hypothesis, what is in and out, and the open questions. Ask whether it matches what they
want, and fold in corrections. A real yes is explicit; "sounds good" gets the question
"anything you would change?".

Then stop your turn. Tell the human the briefing is ready for their approval and hand the
gate to your human, who runs `lane approve`. Do not run it for them, and do not start the
PRD in the same turn: `lane next` moves on only after the stamp.

## Red flags

- A batch of questions in one message, or a question with no guess attached.
- Producing a PRD, plan or task list before the briefing is stamped.
- A section filled with your assumptions presented as their answers.
- "Scope hints" with an "in" list and no "out" list.
- Output anywhere except `BRIEFING.md`: no side notes, intent files or scratch docs.
- Treating "whatever you think" or silence as approval.

Adapted from addyosmani/agent-skills (interview-me, idea-refine) and mattpocock/skills (grill-me, grilling), MIT — see .lane/THIRD_PARTY_NOTICES.md.
