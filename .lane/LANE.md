# LANE — Leapfrog AI-Native Execution

This project uses **LANE**, an AI-native SDLC framework. The flow is enforced
mechanically by the `lane` binary — you run a command, read its output, and do
what it tells you. There is no procedure to memorize here.

## If you are an AI agent

Run the `/lane` slash command to orient yourself. It runs `lane` (your state and
next action) and points you at `lane playbook why` (the mental model) for a
first visit. Everything you need is surfaced by the binary.

`lane init` also installs LANE's method skills, a `lane-critic` reviewer and
two document reviewers (`lane-tsd-reviewer`, `lane-plan-reviewer`) for your
tool (unless run with `--no-skills`). They are advisory and never gates.

Claude Code, Cursor and Copilot each get a session-start hook (`lane orient`)
that orients you each session and a stop hook (`lane guard`) that keeps you
on-task to each gate, scaffolded by `lane init --agent <tool>`. They are an
autonomy driver, not a gate: human approvals and the TDD ledger are unchanged. Claude Code
also gets a pre-tool hook (`lane pretool`) that refuses a helper agent's
`lane approve` / `abandon` / `land` and any edit to an `approved_*` field — the
main session is never refused.

## If you are a human

Run these in your terminal:

- `lane` — current state and your next action
- `lane playbook why` — the reasoning behind every hard rule; `lane playbook` for the rest
- `lane philosophy` — the long form of that reasoning
- `lane dashboard` — the live web view: state, documents, review and approvals
- `lane help` — every command

That's it. The binary is the source of truth; it is versioned with the code and
cannot drift the way a static document does.
