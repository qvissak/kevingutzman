---
paths:
  - "DailyWire/**/*.swift"
  - "DailyWireTests/**/*.swift"
  - "DailyWire.xcodeproj/**/*.pbxproj"
  - "**/*tvOS*.swift"
  - "**/*tvOS*.pbxproj"
---

# tvOS Foundations

## Rule Priority

1. Safety, privacy, auth, entitlement, StoreKit, playback correctness, and tvOS platform constraints override all other rules.
2. tvOS standards override iOS standards for tvOS code, even when broad Swift globs cause both rule sets to appear.
3. Existing tvOS project patterns override generic Swift architecture preferences.
4. Narrow bug fixes may preserve local legacy style, but must not introduce new legacy dependencies.
5. New abstractions require evidence from the current codebase and at least one concrete caller or test seam.

## Current Project Shape

- The tvOS app code lives under `DailyWire/`.
- Focused tests live under `DailyWireTests/`.
- App launch and scene setup live under `DailyWire/Main`.
- Screens live under `DailyWire/Screens`.
- Shared views, cells, focus helpers, networking pieces, and protocols live under `DailyWire/Components`.
- Shared app services live under `DailyWire/Services`.
- App-wide dependency registration lives in `DailyWire/Helpers/DI`.
- UIKit is the safer default for existing screens because most of the app is UIKit, especially when the work needs complex focus behavior, advanced collection layouts, or other tvOS-specific UI tricks.
- Prefer SwiftUI for new isolated screens when the UI is simple, predictable, and does not need complex collections or custom focus behavior. Good candidates include profile, sign-in, service menu, and debug menu screens.

## Baseline Standards

- Preserve focus behavior before changing layout, animation, or visual polish.
- Treat remote input, menu/back behavior, preferred focus, and focus guides as part of the feature contract.
- Keep screen-specific behavior close to the screen unless reuse is already proven.
- Use the existing screen, view-model, data-model, service, router, and component patterns before adding a new layer.
- Prefer constructor injection for new collaborators. Use the existing `DIContainer` at app composition, router, controller, or feature-boundary points instead of introducing another dependency system.
- Do not move networking, persistence, auth, purchase, analytics, or playback work into reusable views, cells, or visual components.
- Map backend or storage data into screen-ready models before UI code depends on it.
- Reuse existing buttons, cells, parallax/focus behavior, drawers, loading states, colors, fonts, and layout helpers before adding new UI primitives.
- Do not port iOS-only SwiftUI, Swinject, navigation, or lifecycle patterns into tvOS code unless the tvOS project already uses that pattern locally.

## Future Standards To Add

- Focus and remote input
- UIKit and SwiftUI UI boundaries
- Data and network
- Persistence and preferences
- Playback and player overlays
- Auth, purchase, entitlement, and privacy flows
- Testing and validation

## Validation Expectations

- For UI changes, verify focus entry, focus movement, remote/menu behavior, and the affected screen's selected/default state.
- For navigation or player changes, verify source, destination, dismissal/back behavior, and whether playback or tab/sidebar state should be preserved.
- For service, data, or mapper changes, add or update focused tests when behavior changes.
- For dependency registration or target changes, compile the affected tvOS target when the environment allows it.
- Always report exactly what was validated and what could not be validated.
