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

# Roku Foundations

## Rule Priority

1. Safety, privacy, auth, entitlement, playback correctness, backend protection, and Roku platform constraints override all other rules.
2. Roku standards override generic frontend standards for Roku files when the guidance is more specific.
3. Existing Roku project patterns override generic architecture preferences.
4. Narrow bug fixes may preserve local legacy style, but must not introduce new legacy dependencies.
5. New abstractions require evidence from the current codebase and at least one concrete caller or test seam.

## Tooling and linting

Adopt bslint's default code standards as the primary Roku coding guideline. When the repo has BrightScript tooling, use `brighterscript` and `@rokucommunity/bslint` through the repo's existing scripts.

Apply these without exception:

- Run the narrowest available lint command, such as `npm run lint`, `npx bslint`, or the repo's equivalent, before declaring Roku code complete.
- Do not weaken `bsconfig.json`, `bslint.json`, `diagnosticFilters`, or ignore rules to hide real issues.
- Do not leave `stop` statements in production code.
- Do not introduce bare TODOs. Follow the repository-wide `TODO(PROJ-1234): ...` rule.
- Do not commit developer device IPs, passwords, tokens, API keys, or partner secrets in launch configs, manifest changes, tests, docs, or examples.

## File and component shape

Use the existing project structure before inventing a new one. For new SceneGraph views and screens, prefer one directory per component:

```text
components/
└── MainPage/
    ├── MainPage.xml
    └── MainPage.brs
```

Apply these defaults:

- Component, screen, class-like factory, and XML component names MUST use PascalCase.
- Variables, functions, methods, and local helpers MUST use camelCase.
- Use 2 spaces for indentation.
- Keep component XML responsible for structure and default visual configuration.
- Keep component `.brs` files focused on wiring nodes, observing fields, rendering state, and forwarding user events.
- Move reusable business rules, data shaping, networking, storage, SDK calls, and analytics out of component view files.
- Keep feature-owned files close together unless reuse is already proven.

## BrightScript file standards

- Put spaces around operators such as `=`, `+`, `-`, `*`, and `/`.
- Pass event objects as the first argument to event handlers and event-forwarding functions.
- In `init`, find nodes in the same order they appear in the XML whenever practical.
- Keep `init` small: initialize fields, find nodes, attach observers, construct injected collaborators, and set the first explicit UI state.
- Guard optional nodes, optional fields, and variant backend data before use. Do not assume malformed content cannot happen.
- Prefer named helpers over deeply nested `if` blocks or repeated inline conditions.
- Avoid global mutable state. If a dependency is needed, pass it through a factory, ViewModel constructor, component field, or app composition point.
- Do not hide side effects in formatting helpers, mappers, or view-rendering functions.

## BrightScript gotchas

BrightScript lacks the null-safety and module scoping that engineers may expect from Swift, Kotlin, or TypeScript. Guard the sharp edges explicitly.

The `m` pointer is contextual, not global. In a component script, `m` belongs to that component instance. In `main.brs` or source files, `m` belongs to that app or module context. Do not assume state written to `m` in one context exists in another context.

Roku execution contexts are separated. Main/source code, SceneGraph component code, and Task-node work must communicate through fields, observers, messages, or explicit return values. Do not pass SceneGraph nodes into background work and mutate them directly.

```brightscript
sub onTaskResult(event as Object)
  result = event.getData()

  if result <> invalid
    m.top.setField("content", result)
  end if
end sub
```

Check for `invalid` before calling properties, methods, or interfaces on values that came from XML, JSON, Task nodes, SDKs, storage, or associative arrays.

```brightscript
sub init()
  m.myNode = m.top.findNode("myNodeID")

  if m.myNode <> invalid
    m.myNode.observeField("myField", "onFieldChanged")
  end if
end sub
```

Never read a property from a value that might be `invalid`.

```brightscript
if node <> invalid and node.text = "hello"
  showGreeting()
end if
```

Use `m.top.observeField()` or node-specific `observeField()` calls to react to data changes. Do not poll fields, timers, or render loops just to notice state updates.

```brightscript
sub init()
  m.top.observeField("content", "onContentChanged")
end sub

sub onContentChanged(event as Object)
  content = event.getData()
  renderContent(content)
end sub
```

Use exact SceneGraph IDs and guard the result. Do not use jQuery-style selectors or inferred IDs.

```brightscript
button = m.top.findNode("primaryButton")

if button <> invalid
  button.observeField("buttonSelected", "onPrimaryButtonSelected")
end if
```

Do not rely on JavaScript-style global scopes. Pass associative arrays, dependencies, and state explicitly into functions or factories.

```brightscript
sub configurePlayback(item as Object, deps as Object)
  if item = invalid or deps = invalid then return

  if deps.DoesExist("analytics") and deps["analytics"] <> invalid and item.DoesExist("id")
    deps["analytics"].trackPlaybackStart(item["id"])
  end if
end sub
```

SceneGraph field names are case-sensitive even though BrightScript syntax is generally case-insensitive. Match XML field IDs exactly from `.brs` code.

```xml
<interface>
  <field id="myData" type="assocarray"/>
</interface>
```

```brightscript
m.top.myData = { title: "Featured" }
```

Use bracket access or `DoesExist()` for dynamic associative-array keys from JSON. Dot access is only safe for known keys that definitely exist.

```brightscript
if item <> invalid and item.DoesExist("title") and item["title"] <> invalid
  title = item["title"]
end if
```

Avoid deeply nested `if`, `for`, and `while` blocks. BrightScript requires explicit `end if`, `end for`, and `end while`, and deep nesting becomes hard to parse and easy to break. Extract named helpers before a function needs more than two levels of control-flow nesting.

## SceneGraph node lifecycle

- `CreateObject("roSGNode", "SomeNode")` creates a node object, but it will not render until it is attached to the graph through a parent, usually with `appendChild()` or `createChild()`.
- Do not call `createChild()` repeatedly inside loops, observers, or dynamic update functions without reusing nodes or clearing existing children first.
- Before replacing dynamic children, use the repo's established cleanup helper or a direct child-clear operation such as `removeChildren()`.
- Prefer stable child IDs and reusable render helpers over rebuilding a whole subtree for small state changes.

## SceneGraph XML standards

- Do not put spaces around `=` in XML attributes.
- Put the `id` attribute immediately after the element name when an element has an ID.
- Do not add a space before the closing slash in self-closing tags.
- When a component has three or fewer attributes, keep it on one line.
- When a component has more than three attributes, put each attribute on its own line.
- Use a space after each comma in XML array values.
- Keep `<interface>`, `<script>`, and `<children>` sections predictably ordered and indented.
- Do not add behavior by hiding magic values in XML fields. If a value controls workflow, document it in code or move the decision into a named ViewModel or mapper function.

## Validation Expectations

- For syntax/style changes, run bslint or the repo's equivalent.
- For component XML or view changes, verify focus entry, focus movement, remote key handling, loading, error, empty, and selected/default states when applicable.
- For dependency, manifest, config, or packaging changes, compile/package the channel when the environment allows it.
- For SDK, auth, entitlement, playback, or backend-impacting changes, validate the affected flow on the closest available Roku target and state what could not be validated.
