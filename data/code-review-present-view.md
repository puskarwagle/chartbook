# Code Review — `present` (World ADHD) view + locale switcher change

Scope: uncommitted changes vs HEAD (`git status --short`, `git diff HEAD`).
10 modified files + 9 untracked files. Tests: `npm run test -- --run` → 11 files, 57 tests, all pass.
Full files read: `src/routes/+page.svelte`, `src/lib/components/MapPresentation.svelte`,
`src/lib/presentation.ts`, `src/lib/collections.ts`, `src/lib/navGroups.ts`,
`src/lib/dataSources.ts`, `src/lib/viewInfo.ts`, `src/lib/i18n/store.svelte.ts`,
`data/presentation_adhd_timeline.json`, `data/presentation_adhd_diffusion.json`,
`docs/presentation-situation.md`, `src/lib/__tests__/presentation.test.ts`,
`src/lib/__tests__/diffusion.test.ts`, `src/lib/__tests__/i18n.test.ts`,
`src/lib/__tests__/dataSources.test.ts`, `src/lib/__tests__/collections.test.ts`.

No source files were modified to produce this review.

## Summary

New reusable `MapPresentation` player + `presentation.ts` engine + ADHD timeline/diffusion JSONs,
wired as default `present` view. Engine is pure and well-tested; diffusion honesty enforcement via
`diffusion.test.ts` is good. i18n parity (empty-string overlays for `ne`/`hi`) is done correctly.
Main concerns are navigation/collection orphaning and keyboard-event conflicts, both in changed code.

---

## 1. Orphaned views: `worldmap`, `stats`, `timeline` unreachable (Medium)

Files: `src/lib/navGroups.ts`, `src/lib/collections.ts`, `src/routes/+page.svelte`

`NAV_GROUPS.overview` changed from `['worldmap','brain','mhmap','stats','timeline']` to
`['present','brain','mhmap']`, and both `COLLECTIONS` (`all`, `adhd`) dropped
`worldmap`/`stats`/`timeline` and added `present`.

But `+page.svelte` `COMPONENTS` and the `if/else` render chain still contain
`worldmap`, `stats`, `timeline`, and `VIEW_DATA_SOURCES` / `VIEW_INFO` / `nav.*` keys for them remain.

Effect: `orderedComponents` filters by `inActiveCollection()` before `displayComponents`
splits into categories + remainder. Since no collection lists `worldmap`/`stats`/`timeline`,
they are filtered out before the remainder fallback can show them. They are dead code in
every collection (`all` included), despite still appearing in Settings (`settingsItems`
is built from `ALL_COMPONENTS`).

If retirement is intentional, remove the `COMPONENTS` entries, render branches,
`VIEW_DATA_SOURCES` entries, `VIEW_INFO` entries, and `nav.*` keys. If it is not intentional,
re-add them to `NAV_GROUPS` and `COLLECTIONS`. Current state also makes the `all` collection
blurb ("Everything in the chartbook") inaccurate.

Existing tests do not catch this: `dataSources.test.ts` only asserts
`NAV_GROUPS ⊆ VIEW_DATA_SOURCES`, not the reverse, and `collections.test.ts` only asserts
sub-collections ⊆ `all`. No test asserts `COMPONENTS ⊆ NAV_GROUPS` or
`COMPONENTS ⊆ COLLECTIONS(all)`.

## 2. Global Space handler conflicts with focused buttons / country paths (Medium)

File: `src/lib/components/MapPresentation.svelte:257-276`, `302-308`, `399-412`

`handleKeydown` ignores only `INPUT`/`TEXTAREA`/`SELECT`. It does not ignore `BUTTON`.

Realistic scenario: user Tabs to a `.step` button or a country `path[role=button]`
and presses Space. The browser fires the element's native click / `onkeydown`
(select-toggle) and the `svelte:window` handler fires `togglePlay()` on the same
keystroke. For country paths this is explicit: `onkeydown` handles `' '` for select
(`MapPresentation.svelte:303`) while the window handler handles `' '` for play/pause.
Result is selection change + unintended autoplay toggle.

Fix: return early when `e.target` is a button or inside one, e.g.
`(e.target as HTMLElement).closest('button, [role="button"]')`, or only bind
transport keys when focus is on `body`/non-interactive elements.

## 3. `selected ?? hovered` disables hover while a step is pinned (Low-Medium UX)

File: `src/lib/components/MapPresentation.svelte:55`

`shown = selected ?? hovered` with the comment "Pinned selection wins". `goTo()` and the
autoplay tick pin `selected` to the step origin (`stepPinned = true`). From that point
hovering any other country does nothing until the user clicks the selected country again
(to null it), clicks another country, or resets.

During a stepped presentation this means comparison-by-hover is unavailable exactly when
the user is most likely to want it. If pin-persistence is required, consider
`hovered ?? selected` (hover temporarily wins), or clear `selected` on `mouseenter` of a
different country. At minimum this tradeoff should be intentional, since the tooltip copy
("Hover a country…") implies hover always works.

## 4. `revealedIso2()` ignores `tierWave`; wave logic lives only in the component (Low-Medium, structural)

Files: `src/lib/presentation.ts:115-126`, `src/lib/components/MapPresentation.svelte:78-96`

`revealedIso2()` unions `iso2` + `alsoLit` only. `kind: 'tierWave'` steps (finale,
`today-tier1`) contribute zero. The component compensates with local `waveLit` and unions
it into `revealed`. Tests in `presentation.test.ts` cover only the event path; no test covers
a `tierWave` reveal through the engine.

Any future caller of `revealedIso2()` (counter, export, second player) will undercount the
finale. Either move wave expansion into `presentation.ts` (accepting a tier-lookup callback
so it stays pure/testable) or rename/document `revealedIso2` as event-only with a companion
`revealedWithWaves()` helper, plus one engine-level test for the wave case.

## 5. `setLocale('hi')` still allowed after removing the `hi` button (Low)

File: `src/lib/i18n/store.svelte.ts:17,29-32,105-117,119-128`

`Locale` still includes `'hi'`, `DICTS` still has `hi`, `isLocale('hi')` is true, and
`setLocale('hi')` works (the test suite relies on this for fallback checks). Only `LOCALES`
(button list) dropped `'hi'` and `readStored()` maps stored `'hi'` → `null` → default `en`.

Consequences:
- A programmatic `setLocale('hi')` strands the UI on a locale with no switcher button,
  the exact state the `readStored` comment says it avoids.
- `readStored` does not migrate the stored value; every reload re-applies the fallback
  instead of writing back `en` once.

Either fully deprecate `hi` (narrow the `Locale` type, keep the dict only as a fallback
fixture) or keep it settable but document it as programmatic-only. If the current half-state
is intentional, one line writing the fallback back to storage in `initLocale()` removes the
repeat-fallback.

## 6. Stale-count risk: hardcoded "41 countries" (Low)

Files: `data/presentation_adhd_timeline.json:140`, `src/lib/viewInfo.ts`, locale `viewInfo.present.*`

The closing `tierWave` label/talkingPoint claims "41 countries". Verified today:
`countryStatus.json` Tier 1 count is exactly 41, so this is currently correct. Nothing
enforces it — a tier reclassification silently makes the recorded narration wrong.
Add one assertion to `diffusion.test.ts` (or `presentation.test.ts`) that the Tier 1 count
in `countryStatus.json` equals the number claimed in the timeline label, or compute the
label at runtime.

## 7. Copy contradiction: "Keyboard only" followed by click instructions (Low)

Files: `src/lib/viewInfo.ts:29`, `src/lib/i18n/locales/en.json` `viewInfo.present.howToRead`

> 'Keyboard only: "," / "<" = back, … The right-side list shows every timeline event — click one…'

The first two words are contradicted by the second sentence (and by the tier circles).
Change to `Keyboard: … Or click…`. Same text exists in both `viewInfo.ts` and `en.json`;
fix both (they are duplicated, not shared — see note below).

## 8. Nits (Low, non-blocking)

- `MapPresentation.svelte:243-245`: `stepPinned = selected !== null;` is duplicated on
  consecutive lines in the autoplay interval. Harmless; remove one.
- `viewInfo.present` prose is duplicated between `src/lib/viewInfo.ts` and
  `src/lib/i18n/locales/en.json`. They already diverge slightly in wording
  ("lights up one country per step" vs step-by-step player copy). If both must exist,
  note which is canonical; otherwise share one source.
- `MapPresentation.svelte:124-139`: `style()` allocates a new wrapper object per country
  per call, and `fillFor()` + `tierOpacity()` each call it — two allocations per country
  per render, during spring-zoom animation frames. Trivial at ~200 countries, but computing
  `style` once per render and passing it down is a two-line cleanup.
- `TIER_KEYS` (`MapPresentation.svelte:58`) deliberately omits `'4'`. Consistent with the
  "four color circles" copy and the footnote, but Tier 4 countries are then unfilterable.
  Since omission is intentional per the inline comment, no change needed — record it here
  so a future reader does not "fix" it back.
- Returning users with a persisted `sidebar-component-order` (key `sidebar-component-order`)
  will get `present` appended at the end (`loadOrder()` appends missing ids) rather than at
  the overview front. New users see it first; returning users see it last in its group.
  Acceptable, but worth knowing when verifying the "opens on World ADHD" behavior —
  `defaultId = 'present'` covers the landing view regardless.

## Behavior changes noted (expected, confirm intentional)

- Default landing view `worldmap` → `present` (`+page.svelte:236`). Matches
  `docs/presentation-situation.md` §8. Confirm product sign-off; returning users with a
  hidden-ids or collection state are still force-migrated via the `$effect` fallback.
- `LOCALES` `['en','ne','hi']` → `['en','ne']` with stored-`hi` fallback to `en`.
  Existing `hi` users are silently switched on next load. If that needs communication,
  it is not in the current diff.
- `data/presentation_adhd_diffusion.json` ships with `"entries": {}`. Tests pass
  vacuously; enrichment is owner-gated. No issue — just noting the back half of the story
  still re-lights US/GB/DE/CH until diffusion entries are added, per `presentation-situation.md` §5.

## What was checked and found fine

- ISO codes in the timeline (`DE`, `GB`, `US`, `CH`) all exist in `mapData.ts`
  `NUMERIC_TO_ISO2` (`GB` = 826, not `UK`). No silent no-light bug.
- Mixed `year` types (number + `"1917–18"` / `"1930s–50s"` / `"2000s"` / `"Today"`) are
  allowed by `PresentationStep.year?: number | string | null` and rendered verbatim.
  Order is array order; no date parsing to break.
- `autoplayMs: 2200` matches `viewInfo` coverage copy ("autoplay 2.2s/step").
- `attachDiffusion()` is pure (does not mutate input; verified by existing test asserting
  `withIds.steps[1].alsoLit` stays `undefined`) and silently ignores unknown diffusion keys
  at runtime, with `diffusion.test.ts` catching typos at build time. Reasonable split.
- `resolveFill` / `resolveOpacity` filter-preview semantics match the documented fix
  (true tier membership straight through the reveal); regression test at
  `presentation.test.ts:75-84` covers the all-grey opening frame.
- i18n parity approach (blank `""` in `ne`/`hi` for new `nav.present` + `viewInfo.present.*`)
  satisfies the `ne.json`/`hi.json` mirror-every-key tests. Correct per `AGENTS.md` overlay rule.
