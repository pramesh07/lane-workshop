---
name: lane-qa-plan
description: Use only when lane's output has a Method line naming lane-qa-plan (a QA kind's test-plan step) — writing a QA test plan from the source feature's signed PRD and TSD, never from the code.
---

# lane-qa-plan — plan the tests from the requirements, not from the build

Advisory method for a QA kind's `draft-test-plan` step. It enriches `lane next`; it gates
nothing. The output is `TEST-PLAN.md` in the QA feature's folder: what will be tested, how,
where and with which data. No test cases and no test code yet, and the plan waits for your
human's stamp (gate 1). Project specifics (how the app boots, the e2e folder and runner, the
recording tool) are in the step's assist, which `lane next` serves beside this skill.

## The stance: a second check, from the requirements

Act as a senior QA engineer who has not seen the code and will not read it. That is the
point of the QA track: an agent that wrote both the code and its unit tests can agree with
itself about a misreading of the story. Tests derived from the signed requirements alone
catch what that agreement hides.

- Read the source PRD in full, and the source TSD for the contracts it promises at the edge:
  inputs, outputs, error messages, who may do what.
- Never open the source code, its unit tests, the dev tasks' cards, exec plans or diffs. If a
  question can only be answered from the code, it is a question for your human.
- A requirement too vague to test is a finding, not a gap to fill with a guess. Ask, and
  record the answer in the plan.

## What lane already did

Lane created this feature only once the source documents were signed, and wrote the
`**Source PRD:**` / `**Source TSD:**` lines itself. Leave them as lane wrote them; the human
signs them with the plan. Reading the source means the files those lines name.

## Answer "Is the feature already built?"

Tick exactly one box, and make the `**Answer:**` line below them say the same (`No — …` or
`Yes — …`). The answer decides when each case may start, so get it right:

- **No — dev builds it:** the source feature still has tasks to land, or has none yet. This
  is the normal case; each case task then waits for dev.
- **Yes — already built:** it already shipped and the source feature has no open task.
- Never *Yes* while the source has an open task; lane refuses that stamp. Unsure? Ask.

## What the plan covers, section by section

- **Scope:** **In** names the PRD stories and flows covered; **Out** names what is not tested
  here and why. Silence is not scope: a story missing from both is a gap.
- **Stories under test:** every story and every acceptance criterion of the PRD, by id. Every
  `e2e`-tagged criterion is covered, or listed under **Out** with the reason.
- **Test types:** which of functional e2e, negative and boundary, accessibility,
  cross-browser and smoke apply, and what each covers.
- **Negative and boundary cases** the PRD implies but does not spell out: empty input, the
  wrong role, the limit and one past it, a double submit, an expired session. Name them here
  so the cases step turns each into its own case.
- **Environments and test data:** how the app boots for exploration and for the e2e (the
  assist says how in this project), the base URL, the browsers, and the data. The run creates
  its own data; never a hand-seeded database, a shared account or another run's leftovers.
- **Entry and exit criteria:** what must be true before a case is explored, and what "QA
  done" means (for example every P1 case explored as a PASS, its e2e green in CI).
- **Risks:** what could make a test lie (timing, brittle selectors, shared state, a
  third-party service, a clock) and the mitigation for each.
- **Automation strategy:** which cases become e2e tests and which stay manual (a human has to
  look: a visual judgement, a physical device). Retries are 0, so a flake fails loudly.

## Ask the gaps, one at a time

Each gap is a direct question to your human: one question, then wait for the answer before
the next. Offer the options you see and the one you would pick, so a short reply settles
it. Write each answer into the plan where it belongs, in place; a decision that lives only in
the chat is lost at the next session.

## Replace every placeholder

Every `<…>` token in the template is filled or its line deleted; lane refuses the stamp while
one is left. Run `lane next`: it must stop calling the file a template before you say it is
ready. Never touch the frontmatter stamp fields; lane writes them, and editing the plan after
the stamp reopens gate 1.

## Stop at the gate

Read the plan back to your human: scope, the stories and criteria mapped, the negative and
boundary cases, the environment and data, the risks, the built-or-not answer. Fold in their
corrections, then stop your turn. Gate 1 is the human's: the human runs `lane approve`, never
you. Write no test cases this turn; `lane next` moves on to them after the stamp.

## Red flags

- A plan line that could only come from reading the code ("the handler retries twice").
- A PRD story or `e2e` criterion that is neither under test nor listed under **Out**.
- "Happy path only": no negative or boundary case named.
- Test data that depends on a hand-seeded database, a shared login or a previous run.
- *Yes — already built* while the source feature still has an open task.
- A guess written down where the PRD was vague, instead of a question to the human.
- The Source lines edited by hand.

Adapted from the QA pack's test-plan assist (packs/qa, LANE's own), no third-party text.
