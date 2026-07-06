# Worldmap — ADHD Medication Access Tiers

Interactive world map that visualizes **prescription access tiers for ADHD medications** across countries. Color-coded by which drug classes are approved and routinely prescribable domestically.

**This is NOT legal or medical advice.** Data is research-sourced and tagged with confidence/evidence metadata.

## What It Does

- Renders a Natural Earth projection world map using D3-geo and TopoJSON
- Colors each country by tier (amphetamine available → no treatment)
- Hover shows tooltip with tier, confidence, evidence type, notes, and per-drug approval status
- Click countries to reassign their tier
- Toggle country name labels
- Export map as PNG via html2canvas

## Tier System

| Tier | Meaning |
|------|---------|
| 1 | At least one amphetamine-class stimulant approved (dexamphetamine, lisdexamfetamine/Vyvanse) |
| 2 | Amphetamine unavailable; methylphenidate (Ritalin/Concerta) available |
| 3 | Both amphetamine and methylphenidate unavailable; non-stimulants only (atomoxetine, etc.) |
| 4 | No approved ADHD pharmacological treatment infrastructure |
| unknown | Insufficient evidence to assign a tier |

## Project Structure

```
worldmap/
├── src/
│   ├── app.html              # HTML shell (SvelteKit entry point)
│   ├── app.d.ts              # TypeScript ambient declarations
│   ├── lib/
│   │   ├── index.ts          # $lib alias barrel (re-exports)
│   │   ├── mapData.ts        # GeoJSON → SVG path conversion, country lookup helpers
│   │   ├── colors.ts         # Tier color palette and tier label mapping from countryStatus.json
│   │   ├── countryStatus.json# Tier data for every country (tier, confidence, evidence, notes, approved drugs)
│   │   ├── countryStatus.bak.json  # Backup of previous version
│   │   └── assets/
│   │       └── favicon.svg   # App favicon
│   └── routes/
│       ├── +layout.svelte    # Root layout — sets favicon, renders children
│       └── +page.svelte      # Main page — SVG map, controls, tooltip, screenshot
├── static/                   # Static assets served as-is
├── package.json
├── vite.config.ts            # Vite + SvelteKit config (runes mode forced)
└── tsconfig.json
```

## Key Files

### `src/lib/mapData.ts`
Core geo module. Loads the `world-atlas` TopoJSON, converts to GeoJSON features via `topojson-client`, projects them with `geoNaturalEarth1` into SVG paths. Exports:
- `countryFeatures` — array of `{id, iso2, name, path}` for every renderable country
- `bordersPath` — SVG path string for country borders
- `iso2ToName()` / `nameToIso2()` — lookup helpers
- Contains a full `NUMERIC_TO_ISO2` mapping table (ISO 3166-1 numeric → alpha-2)

### `src/lib/countryStatus.json`
The dataset. Schema v2.0. Each country entry has: `tier`, `confidence` (high/medium/low), `evidence` (government/peer_review/clinical/community/mixed), `approved` (per-drug booleans), `sources`, `notes`, `last_verified`. The `_meta` block defines tiers, color suggestions, and field meanings.

### `src/lib/colors.ts`
Thin wrapper that re-exports `COLORS` (hex per tier) and `TIERS` (tier label text) from `countryStatus.json`'s `_meta` section.

### `src/routes/+page.svelte`
The entire UI in one file. Handles: SVG map rendering, tier selection palette, click-to-toggle country assignment, hover tooltip with metadata display, country name overlay toggle, reset/clear/screenshot actions. Uses Svelte 5 runes (`$state`, `$props`).

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5 (runes mode)
- **Geo**: d3-geo (projection), topojson-client (TopoJSON → GeoJSON), world-atlas (110m country data)
- **Export**: html2canvas (DOM → PNG)
- **Build**: Vite 8, TypeScript 6

## Getting Started

```sh
npm install
npm run dev
```

Open `http://localhost:5173`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run check` | Type-check with svelte-check |
| `npm run check:watch` | Type-check in watch mode |
# world-medicine-map
