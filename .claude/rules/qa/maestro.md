---
paths:
  - ".maestro.yaml"
  - ".maestro.yml"
  - "**/.maestro.yaml"
  - "**/.maestro.yml"
  - "**/.maestro/**/*.yaml"
  - "**/.maestro/**/*.yml"
  - "**/maestro/**/*.yaml"
  - "**/maestro/**/*.yml"
  - "flows/**/*.yaml"
  - "flows/**/*.yml"
  - "**/flows/**/*.yaml"
  - "**/flows/**/*.yml"
  - "*.maestro.yaml"
  - "*.maestro.yml"
  - "**/*.maestro.yaml"
  - "**/*.maestro.yml"
---

# Maestro Mobile E2E Standards

## Test purpose and regression value

You must make every Maestro flow prove a behavior a user can observe or a regression risk the team explicitly cares about. Do not add flows that only tap through screens, warm caches, or verify that navigation happened without asserting the product outcome.

You must assert after important actions, especially state changes, navigation, persistence, entitlement gates, error states, and platform-specific branches. Prefer assertions close to the action that creates the expectation instead of one broad assertion at the end.

Name flows by the behavior they prove, not the mechanics they perform:

```yaml
name: Free user is blocked from premium playback
tags: [regression, entitlement]
```

## Idempotence and state control

You must make each flow safe to run repeatedly, alone, in parallel where the runner allows it, and after a failed previous run. Never rely on test execution order.

You must establish the starting state inside the flow or its setup subflows. Control clean app state, warm app state, login/session state, keychain state, server-side fixtures, local storage, permissions, feature flags, and seeded test accounts deliberately. Use `launchApp`, `clearState`, `clearKeychain`, `onFlowStart`, `onFlowComplete`, and `runFlow` where they make the state contract explicit.

Use setup and teardown flows when a scenario mutates server data, local data, entitlements, notification state, downloads, preferences, or permissions. You must use unique or resettable test data for destructive or mutating scenarios. Do not share mutable accounts unless the suite resets them before every run.

## Flake resistance

You must keep selectors, data, environment, and assertions deterministic. Do not use arbitrary sleeps as the default fix for timing. Prefer Maestro waits, retries, and assertions that wait for a concrete UI condition, such as a loading view disappearing, a specific element becoming visible, or a disabled control becoming enabled.

You must handle animations, network latency, loading states, slow devices, keyboards, system permission dialogs, app background/foreground behavior, and app restarts explicitly when they affect the flow. If a test is flaky, investigate the product state, selector, fixture, timing condition, and device configuration before increasing retries.

Overbroad retries hide signal. Use retries only around a known asynchronous condition, and keep the assertion that proves success visible in the flow.

## Maestro YAML structure

You must keep Maestro `*.yaml` files small, named by intent, and readable in review. Put `appId`, `name`, `tags`, and `env` at the top when the flow owns them. Use `onFlowStart` and `onFlowComplete` for setup and cleanup that must always run. Use `launchApp` with `clearState` or `clearKeychain` only when the scenario requires that isolation; otherwise state the warm-state assumption through setup.

Prefer reusable subflows for repeated behavior such as login, logout, onboarding dismissal, permission handling, navigation to common screens, fixture setup, and cleanup. Keep subflows small and parameterize them through `env` when the same intent needs different accounts, entitlement states, feature flags, or platform values.

```yaml
- runFlow:
    file: ../shared/login.yaml
    env:
      ACCOUNT_TYPE: free
```

Do not create giant flows, hidden coupling between flows, or clever control flow that obscures the behavior under test. Use scripts only when YAML cannot express deterministic setup or assertions clearly, and keep script inputs and outputs explicit.

Avoid Maestro header comments that end a line with `->`. `maestro-runner` 1.1.19 has a known parser bug that can reject otherwise-valid flows before test execution when a comment in the pre-`---` config section ends with that token (https://github.com/devicelab-dev/maestro-runner/issues/119). Reword arrow-style navigation comments so no comment line ends with `->`.

## Selectors and accessibility

Prefer stable accessibility identifiers or IDs for important controls, destinations, list items, and state indicators. Use stable selectors for both interactions and assertions, including `tapOn`, `assertVisible`, `assertNotVisible`, and waits. New app UI that needs E2E coverage must expose stable identifiers on both iOS and Android.

Use visible text selectors when the copy is stable user-facing contract text or when the test intentionally validates that copy. Do not use text selectors for CMS-managed, localized, personalized, or experiment-controlled content unless the data is seeded by the test.

Avoid coordinate, point, index, visual, or position-only selectors unless no stable alternative exists. Coordinate and point-based assertions such as `assertVisible` with `point` are allowed only when the flow cannot target a stable element, and the flow must document why. Handle duplicated text, repeated buttons, lists, and dynamic content by selecting a stable parent, unique identifier, or seeded item rather than tapping the first match.

During PR review, Cursor/Bugbot reviewers should comment when a Maestro flow uses coordinates, points, indexes, visual matching, or position-only selectors where a stable selector is available or should be added to the app UI.

## Cross-platform mobile behavior

You must account for iOS and Android differences deliberately. Shared flows are allowed only when behavior and selectors are genuinely shared. Use separate platform-specific flows when the UX, system UI, selectors, navigation model, or OS behavior diverges.

Cover platform-specific system dialogs, permissions, keyboards, date and time pickers, back behavior, deep links, notifications, biometrics, network permissions, and OS version differences when the scenario touches them. Do not let one platform passing imply the other platform is covered.

## Edge cases and negative paths

You must cover high-value edge cases, not only happy paths. Add Maestro coverage for negative paths when the end-to-end wiring is the risk: invalid credentials, expired sessions, missing entitlements, empty states, offline or degraded network, API failures, disabled controls, validation errors, permission denied, background/resume, app restart persistence, and interrupted flows.

Every negative-path flow must assert the correct error, fallback, recovery path, or blocked action. Do not stop after triggering the failure condition.

## CI and maintainability

You must ensure Maestro flows run consistently in CI on known simulator, emulator, or device configurations. Tag tests by purpose, such as smoke, regression, platform, entitlement, or feature area, using the repo's established tag vocabulary.

Make failures diagnosable through clear names, close assertions, screenshots or logs where available, and deterministic setup. Quarantined or skipped flows must include an owner, ticket, reason, and re-enable condition. Test changes must be reviewed like production code, including fixture changes, selector changes, and CI configuration.

## Avoid

Never write order-dependent flows, shared mutable accounts without reset, arbitrary sleeps as synchronization, coordinate-first selectors, assertions only at the end, flows that only verify navigation, overbroad retries, environment-dependent assumptions, untagged critical tests, silent skips, or platform-specific behavior hidden inside a supposedly shared flow.

## Review checklist

- Does the flow prove a user-visible behavior or known regression risk?
- Can it run repeatedly without depending on previous test order or leftover state?
- Are setup, teardown, app state, keychain state, session state, permissions, feature flags, and test data controlled?
- Are selectors stable, accessible, and valid for duplicated text, lists, dynamic content, and localization-sensitive copy?
- Did review flag any coordinate, point, index, visual, or position-only selector that could use a stable ID, accessibility identifier, stable parent, or seeded item instead?
- Are assertions placed after meaningful actions and specific enough to diagnose failure?
- Are edge cases, negative paths, entitlement gates, persistence, and platform branches covered where relevant?
- Are waits tied to concrete UI conditions instead of arbitrary sleeps?
- Are shared and platform-specific flows split according to real iOS and Android behavior?
- Are `name`, `tags`, `env`, `runFlow`, scripts, retries, and cleanup readable and scoped?
- Is the flow ready for CI with useful failure evidence and no silent skips?
