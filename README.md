# Chartbook — Interactive Data Chart Collections

Interactive multi-view dashboard for exploring **curated chart collections** — from ADHD prevalence, treatment access, and comorbidities to global mental health, wellbeing, and socioeconomic indicators — across countries. Combines data from WHO, World Bank, World Happiness Report, UNDP HDI, and more.

**This is NOT legal or medical advice.** Data is research-sourced and tagged with confidence/evidence metadata.

## What It Does

- **24 visualization views** accessible from a collapsible sidebar with drag-and-drop reordering
- World map with Natural Earth projection (D3-geo + TopoJSON) — color-coded by ADHD medication access tier
- Statistics, timelines, age pyramids, sex comparisons, regional rankings
- Trend lines, SDI scatter plots, comorbidity breakdowns, substance use data
- Suicide risk analysis, education pressure, governance radar, economic snapshots
- Happiness rankings, human development explorer, global health trends
- Keyboard navigation (arrow keys) and sidebar order persistence via localStorage

## Views

| ID | Label | Description |
|----|-------|-------------|
| `worldmap` | World Map | ADHD medication access tiers by country |
| `stats` | Stats | Global ADHD statistics overview |
| `timeline` | Timeline | Historical data over time |
| `age` | By Age | Age pyramid of ADHD prevalence |
| `sex` | By Sex | Sex-based comparison |
| `region` | By Region | Regional ranking of indicators |
| `trends` | Trends | Trend lines across countries |
| `sdi` | SDI Scatter | Socio-demographic index scatter plot |
| `prison` | Prison ADHD | ADHD prevalence in prison populations |
| `comorbid` | Comorbidities | Comorbidity breakdown |
| `sud` | SUD & ADHD | Substance use disorders and ADHD |
| `suicide` | Suicide Risk | Suicide risk correlation |
| `sudsex` | SUD by Sex | SUD differences by sex |
| `mhmap` | Mental Health Map | Global mental health indicators map |
| `wealth` | Wealth & Wellbeing | GDP vs wellbeing analysis |
| `treatment` | Treatment Access | Treatment access index |
| `education` | Education Context | Education pressure indicators |
| `prisonmh` | Prison & MH | Prison and mental health link |
| `happiness` | Happiness Report | World Happiness Report data |
| `hdi` | Human Development | HDI explorer |
| `governance` | Governance | Governance radar (CPI) |
| `healthtrends` | Health Trends | Global health trends |
| `economy` | Economic Overview | Economic snapshot |
| `dataexplorer` | Data Files | Browse raw JSON data files |

## Tier System (World Map)

| Tier | Meaning |
|------|---------|
| 1 | At least one amphetamine-class stimulant approved (dexamphetamine, lisdexamfetamine/Vyvanse) |
| 2 | Amphetamine unavailable; methylphenidate (Ritalin/Concerta) available |
| 3 | Both amphetamine and methylphenidate unavailable; non-stimulants only (atomoxetine, etc.) |
| 4 | No approved ADHD pharmacological treatment infrastructure |
| unknown | Insufficient evidence to assign a tier |

## Project Structure

```
├── src/
│   ├── app.html                 # HTML shell (SvelteKit entry point)
│   ├── app.d.ts                 # TypeScript ambient declarations
│   ├── lib/
│   │   ├── index.ts             # $lib alias barrel (re-exports)
│   │   ├── mapData.ts           # GeoJSON → SVG path conversion, country lookup helpers
│   │   ├── colors.ts            # Tier color palette and tier label mapping
│   │   ├── data.ts              # Data pipeline — imports from root data/, exports datasets & helpers
│   │   ├── Sidebar.svelte       # Collapsible sidebar with drag-and-drop reordering
│   │   ├── countryStatus.json   # Tier data per country (schema v2.0)
│   │   ├── countryStatus.bak.json # Backup
│   │   ├── components/          # 24 views + shared helpers (EChart, CustomPage, CustomPagePreview, ViewInfo)
│   │   │   ├── WorldMap.svelte
│   │   │   ├── StatsView.svelte
│   │   │   ├── TimelineView.svelte
│   │   │   ├── AgePyramid.svelte
│   │   │   ├── SexComparison.svelte
│   │   │   ├── RegionalRanking.svelte
│   │   │   ├── TrendLine.svelte
│   │   │   ├── SDIScatter.svelte
│   │   │   ├── PrisonPrevalence.svelte
│   │   │   ├── ComorbidityBreakdown.svelte
│   │   │   ├── SUDbySubstance.svelte
│   │   │   ├── SuicideRisk.svelte
│   │   │   ├── SexDiffSUD.svelte
│   │   │   ├── MentalHealthWorldMap.svelte
│   │   │   ├── WealthVsWellbeing.svelte
│   │   │   ├── TreatmentAccessIndex.svelte
│   │   │   ├── EducationPressure.svelte
│   │   │   ├── PrisonMentalHealthLink.svelte
│   │   │   ├── HappinessRankings.svelte
│   │   │   ├── HDIExplorer.svelte
│   │   │   ├── GovernanceRadar.svelte
│   │   │   ├── GlobalHealthTrends.svelte
│   │   │   ├── EconomicSnapshot.svelte
│   │   │   ├── DataExplorer.svelte
│   │   │   ├── EChart.svelte           # Shared echarts wrapper
│   │   │   ├── CustomPage.svelte        # Generic renderer for user-created pages
│   │   │   ├── CustomPagePreview.svelte # Fullscreen present mode
│   │   │   └── ViewInfo.svelte
│   │   └── assets/
│   │       └── favicon.svg
│   └── routes/
│       ├── +layout.svelte       # Root layout — sets favicon, renders children
│       └── +page.svelte         # Dashboard shell — sidebar + active view renderer
├── data/                        # Raw and processed data files (JSON + Markdown)
├── static/                      # Static assets served as-is
├── package.json
├── vite.config.ts               # Vite + SvelteKit config (runes mode forced)
└── tsconfig.json
```

## Key Files

### `src/lib/mapData.ts`
Core geo module. Loads `world-atlas` TopoJSON, converts to GeoJSON features via `topojson-client`, projects with `geoNaturalEarth1` into SVG paths. Exports:
- `countryFeatures` — array of `{id, iso2, name, path, cx, cy}` (includes centroid coordinates)
- `bordersPath` — SVG path string for country borders
- `iso2ToName()` / `nameToIso2()` — lookup helpers

### `src/lib/data.ts`
Data pipeline. Imports JSON datasets directly from root `data/` (7 core API-sourced files), filters out World Bank aggregates, deduplicates per country, and exports typed datasets and helper functions for all views.

### `src/lib/countryStatus.json`
The tier dataset (schema v2.0). Each country entry: `tier`, `confidence`, `evidence`, `approved` (per-drug booleans), `sources`, `notes`, `last_verified`. The `_meta` block defines tiers, color suggestions, and field meanings.

### `src/lib/colors.ts`
Re-exports `COLORS` (hex per tier) and `TIERS` (tier label text) from `countryStatus.json`'s `_meta` section.

### `src/lib/Sidebar.svelte`
Collapsible navigation sidebar. Supports drag-and-drop reordering with position persistence in localStorage.

### `src/lib/index.ts`
Currently an unused barrel re-export placeholder. Prefer importing directly from the specific module.

### `src/routes/+page.svelte`
Dashboard shell. Renders the sidebar and active component. Handles keyboard navigation (arrow keys) and component order persistence.

## Data Sources

| File | Source |
|------|--------|
| `worldbank_indicators.json` | World Bank |
| `who_health_indicators.json` | WHO |
| `world_happiness_report_2026.json` | World Happiness Report |
| `undp_hdi.json` | UNDP Human Development Index |
| `transparency_cpi_2024.json` | Transparency International CPI |
| `world_prison_brief.json` | World Prison Brief |
| `education_indicators.json` | Education data |
| `countryStatus.json` | Research-sourced ADHD medication access tiers |

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5 (runes mode — forced for all project files via `vite.config.ts`, excluded for `node_modules`)
- **Geo**: d3-geo (projection), topojson-client (TopoJSON → GeoJSON), world-atlas (110m country data)
- **Charts**: echarts (via `src/lib/components/EChart.svelte` wrapper + `src/lib/echartsTheme.ts`)
- **Export**: html2canvas (DOM → PNG)
- **Build**: Vite 8, TypeScript 6
- **Lint/Test**: ESLint 10 (Svelte + TypeScript, `globals` for browser/node) + Vitest 4 (`npm run lint`, `npm run test`)

## Getting Started

```sh
npm install
npm run dev
```

Open `http://localhost:5173`.

> **Note**: `.npmrc` has `engine-strict=true` — ensure your Node version matches `package.json` engines.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run check` | Type-check with svelte-check |
| `npm run check:watch` | Type-check in watch mode |
| `npm run lint` | ESLint (Svelte + TypeScript) |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run prepare` | Sync SvelteKit types (runs automatically on `npm install`) |
