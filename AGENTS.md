# AGENTS.md

## Quick Commands

- `npm run dev` — dev server at localhost:5173
- `npm run build` — production build
- `npm run check` — type-check (svelte-check)
- `npm run lint` — ESLint (Svelte + TypeScript rules)
- `npm run test` — Vitest (run once); `npm run test:watch` — watch mode

## Tech Stack

SvelteKit 2 + Svelte 5 (runes mode forced for all project files via `vite.config.ts`), TypeScript 6, Vite 8.
ESLint 10 (flat config), Vitest 4 + jsdom. No Prettier configured.

## Architecture

Single-page app. `src/routes/+page.svelte` is the dashboard shell — it renders a sidebar and switches views via an if/else chain keyed on `activeId`. Adding a new view requires:

1. Create `src/lib/components/YourView.svelte`
2. Import it in `src/routes/+page.svelte` and add entries to `COMPONENTS`, `CATEGORIES`, and the if/else block. Labels are i18n keys — add `nav.<id>` (+ `viewInfo.<id>` prose) to `src/lib/i18n/locales/en.json` (canonical; `ne.json`/`hi.json` overlays fall back to English when empty)
3. Data helpers live in `src/lib/data.ts` — import JSON datasets from `data/` (root-level) or `src/lib/data/` (lib-level)

Locale state lives in `src/lib/i18n/store.svelte.ts` (persisted under `app-locale`, synced to `<html lang>`); locale-aware number helpers in `src/lib/i18n/format.ts`.

## Data

All data is static JSON imported at build time (not fetched). Raw datasets live in `data/` (root-level). `src/lib/data.ts` is the pipeline — it imports directly from root `data/`, filters out World Bank aggregates, deduplicates per country, and exports typed helpers for views.

`src/lib/countryStatus.json` is the tier dataset (schema v2.0). `src/lib/colors.ts` re-exports tier colors/labels from its `_meta` block.

## Gotchas

- `.npmrc` has `engine-strict=true` — ensure your Node version matches `package.json` engines.
- `src/lib/index.ts` is a barrel re-export; prefer importing directly from the specific module.
- `adapter-auto` is used — deployment target determines the adapter. Switch if deploying to a specific platform.
- The sidebar order is persisted in `localStorage` under key `sidebar-component-order`.
- 24 visualization components exist in `src/lib/components/`; the README lists 23 views (DataExplorer is undocumented there).
