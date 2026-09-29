# Code Quality Report — chartbook

**Date:** 2026-07-18
**Scope:** Full codebase review — architecture, tooling, patterns, and maintainability

---

## 1. Project Overview

| Aspect | Detail |
|--------|--------|
| **Framework** | SvelteKit 2.63.0 + Svelte 5.56.1 (runes mode) |
| **Language** | TypeScript 6.0.3 (strict mode) |
| **Build** | Vite 8.0.16 |
| **Testing** | Vitest 4.1.10 + jsdom |
| **Linting** | ESLint 10 (flat config) with typescript-eslint + eslint-plugin-svelte |
| **Formatter** | None configured |
| **Components** | 24 visualization components |
| **Data sources** | 28 static JSON files imported at build time |

---

## 2. Architecture

### 2.1 Structure

The app is a single-page dashboard with a sidebar-driven view switcher. Routing is handled via an if/else chain in `src/routes/+page.svelte` keyed on `activeId` — no file-based routing is used for the 24 views.

```
src/
├── routes/
│   ├── +layout.svelte        # Root layout (favicon, render children)
│   └── +page.svelte          # Dashboard shell — sidebar + if/else view switcher
├── lib/
│   ├── data.ts               # Central data pipeline (329 lines)
│   ├── mapData.ts            # GeoJSON pipeline (d3-geo + topojson)
│   ├── colors.ts             # Tier color/label re-exports
│   ├── countryStatus.json    # Tier dataset (3508 lines, schema v2.0)
│   ├── Sidebar.svelte        # Collapsible nav with drag-and-drop reorder
│   ├── __tests__/            # 2 test files
│   └── components/           # 24 visualization components
data/                          # 28 raw JSON + Markdown datasets
```

### 2.2 Data Pipeline (`src/lib/data.ts`)

The data layer is the strongest architectural element:

1. Imports 7 JSON datasets from root `data/` via relative paths
2. Casts raw JSON to typed `Record<string, T[]>` structures
3. Filters out 46 World Bank aggregate country codes
4. Deduplicates per country (keeping latest year)
5. Exports ~20 typed helper functions and pre-computed datasets
6. Uses `Map<string, number>` for O(1) country lookups

### 2.3 Component Pattern

All 24 components follow a consistent structure:

```svelte
<script lang="ts">
  // 1. Typed imports
  // 2. $state() for reactive local state
  // 3. $derived() / $derived.by() for computed values
  // 4. Helper functions inline
</script>

<!-- HTML template with {#each}, {#if}, {#key} blocks -->

<style>
  /* Scoped CSS */
</style>
```

---

## 3. Strengths

### 3.1 Clean Data Layer
`data.ts` is well-structured with clear separation of concerns: import → filter → deduplicate → export. The pattern of pre-computing datasets as IIFEs avoids redundant work at render time.

### 3.2 TypeScript Strict Mode
`tsconfig.json` extends SvelteKit's config with `strict: true`, `allowJs`, `checkJs`, `forceConsistentCasingInFileNames`, and `resolveJsonModule`. This catches a class of bugs at compile time.

### 3.3 Svelte 5 Runes Consistency
Every component uses Svelte 5 runes (`$state`, `$derived`, `$props`, `$bindable`) consistently — no legacy reactive syntax (`$:`) or stores. This is forward-compatible and easier to reason about.

### 3.4 Accessibility Basics
World map paths include `role="button"`, `tabindex="0"`, and `aria-label` attributes. Arrow key navigation is supported for view switching. This is a good foundation for a data visualization dashboard.

### 3.5 Documentation
- `README.md` is thorough: lists all 24 views, tier definitions, data sources, project structure
- `AGENTS.md` provides clear instructions for AI agents working on the codebase
- `data/README_DATA.json` documents data sources

### 3.6 Feature-Rich Sidebar
Drag-and-drop reorder with `localStorage` persistence is a polished UX detail that shows attention to user experience.

### 3.7 Geo Module
`mapData.ts` is a clean, well-documented module with a comprehensive ISO numeric-to-alpha-2 mapping table and clear exports.

---

## 4. Weaknesses

### 4.1 Minimal Test Coverage

| What | Coverage |
|------|----------|
| `colors.ts` | ✅ Tested (tier colors, labels) |
| `mapData.ts` | ✅ Tested (features, SVG paths, lookups) |
| 24 components | ❌ Zero tests |
| `data.ts` | ❌ Zero tests |
| `Sidebar.svelte` | ❌ Zero tests |

`@testing-library/svelte` is installed but unused. This is the single biggest quality gap — the test infrastructure exists but isn't utilized.

**Recommendation:** Add tests for `data.ts` (the most critical module), then component smoke tests, then interaction tests for the sidebar.

### 4.2 No Formatter

No Prettier or equivalent is configured. While code style is fairly consistent (tabs, single quotes), there's no automated enforcement. This leads to drift over time, especially with multiple contributors.

**Recommendation:** Add Prettier with a minimal config (matching existing conventions: tabs, single quotes, 100 print width) and add a `format` script.

### 4.3 `as any` Casts

Multiple `as any` casts exist across the codebase:

| File | Lines | Context |
|------|-------|---------|
| `src/lib/data.ts` | 222 | JSON dataset casting |
| `src/lib/mapData.ts` | 30–32 | TopoJSON/GeoJSON type assertions |
| `src/lib/components/WorldMap.svelte` | 31, 47, 124 | D3 projection types |
| `src/lib/components/StatsView.svelte` | 10 | Data accessor |

The ESLint rule `@typescript-eslint/no-explicit-any` is set to `warn` rather than `error`, so these don't block the build.

**Recommendation:** Define proper types for TopoJSON and D3 projection return values. Gradually tighten the ESLint rule to `error`.

### 4.4 No CSS Theming System

Color values are hardcoded across every component:

```css
/* Repeated in 24+ files */
background: #1a1a2e;
color: #e0e0e0;
border: 1px solid rgba(255, 255, 255, 0.06);
```

There are no CSS custom properties or shared theme tokens. Changing the color scheme requires editing every component individually.

**Recommendation:** Define CSS custom properties in `src/app.css` or a theme file:

```css
:root {
  --bg-primary: #1a1a2e;
  --text-primary: #e0e0e0;
  --border-subtle: rgba(255, 255, 255, 0.06);
  /* ... */
}
```

Then reference `var(--bg-primary)` everywhere.

### 4.5 Fragile View Switcher

`+page.svelte` contains a 24-branch if/else chain:

```svelte
{#if activeId === 'world-map'}
  <WorldMap />
{:else if activeId === 'mental-health-map'}
  <MentalHealthWorldMap />
{:else if activeId === 'stats'}
  <StatsView />
{!-- ... 21 more branches --}
{/if}
```

Adding a new view requires changes in **3 places**: `COMPONENTS` array, `CATEGORIES` object, and the if/else block. This is error-prone and violates DRY.

**Recommendation:** Replace with a dynamic component pattern:

```svelte
<script>
  import { COMPONENTS } from './config';
  $: Component = COMPONENTS[activeId];
</script>

<svelte:component this={Component} />
```

### 4.6 Empty Catch Block

`src/routes/+page.svelte:87` has:

```typescript
} catch {}
```

This silently swallows errors with no logging, making debugging difficult.

**Recommendation:** At minimum, log the error:

```typescript
} catch (e) {
  console.error('Failed to load view:', e);
}
```

### 4.7 Duplicate Lockfiles

Both `bun.lock` and `package-lock.json` exist, indicating the project has been used with both npm and Bun. This can lead to dependency drift if one lockfile is updated without the other.

**Recommendation:** Pick one package manager and remove the other lockfile. Add a `packageManager` field to `package.json` and a `.npmrc` or `bunfig.toml` to enforce it.

### 4.8 Backup File in Repo

`src/lib/countryStatus.bak.json` is committed to the repository. Backup files should be gitignored.

**Recommendation:** Add `*.bak.json` to `.gitignore` and remove the file from tracking.

### 4.9 `.npmrc` engine-strict Without engines Field

`.npmrc` has `engine-strict=true`, but `package.json` has no `engines` field. This rule is effectively a no-op.

**Recommendation:** Either add an `engines` field or remove the `.npmrc` setting.

---

## 5. Code Smells

| Smell | Location | Severity |
|-------|----------|----------|
| Long file | `countryStatus.json` (3508 lines) | Low — data file, not code |
| Long file | `data.ts` (329 lines) | Medium — could split into domain-specific modules |
| Magic numbers | Hardcoded array indices in `data.ts` | Low — documented in comments |
| Duplicated CSS | Color tokens in 24+ component styles | High — maintenance burden |
| Silent error | Empty catch in `+page.svelte` | Medium — hides bugs |
| No error boundaries | SvelteKit error handling not visible | Low — SvelteKit handles 404/500 |

---

## 6. Positive Patterns Worth Preserving

1. **Typed data imports** — JSON is cast to typed structures, not left as `any`
2. **Consistent component structure** — All 24 components follow the same pattern
3. **Filter-before-render** — World Bank aggregates are filtered in `data.ts`, not in components
4. **O(1) lookups** — `Map<string, number>` for country code lookups
5. **Keyboard navigation** — Arrow keys for view switching
6. **localStorage persistence** — Sidebar order survives page refreshes
7. **Scoped CSS** — No style leakage between components
8. **Runes-only** — No legacy Svelte reactivity syntax

---

## 7. Priority Recommendations

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| 🔴 High | Add tests for `data.ts` | Medium | Prevents regressions in core data pipeline |
| 🔴 High | Add Prettier + format script | Low | Consistent style, zero mental overhead |
| 🔴 High | Add CSS custom properties for theme | Medium | Single source of truth for colors |
| 🟡 Medium | Refactor view switcher to dynamic component | Low | Easier to add/remove views |
| 🟡 Medium | Add component tests (smoke tests) | Medium | Catches rendering regressions |
| 🟡 Medium | Remove `as any` casts | Medium | Stronger type safety |
| 🟡 Medium | Pick one package manager | Low | Avoids lockfile confusion |
| 🟢 Low | Log errors in catch blocks | Low | Easier debugging |
| 🟢 Low | Remove backup file, add to .gitignore | Low | Cleaner repo |
| 🟢 Low | Add `engines` field or remove engine-strict | Low | Honest configuration |

---

## 8. Summary

The codebase is **well-structured and consistent** for a project of this scope. The data pipeline is the strongest element — clean, typed, and efficient. The Svelte 5 runes adoption is complete and forward-looking. The main gaps are **test coverage** (the infrastructure exists but isn't used) and **theme consistency** (hardcoded colors across 24 components). The view switcher refactor and Prettier adoption are low-effort, high-impact improvements.

**Overall grade: B+** — solid architecture, good patterns, needs testing and polish.
