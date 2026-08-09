---
paths:
  - "**/*.kt"
  - "**/*.kts"
  - "**/*.gradle"
---

# Android AI Agent Guidelines

## Purpose

Define how AI agents should work on the existing Android project while following the same engineering standards as human developers. These rules are Android-specific additions to the project `AGENTS.md` instructions.

## Current Project Pattern

- `AGENTS.md` is the execution contract for this repository.
- `TESTING.md` is the detailed source of truth for test infrastructure and test commands.
- Android standards live in this `android/` directory and describe how new code should fit the existing app.
- The project has one Android app module; do not generalize decisions for hypothetical Android repositories.

## Required Workflow

- Classify the task before editing: bug fix, feature change, refactor, test update, build/config change, docs-only, review, debugging, or reproduction.
- Inspect the relevant code path before proposing or changing code.
- Read the nearest screen, ViewModel, use case, API/repository, mapper, DAO, and tests as applicable.
- Make the smallest safe change that fits the existing architecture.
- Do not refactor, rename, move files, or introduce abstractions unless the task requires it.
- Do not edit sensitive config, signing, auth, billing, Firebase, or secret-bearing files unless explicitly requested.
- Validate with the narrowest relevant command or test.
- Report changed files, validation performed, skipped checks, assumptions, and remaining risk.
- If validation is blocked by missing config, JDK, SDK, network, device, credentials, or private test data, report the exact blocker and do not claim success.
- Do not create branches, commits, PRs, rebases, squashes, or history rewrites unless the user explicitly asks for git actions.

## Android-Specific Rules

- For Compose changes, preserve state ownership and recomposition behavior.
- For ViewModel changes, preserve `UiState`, action handling, and lifecycle-scoped coroutine ownership.
- For API changes, preserve DTO/domain boundaries and return explicit result types.
- For persistence changes, verify migrations and schema history.
- For dependency injection changes, inspect existing bindings before adding modules.
- For flavor, environment, billing, auth, or release behavior, reason about every affected environment before editing.

## Preferred Patterns

- Follow `AGENTS.md` first when it is more specific than these standards.
- Use these standards to choose structure, state flow, tests, and validation scope.
- Prefer static inspection and focused tests before broad builds.
- Keep final reports short, evidence-based, and explicit about skipped validation.
- Prefer the repo's existing helpers, modules, and local patterns over introducing a new dependency or framework.

## Do / Don't

Do:

```text
1. Inspect current screen and ViewModel.
2. Inspect the repository or use case and mapper that provide the data.
3. Inspect nearest tests.
4. Patch the smallest behavior surface.
5. Run the focused test or explain why it is blocked.
```

Don't:

```text
1. Add a new repository unless data is unavailable in existing repositories.
2. Add a new DI module without checking existing bindings.
3. Rewrite the screen to make the fix cleaner.
4. Run broad validation first and ignore local failures.
```

Reason: most Android tasks should extend the existing path, not create a parallel architecture.

Do:

```kotlin
when (val state = uiState.pageState) {
    is LoadableUiState.Available -> Content(state.data)
    is LoadableUiState.Error -> ErrorContent(onRetry = retry)
    is LoadableUiState.Loading -> LoadingContent()
}
```

Don't:

```kotlin
if (uiState.isLoading) LoadingContent()
if (uiState.error != null) ErrorContent()
if (uiState.data != null) Content(uiState.data)
```

Reason: existing loadable state patterns reduce impossible UI combinations.

Do:

```text
Validation:
- Ran focused ViewModel test for the changed action.
- Did not run full assemble because this was a local logic-only change.
```

Don't:

```text
Validation:
- Looks good.
```

Reason: reports must be evidence-based so reviewers can trust what was checked.

## Exceptions

- For analysis-only or review tasks, do not edit code unless the user later asks for implementation.
- If existing local code conflicts with these standards, prefer the smallest safe local fix and document the exception.
- If requirements are ambiguous and affect auth, billing, persistence, API contracts, or release behavior, ask for clarification before editing.
- If the task explicitly forbids running tests, running the app, or changing code, obey that limit and confine work to the requested scope.

## Validation Expectations

- Use the standards docs in this directory as the source of truth for architecture, UI, navigation, data/network, persistence, and testing decisions.
- Prefer focused validation first, then broaden only when shared behavior or integration boundaries are touched.
- If validation cannot run, continue with static analysis where useful and report the exact missing prerequisite.
- Never claim validation passed unless the command or evidence actually passed.
