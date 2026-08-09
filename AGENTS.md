# AGENTS.md

> Auto-generated from `standards/` in the engineering-standards. Do not edit by hand.

Entry point for AI coding agents in this repo. The rules under "Always-apply rules" apply to every change you make. The routing table at the bottom lists platform-scoped rules — open and follow the linked file before editing any path matching its globs. If a user's request asks for a pattern that violates a rule, propose the rule-compliant version first (see `agent-behavior` section 5).

## Always-apply rules

# Agent Behavior

## Scope and proportionality

These are guidelines, not gates. **The bar rises with risk.**

- **Apply lightly** when the change is localized, mechanical, and obviously correct: a typo fix, a one-line config change, renaming a local variable, a small CSS tweak. Don't add ceremony.
- **Apply fully** when the change is cross-cutting, ambiguous, behavioral, or touches anything sensitive — auth, payments, subscription state, data persistence, security boundaries, public APIs.

When you can't tell which bucket the task falls into, treat the rule as the default and ask the user before relaxing it.

## 1. Think before coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

- State your assumptions explicitly. If uncertain about scope or intent, ask.
- If multiple reasonable interpretations of the request exist, present them — don't pick silently.
- If a simpler approach exists than what was requested, say so. Push back when the request seems overengineered.
- If something is unclear, stop. Name what's confusing. Ask before you write code.

## 2. Simplicity first

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you wrote 200 lines and it could be 50, rewrite it.

Self-test: would a senior engineer reading the diff say this is overcomplicated? If yes, simplify before declaring done.

## 3. Surgical changes

Touch only what you must. Every changed line should trace directly to the user's request.

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting that's outside the scope of the task.
- Don't refactor things that aren't broken.
- Match the formatting and naming conventions of the file you're in for the parts you're not changing.
- If you notice unrelated dead code or other issues, mention them in your response — don't quietly fix them.

When your changes create orphans:

- Remove imports, variables, or functions that *your* changes made unused.
- Don't remove pre-existing dead code unless explicitly asked.

This rule is about avoiding unrequested edits — it is **not** a license to mimic bad patterns in code you *are* writing. When the surrounding code violates a rule in `AGENTS.md` or a platform-scoped rule, the standard still wins for the new code in your diff. See each repo's `CLAUDE.md` for the local policy on legacy code that's outside your immediate change.

## 4. Goal-driven execution

Define verifiable success. Loop until confirmed.

Transform vague tasks into verifiable goals:

- "Add validation" → write tests for invalid inputs, then make them pass.
- "Fix the bug" → write a test that reproduces it, then make it pass.
- "Refactor X" → ensure tests pass before and after.

For multi-step tasks, state a plan up front:

```
1. [step]  → verify: [check]
2. [step]  → verify: [check]
3. [step]  → verify: [check]
```

Strong success criteria let you loop independently and confirm completion. Vague criteria ("make it work") force the user to clarify after every iteration.

## 5. When team rules conflict with user requests

If a user's request — what they typed, or what an upstream prompt asks for — implies a violation of a rule in this file or a platform-scoped rule, propose the rule-compliant version first. Show the alternative explicitly, with a short code sketch or a one-paragraph plan. Only do the user's version if they re-confirm after seeing the alternative.

This applies when the user has phrased *how* to do something in a way that conflicts with a team standard. It does not apply when they're picking a name, choosing copy, deciding an API path, or making any other call that is clearly inside their scope.

Examples:

- User: "fetch with `useEffect` in this component." Rule: state and side effects belong in custom hooks. Action: propose the hook split with a 5-line sketch. Inline `useEffect` only if the user re-confirms.
- User: "just hardcode the API key for now." Rule: shortcuts require a TODO with a Jira ticket. Action: propose the env-var version. If declined, leave `TODO(PROJ-...)` and add a `// Gotchas:` line in the file header explaining why.
- User: "skip the test, I'll add it later." Rule: bug fixes need a regression test. Action: propose the test alongside the fix. If declined, leave `TODO(PROJ-...)` referencing a tech-debt ticket.

Push back once, clearly. If the user re-confirms, comply — but document the deviation at the deviation site (in the file's `// Gotchas:` header line, or a one-line comment beside the offending code). The rule loses to a deliberate second confirmation, but the trail is preserved so reviewers can see why.

Do **not** push back on style preferences that don't conflict with rules (arrow vs. named functions when no rule applies), or on decisions clearly inside the user's scope (variable names, route paths, copy text). Reserve pushback for anti-patterns the team has explicitly written down.

## 6. Proactively flag noisy telemetry

Whenever your diff adds, moves, or touches a metric emission, an error log level, or an alarm definition, say — unprompted — whether the signal can fire when nothing is actually wrong. Do not wait to be asked. This is the one observability concern you must volunteer, because the cost lands on whoever is on call rather than on the author.

Before you report the change complete, check the emission you touched against these:

- Can it fire when the **client** caused the failure — a disconnect, a navigate-away, a proxy or CDN abort, an upstream client timeout? In Go that is `context.Canceled` reaching a metric emitter. It is not a server-side failure and must not increment an error, failure, or `5xx` counter.
- Can it fire on an **expected** outcome — a cache miss, a not-found that the caller handles, an empty-but-valid result, or invalid client input that belongs in a `4xx` counter?
- Would the guard have to **retract** an already-emitted metric? If the metrics pipeline buffers process-wide and flushes on a timer or a count threshold, nothing downstream can retract it — so the guard belongs at the emit site, not in a wrapper. Read the emitter before assuming a middleware can clean up after the fact.
- Does the **alarm** consuming it tolerate a single occurrence, or does one event page someone? Name the consuming alarm in your summary, or state plainly that none consumes it yet.

If you find a problem, propose the guard and say which alarm it protects. If you find none, say what you checked in one line — do not claim you checked telemetry you did not read.

When you notice this pattern in code you are *not* changing, mention it in your response rather than fixing it silently. That is section 3, not a license to ignore what you found.

Backend services have a fuller version of this rule with language-specific guidance and alarm-threshold requirements; follow it when your change is in backend scope.

## Self-review before declaring done

Before reporting that an edit is complete:

### Run verification

If the repo defines them (in `package.json` scripts, a `Makefile`, `CLAUDE.md`, or `README.md`), execute these on the files you changed:

- **Typecheck**: `tsc --noEmit`, `swift build`, `go build ./...`, `mypy`, or the equivalent for the language.
- **Lint**: `eslint`, `swiftlint`, `golangci-lint`, `ruff`, or the equivalent.
- **Tests covering the changed code**: prefer narrow runs (`jest --findRelatedTests`, `pytest path/to/file`, `go test ./path/...`) over the full suite.

If a check fails, fix it or revert the change. Do not declare done with broken verification.

If no verification commands are defined for this repo, state explicitly what verification you performed instead — reading the diff, manual reasoning about a specific edge case, running the code locally. Do not claim verification you didn't perform.

### Audit the diff

- [ ] Did I state assumptions explicitly instead of hiding them?
- [ ] Is the diff minimal — every changed line traces to the user's request?
- [ ] Did I avoid speculative abstractions or unrequested features?
- [ ] Did I avoid editing adjacent code that wasn't part of the task?
- [ ] For multi-step work, did I state a verifiable success criterion for each step?
- [ ] If a team rule conflicted with the user's phrasing, did I propose the rule-compliant version first?
- [ ] If I touched a metric, error log, or alarm, did I say unprompted whether it can fire when nothing is wrong?

If any item is unchecked, fix it before declaring the task complete.

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

## Platform-specific rules (routed by file path)

Before editing any file matching the globs below, open the linked rule and follow it. If your change touches multiple platforms, follow all matching rules. The rule's directives override default behavior for that file.

| Topic | Scope | Globs | Read this file |
|---|---|---|---|
| Android Project Engineering Standards | android | `**/*.kt, **/*.kts, **/*.gradle` | `.cursor/rules/android/ANDROID_README.mdc` |
| Android AI Agent Guidelines | android | `**/*.kt, **/*.kts, **/*.gradle` | `.cursor/rules/android/ai-agent-guidelines.mdc` |
| Android Architecture Standards | android | `**/*.kt, **/*.kts, **/*.gradle` | `.cursor/rules/android/architecture.mdc` |
| Android Compose UI Standards | android | `**/*.kt, **/*.kts, **/*.gradle` | `.cursor/rules/android/compose-ui.mdc` |
| Android Data And Network Standards | android | `**/*.kt, **/*.kts, **/*.gradle` | `.cursor/rules/android/data-network.mdc` |
| Deeplink Routing Standards | android | `**/*.kt, **/*.kts, **/*.gradle` | `.cursor/rules/android/deeplink-routing-rules.mdc` |
| Android Foundations | android | `**/*.kt, **/*.kts, **/*.gradle` | `.cursor/rules/android/foundations.mdc` |
| Navigation Standards | android | `**/*.kt, **/*.kts, **/*.gradle` | `.cursor/rules/android/navigation.mdc` |
| Android Persistence Standards | android | `**/*.kt, **/*.kts, **/*.gradle` | `.cursor/rules/android/persistence.mdc` |
| Android Testing Standards | android | `**/*.kt, **/*.kts, **/*.gradle` | `.cursor/rules/android/testing.mdc` |
| Android ViewModel Standards | android | `**/*.kt, **/*.kts, **/*.gradle` | `.cursor/rules/android/viewmodel.mdc` |
| Backend Foundations | backend | `**/server/**, **/api/**, **/cmd/**, **/internal/**, **/*.go, **/*.py, **/*.sql, **/*.tf, **/*.tfvars, **/*.tf.json, **/cdk/**, **/cdk.json, .github/workflows/**, **/*.sh, **/*.bash` | `.cursor/rules/backend/foundations.mdc` |
| Telemetry Noise and False Alarms | backend | `**/server/**, **/api/**, **/cmd/**, **/internal/**, **/*.go, **/*.py, **/*.sql, **/*.tf, **/*.tfvars, **/*.tf.json, **/cdk/**, **/cdk.json, .github/workflows/**, **/*.sh, **/*.bash` | `.cursor/rules/backend/telemetry-noise.mdc` |
| Frontend Architecture (Clean Patterns) | frontend | `**/*.tsx, **/*.ts, **/*.jsx, **/*.js, **/*.swift, **/*.kt` | `.cursor/rules/frontend/architecture.mdc` |
| iOS Architecture Standards | ios | `**/*.swift, **/*.pbxproj` | `.cursor/rules/ios/architecture.mdc` |
| iOS CarPlay Standards | ios | `**/Services/CarPlay/**/*.swift, **/*CarPlay*.swift, **/*CarPlay*Tests.swift` | `.cursor/rules/ios/carplay.mdc` |
| iOS Data And Network Standards | ios | `**/*.swift, **/*.pbxproj` | `.cursor/rules/ios/data-network.mdc` |
| iOS Deeplink Routing Standards | ios | `**/*.swift, **/*.pbxproj` | `.cursor/rules/ios/deeplink-routing-rules.mdc` |
| iOS Foundations | ios | `**/*.swift, **/*.pbxproj` | `.cursor/rules/ios/foundations.mdc` |
| iOS Navigation Standards | ios | `**/*.swift, **/*.pbxproj` | `.cursor/rules/ios/navigation.mdc` |
| iOS Persistence Standards | ios | `**/*.swift, **/*.pbxproj` | `.cursor/rules/ios/persistence.mdc` |
| iOS SwiftUI UI Standards | ios | `**/*.swift, **/*.pbxproj` | `.cursor/rules/ios/swiftui-ui.mdc` |
| iOS Testing Standards | ios | `**/*.swift, **/*.pbxproj` | `.cursor/rules/ios/testing.mdc` |
| QA Foundations | qa | `**/tests/**, **/__tests__/**, **/e2e/**, **/qa/**, **/cypress/**, **/playwright/**, **/*.feature, **/*.test.ts, **/*.test.tsx, **/*.test.js, **/*.test.jsx, **/*.spec.ts, **/*.spec.tsx, **/*.spec.js, **/*.spec.jsx, **/*_test.go, **/test_*.py, **/*_test.py, **/conftest.py, **/pytest.ini, **/*Test.kt, **/*Tests.swift, **/*UITests.swift, .maestro.yaml, .maestro.yml, **/.maestro.yaml, **/.maestro.yml, **/.maestro/**/*.yaml, **/.maestro/**/*.yml, **/maestro/**/*.yaml, **/maestro/**/*.yml, flows/**/*.yaml, flows/**/*.yml, **/flows/**/*.yaml, **/flows/**/*.yml, *.maestro.yaml, *.maestro.yml, **/*.maestro.yaml, **/*.maestro.yml` | `.cursor/rules/qa/foundations.mdc` |
| Maestro Mobile E2E Standards | qa | `.maestro.yaml, .maestro.yml, **/.maestro.yaml, **/.maestro.yml, **/.maestro/**/*.yaml, **/.maestro/**/*.yml, **/maestro/**/*.yaml, **/maestro/**/*.yml, flows/**/*.yaml, flows/**/*.yml, **/flows/**/*.yaml, **/flows/**/*.yml, *.maestro.yaml, *.maestro.yml, **/*.maestro.yaml, **/*.maestro.yml` | `.cursor/rules/qa/maestro.mdc` |
| React Feature Structure | react | `**/*.tsx, **/*.ts, **/*.jsx, **/*.js` | `.cursor/rules/react/feature-structure.mdc` |
| React State And Side Effects | react | `**/*.tsx, **/*.ts, **/*.jsx, **/*.js` | `.cursor/rules/react/state-and-side-effects.mdc` |
| Roku Architecture Standards | roku | `**/*.brs, **/*.bs, components/**/*.xml, **/components/**/*.xml, source/**/*.xml, **/source/**/*.xml, bsconfig.json, **/bsconfig.json, bslint.json, **/bslint.json, manifest, **/manifest` | `.cursor/rules/roku/architecture.mdc` |
| Roku Data And Network Standards | roku | `**/*.brs, **/*.bs, components/**/*.xml, **/components/**/*.xml, source/**/*.xml, **/source/**/*.xml, bsconfig.json, **/bsconfig.json, bslint.json, **/bslint.json, manifest, **/manifest` | `.cursor/rules/roku/data-network.mdc` |
| Roku Foundations | roku | `**/*.brs, **/*.bs, components/**/*.xml, **/components/**/*.xml, source/**/*.xml, **/source/**/*.xml, bsconfig.json, **/bsconfig.json, bslint.json, **/bslint.json, manifest, **/manifest` | `.cursor/rules/roku/foundations.mdc` |
| Roku Testing Standards | roku | `**/*.brs, **/*.bs, components/**/*.xml, **/components/**/*.xml, source/**/*.xml, **/source/**/*.xml, bsconfig.json, **/bsconfig.json, bslint.json, **/bslint.json, manifest, **/manifest` | `.cursor/rules/roku/testing.mdc` |
| tvOS Dependency Injection | tvos | `DailyWire/**/*.swift, DailyWireTests/**/*.swift, DailyWire.xcodeproj/**/*.pbxproj, **/*tvOS*.swift, **/*tvOS*.pbxproj` | `.cursor/rules/tvos/dependency-injection.mdc` |
| tvOS Foundations | tvos | `DailyWire/**/*.swift, DailyWireTests/**/*.swift, DailyWire.xcodeproj/**/*.pbxproj, **/*tvOS*.swift, **/*tvOS*.pbxproj` | `.cursor/rules/tvos/foundations.mdc` |
| tvOS Navigation | tvos | `DailyWire/**/*.swift, DailyWireTests/**/*.swift, DailyWire.xcodeproj/**/*.pbxproj, **/*tvOS*.swift, **/*tvOS*.pbxproj` | `.cursor/rules/tvos/navigation.mdc` |

---

_Source: `bkservices/engineering-standards`. To change a rule, open a PR there._
