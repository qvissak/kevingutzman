# CLAUDE.md

> The shared engineering standards in this repo are mirrored by `./sync-ai-rules.sh` to the native surface each AI tool reads: `AGENTS.md` for ChatGPT Codex, `.cursor/rules/` for Cursor (glob-routed), and `.claude/rules/` for Claude Code (path-routed). This file extends those with project-specific context that only this repo knows about — Claude Code reads it alongside the synced rules.

## Project overview

Kevin Gutzman's website.

## Tech stack

<Not yet established — this repo has no code beyond the AI tooling setup. Fill in once the stack is chosen.>

## How to run and test

<Not yet established — no build, dev, test, or lint commands exist yet.>

## Shared standards

This repo follows the rules in [`AGENTS.md`](./AGENTS.md), which is mirrored from
[`bkservices/engineering-standards`](https://github.com/bkservices/engineering-standards). Cursor reads
`.cursor/rules/*.mdc` for glob-routed platform rules from the same source.

To pull the latest handbook updates, run from the repo root:

```bash
./sync-ai-rules.sh
git diff -- AGENTS.md .cursor/rules
# review, then commit if it looks right
```

**Do not edit `AGENTS.md` or `.cursor/rules/` directly in this repo** — open a PR
to the handbook and let the next sync run mirror it here.

## Telemetry and alarm awareness

Treat this as a standing instruction, not a placeholder. When a change in this repo adds, moves, or touches a metric emission, an error log level, or an alarm definition, say — without being asked — whether the signal can fire when nothing is actually wrong, and name the alarm that consumes it (or state that none does yet).

The recurring false positive to rule out first: an error, failure, or `5xx` counter on a code path reachable by **client-driven cancellation** — a client disconnect, navigate-away, proxy/CDN abort, or upstream client timeout. In Go that is a request-scoped `context.Canceled` reaching the emitter. Guard it with `errors.Is(err, context.Canceled)` **at the emit site** (a post-handler wrapper cannot retract a metric already emitted into a process-wide buffer), and keep counting `context.DeadlineExceeded` — a timeout we set and blew is a real signal.

The full rule lives in the handbook: see `.claude/rules/backend/telemetry-noise.md` (Cursor: `.cursor/rules/backend/telemetry-noise.mdc`), plus section 6 of the always-apply agent-behavior rule.

<No metrics pipeline exists yet — fill in once this repo emits telemetry.>

## Project-specific gotchas

<None yet — this repo has no code beyond the AI tooling setup.>

## Owners and runbooks

- Owning team: <fill in>
- On-call runbook: <fill in>
- Dashboards: <fill in>
- Alerts: <fill in>
