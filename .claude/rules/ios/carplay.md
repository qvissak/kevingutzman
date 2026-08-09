---
paths:
  - "**/Services/CarPlay/**/*.swift"
  - "**/*CarPlay*.swift"
  - "**/*CarPlay*Tests.swift"
---

<!--
What: iOS CarPlay engineering standards for the DailyWire app.
Who calls it / when: Engineers and AI agents read this before changing Swift CarPlay code.
Gotchas: CarPlay work is safety-sensitive and must stay inside Apple's template model.
-->

# iOS CarPlay Standards

## Purpose

Define how the existing iOS project should expose catalog, playback, offline, and auth behavior through Apple CarPlay while preserving the current app architecture and CarPlay host constraints.

## Current Project Pattern

DailyWire CarPlay code lives under `App/DailyWire/Services/CarPlay` and is wired through `Injector.ServiceAssembly`.

```text
CarPlaySceneDelegate
    ↓
CarPlaySessionService
    ↓
CarPlayCoordinator
    ↓
CarPlayLibraryProvider
    ↓
CarPlayArticleProvider / CarPlayEpisodeProvider / CarPlayDownloadsProvider
    ↓
CarPlayMediaItemMapper
    ↓
CarPlayTemplateBuilder
    ↓
CPListTemplate / CPTabBarTemplate / CPNowPlayingTemplate
```

## CarPlay Platform Constraints

- CarPlay UI must use Apple-provided templates appropriate for the app category.
- Keep navigation depth and list size within CarPlay host limits.
- Do not create unbounded navigation from backend rails, categories, topics, tags, or collections.
- Use only `CPNowPlayingTemplate.shared` for Now Playing.
- Do not present Now Playing modally.
- Re-check connection/session state before mutating templates after async work completes.
- Call selection completion handlers exactly once.

## Required Standards

- Keep CarPlay code under `Services/CarPlay` unless the change is app delegate wiring, dependency registration, localization, tests, or a shared service contract.
- Do not assume every vehicle displays the same number of list items.
- Keep root tabs and child lists short, deterministic, and safe to truncate.
- When a backend rail is too large for CarPlay, apply explicit filtering, ordering, or pagination before template creation.
- Keep all `CPInterfaceController`, `CPTemplate`, `CPListItem`, and `CPNowPlayingTemplate` mutation on the main actor.
- Route item selection through `CarPlayItemAction` (`play` or `open`) rather than branching on DTO type in the coordinator.
- Use stable `CarPlayMediaID` values for parent IDs and special message rows. Do not derive parent IDs from localized titles.
- Use localized `DW.Text.CarPlay` strings for every visible label, empty message, alert, and tab title.
- Keep template construction in `CarPlayTemplateBuilder`; providers return `CarPlayItem` data, not `CPListItem` or `CPTemplate`.
- Keep catalog routing in `CarPlayLibraryProvider`; individual providers should not know template stack details.
- Keep playback side effects in `CarPlayPlaybackService`; the coordinator can request playback, but it should not manipulate `MediaCenter` directly.
- Include analytics metadata with location/referrer set to `CarPlay` for playable catalog items.
- Prefer square artwork. When only landscape artwork is available, normalize it to a face-cropped square URL before handing it to templates.

## Auth, Entitlement, And Offline Behavior

- Logged-out users should see a root-level continue-on-phone item and no playable child content.
- Free users must not see paid-only downloads or paid-only playable content.
- Apply subscription and availability filters before creating playable items.
- Filter upcoming or unsupported playback items unless the product explicitly defines a safe non-play action.
- Online-only tabs must not start middleware requests while offline.
- Downloads may remain available offline for entitled users.
- When offline, show lightweight disabled message rows or offline-safe More content instead of empty interactive lists.
- On auth or session changes, clear CarPlay catalog caches and force a reload so stale entitlement state does not remain visible.

## Navigation And Lifecycle

- Set a loading root template before asynchronous catalog load work.
- Store one task per active load path and cancel previous tasks before replacing them.
- On disconnect, remove now-playing observers, cancel catalog and refresh tasks, clear template/list caches, and stop updating CarPlay now-playing controls.
- Use `defer` where possible to guarantee completion on success, failure, cancellation, and unsupported-selection paths.
- Do not leave a selected CarPlay row in a loading state after cancellation or disconnect.
- Present a CarPlay alert for unsupported or failed playback instead of silently ignoring selection.
- Never instantiate, wrap, or present a separate now-playing template.
- Before pushing Now Playing, inspect the current CarPlay template stack and pop to the existing shared template when present.
- Keep Up Next derived from the current playable article queue; do not expose arbitrary backend lists through the now-playing up-next button.

## Data And Mapping

- Do not expose middleware DTOs directly to CarPlay templates.
- Map content into `CarPlayItem` with ID, title, subtitle, optional image URL, optional source rail, analytics metadata, and explicit action.
- Keep subtitle formatting deterministic and compact. CarPlay list rows should be scannable without long descriptive text.
- Resolve article list items into playable article audio only when the article page has an audio URL.
- Resolve downloaded content before playback so offline episodes/articles use local assets when available.
- Keep source rail and element position metadata when mapping rails so analytics can distinguish CarPlay rows.

## Validation Expectations

- Add or update Swift Testing coverage for CarPlay routing, mapping, entitlement, offline behavior, downloads, playback queue logic, and template-builder state updates when those behaviors change.
- Use CarPlay test fixtures and middleware stubs instead of real middleware.
- Test logged-out, free-user, paid-user, online, and offline paths when the change touches catalog availability.
- Test mapper filtering for paid-only content, upcoming content, missing audio URLs, unsupported content, artwork fallback, and analytics metadata.
- For scene, template, or now-playing changes, run the narrowest available unit tests and manually inspect on a CarPlay-capable simulator or device when the behavior depends on Apple's host UI.
- If CarPlay simulator/device validation is not available, state that explicitly in the handoff and describe the unit coverage that substitutes for it.
