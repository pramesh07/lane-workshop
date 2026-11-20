---
name: lane-qa-cases
description: Use only when lane's output has a Method line naming lane-qa-cases (a QA kind's test-cases step) — deriving test cases from the acceptance criteria, with negative and boundary cases, in Given/When/Then.
---

# lane-qa-cases — one case per thing to prove, each a script a tester can walk

Advisory method for a QA kind's `draft-test-cases` step. It enriches `lane next`; it gates
nothing. The output is `TEST-CASES.md` in the QA feature's folder, and it waits for your
human's stamp (gate 2). No exploration and no test code yet.

## Read first, black box only

- The signed `TEST-PLAN.md`: its stories under test, the negative and boundary cases it
  names, its environments and test data, its automation strategy.
- The source PRD its `**Source PRD:**` line names: the stories and their acceptance criteria.
  The source TSD (its `**Source TSD:**` line) for the observable contracts: messages, limits,
  who may do what.
- Never the source code, its unit tests or the dev tasks' cards, plans or diffs. A case must
  hold whatever the build turns out to be; written from the code, it only re-states the code.

## The section shape is load-bearing

One `## TSD S-<FEAT>.nn — TC-nn: <title>` section per case, in the template's shape, where
`<FEAT>` is this QA feature's number. When the human stamps gate 2, lane creates one QA task
per section, and `lane start` freezes that exact section as the task's case
(`snapshot-TSD.md`): the storyboard and the e2e are judged against it, word for word.

- Number the story ids in step with the cases: S-<FEAT>.01 — TC-01, S-<FEAT>.02 — TC-02, and
  so on. One id per case; lane refuses the stamp when two cases share one, or when an id
  carries another feature's number.
- Inside a case use the table and `###` only. A `## ` line ends the section early and cuts
  the case lane freezes.
- Once a case has a task, its id and number are fixed. Amending the cases later: change a
  case in place, or add a new one with the next free number; never renumber, reuse an id or
  move a case to another id. Removing a case does not remove its task; tell your human, who
  decides whether to abandon it.

## Derive every case from an acceptance criterion

- Start from the PRD's acceptance criteria, `e2e`-tagged ones first, in the order of the
  plan's stories under test.
- **Covers** names the source story and criterion the case proves, in the form
  `S-0003.01 AC-2` (several, comma-separated). Lane reads that form onto the case's task card,
  and the dashboard shows it; any other form reads as covering nothing. A case that covers no criterion is either a negative or
  boundary case the plan names (say which) or out of scope.
- Every criterion the plan put under test has at least one case. One you cannot write a case
  for is a question for your human, not a silent skip.

## The fewest cases that cover

Write the fewest cases that cover the plan: each case costs an exploration, an e2e and a review.
Before you add one, name the criterion, or the negative or boundary case the plan names, that it
proves and no other case already proves. Two cases that prove the same outcome with different
values (leading spaces, trailing spaces, both) are one case: pick the value that shows the most,
and list the others in its test data only if the plan asks for them. A negative or boundary case
the plan does not name is a question for your human, not an extra case.

## Negative and boundary cases, one each

Write each negative and boundary case the plan names as its own case: empty input, the wrong
role, the limit, one past the limit, a double submit, an expired session. Never fold one into a
happy path as an extra step: a case proves one outcome, and its verdict is one word. A case
that needs two unrelated expected results is two cases.

## Steps in Given / When / Then

**Steps** are clauses separated by ` / `: `Given … / When … / And … / Then …`. Each clause
becomes one step of the exploration storyboard, copied verbatim as its heading and judged
alone, so write each as something a tester can do or see on the running app.

- **Given** sets up state the run creates for itself (an account, a record), named in
  **Preconditions / Test data**, never "the seeded user" or what a previous case left.
- **When** is one user action: a click, a field filled, a request sent.
- **Then** is something visible: a message, a page, a status code, a row in a list.
- Concrete values, not categories: `When the user enters "ab" as the name`, not "an invalid
  name". The tester and the e2e need the same value.

## The expected result is observable

**Expected result** is what the UI or the public API shows: the exact message, the page, the
response code and body. Never a table row, a log line, a function's return value or an
internal state; those need the code to check, and a black-box case cannot. Quote messages and
numbers from the PRD or TSD; never invent one. If neither states it, ask your human.

## The other fields

- **Priority:** P1 for what the plan's exit criteria need, P2 and P3 below that.
- **Automation:** `automated`, unless a human genuinely has to look (a visual judgement, a
  physical device); then `manual`, and its storyboard is the whole record.
- **Preconditions / Test data:** the state and data the case sets up for itself.

## Ask the gaps, one at a time

Each gap is a direct question to your human: one at a time, with the options you see and the
one you would pick, then wait. Write each answer into the case it decides, in place.

## Replace every placeholder, then stop at the gate

Every `<…>` token is filled or its line deleted, and no example case is left over; lane
refuses the stamp while one is. Run `lane next` until it stops calling the file a template.
Never touch the frontmatter stamp fields. If lane names a case reviewer on a `Review:` line,
hand it the file paths it asks for and weigh what it returns before you hand over.

Then read the cases back to your human: what each covers, the negatives and boundaries, the
manual ones, and any criterion left uncovered and why. Stop your turn. Gate 2 is the human's:
the human runs `lane approve`, never you. Lane creates the case tasks after the stamp; you
create no cards.

## Red flags

- A case whose expected result needs a database query, a log or the code to check.
- A negative case folded into a happy path, or two outcomes under one verdict.
- Two cases that prove the same outcome, or a case no criterion or named negative asks for.
- A clause no tester could do or see ("the system validates the input").
- A `## ` heading inside a case, two cases on one story id, or a renumbered existing case.
- A `Covers` cell with no criterion id, or a criterion under test with no case.
- A message or number invented rather than quoted from the PRD or TSD.

Adapted from the QA pack's test-cases assist (packs/qa, LANE's own), no third-party text.
