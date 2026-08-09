---
paths:
  - "**/*.swift"
  - "**/*.pbxproj"
---

<!--
What: iOS deeplink routing standards for URL-shaped input.
Who calls it / when: Engineers and AI agents read this before changing deeplink parsing or routing.
Gotchas: Keep parsing, mapping, and route execution separated.
-->

# iOS Deeplink Routing Standards

## Purpose

Define how URL-shaped input is parsed, stored, converted to navigation or playback targets, and routed in the existing iOS project.

Deeplinks are navigation input. Keep URL parsing, destination mapping, and final route execution separated so URL support does not leak into screens, SwiftUI views, cards, sheets, or media components.

## Current Project Pattern

- Deeplink models and parsing live under `App/DailyWire/UI/Deeplinker`.
- App entry points and external URL handling enter through app/root flow code.
- Root and main view models coordinate when stored or incoming deeplinks should be consumed.
- Media playback has its own route for playback-first content.
- Unit coverage for deeplink parsing and routing behavior lives under `App/DailyWireUnitTests/Services/Deeplink`.

```text
App/DailyWire/UI/Deeplinker/
├── Deeplink.swift
└── Deeplinker.swift

App/DailyWireUnitTests/Services/Deeplink/
└── DeepLinkUnitTests.swift
```

## Required Standards

- Keep URL parsing in the deeplink layer.
- Keep deeplink-to-screen or deeplink-to-playback mapping out of reusable UI.
- Store or pass parsed deeplink data, not raw URL strings, once parsing has succeeded.
- Consume stored deeplinks once; do not allow the same incoming URL to route repeatedly across app lifecycle events.
- Use explicit routing branches for normal screen navigation, overlay navigation, and playback-only behavior.
- Do not parse URLs inside SwiftUI views, cards, drawers, player controls, CarPlay templates, or reusable components.
- Do not add a screen destination just to handle playback-only content unless product behavior changes.
- Unsupported or malformed URLs must resolve to an unknown/no-op path and fall back to browser handling when appropriate.

## Preferred Routing Flow

Incoming URL:

```text
URL input
-> Deeplinker parses URL into Deeplink
-> root/main flow stores or receives parsed deeplink
-> routing helper maps deeplink to screen, overlay, or playback action
-> coordinator/view model executes route
```

Deferred route after auth or overlay close:

```text
Parsed route target
-> store as pending app/navigation state
-> complete auth or close overlay
-> consuming flow executes target once
-> clear pending target
```

## Do / Don't

Do:

```swift
if let deeplink = Deeplink(url) {
    rootViewModel.handle(deeplink)
} else {
    openExternally(url)
}
```

Don't:

```swift
if url.absoluteString.contains("/article/") {
    coordinator.openArticle(slug: url.lastPathComponent)
}
```

Reason: URL parsing and route execution must stay separated.

Do:

```swift
func route(_ deeplink: Deeplink) {
    switch deeplink.route {
    case .post:
        coordinator.openArticle(slug: deeplink.slug)
    case .episode:
        mediaCenter.play(slug: deeplink.slug, source: .deeplink)
    }
}
```

Don't:

```swift
struct ArticleCard: View {
    let url: URL
    let deeplinker: Deeplinker

    var body: some View {
        Button("Open") {
            deeplinker.process(url)
        }
    }
}
```

Reason: reusable UI must not know URL path rules or instantiate deeplink dependencies.

## Validation Expectations

- When adding or changing a URL path mapping, add focused tests for parsing.
- When adding or changing destination mapping, add focused tests for route selection.
- When changing playback-first deeplinks, verify media service behavior and analytics source metadata.
- When changing deferred routing, test that the route is consumed once and cleared.
