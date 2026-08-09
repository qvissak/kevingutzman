---
paths:
  - "**/*.tsx"
  - "**/*.ts"
  - "**/*.jsx"
  - "**/*.js"
  - "**/*.swift"
  - "**/*.kt"
---

# Frontend Architecture (Clean Patterns)

## Scope

This standard applies to UI code across React, iOS, and Android. The concrete APIs differ by platform, but the responsibilities are the same:

- controllers own side effects and workflow state
- presenters shape data for display
- views render

React examples are used below because this document originated in React. Translate the same ideas into ViewModels and views on iOS and Android.

## Core model

Use this mental model when structuring frontend code:

| Responsibility | React | iOS | Android |
|---|---|---|---|
| Controller | Custom hook (`useXyz`) | ViewModel | ViewModel |
| Presenter | Pure function | Pure function / mapper | Pure function / mapper |
| View | React component | SwiftUI view / UIView | `@Composable` function |
| Entity / DTO | Backend model | Backend model | Backend model |

The names differ. The boundary does not.

## What good looks like

A well-structured feature lets a reviewer answer these questions quickly:

- Where is the network call?
- Where is the server-state query or mutation?
- Where is local UI workflow state owned?
- Where is the API data shaped for the UI?
- Which component is just rendering?

If those answers are not obvious, the feature is too tangled.

## Feature structure

Organize frontend code by feature. Co-locate the pieces that change together.

Typical feature structure:

```
src/
└── features/
    └── order-details/
        ├── api/
        ├── hooks/
        ├── presenters/
        ├── components/
        └── types/
```

Use folders only when they earn their keep. A small feature may only need a few files in one directory. The standard is about clear responsibilities, not a mandatory folder count.

## Application structure

At the application level, keep these three layers distinct:

- `core/`: app-wide singletons and configuration such as auth, themes, layouts, and global providers
- `shared/`: generic reusable UI and utilities that do not belong to one feature
- `features/`: domain-specific user-facing functionality

Do not put app-wide concerns inside a feature folder. Do not move feature-owned logic into `shared/` too early just because two files happen to use it once.

## Import boundaries

Protect feature boundaries deliberately.

- Prefer imports from `core/` for app-wide concerns
- Prefer imports from `shared/` for generic reusable code
- Prefer imports from inside the same feature for feature-specific logic
- Avoid cross-feature imports

If Feature A needs code from Feature B, stop and ask whether that logic actually belongs in `shared/` or `core/`.

A useful test: a feature folder should be as close to deletable as possible. If deleting `features/order-details/` breaks unrelated features, your boundaries are probably too weak.

## Responsibilities

### API layer

- Calls backend services
- Returns raw DTOs
- Contains no UI logic

```ts
export async function getOrder(id: string): Promise<OrderDTO> {
  const res = await fetch(`/api/orders/${id}`);
  return res.json();
}
```

### Presenter layer

- Pure functions only
- Converts DTOs into UI-friendly values
- Contains no side effects, no fetching, and no component state

```ts
export function presentOrder(dto: OrderDTO): OrderViewModel {
  return {
    customerName: `${dto.customer.firstName} ${dto.customer.lastName}`,
    statusLabel: dto.status.toUpperCase(),
  };
}
```

Presenter code should be easy to unit test in isolation.

### Controller layer

- Calls the API layer
- Owns side effects
- Owns workflow state
- Coordinates loading, error, empty, and success states
- Applies presenter logic before data reaches the view

```ts
export function useOrder(id: string) {
  const { data, error, isLoading } = useQuery(['order', id], () => getOrder(id));
  const order = data ? presentOrder(data) : null;
  return { order, isLoading, error };
}
```

On iOS and Android, this is the ViewModel layer.

In frameworks like Next.js, this controller logic does not always need to live in a client-side hook. If the work can stay on the server, prefer that shape. A Server Component can load data and pass it directly to the view, with client-side controller logic introduced only where interactivity actually requires it.

### View layer

- Renders UI only
- Receives already-shaped data
- Does not fetch
- Does not hide formatting or workflow logic in the render path

```tsx
export function OrderDetails({ orderId }: { orderId: string }) {
  const { order, isLoading, error } = useOrder(orderId);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  if (!order) return <p>No data</p>;
  return (
    <div>
      <h2>{order.customerName}</h2>
      <p>{order.statusLabel}</p>
    </div>
  );
}
```

Thin leaf components are preferred because they are easier to test and review.

## State ownership

Separate server state from local UI state.

- Server state is data loaded from a backend and refreshed over time.
- Local UI state is selection, modal state, input state, drag state, and other in-progress user interaction.

Do not mix those two concerns casually in one large component or one large hook.

Good examples:

- server state in a query hook / ViewModel
- local form state in a focused workflow hook / ViewModel field
- pure formatting in a presenter

When server state and local workflow state are intertwined, the result is usually fragile and hard to test.

## Testability is a design requirement

Architecture is not only about readability. It determines whether a feature can be tested in small pieces.

Good boundaries create test seams:

- presenters can be unit tested as pure functions
- controllers / ViewModels can be tested around explicit inputs and outputs
- render components can be tested without mocking the whole feature
- workflow logic can be tested without routing, networking, and rendering all in one test

If a feature only feels testable through end-to-end manual QA, its responsibilities are probably too mixed together.

## Proximity principle

Code that changes together should live together.

Keep related API calls, controller logic, presenters, tests, and views close to the feature they serve. Do not centralize code preemptively in the name of reuse. Premature sharing usually makes ownership less clear and increases blast radius when the feature changes.

Promote code into `shared/` only after repeated use proves it is truly shared.

## Avoid these failure modes

### 1. One giant page / screen

A route or screen should compose a feature, not own every detail of it.

Bad smell:

- one file owns fetching, selection, modals, forms, formatting, and rendering

### 2. One giant hook / ViewModel

Do not move a tangled page into a single giant controller and call that architecture.

Bad smell:

- one hook returns a huge bag of unrelated state and actions

Prefer a middle ground:

- small query and mutation hooks
- focused workflow hooks / ViewModel sections
- small render components
- a route or screen that composes those pieces explicitly

### 3. Presentation logic in the view

If the render layer is normalizing DTOs, stitching labels together, or embedding domain rules inline, extract that logic into a presenter.

### 4. UI-specific state in the API layer

Do not leak modal state, formatting, selection, or view concerns into API files.

## Practical heuristics

- Prefer one clear responsibility per file.
- Prefer smaller components when a file starts rendering distinct UI regions with different concerns.
- Prefer focused hooks over one catch-all hook.
- Do not extract abstractions for single use unless they materially improve readability or testability.
- Keep code that changes together close together.
- Promote code into shared modules only after repeated use proves it belongs there.

## Review questions

During review, ask:

- Is each file doing one clear job?
- Is server state clearly separated from local UI state?
- Could a presenter be tested without rendering?
- Could the main workflow be tested without mocking the entire screen?
- Is the route / screen composing the feature, or quietly becoming the feature?
- Did we reduce complexity, or just move it around?

## Final note

The goal is not more files, more folders, or more abstraction.

The goal is code that is easier to test, easier to reason about, and safer to change.
