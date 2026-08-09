---
paths:
  - "**/*.swift"
  - "**/*.pbxproj"
---

<!--
What: iOS testing standards for the DailyWire app.
Who calls it / when: Engineers and AI agents read this before adding or changing Swift tests.
Gotchas: Prefer focused deterministic tests; report exactly what was not run.
-->

# iOS Testing Standards

## Purpose

Define what changes in the existing iOS project need to prove before they are ready. Tests should be focused, deterministic, and proportional to the risk of the change.

## Current Project Pattern

- Unit tests live under `App/DailyWireUnitTests`.
- Newer focused unit tests use Swift Testing (`import Testing`, `@Test`, `#expect`, `#require`).
- Shared test helpers live in `App/DailyWireUnitTests/TestSupport.swift` and feature-specific support files such as `Services/CarPlay/CarPlayTestSupport.swift`.
- Middleware tests should use stubs such as `MiddlewareClientStub` or feature-specific fake clients.
- Network, feature flags, deeplink, CarPlay, preferences, theme, and view-model behavior already have focused unit coverage.

```text
App/DailyWireUnitTests/
├── Services/
│   ├── CarPlay/
│   ├── Deeplink/
│   ├── FeatureFlags/
│   ├── Network/
│   └── Shorts/
├── UI/
└── TestSupport.swift
```

## Required Standards

- Add or update tests when behavior changes materially.
- Prefer the narrowest test that proves the behavior.
- Keep tests close to the behavior they verify.
- Prefer Swift Testing for new unit tests unless the existing file or target is XCTest-only.
- Reuse existing fixtures, stubs, mock users, middleware clients, network helpers, and test support before adding new test infrastructure.
- Do not introduce broad test scaffolding for a narrow bug fix.
- Do not rely on real backend availability unless the test is explicitly an integration or contract check.
- Never hardcode private credentials, tokens, user identifiers, or production secrets in tests.

## Test Type Expectations

- Unit tests: pure logic, mappers, validators, formatters, entitlement rules, URL parsing, and local business rules.
- ViewModel tests: state transitions, action handling, one-off events, collaborator calls, loading/error/success/offline/restricted behavior.
- Service/provider tests: middleware mapping, auth/session reactions, offline behavior, caching/refresh behavior, analytics metadata, and media/download coordination.
- UI-adjacent tests: theme, text formatting, presentation decisions, and stable view state where it can be tested without fragile snapshots.
- Persistence tests: Realm-backed behavior, UserDefaults-backed stores, migrations/cleanup, and user-scoped data.
- Integration/manual checks: flows that require simulator/device services, Apple host UI, media playback, CarPlay, or external SDK behavior.

## Validation By Change Type

- Do not claim simulator, device, CarPlay, or visual validation unless it was actually performed in the current environment.
- Logic change: focused unit or view-model test.
- SwiftUI UI change: focused state/view-model test when behavior is non-trivial; visual inspection when the change is purely presentational.
- Navigation change: source, destination, back behavior, tab/player visibility, overlay/drawer dismissal, and deeplink behavior when applicable.
- API/network change: mocked response tests plus real-backend checks only when contract confidence is required.
- Persistence change: storage/service tests and migration/cleanup validation.
- Build/config/target change: compile the affected target and reason about all impacted environments.
- Docs-only change: factual consistency review; no build required unless examples are intended to compile.

## Preferred Patterns

- Use deterministic async tests with `async` test functions and explicit awaits.
- Use `#require` to unwrap required fixtures and fail clearly.
- Use stubs/fakes for middleware, network, auth, downloads, analytics, media, and platform collaborators.
- Keep test data small and explicit.
- Prefer mocked middleware for automated feature behavior and reserve real middleware for explicit integration confidence.

## Do / Don't

Do:

```swift
@Test
func loadFeatureTransitionsToAvailable() async throws {
    let client = FeatureTestMiddlewareClient()
    client.response = .success(.fixture)
    let viewModel = FeatureViewModel(provider: FeatureProvider(client: client))

    await viewModel.load()

    #expect(viewModel.uiState.pageState == .available(.fixture))
}
```

Don't:

```swift
func testLoadFeature() {
    sleep(1)
    viewModel.load()
    XCTAssertNotNil(viewModel.page)
}
```

Reason: async tests should wait on deterministic work, not wall-clock sleeps.

Do:

```swift
@Test
func mapperDropsMissingTitle() {
    let item = FeatureTestFixtures.componentItem(title: nil)

    #expect(FeatureMapper().map(item) == nil)
}
```

Don't:

```swift
let result = try await productionClient.getPostPage(
    id: .slug("home"),
    membershipPlan: nil,
    isForced: false
)
#expect(result.article.slug.isEmpty == false)
```

Reason: default automated tests should not depend on backend availability or production data.

## Exceptions

- A trivial copy, spacing, or style-only UI change may not need a new test.
- Legacy tests may use XCTest or older assertion patterns. Preserve local consistency unless updating the pattern is required for the change.
- Real-backend, simulator, CarPlay, or device checks can exist as explicit integration/manual validation, but deterministic PR validation should prefer stubs.

## Validation Expectations

- Each code change should state what was validated and what was not.
- Failed validation must not be reported as passed.
- If validation is blocked by environment, credentials, network, SDK, simulator, CarPlay host, or device availability, report the exact blocker.
- Prefer one focused validation pass first; broaden only when the change touches shared behavior or integration boundaries.
