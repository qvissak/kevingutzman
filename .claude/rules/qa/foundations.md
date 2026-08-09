---
paths:
  - "**/tests/**"
  - "**/__tests__/**"
  - "**/e2e/**"
  - "**/qa/**"
  - "**/cypress/**"
  - "**/playwright/**"
  - "**/*.feature"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.test.js"
  - "**/*.test.jsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "**/*.spec.js"
  - "**/*.spec.jsx"
  - "**/*_test.go"
  - "**/test_*.py"
  - "**/*_test.py"
  - "**/conftest.py"
  - "**/pytest.ini"
  - "**/*Test.kt"
  - "**/*Tests.swift"
  - "**/*UITests.swift"
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

# QA Foundations

## Stable and deterministic tests

Tests MUST NOT be flaky. A test should pass or fail for a product reason, not because of timing, ordering, shared state, randomness, or environment residue.

Apply these rules without exception:

- Do not use arbitrary sleeps as synchronization. Wait for a specific state, event, response, job completion, or UI condition.
- Control time, randomness, network responses, and feature flags when the behavior depends on them.
- Do not depend on test execution order.
- Do not share mutable test data between tests unless the fixture is read-only.
- Keep retries from becoming a hiding place. If a retry passes after an earlier failure, treat that as a flake to investigate.
- Make selectors and assertions stable. Prefer roles, labels, durable IDs, API contracts, and domain outcomes over incidental DOM structure or copy.

If a test is flaky, fix it or quarantine it with a ticket, owner, and expiration. Do not silently disable it or leave it retried forever.

## Playwright best practices

Playwright tests should use web-first, user-facing interactions by default. Prefer `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText` for stable contract text, and durable test IDs when accessible selectors cannot express the target. Avoid brittle CSS selectors, XPath, `nth()` chains, and assertions against incidental DOM structure.

Use Playwright's auto-waiting assertions instead of manual timing. Prefer `await expect(locator).toBeVisible()`, `toHaveURL`, `toHaveText`, `toHaveCount`, or a specific response/event wait. Do not use `page.waitForTimeout()` except as a temporary debugging aid that is removed before merge.

Keep Playwright tests independent and parallel-safe:

- Seed state through APIs, factories, or fixtures instead of long UI setup.
- Clean up created data with fixture finalizers, `test.afterEach`, or test-owned TTL data.
- Use `storageState` deliberately for account types, and do not mutate shared authenticated state across tests.
- Model entitlement/account coverage with projects, fixtures, or explicit test data rather than one mutable shared user.
- Mock or route noisy third-party dependencies when the product behavior under test does not require the real service.

Avoid forceful or implementation-heavy actions. Do not use `force: true`, hardcoded slow timeouts, `page.evaluate`, or direct DOM mutation unless the test is specifically about that browser behavior and the reason is documented in the test.

Use traces, screenshots, and video to make failures diagnosable, especially in CI and on retries. Screenshots should be primary assertions only for intentional visual regression coverage; most product behavior should be asserted through accessible UI state, URL changes, API contracts, or durable domain outcomes.

## Idempotency and state cleanup

Automated tests MUST be idempotent. A test should be safe to run once, repeatedly, in parallel, or after a failed previous run.

When a test creates state, it must own that state:

- Create unique users, records, subscriptions, orders, articles, or other entities per test run when possible.
- Prefer setup through APIs, factories, fixtures, or seed helpers instead of fragile UI setup.
- Tear down created state in cleanup hooks, `finally` blocks, or explicit fixture finalizers.
- If teardown is impossible, create data with unique prefixes and TTL/expiration behavior so it cannot affect future runs.
- Never rely on a shared account whose mutable state is changed by multiple tests.
- Never require a human to clean up routine test data.

Isolation matters more than speed. Optimize setup only after the test is reliable.

## Account and entitlement coverage

Every feature that changes behavior by identity, subscription, entitlement, or access level must be tested against the relevant account types.

Consider at least:

- anonymous / logged out
- free registered user
- Insider monthly
- Insider annual
- All Access
- lifetime
- Readers Pass
- expired, canceled, grace-period, or otherwise edge-case entitlement states when the feature cares about them

Do not assume one paid user covers all paid behavior. If monthly, annual, All Access, lifetime, and Readers Pass users see different navigation, content access, billing, ads, comments, downloads, or calls to action, the test plan must cover those differences.

For each feature, state which account types are in scope and why. If a type is intentionally excluded, the reason should be clear from the test name, test plan, or PR description.

## Edge cases and negative paths

Tests should cover the behavior users and systems actually depend on, including edge cases:

- empty, loading, partial, and error states
- permission denied and unauthenticated states
- expired, missing, malformed, or conflicting data
- slow dependencies, failed network calls, and retries
- pagination, sorting, filtering, and boundary values
- duplicate submissions and back/refresh behavior
- mobile, tablet, and desktop breakpoints when layout affects behavior

Do not test only the happy path when the failure path is part of the product contract.

## Avoid brittle configurable-content assertions

Do not write tests that depend on exact values managed outside the repo unless the purpose of the test is to validate that configuration contract.

Examples of brittle assertions:

- checking that a specific CMS article title, hero image, shelf label, promo copy, or price text appears
- checking copy or values that can be changed in `dailywire-cms-2`
- checking item order when the order is editorially or administratively configurable

Prefer assertions against stable behavior:

- the page renders the expected content region for the account type
- locked content blocks anonymous or free users and allows entitled users
- a CMS-driven value is present and linked according to the contract, without pinning the exact editorial value
- the API response matches the schema and entitlement rules
- the UI exposes an accessible control with the expected role or purpose

When exact content is the product requirement, seed controlled test content or assert against a fixture owned by the test.

## Pick the right test layer

Use the smallest reliable test layer that proves the behavior:

- Unit tests for pure logic, mappers, validators, presenters, and policy rules.
- API or integration tests for service contracts, persistence, caching, entitlement checks, and third-party boundaries.
- Component or screen tests for UI states and user interactions that do not require a full stack.
- End-to-end tests for critical journeys, cross-service wiring, and high-value entitlement boundaries.

Do not push every behavior into end-to-end tests. E2E tests are valuable, but they are slower, more fragile, and harder to debug than focused lower-layer tests.

## CI ownership and failure triage

A failing test is a release signal. Treat it as either a product regression, a test bug, or an environment issue that needs ownership.

Apply these rules:

- Do not merge by ignoring a failing test unless there is an explicit owner and follow-up ticket.
- Do not delete coverage because it is inconvenient; replace it with a better test if the old one was wrong.
- Quarantined tests must include the reason, owner, ticket, and criteria for re-enabling.
- Test names should describe the behavior and conditions, not implementation trivia.
- Test output should make failures diagnosable without rerunning locally five times.

## Review questions

During review, ask:

- Can this test run repeatedly and in parallel without state collisions?
- Does the test clean up the state it creates?
- Is the test waiting on a real condition instead of sleeping?
- Are all relevant account and entitlement types covered?
- Are edge cases and negative paths covered where product behavior depends on them?
- Is the assertion stable, or can CMS/configuration changes break it without a product regression?
- Is this behavior tested at the smallest reliable layer?
- For Playwright tests, are locators user-facing, waits condition-based, state isolated, and failure artifacts useful?
