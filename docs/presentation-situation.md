# World ADHD presentation view — full situation brief

Date: 2026-10-02. Status: everything green (`check` 0 errors, `lint` clean,
`test` 50/50, `build` passes). Purpose of this file: hand it to another
assistant (or a human) for a second opinion on the open data-model question
at the bottom.

## 1. What this is

A fullscreen "World ADHD" view in a SvelteKit chartbook: a world map that
starts all-grey ("unknown") and lights up countries step by step while the
owner narrates over a screen recording. Transport is keyboard-only:
`,` / `<` = back, `.` / `>` = forward, `Space` = play/pause autoplay,
`Home` / `End` = jump. A clickable event list (right panel) jumps to any step.

## 2. Architecture (deliberately reusable)

One generic player + one JSON file per topic = one video. Next topic
(cancer, depression, …) means copying the JSON, not writing code.

- `src/lib/components/MapPresentation.svelte` — the player. Renders the SVG
  world map (same geography pipeline as the main map), a tier-filter row of
  four color circles (Amphetamine / Methylphenidate-only / Non-stimulants-only
  / Unknown — Tier 4 "No Treatment" deliberately omitted), hover tooltips with
  tier/confidence/notes/approved-drugs, a current-step card, and the clickable
  timeline list.
- `src/lib/presentation.ts` — engine: `PresentationStep` / `PresentationSequence`
  types, `revealedIso2()` (set of ISO codes lit at a given step), `clampStep()`,
  key helpers (`isPrevKey`, `isNextKey`, `isPlayPauseKey`), plus pure
  `resolveFill()` / `resolveOpacity()`. The tier circles preview TRUE tier
  membership straight through the reveal (fixed 2026-10-02: they used to compare
  against the grey disguise and blanked the map at the opening frame).
- `data/presentation_adhd_timeline.json` — the ADHD sequence (18 steps, see §4).
- `src/routes/+page.svelte` renders `<MapPresentation sequence={adhdSequence} />`
  for the `present` view id (sidebar label "World ADHD", the default landing view).
- Tests: `src/lib/__tests__/presentation.test.ts` covers the engine
  (cumulative reveal, clamping, key mapping). A component-level test was tried
  and deleted — `@testing-library/svelte`'s `render` hits
  `lifecycle_function_unavailable / mount(...) is not available on the server`
  under this repo's vitest/jsdom setup, so component rendering is untested.

## 3. Current data model

```json
{ "id": "ritalin-1955", "iso2": "US", "year": 1955, "label": "FDA approves Ritalin",
  "talkingPoints": ["...narration cue..."] }
```

- `iso2` optional/null: steps with `iso2: null` are narrative beats — the side
  card advances, the map stays as-is.
- `tier` optional: falls back to the country's tier in `data/countryStatus.json`.
- `kind: "tierWave"` + `tier`: lights a whole present-day tier at once (finale).
- `alsoLit` (attached at load from `data/presentation_adhd_diffusion.json`,
  keyed by step `id`): sourced `{iso2, note, source}` entries. Test-enforced
  (`diffusion.test.ts`): unknown step id, unknown country, or missing source =
  red build.
- Reveal is **cumulative union and test-proven**: clicking step N lights every
  origin + every alsoLit + every tierWave tier from steps 0–N. The map only
  ever gains. Clicking the active step again toggles the COMPLETE view — the
  full colorful map (all tiers); clicking once more dives back into the reveal.
  Closing a tier circle lands on the complete view too. Fresh load and Home
  reset are the only paths to the all-grey opening frame. The origin gets a
  ping ring + zoom + pinned tooltip; alsoLit
  countries just fill (protagonist vs chorus, visually distinct).
- Player extras needing no research: spring zoom to each origin (holds on
  narrative beats, pulls out for the finale), step counter ("Step 12 of 19 ·
  4 lit"), persistent footnote ("Highlights follow the events shown — not a
  complete regulatory history.").

## 4. Current sequence (from `adhd-timeline.txt`, owner's file)

| # | Year | Country | Event |
|---|------|---------|-------|
| 1 | 1775 | DE | Weikard, first written account |
| 2 | 1798 | GB | Crichton, "mental restlessness" |
| 3 | 1844 | DE | Hoffmann, "Fidgety Phil" |
| 4 | 1902 | GB | Still, "defect of moral control" |
| 5 | 1917–18 | — | Encephalitis epidemic (global, narrative beat) |
| 6 | 1930s–50s | — | "Minimal Brain Damage" era (narrative beat) |
| 7 | 1937 | US | Bradley, Benzedrine breakthrough |
| 8 | 1944 | CH | Panizzon synthesizes Ritalin |
| 9 | 1955 | US | FDA approves Ritalin |
| 10 | 1957 | — | "Hyperkinetic impulse disorder" coined (narrative beat) |
| 11 | 1968 | US | DSM-II |
| 12 | 1980 | US | DSM-III (ADD) |
| 13 | 1987 | US | DSM-III-R (ADHD) |
| 14 | 1994 | US | DSM-IV subtypes |
| 15 | 1996 | US | Adderall approved |
| 16 | 2000s | US | Extended-release (Concerta, Vyvanse) |
| 17 | 2002 | US | Strattera, first non-stimulant |
| 18 | 2013 | US | DSM-5, adult ADHD |
| 19 | Today | wave | Tier-1 closing wave: all 41 present-day stimulant-first countries at once |

Talking points are drafted from the owner's timeline file; event→country
mapping for US items (FDA/DSM/market events → US) is the implementer's
editorial choice, flagged in `VIEW_INFO`. Diffusion file
(`presentation_adhd_diffusion.json`) currently has empty entries — enrichment
only where the owner knows the facts.

## 5. The pickle (open question)

Observed behavior: after ~1955 the map barely changes — 9 of the last 10 steps
re-light the already-lit US (plus GB/DE/CH from earlier). Clicking through the
second half visibly does almost nothing except move the side card. The owner
described this as "one at a time" and suggested "a separate JSON for this":
each timeline event would carry its **own explicit full country list**, e.g.

```json
{ "year": 1955, "label": "FDA approves Ritalin",
  "countries": ["US", "GB", "DE", "CH", "CA", "AU", "SE", "NL", "FR", ...] }
```

…so that clicking an event colors "all the countries up to that point" in a
historically rich sense, and reveal = union of lists up to the clicked step.

Why it's a real dilemma, not just a refactor:

1. **The data doesn't exist yet.** Nobody has per-country approval years for
   these drugs/events. The 41-country Tier-1 list exists (`data/countryStatus.json`
   has tiers + notes, no dates), but assigning each country to a year is manual
   research per row — easy to get subtly wrong, and wrong dates on a recorded
   video are worse than a boring map.
2. **The current model is honest but flat.** One-event-one-country is
   defensible (each step claims only "this happened here"), but the story runs
   out of map after step 8.
3. **The proposed model is vivid but editorial.** A per-step country list looks
   great and each click feels big — but every entry in every list is a claim
   ("by 1955 these 12 countries had access") that needs sourcing, or an
   on-screen honesty label ("illustrative, not regulatory history").
4. **Middle paths exist.** (a) Keep one-iso-per-event but make repeat steps
   feel alive (pulse animation, lit-counter, per-step tooltip follow — tooltip
   follow already exists). (b) Hybrid: keep events as the driver, but allow an
   optional `alsoLit: [...]` array on steps where the owner *does* know the wider
   diffusion, leaving other steps single-country. (c) Drop geography for the
   US-heavy second half — but the owner explicitly wants map lighting throughout.

## 6. Questions for the second opinion

1. Is the per-step explicit country list (union reveal) the right model, or is
   there a better structure for "timeline drives map" that avoids fabricating
   per-country dates (e.g. tier-wave reveals: step lights a whole tier at once)?
2. If explicit lists: replace `iso2` with `countries: string[]`, or additive
   optional `alsoLit` alongside `iso2`? Cumulative-union vs exact-list semantics?
3. What is the minimum honest sourcing bar per list entry before recording —
   and where should the caveat live (JSON `_help`, on-screen footnote, video
   description)?
4. Any cheaper way to make the back half feel alive without per-country research?

## 7. Key files

- `src/lib/components/MapPresentation.svelte` (player)
- `src/lib/presentation.ts` (engine + schema)
- `data/presentation_adhd_timeline.json` (sequence)
- `data/countryStatus.json` (tier source of truth)
- `adhd-timeline.txt` (owner's historical source)
- `src/lib/__tests__/presentation.test.ts` (engine tests)
- `src/lib/__tests__/diffusion.test.ts` (alsoLit honesty enforcement)
- `data/presentation_adhd_diffusion.json` (enrichment, keyed by step id)
- `src/lib/viewInfo.ts` + `src/lib/i18n/locales/en.json` (`present` entries)

## 8. Reproduce / verify

- `npm run dev` → opens on World ADHD (default view).
- Click timeline steps out of order; observe cumulative lighting.
- `npm run check && npm run lint && npm run test` — currently all green.

## 9. Resolution (2026-10-02) — hybrid adopted

Owner chose the hybrid: keep `iso2` origin as the driver, additive optional
`alsoLit` (`{iso2, note, source}`) merged at load from the separate
`data/presentation_adhd_diffusion.json`, keyed by step `id`. Honesty lives in
the data model: `diffusion.test.ts` fails on unknown step id, unknown country,
or missing source. Cumulative union (map only gains); origin gets ping + zoom
+ pinned tooltip, alsoLit just fills. Back half made alive without research
via: Tier-1 closing wave step (claims the present, from the tier dataset),
spring zoom to each origin (holds on beats, pulls out for the finale),
"Step N of 19 · M lit" counter, persistent on-screen footnote. Diffusion file
ships empty — enrichment only where the owner knows the facts. A future
chapter reset would be explicit `reset: true`, not a default change.
