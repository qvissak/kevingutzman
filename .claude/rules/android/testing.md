---
paths:
  - "**/*.kt"
  - "**/*.kts"
  - "**/*.gradle"
---

# Android Testing Standards

## Purpose

Define what changes in the existing Android project need to prove before they are ready. Tests should be focused, deterministic, and proportional to the risk of the change.

## Current Project Pattern

- Unit and Robolectric tests live in `app/src/test`.
- Android instrumentation and E2E tests live in `app/src/androidTest`.
- Shared test infrastructure, test Hilt modules, robots, and reusable screen suites live in `app/src/testFixtures`.
- Detailed testing infrastructure and command guidance lives in root `TESTING.md`.
- Test filtering is supported by the Gradle test configuration; prefer focused tests before broad validation.

```text
app/src/
├── test/
│   └── java/
├── androidTest/
│   └── java/
└── testFixtures/
    ├── kotlin/
    │   ├── testing/
    │   ├── screens/
    │   ├── mock/
    │   └── di/
    └── resources/
```

## Required Standards

- Add or update tests when behavior changes materially.
- Prefer the narrowest test that proves the behavior.
- Keep tests close to the behavior they verify.
- Reuse existing base test classes, fixtures, robots, mock users, dispatchers, and network helpers before adding new test infrastructure.
- Do not introduce broad test scaffolding for a narrow bug fix.
- Do not rely on real backend availability unless the test is explicitly an integration or contract test.
- Never hardcode private credentials, tokens, user identifiers, or production secrets in tests.
- Unit testing
    - Use `mockk` to mock injected dependencies and verify function calls
    - Use `org.junit.Assert` or kotest-assertions for assertions

## Test Type Expectations

- Unit tests: pure logic, mappers, validators, formatting, and local business rules.
- ViewModel tests: state transitions, action handling, one-off events, collaborator calls, loading/error/success behavior.
- Compose tests: screen state rendering, user interactions, accessibility selectors, important layout state.
- API tests: request/response behavior, parsing, headers, cache/refresh behavior, and controlled network failure.
- Persistence tests: DAO queries, repository behavior, migrations, and user-scoped data.
- E2E tests: critical user flows where integration behavior matters more than isolated logic.

## Validation By Change Type

- Logic change: focused unit or ViewModel test.
- Compose UI change: focused Compose/Robolectric test when behavior is non-trivial; visual inspection when the change is purely presentational.
- Navigation change: destination, argument, back behavior, and deep-link tests when applicable.
- API/network change: mocked response tests plus real-backend checks only when contract confidence is required.
- Persistence change: DAO/repository tests and migration/schema validation.
- Build/config/flavor change: compile or assemble the affected variant and reason about all impacted environments.
- Docs-only change: factual consistency review; no build required unless examples are compiled snippets.

## Preferred Patterns

- Reuse existing test base classes and fixtures before adding new infrastructure.
- Use deterministic coroutine tests with test dispatchers and explicit scheduler advancement.
- Keep UI selectors inside screen robots or stable helper objects when a screen is tested more than once.
- Prefer mocked middleware for automated feature behavior and reserve real middleware for explicit integration confidence.

## Do / Don't

Do:

```kotlin
@Test
fun loadFeatureTransitionsToAvailable() = runTest {
    everySuccessfulFeatureResponse()

    viewModel.send(FeatureAction.Load)
    advanceUntilIdle()

    viewModel.uiState.value.pageState shouldBe LoadableUiState.Available(expectedPage)
}
```

Don't:

```kotlin
@Test
fun loadFeature() = runBlocking {
    Thread.sleep(1000)
    viewModel.load()
    assertTrue(viewModel.page != null)
}
```

Reason: coroutine tests should use test dispatchers and deterministic advancement.

Do:

```kotlin
mockWebServer.enqueue(successResponse(body = featureJson))

val result = useCase(id = "123")

result shouldBe ApiResult.Success(expectedFeature)
```

Don't:

```kotlin
val result = realProductionService.getFeature("123")
assertNotNull(result)
```

Reason: default automated tests should not depend on backend availability or production data.

Do:

```kotlin
object FeatureScreen {
    context(_: ComposeTestRule)
    val RetryButton get() = onNodeWithTag("feature_retry")
}
```

Don't:

```kotlin
composeRule.onAllNodes(hasClickAction())[4].performClick()
```

Reason: stable selectors make UI tests readable and resilient.

## Exceptions

- A trivial copy, spacing, or style-only UI change may not need a new test.
- Legacy tests may use older assertion or runner patterns. Preserve local consistency unless updating the pattern is required for the change.
- Real-backend tests can exist as explicit API/integration checks, but they should be isolated from deterministic PR validation when possible.

## Validation Expectations

- Each code change should state what was validated and what was not.
- Failed validation must not be reported as passed.
- If validation is blocked by environment, credentials, network, SDK, or device availability, report the exact blocker.
- Prefer one focused validation pass first; broaden only when the change touches shared behavior or integration boundaries.
