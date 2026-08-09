---
paths:
  - "**/*.brs"
  - "**/*.bs"
  - "components/**/*.xml"
  - "**/components/**/*.xml"
  - "source/**/*.xml"
  - "**/source/**/*.xml"
  - "bsconfig.json"
  - "**/bsconfig.json"
  - "bslint.json"
  - "**/bslint.json"
  - "manifest"
  - "**/manifest"
---

# Roku Data And Network Standards

## Purpose

Define how Roku code should call backend services, transform data, handle failures, and expose results to ViewModels and SceneGraph views. Roku devices are resource-constrained clients, so backend calls must be deliberate, bounded, cache-aware, and resilient.

## Required Standards

- Shared transport behavior belongs in network services, API wrappers, or Task nodes, not in SceneGraph views or component event handlers.
- ViewModels should depend on app behavior such as `loadHomePage`, `refreshContinueWatching`, or `resolvePlayback`, not raw HTTP clients.
- DTOs and raw JSON represent wire format and MUST NOT leak into UI.
- Mappers MUST convert DTOs into domain or UI-ready models at the data boundary.
- Network errors, HTTP errors, parsing errors, timeout errors, authentication errors, entitlement errors, connectivity errors, and unsupported-content cases MUST be represented explicitly when callers need different behavior.
- Avoid hardcoded endpoints, environment selectors, API keys, tokens, user identifiers, or secrets in feature code and examples.
- Do not add new networking libraries or SDK wrappers unless the existing stack cannot safely support the requirement.

## Be a good backend client

Roku features MUST NOT hammer backend services.

Apply these rules to new or changed network behavior:

- Do not issue a request from every focus move, key repeat, render pass, observer callback, or repeated `init`.
- Debounce or throttle search, pagination, carousel loading, refresh, and remote-driven actions when repeated input can trigger network work.
- Reuse in-flight requests when the same screen asks for the same data.
- Ignore or cancel stale responses when the user navigates away, changes tabs, refreshes again, or starts a newer request.
- Treat force-refresh as an explicit input from a user action or known invalidation event, not the default.
- Cache stable content with an explicit TTL when the product allows it.
- Scope cache keys by account, profile, locale, entitlement, environment, and feature flags whenever those dimensions affect the response.
- Preserve offline behavior when changing caching, refresh, or persistence.
- Do not poll unless the product requires it. Polling must have a bounded interval, stop condition, and backoff on failure.
- Retry only retryable failures. Use bounded retry counts and backoff. Do not blindly retry authentication failures, entitlement failures, malformed responses, or ordinary 4xx responses.
- Bound pagination and batch detail requests to avoid N+1 backend patterns.

## Preferred flow

Request path:

```text
SceneGraph event
-> ViewModel action
-> use case
-> API service / Task node
-> backend
```

Response path:

```text
DTO / raw response
-> mapper
-> domain or UI-ready model
-> explicit result
-> ViewModel state
-> SceneGraph render
```

## API contracts and deep links

When adding or changing an endpoint, mapper, or deep-link handler, document the contract near the service, mapper, or fixture that owns it. Keep examples minimal and explicit.

API contracts should name:

- required fields
- optional fields
- nullable fields
- enum values or known variants
- empty response shape
- representative error response shape
- entitlement, region, auth, or playback restrictions

Example response fixture:

```json
{
  "items": [
    {
      "id": "video-123",
      "title": "Episode title",
      "durationSeconds": 1800,
      "isEntitled": true
    }
  ],
  "nextPageToken": null
}
```

Deep-link contracts should name the route type, required identifiers, optional campaign/source metadata, and fallback behavior when the route cannot be opened.

Example deep-link payload:

```json
{
  "type": "video",
  "id": "video-123",
  "source": "push",
  "campaign": "daily-briefing"
}
```

Validate contract shape before mapping. Do not assume a backend field is present just because it was present in a sample response.

```brightscript
function parseFeatureResponse(json as Object) as Object
  if json = invalid then
    return { status: "error", reason: "invalid_contract" }
  end if

  if not json.DoesExist("items") or json["items"] = invalid then
    return { status: "error", reason: "invalid_contract" }
  end if

  if GetInterface(json["items"], "ifArray") = invalid then
    return { status: "error", reason: "invalid_contract" }
  end if

  return { status: "success", items: json["items"] }
end function
```

## Error handling and user states

Do not display raw backend, transport, or decoding error strings as user-facing copy. Map failures into product-appropriate states and messages.

Represent these states when applicable:

- `loading`: first load or blocking operation
- `content`: successful data with renderable items
- `empty`: successful data with no renderable items
- `refreshing`: content is visible while a refresh is in progress
- `error`: recoverable failure with retry affordance
- `offline`: connectivity failure or known offline mode
- `restricted`: auth, subscription, entitlement, region, age, or playback restriction
- `unsupported`: content or feature not available on the current Roku target

Preserve existing content during refresh failures when that is safer for the user than blanking the screen. Make retry actions explicit and avoid retry loops that the user cannot stop.

## Task nodes and async work

- Use Task nodes for background transport or expensive work that would block UI responsiveness.
- Keep Task nodes focused on one operation. Do not turn one Task into a feature controller.
- Return explicit result objects from Task nodes, including success and failure metadata needed by the ViewModel.
- Include a request ID, generation counter, or equivalent guard when multiple async responses can race.
- Keep parsing and mapping deterministic so it can be tested without a Roku device when the repo supports tests.

## Privacy and observability

- Do not log secrets, auth headers, cookies, session IDs, device identifiers, account identifiers, raw entitlement payloads, raw response bodies, or partner SDK credentials.
- Use bounded analytics and metric dimensions. Do not emit unbounded titles, URLs, emails, user IDs, or raw error payloads.
- Preserve existing telemetry when refactoring network, playback, auth, entitlement, or purchase flows.
- Add useful logging around request category, result category, retry count, cache hit/miss, and user-visible failure state when the repo supports it.

## Validation Expectations

- For new endpoints or request options, test success and representative failure cases.
- For mappers, test null, missing, entitlement, region, and variant fields when backend contracts permit them.
- For cache, refresh, debounce, throttle, or retry changes, test both normal and edge paths.
- For authentication, entitlement, or playback-sensitive requests, verify session behavior without logging secrets or user identifiers.
- For high-traffic or repeated UI actions, verify the change does not issue duplicate or unbounded backend requests.
