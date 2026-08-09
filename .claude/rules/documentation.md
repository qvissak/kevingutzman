# Code Documentation

## Comments

Apply these without exception:

- Comments explain **why**, not **what**. The code shows what.
- Add a comment when intent is non-obvious: a magic number, an unusual branch, a workaround for a vendor bug, a domain rule, an ordering requirement, or a hot-path constraint.
- Keep comments short and current. If you change the code, update or delete the comment in the same edit.
- Never leave commented-out code. Delete it. Git remembers.
- Never add journal/changelog headers (e.g. "2024-01-04: refactored by Alice") or "added by X" attributions.
- Never add boilerplate docstrings on trivially short, self-explanatory functions just because policy says so.
- Never write a comment that restates the code (e.g. `// increment i` above `i = i + 1`).
- If a comment was made obsolete or wrong by your change, fix or remove it in the same diff.

**Bad**

```
// increment i
i = i + 1
```

**Good**

```
// Vendor X returns HTTP 200 with an error body when rate-limited.
// Treat any non-empty `error.code` as failure regardless of status.
```

## TODOs and tech debt

Every TODO MUST include a Jira ticket key. Format:

```
// TODO(PROJ-1234): one-line summary of what's wrong and what "done" looks like.
// Why now: shipping deadline / unknown scope / blocked by X.
```

If you are introducing a TODO and there is no Jira ticket, STOP and either (a) create one, or (b) ask the user to create one. Do not leave a bare `TODO`, `FIXME`, or `XXX`.

If you are about to take a shortcut — skipping tests, hardcoding a value, copy-pasting logic, deferring a refactor — you MUST leave a `TODO(PROJ-...)` comment referencing a tech-debt ticket that lists the concrete follow-up work. The ticket title is prefixed with `[TechDebt]` and the description includes:

- A bulleted, file-and-function-level list of the changes needed (not vague intent).
- The "why now": why the shortcut was taken.
- A "long-term solution" section if the proper fix needs a design doc, spike, or new infrastructure.

## File and module headers

When creating a new file, or significantly restructuring an existing one, add a header at the top that answers three questions. The exact comment syntax varies by language; the three lines do not.

```
// What: <one sentence describing this file's purpose>
// Who calls it / when: <entry points, triggers, schedule, request paths>
// Gotchas: <coupling, ordering, vendor quirks, dragons — or "none">
```

## Public APIs

Every function, class, or type exported across module boundaries MUST have a docstring with: purpose, parameters, return value, and at least one example call.

Exceptions:

- **Internal helpers** are exempt if their name and signature are self-explanatory.
- **Thin React components and JSX leaf wrappers** are exempt when the file header (What / Who calls it / Gotchas) and the component name carry enough context. Reach for a docstring only when the component has non-obvious props, ordering implications, side effects, or state ownership worth calling out.

## Writing for the next agent

Treat your comments and headers as the prompt the next AI agent (or new engineer) will read before changing your code:

- Spell out invariants and assumptions that aren't enforced by the type system or tests.
- Link to the Jira ticket, design doc, RFC, or postmortem that explains the decision.
- If code exists because of a vendor bug, regulatory requirement, migration, or customer-specific carve-out — say so. AI cannot infer that, and neither can a new hire.

If a piece of context currently only lives in your head, it does not exist. Write it down in code or link to where it lives.

## Self-review before declaring done

Before reporting that an edit is complete, scan your diff and confirm every item:

- [ ] No new TODO without a Jira link in the format `TODO(PROJ-1234): ...`.
- [ ] No commented-out code in the diff.
- [ ] Comments explain the why and are still accurate after the change.
- [ ] Any new file has a "What / Who calls it / Gotchas" header.
- [ ] Non-obvious decisions in the diff (magic numbers, unusual branches, workarounds) have a one-line rationale.
- [ ] Public APIs touched in the diff still have accurate docstrings.

If any item is unchecked, fix it before declaring the task complete.
