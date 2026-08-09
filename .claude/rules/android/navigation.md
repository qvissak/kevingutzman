---
paths:
  - "**/*.kt"
  - "**/*.kts"
  - "**/*.gradle"
---

# Navigation Standards

This document describes the current navigation flow and the expected pattern for adding screens, overlay screens, top bar overflow actions, and modal sheets.

## Navigation Layers

The app uses three nested Compose navigation layers:

1. Root app navigation
   - Host: `DWApp`
   - Graph builder: `appGraph`
   - Use for splash, auth, bottom menu entry, settings-style app pages, and full-screen overlay pages.

2. Bottom menu navigation
   - Host: `BottomMenuHost`
   - Graph builder: `bottomMenuGraph`
   - Use only for bottom navigation tab containers such as Home, Catalog, Search, and Profile.

3. Tab navigation
   - Host: `TabHostScreen`
   - Graph builder: `tabHostGraph`
   - Use for screens that should live inside a selected bottom tab stack, such as show, host, article, video, and downloads screens.

Navigation route definitions live in `Destinations`. Route execution goes through `Direction`, `NavigationAction`, `NavigationManager`, and `NavController.navigate(direction)`.

## Overlay Screens

Overlay screens are root graph destinations that are opened above the current tab-host flow. They are for full-screen experiences that should temporarily cover the current tab stack while preserving the tab stack underneath.

Overlay screens do not show the bottom tab menu. They are outside `BottomMenuHost` and `TabHostScreen`, so the user is no longer interacting with the tab navigation UI while the overlay is visible.

Use an overlay screen when:

- The screen is full-screen and should cover the current tab flow.
- The user should return to the previous tab stack when closing it.
- The screen may be opened from multiple tab screens, component cards, or deeplinks.
- The screen needs root-level navigation, back stack behavior, or its own system UI/top bar behavior.

Do not use an overlay screen for:

- A simple modal sheet, picker, drawer, tooltip, or temporary panel.
- A normal tab detail page that should push inside the current tab stack.
- A bottom navigation tab container.

Current primary example: `Shorts`.

- Destination: `Destinations.Shorts`
- Overlay flag: `isOverlayScreen = true`
- Registration: `appGraph` with `composableOverlayPage`
- Typical source: `NavigationHelper.getShortsFeedDirection(...)`
- Root navigation path: `NavigationManager.goTo(direction)`

The important detail: an overlay destination is not added to `tabHostGraph`. It is registered in `appGraph`, then routed through the root `NavigationManager` when a tab-host screen requests it.

Because an overlay screen is outside the tab host, it should be closed before navigating to a normal tab-host destination. Store the target destination in `DeeplinkManager.nextDirection`, close the overlay, and let `TabHostScreen` consume the stored direction when it resumes.

Common overlay usages:

- Open Shorts from a content carousel: build `Destinations.Shorts.getDirections(...)`, mark the direction as overlay through `isOverlayScreen`, and let `TabHostViewModel` forward it to the root graph.
- Open Shorts from a deeplink: parse the URL into `DataType.SHORT_CLIP`, build the Shorts direction in `NavigationHelper`, then route it through `NavigationManager.goTo(...)`.
- Leave Shorts and open a Host screen: store the Host `Direction` in `DeeplinkManager.nextDirection`, close Shorts, then let `TabHostScreen` consume that direction when it resumes.

## Choosing Where a Screen Belongs

Add a screen to `appGraph` when it is outside the bottom-tab experience or should be opened by the root `NavigationManager`.

Add a screen to `bottomMenuGraph` only when it is a bottom navigation tab host destination. This graph should point to `TabHostScreen` and set the tab's start destination.

Add a screen to `tabHostGraph` when it belongs inside a bottom tab stack and should keep the bottom bar/tab-host context.

Add an overlay screen to `appGraph` with `composableOverlayPage` when it must open above the current tab stack instead of inside it.

## Adding a Standard Screen

1. Add a destination in `Destinations`.

```kotlin
object ExampleScreen : Destination<String>() {
    override val root: String = "example_screen"

    override fun argumentToBundle(argument: String?): Bundle {
        return bundleOf(Keys.EXAMPLE_ID to argument)
    }

    object Keys {
        const val EXAMPLE_ID = "example_id"
    }
}
```

Use `Destination<Nothing>` when the screen has no argument. Override `argumentToBundle` only when the screen needs values in `SavedStateHandle`.

2. Register the composable in the correct graph.

For a tab-host screen:

```kotlin
composableHorizontalAnimated(
    route = Destinations.ExampleScreen.route
) {
    ExampleScreen(
        modifier = modifier,
        viewModel = hiltViewModel<ExampleViewModel>(),
        parentTopPadding = parentTopPadding,
        sendHostAction = sendHostAction,
    )
}
```

For a root app screen:

```kotlin
composableHorizontalAnimated(
    route = Destinations.ExampleScreen.route
) {
    ExampleScreen(
        modifier = modifier.padding(top = topPadding),
        viewModel = hiltViewModel<ExampleViewModel>(),
    )
}
```

3. Navigate with `getDirections`.

Inside a tab screen, prefer the existing host callback:

```kotlin
sendHostAction(
    HostTabAction.GoTo(Destinations.ExampleScreen.getDirections(exampleId))
)
```

From app-level view models, prefer a focused `NavigationManagerExt` helper when the destination is reused:

```kotlin
fun NavigationManager.goToExample(exampleId: String) {
    goTo(Destinations.ExampleScreen.getDirections(exampleId))
}
```

For one-off tab content routing from API component items or deeplinks, keep the mapping in `NavigationHelper`.

4. Read arguments through `SavedStateHandle` in the screen view model.

```kotlin
private val exampleId: String? = savedStateHandle[Destinations.ExampleScreen.Keys.EXAMPLE_ID]
```

Do not pass route arguments through globals or unrelated managers when `SavedStateHandle` is enough.

## New Screen Do And Do Not

When adding a new screen, there are usually several technically possible solutions. Choose the smallest solution that fits the current navigation model.

Do:

- Add one `Destinations` entry for the screen.
- Register the screen in the one graph that matches where the screen belongs.
- Use `Destination.getDirections(...)` instead of building route strings manually.
- Use `SavedStateHandle` for destination arguments.
- Navigate inside tab content with `HostTabAction.GoTo`.
- Navigate from app-level view models with `NavigationManager` or a small `NavigationManagerExt` helper.
- Keep the new screen's top bar setup inside that screen with `LocalTopBarUpdater`.
- Add a focused `NavigationHelper` mapping only when API component items or deeplinks need to open the screen.
- Reuse existing animation helpers such as `composableHorizontalAnimated` or `composableOverlayPage`.

Do not:

- Do not add a new `NavHost` for a single screen.
- Do not add a new navigation manager, router, coordinator, or abstraction layer.
- Do not register the same screen in multiple graphs to make navigation "work".
- Do not bypass `Direction` by calling `navController.navigate("raw_route")` from screen code.
- Do not pass screen arguments through singletons, composition locals, managers, or mutable global state when `SavedStateHandle` works.
- Do not move an existing screen between `appGraph`, `bottomMenuGraph`, and `tabHostGraph` unless the task explicitly requires a flow change.
- Do not make a modal sheet a navigation destination just because it needs to appear over a screen.
- Do not make a full-screen overlay a modal sheet if it needs real navigation, back stack behavior, or deeplink support.
- Do not change bottom-tab behavior when adding a non-tab screen.
- Do not introduce custom animations for one screen unless the existing helpers cannot express the required behavior.

Examples:

```kotlin
// DO: route through the tab host when the destination belongs inside the tab stack.
sendHostAction(
    HostTabAction.GoTo(Destinations.ShowScreen.getDirections(showSlug))
)

// DO NOT: navigate with a raw route from tab screen UI.
navController.navigate("show_screen")
```

```kotlin
// DO: keep a reusable app-level navigation helper small.
fun NavigationManager.goToSettings() {
    goTo(Destinations.Settings.getDirections())
}

// DO NOT: create a second app router for one new screen.
class SettingsRouter(...)
```

```kotlin
// DO: keep a sheet as UI state when it dismisses back to the same screen.
if (uiState.showExampleSheet) {
    ExampleSheet(onDismiss = { sendAction(ExampleAction.HideExampleSheet) })
}

// DO NOT: add a Destinations entry for simple temporary sheet state.
object ExampleSheet : Destination<Nothing>()
```

## Adding an Overlay Screen

Overlay screens are full-screen destinations that open on the root app navigation stack while preserving the tab-host stack underneath.

Use this pattern when a screen should appear over tabs, playback, or a current tab stack. Current examples include `Shorts`, which sets `isOverlayScreen = true` and is registered with `composableOverlayPage`.

1. Mark the destination as an overlay.

```kotlin
object ExampleOverlay : Destination<Nothing>() {
    override val root: String = "example_overlay"
    override val isOverlayScreen: Boolean = true
}
```

2. Register it in `appGraph` with `composableOverlayPage`.

```kotlin
composableOverlayPage(
    route = Destinations.ExampleOverlay.route
) {
    ExampleOverlayScreen(
        modifier = modifier,
        viewModel = hiltViewModel<ExampleOverlayViewModel>(),
    )
}
```

3. Trigger it through `HostTabAction.GoTo` or `NavigationManager.goTo`.

`TabHostViewModel` checks `direction.isOverlayScreen()`. If true, it forwards the direction to the root `NavigationManager`; otherwise it navigates inside the tab host.

4. Keep overlay UI self-contained.

Overlay screens should set their own top bar state, back handling, status bar needs, and system UI behavior. Do not rely on the underlying tab screen to clean up overlay UI.

## How Overlay Navigation Works

There are two `NavController` instances involved:

1. `DWApp` owns the root `NavController`.
   - It hosts `appGraph`.
   - It can open root screens and overlay screens.

2. `TabHostScreen` owns a nested tab `NavController`.
   - It hosts `tabHostGraph`.
   - It pushes normal tab-stack screens.

When tab content requests navigation, it sends `HostTabAction.GoTo(direction)` to `TabHostViewModel`.

`TabHostViewModel` checks `direction.isOverlayScreen()`:

```kotlin
if (action.direction.isOverlayScreen()) {
    navigationManager.goTo(action.direction)
} else {
    _events.emit(HostTabEvent.GoTo(direction = action.direction))
}
```

If `isOverlayScreen` is false, the nested tab `NavController` handles the destination.

If `isOverlayScreen` is true, `NavigationManager` sends the direction to the root app graph. `DWApp` receives the navigation event and calls `navController.onNavigationEvent(...)` on the root `NavController`.

This is why overlay screens must be registered in `appGraph`, not `tabHostGraph`.

## Navigating From An Overlay Screen Back Into Tabs

An overlay screen cannot directly navigate with the tab-host `NavController`, because it is running on the root app graph. When an overlay needs to open a normal tab-host screen, use the deferred direction pattern.

Current examples:

- `ShortsViewModel` handles `ShortsAction.GoToHostScreen`.
- `FollowHostViewModel` uses the same deferred direction pattern from a root-level screen.

The pattern:

1. Build the tab-host `Direction`.

```kotlin
val direction = NavigationHelper.getHostDirection(slug = hostSlug)
```

2. Store it in `DeeplinkManager.nextDirection`.

```kotlin
deeplinkManager.nextDirection = direction
```

3. Close the overlay/root screen through root navigation.

```kotlin
navigationManager.goBack()
```

4. `TabHostScreen` resumes after the root screen closes.

5. On resume, `TabHostScreen` asks `TabHostViewModel` for `nextDirection`, clears it, then navigates inside the nested tab `NavController`.

```kotlin
tabHostViewModel.getNextDirectionIfAvailable()?.let { direction ->
    tabHostViewModel.clearNextDirection()
    navController.navigate(direction = direction)
}
```

Use `nextDirection` only for this case: a root-level or overlay screen must close first, then the tab host should continue navigation after it becomes active again.

Do not use `nextDirection` for normal tab-to-tab navigation. Normal tab screens should send `HostTabAction.GoTo(direction)` directly.

## Stored Deeplinks And Overlay Screens

`DeeplinkManager` has two separate deferred values:

- `storeDeeplink(...)` stores parsed URL data as a `Deeplink`.
- `nextDirection` stores a fully built `Direction` to run after a root-level screen closes.

Use stored deeplinks for incoming URLs or URL clicks:

```kotlin
deeplinkManager.storeDeeplink(DeeplinkManager.parseDeeplinkUrl(url))
eventsManager.send(Event.DeeplinkReceived)
```

`TabHostViewModel` listens for `Event.DeeplinkReceived`, calls `getAndClearStoredDeeplink()`, converts the deeplink through `NavigationHelper.prepareDirectionFromUrlData(...)`, then routes it:

- `SHORT_CLIP` opens through `NavigationManager.goTo(...)` because Shorts is an overlay screen.
- Article, video, show, download, and host deeplinks emit `HostTabEvent.GoTo(...)` and navigate inside the tab host.
- Episode, video clip, and fast channel deeplinks may fetch content and start playback instead of navigating to a screen.

`TabHostScreen` also calls `HostTabAction.CheckSavedDeeplink` on resume. This is what makes "store for later" work: a URL can be stored before the tab host is ready, then consumed after login, after a root screen closes, or when the tab host becomes active again.

Use `storeDeeplink(...)` when you have URL-shaped input and still need to parse it.

Use `nextDirection` when you already know the exact tab-host destination but must wait until an overlay/root screen closes before navigating.

Deferred navigation summary:

```text
URL click or incoming URL
-> DeeplinkManager.storeDeeplink(...)
-> Event.DeeplinkReceived, or TabHost resume
-> TabHostViewModel.getAndClearStoredDeeplink()
-> NavigationHelper.prepareDirectionFromUrlData(...)
-> root overlay navigation for SHORT_CLIP, tab navigation for normal destinations
```

```text
Overlay action to open a tab-host destination
-> DeeplinkManager.nextDirection = destinationDirection
-> navigationManager.goBack()
-> TabHostScreen resumes
-> TabHostViewModel clears nextDirection
-> nested tab NavController navigates to destinationDirection
```

Update the top bar from the screen with `LocalTopBarUpdater`, usually from `LaunchedEffect` when the values that affect the bar change.

## Modal Sheets

Modal sheets are UI state, not navigation destinations. Use `ModalBottomSheet` when the user should stay in the current screen context and dismiss back to the same screen.

Use a screen-local sheet when the sheet belongs only to that screen. Examples include picker-style sheets such as `SeasonsPickerBottomSheet`.

Use app-level overlay state in `DWAppViewModel` when the sheet can be launched from multiple areas or global events. Existing examples include description, EPG details, host notification, onboarding, upsell, playback, and connectivity sheets.

Standard modal sheet pattern:

```kotlin
if (uiState.exampleSheetData != null) {
    ExampleSheet(
        data = uiState.exampleSheetData,
        onDismiss = { sendAction(ExampleAction.HideExampleSheet) },
    )
}
```

Inside the sheet composable:

```kotlin
val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

ModalBottomSheet(
    sheetState = sheetState,
    onDismissRequest = onDismiss,
    containerColor = ExampleSheetColor,
    dragHandle = { ExampleDragHandle() },
) {
    ExampleSheetContent(...)
}
```

For full-screen or player sheets, follow the existing `PlaybackOverlay` approach: keep the sheet in `DWApp`, drive visibility from `DWUiState`, and close it by sending the corresponding `DWAction`.

## Back Handling

Use `NavigationManager.goBack()` for root graph back actions.

Use `HostTabAction.GoBack` inside tab-host screens so `TabHostViewModel` can pop the nested tab `NavController`.

Use local `BackHandler` only for transient UI that is not a navigation destination, such as modal sheet sub-states or in-sheet panels.

## Animation Standards

Use `composableHorizontalAnimated` for normal page pushes.

Use `composableOverlayPage` for overlay screens that should slide over the current page and pop back as an overlay.

Use `composableSlideInUpSlideOutDown` only when the requested behavior is explicitly vertical.

Do not define one-off animation specs in a screen unless the existing navigation animation helpers cannot express the required behavior.

## Validation Checklist

Before considering a navigation change complete:

- The destination exists in `Destinations`.
- The destination is registered in exactly one appropriate graph.
- Arguments are defined with keys and read through `SavedStateHandle`.
- Overlay destinations set `isOverlayScreen = true` and use `composableOverlayPage`.
- Tab-host screens navigate through `HostTabAction`.
- App-level screens navigate through `NavigationManager`.
- Modal sheets are driven by explicit UI state and clear that state on dismiss.
- Top bar overflow actions are represented as `OverflowMenuAction`, not as separate fake routes.
- A relevant narrow validation command is run for code changes, usually `./gradlew :app:assembleProdDebug` or `./gradlew :app:testProdDebugUnitTest`.
