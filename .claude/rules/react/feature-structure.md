---
paths:
  - "**/*.tsx"
  - "**/*.ts"
  - "**/*.jsx"
  - "**/*.js"
---

# React Feature Structure

## 1. Start flat

When you add a new feature folder, start flat. Put the components, hooks, presenters, types, and tests for that feature side-by-side in one directory.

```
features/members-only-gate/
├── MembersOnlyGateStepOne.tsx
├── MembersOnlyGateStepTwo.tsx
├── MembersOnlyGateStepTwoViewModel.ts
├── useMembersOnlyGateStepOne.ts
├── useMembersOnlyGateStepTwo.ts
└── presentMembersOnlyGateStepTwo.ts
```

Why: proximity is the point. Files that change together should be visible together. Short import paths and zero navigation friction matter more than category-tidiness when a feature is small.

It is always easier to group flat files into sub-folders later than it is to hunt through empty, over-engineered folder structures today.

## 2. Nest only when a threshold is crossed

Introduce sub-folders inside a feature when one of these is true:

- **The 10-file rule.** The feature folder exceeds roughly ten files and is visually cluttered when listed.
- **Private internal sharing.** A subset of files (e.g. small sub-components, internal utilities) is used only by other files inside this feature, and grouping them clarifies what is private to the feature versus what the feature exports.

When you do nest, use the layer names from [`standards/frontend/architecture.md`](../frontend/architecture.md): `api/`, `hooks/`, `presenters/`, `types/`, `components/`. Do not invent parallel taxonomies.

## 3. Greenfield shape

For new React projects and new feature folders in greenfield code, the target shape is:

```
src/
└── features/
    └── labor-plan-details/
        ├── api/
        │   └── getPlanDetails.ts
        ├── components/
        │   └── PlanDetails.tsx
        ├── hooks/
        │   └── usePlanDetails.ts
        ├── presenters/
        │   └── presentPlanDetails.ts
        └── types/
            ├── PlanDTO.ts
            └── PlanViewModel.ts
```

`features/<feature>/` is the unit of ownership. Each feature is as close to deletable as possible. Cross-feature imports are a smell — if Feature A needs code from Feature B, that code probably belongs in `shared/` or `core/`.

Remember: this is the shape a feature grows into. A new feature with two components and one hook should still start flat inside `features/<feature>/`.

## 4. Legacy-compatible shape

Some existing apps (e.g. `dailywire.com/apps/web`) are rooted at `components/` instead of `features/`. In that case, adding a `components/` folder inside a feature would create `components/<feature>/components/`, which is silly. The rule adapts: same shape as greenfield, just drop the inner `components/` folder since the outer root already owns that name.

```
components/
└── labor-plan-details/
    ├── api/
    │   └── getPlanDetails.ts
    ├── hooks/
    │   └── usePlanDetails.ts
    ├── presenters/
    │   └── presentPlanDetails.ts
    ├── types/
    │   ├── PlanDTO.ts
    │   └── PlanViewModel.ts
    └── PlanDetails.tsx
```

Same flat-first rule applies — a small feature inside `components/` still starts flat and grows into `api/ hooks/ presenters/ types/` siblings only when the thresholds in section 2 are crossed. Do not retroactively refactor existing folders to match; apply the rule to new feature folders and to existing folders when you are already touching them substantively.

### Sub-features

If a feature contains a particularly large sub-component — enough internal complexity that it has its own hooks, presenters, and view-models — break it out into a sub-feature folder and treat it the same way: start flat, nest only when the section 2 thresholds are crossed.

```
components/
└── posts/
    ├── members-only-gate/             ← sub-feature, flat until it grows
    │   ├── MembersOnlyGateStepOne.tsx
    │   ├── MembersOnlyGateStepTwo.tsx
    │   ├── MembersOnlyGateStepTwoViewModel.ts
    │   ├── useMembersOnlyGateStepOne.ts
    │   ├── useMembersOnlyGateStepTwo.ts
    │   └── presentMembersOnlyGateStepTwo.ts
    ├── ArticleMetadata.tsx
    ├── PostTeaser.tsx
    └── …
```

The sub-feature is a feature in miniature. Same flat-first default, same tipping points, same sibling folder names when it grows.

## 5. Do not preemptively split

A single dangling sub-component used by one file in the feature does not need its own folder. A one-file `hooks/` folder is worse than a flat sibling — it adds a directory hop and signals structure that does not exist.

If you find yourself creating a folder to hold one file because "that's where hooks go," stop. The rule is flat-first. Folders earn their place by holding enough siblings to be worth naming.

## 6. Promote to `shared/` only after repeated use

Code that turns out to be used by multiple features can be promoted into `shared/` (or `core/` for app-wide singletons). Do not promote on the first reuse. Two callers is a coincidence; three is a pattern. Premature sharing makes ownership unclear and increases blast radius when the original feature changes.

## Review questions

During review, ask:

- Is this new folder holding enough files to justify its existence, or is it preemptive structure?
- If we deleted this feature folder tomorrow, would anything outside the feature break?
- Are sub-folder names drawn from the standard set (`api/`, `components/`, `hooks/`, `presenters/`, `types/`), or did we invent new ones?
- Did nesting make this feature easier to read, or just more directories to click through?

## Final note

The goal is not a uniform folder shape across every feature.

The goal is React features that are easy to read at a glance when small, easy to navigate when they grow, and easy to delete when they are no longer needed.
