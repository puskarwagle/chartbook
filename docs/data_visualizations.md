# graphicsForADHD — Complete Data & Visualization Documentation

**Project**: Single-page SvelteKit 2 + Svelte 5 (runes) dashboard visualizing global ADHD epidemiology, treatment access, and comorbidities  
**Data Pipeline**: `src/lib/data.ts` imports 7 API-sourced JSON files from `data/`, filters World Bank aggregates, deduplicates to latest year per country, exports typed Maps/functions  
**No runtime fetching** — all data bundled at build time  
**24 visualization components** in `src/lib/components/` (README lists 23; `DataExplorer` is undocumented)

---

## DATA SOURCES — Complete Inventory

### Primary API-Sourced Datasets (imported in `data.ts`)

| File | Source | Indicators | Rows | Key Processing |
|------|--------|------------|------|----------------|
| `worldbank_indicators.json` | World Bank API v2 | 11 indicators (GDP pc, poverty, Gini, literacy, life exp, population, health/edu expenditure, maternal/infant mortality) | ~20k | `latestPerCountry()` filters aggregates (24 WB region codes), returns latest year per ISO-3 |
| `who_health_indicators.json` | WHO GHO API | 7 indicators (depression, anxiety, schizophrenia, eating disorders, alcohol, drugs, life exp) | ~15k | `latestPerCountrySex()` filters `SEX_BTSX` only, latest year |
| `world_happiness_report_2026.json` | WHR 2026 (XLSX→JSON) | 7 factor contributions to life evaluation | ~2k | Parsed to simplified schema; `happinessForYear(year)` filter |
| `undp_hdi.json` | UNDP HDR (XLSX→JSON) | HDI rank, value, life exp, schooling, GNI | ~200 | Parsed from "Table 1" with tier headers |
| `transparency_cpi_2024.json` | WB Governance (proxy) | 6 WGI indicators (corruption, rule of law, gov effectiveness, regulatory quality, political stability, voice/accountability) | ~1k | Filtered to 2023; replaces unavailable TI CPI |
| `world_prison_brief.json` | ICPR scraped HTML | Prison population total, rate per 100k | ~200 | Filtered to rate > 0 |
| `education_indicators.json` | World Bank API | 5 indicators (pupil-teacher primary/secondary, edu expenditure % GDP, tertiary enrollment, primary net enrollment) | ~5k | `latestPerCountry()` per indicator |

### Reference & Narrative Datasets (not imported by components)

| File | Description |
|------|-------------|
| `countryStatus.json` | **Tier dataset (schema v2.0)** — 200+ countries with treatment tier (1=Amphetamine, 2=Methylphenidate, 3=Non-stimulant, 4=None), confidence, evidence, approved drugs, notes |
| `colors.ts` | Re-exports tier colors/labels from `countryStatus.json._meta` |
| `wmh_10_country_adult_adhd_prevalence.json` | WMH Survey 10-country adult ADHD (3.4% global) |
| `wmh_20_country_adult_adhd_access_notes.json` | 20-country WMH access notes + paywall docs |
| `adhd_comorbidities_research.json` | Structured comorbidity stats: prison 8.3–40%, SUD 21–23%, depression/suicide OR=3.34 |
| `china_vs_worldwide.json` | China vs global GBD 1990–2021 (China rising, global falling) |
| `adolescents_young_adults_10_24.json` | Yuan 2026 PLoS ONE: 41M prevalent cases 2021, Australia 5.62% highest |
| `gbd_2019_adhd_global.json` | Cortese 2023: 1.13% age-standardized prevalence, GBD underestimates (5.41% vs 2.68%) |
| `gbd_2021_global_adhd_under20.json` | Cortese 2026: 46.9M prevalent under-20 (1.78%), declining rates but rising absolute cases |
| `adhd_prevalence_sources_metadata.json` | Project data inventory with gaps documented |
| `adhd_cognitive_neuroscience_research.json/.md` | Deficits (attention, WM, inhibition, time perception, emotional regulation) vs strengths (divergent thinking, hyperfocus, novelty-seeking) |
| `problem-for-others.md` | Essay: ADHD impact on household, parents, partners, friends |
| `section-01..04-*.md` | Nepali spoken-word script (4 sections): med access, eyeglasses metaphor, metagnosis, neurochemistry |
| `finalADHD.md` / `rough_draft.md` | Final/draft Nepali monologue on ADHD medication access in Nepal |
| `image_keywords.json` | AI image prompts per script section |
| `TODO_FETCH_MANUALLY.json` | Unfetchable sources: IMF 403, PISA 404, UNESCO DNS, GPI 403, Legatum no API, TI CPI empty |

---

## VISUALIZATION COMPONENTS — Deep Dive

---

### 1. EconomicSnapshot.svelte

**Title**: Economic Overview  
**Type**: Horizontal bar chart with metric selector (4 metrics)  
**Data Source**: `gdpPerCapita`, `povertyRate`, `giniIndex`, `populationData`, `gdpLatestRows`, `countryName` from World Bank  
**Chart Specs**: SVG 600×380, padding {t:30, r:80, b:30, l:150}, barH=18, gap=6, top 15 countries by selected metric  
**Metrics**:
| Key | Label | Unit | Color | Map Source |
|-----|-------|------|-------|------------|
| gdp | GDP per Capita | USD | #3b82f6 | `gdpPerCapita` Map |
| poverty | Poverty Rate | % below $2.15/day | #ef4444 | `povertyRate` Map |
| gini | Inequality (Gini) | 0–100 | #f59e0b | `giniIndex` Map |
| population | Population | total | #10b981 | `populationData` Map |

**Derived State**:
- `displayData` — top 15 rows sorted descending, filtered to val > 0
- `globalStats` — mean, median, count of positive values per metric
- `formatVal()` — smart formatting: B/M/K for population, $ for GDP, %.1f for rates
- `maxValue` — max of displayed bars for scaling

**Interaction**: 4 metric buttons (CSS variable `--c` for active color); hover not implemented (static bars)

**Insight**: GDP pc range ~$200–$130k; poverty 0–70%; Gini 24–63; population 10k–1.4B — stark global inequality backdrop for ADHD treatment access

---

### 2. GlobalHealthTrends.svelte

**Title**: Global Health Trends  
**Type**: Multi-series line chart (10 countries + global average) with indicator selector  
**Data Source**: `wbTimeSeries()`, `wbGlobalAverage()`, `countryName()`, `gdpLatestRows` (top 10 GDP)  
**Indicators**:
| Key | Label | Unit |
|-----|-------|------|
| life_expectancy_wb | Life Expectancy | years |
| infant_mortality | Infant Mortality | per 1k |
| maternal_mortality | Maternal Mortality | per 100k |

**Chart Specs**: SVG 600×380, padding {t:20, r:120, b:40, l:50}  
**Series**: 10 top-GDP countries (distinct colors from 10-color palette) + global avg (white dashed, 0.6 opacity)  
**Scales**: Dynamic xRange (min/max year across all series), yRange (min×0.9, max×1.1 across all values)  
**Functions**: `xPos(year)`, `yPos(value)`, `pathD(data)` → SVG path string  
**Axes**: xTicks (6 steps), yTicks (5 steps) derived dynamically

**Interaction**: 3 indicator pills; legend shows global avg + 10 country lines

**Insight**: Top economies show converging life expectancy (~80–85), diverging maternal mortality — health system capacity varies dramatically at similar GDP levels

---

### 3. MentalHealthWorldMap.svelte

**Title**: Mental Health World Map  
**Type**: Choropleth world map (TopoJSON→GeoJSON paths) with 6-indicator selector  
**Data Source**: WHO GHO via `depressionData`, `anxietyData`, `schizophreniaData`, `eatingDisordersData`, `alcoholData`, `drugsData`, `mentalHealthByCountry`, `countryName`, `nameToIso2` (mapData)  
**Indicators**: Depression, Anxiety, Schizophrenia, Eating Disorders, Alcohol Use, Drug Use (all prevalence %)  
**Chart Specs**: SVG viewBox="0 -10 960 520", 960×520 map centered  
**Color Scale**: Dynamic per indicator — `valueRange` (min/max of positive values) → interpolated RGB: R=30+200t, G=30+100(1-t), B=80+80(1-t) where t=normalized value  
**Opacity**: 1.0 if data exists, 0.15 if missing  
**ISO Mapping**: `code3ToIso2` derived per indicator via `nameToIso2(countryName(code3))`

**Interaction**:
- 6 indicator buttons (bottom fixed)
- Hover country → fixed-position tooltip (bottom:6rem) showing all 6 prevalences for that country
- Tooltip uses `mentalHealthByCountry` Map keyed by ISO-3

**Insight**: Depression/anxiety highest in high-income countries (5–7%); schizophrenia ~0.3–0.5% globally; substance use varies by region — mental health burden geography informs ADHD comorbidity expectations

---

### 4. WorldMap.svelte (Treatment Tier Map)

**Title**: ADHD Treatment Access (Tier Map)  
**Type**: Interactive choropleth with tier filtering, labels, screenshot export  
**Data Source**: `countryStatus.json` (tier per ISO-2), `COLORS`, `TIERS` from `colors.ts`, `countryFeatures`, `bordersPath` from `mapData.ts`  
**Tiers**:
| Tier | Label | Color | Count |
|------|-------|-------|-------|
| 1 | Amphetamine | #22c55e | ~45 |
| 2 | Methylphenidate Only | #3b82f6 | ~35 |
| 3 | Non-Stimulants Only | #f59e0b | ~25 |
| 4 | No Treatment | #ef4444 | ~55 |
| unknown | Unknown | #6b7280 | ~40 |

**Chart Specs**: SVG viewBox="0 -10 960 520", same map as MentalHealthWorldMap  
**Features**:
- `countryTiers` state (mutable for Reset)
- `filterTier` — click tier button to isolate (others dimmed to #1a1a2e at 0.15 opacity)
- `showNames` — toggle country labels (SHORT_NAMES map for abbreviations: US→USA, GB→UK, etc.)
- `takeScreenshot()` — html2canvas export at 2x scale, background #1a1a2e
- Hover tooltip (bottom:8rem): country name, tier label, confidence, evidence, last_verified, notes, approved drugs (green ✓ / red ✗)

**Interaction**: 5 tier filter buttons + Names toggle + Reset + Screenshot; keyboard accessible (role=button, tabindex=0, aria-label)

**Insight**: Tier 1 concentrated in Americas/Europe/Australia; Tier 4 dominates Africa/South Asia; stimulant access maps to regulatory capacity + pharma market size

---

### 5. WealthVsWellbeing.svelte

**Title**: Wealth & Wellbeing  
**Type**: Scatter plot (log GDP pc vs Happiness score) with Gini color encoding + trend line  
**Data Source**: `happinessData`, `happinessYears`, `happinessForYear()`, `gdpPerCapita`, `giniIndex`, `countryNameToCode3()`  
**Chart Specs**: SVG 600×400, padding {t:30, r:30, b:50, l:60}  
**Scales**:
- X: log10(GDP) from 500 to 100,000 → `xPos(gdp) = pad.l + ((log10(gdp)-log10(500))/(log10(100k)-log10(500))) × width`
- Y: linear 2–9 → `yPos(score) = pad.t + (1-(score-2)/7) × height`
- Gini color: t=(gini-25)/45 clamped → R=16+220t, G=185-150t, B=129-90t (green→magenta)

**Derived**:
- `joinedData` — WHR countries matched to WB GDP/Gini via `countryNameToCode3()`; filtered to gdp>0
- `trendLine` — OLS on log10(GDP) vs score: slope, intercept → line from xMin to xMax
- `outliers` — top/bottom 3 by score for labeling

**Interaction**: Year selector (all WHR years); trend line toggle; hover dot (r=7, white stroke) shows country; outlier labels always visible

**Insight**: Log-linear trend positive but flattening >$30k; high-Gini outliers (USA, Saudi) sit below trend — inequality erodes wellbeing returns from wealth; ADHD treatment access correlates with both GDP and low Gini

---

### 6. HappinessRankings.svelte

**Title**: World Happiness Report  
**Type**: Stacked horizontal bar chart (top 20) — 7 factor segments per bar  
**Data Source**: `happinessYears`, `happinessForYear()`  
**Factors** (order = stack order):
| Key | Label | Color |
|-----|-------|-------|
| gdp | GDP | #3b82f6 |
| social | Social Support | #8b5cf6 |
| health | Healthy Life Expectancy | #10b981 |
| freedom | Freedom to Choose | #f59e0b |
| generosity | Generosity | #ef4444 |
| corruption | Perceptions of Corruption | #06b6d4 |
| dystopia | Dystopia + Residual | #6b7280 |

**Chart Specs**: barW=500, barH=22, gap=6, labelW=140, chartW=barW+labelW+80, chartH=20×(22+6)+40  
**Scale**: `scaleX = barW / maxScore` (maxScore = max total score in year)  
**Segments**: Each factor width = `factorValue * scaleX`; stacked left-to-right

**Interaction**: Year pills (all WHR years); scrollable chart container; legend maps color→factor

**Insight**: Nordic countries: social support + health dominate; USA: GDP large but corruption/freedom drag; Generosity near zero globally — social capital matters more than wealth for wellbeing, relevant for ADHD social support systems

---

### 7. HDIExplorer.svelte

**Title**: Human Development Index  
**Type**: Ranked table with segmented horizontal bars (HDI = Life Exp + Education + Income)  
**Data Source**: `hdiData` from UNDP "Table 1" (parsed: rank, country, hdi, lifeExp, expectedSchooling, meanSchooling, gni)  
**Tier Classification**: Very High ≥0.8 (green), High ≥0.55 (blue), Medium ≥0.35 (amber), Low <0.35 (red)  
**Bar Segmentation** (per row):
- Total bar width = `(hdi / 1.0) × 200px`
- Life segment = `(lifeExp / 90) × totalBarW × 0.4`
- Education segment = `(meanSchooling / 16) × totalBarW × 0.3`
- Income segment = remainder

**Interaction**: Search filter (debounced via $derived); tier filter buttons (5); top 30 rows; scrollable

**Insight**: HDI components map to ADHD enablers: Life expectancy → health system capacity for diagnosis; Education → teacher awareness/screening; Income → medication affordability; Tier 4 treatment countries cluster in Low/Medium HDI

---

### 8. GovernanceRadar.svelte

**Title**: Governance Scores  
**Type**: Radar/spider chart (6 axes, scaled 0–10 from WBGI −2.5→+2.5)  
**Data Source**: `govIndicators` (6 Maps), `govCountryNames` (Map) — World Bank Governance Indicators 2023  
**Dimensions** (clockwise from top):
1. Control of Corruption
2. Rule of Law
3. Government Effectiveness
4. Regulatory Quality
5. Political Stability
6. Voice & Accountability

**Chart Specs**: 300×300 SVG, center (150,150), radius=110, 5 grid levels  
**Math**: `angleFor(i) = 2πi/6 - π/2`; `pointFor(i, val) = cx + (0-10)) → r=(val/10)×110`  
**Polygons**: Grid polygons at 20%/40%/60%/80%/100% radius; axis lines to 10; labels at 11.5 radius

**Interaction**: Country 1 dropdown (all countries sorted by name); Compare toggle → Country 2 dropdown; dual polygons (blue #3b82f6 fill 0.2 / red #ef4444 fill 0.15) with vertex dots

**Insight**: Regulatory quality + government effectiveness predict controlled substance scheduling efficiency; low corruption + high voice → better patient advocacy for ADHD access

---

### 9. PrisonMentalHealthLink.svelte

**Title**: Prison Population & Mental Health  
**Type**: Horizontal bar chart (top 20 incarceration rates) + global avg reference line  
**Data Source**: `prisonData` from World Prison Brief (ICPR)  
**Chart Specs**: SVG 600×480, padding {t:30, r:60, b:30, l:200}, barH=18, gap=6  
**Scale**: `xPos(rate) = pad.l + (rate/maxRate)×width`  
**Bars**: Red #ef4444, opacity 0.4–1.0 by rate; rank label left, rate/100k right, total pop small text on bar  
**Reference Line**: Amber #f59e0b dashed at global average

**Static Cards** (below chart):
- "ADHD prevalence in prisons: 25–40% vs ~3.5% general population. Up to 8× overrepresentation across studies."
- "Only 7% had childhood diagnosis. Most ADHD prisoners were never identified or treated — a systemic failure of screening and support."

**Insight**: Top incarceration nations (US, El Salvador, Turkmenistan) overlap with Tier 1/2 treatment access but prison ADHD screening absent — criminal justice system becomes de facto mental health provider

---

### 10. PrisonPrevalence.svelte

**Title**: ADHD in Prison Populations  
**Type**: Horizontal bar chart with 95% CI error bars + general population reference line  
**Data**: Embedded static (3 studies):
| Study | Prevalence | 95% CI | n | Note |
|-------|------------|--------|---|------|
| Fazel 2024 | 8.3% | [3.8, 12.8] | 3,919 | Unselected adults, random sampling |
| Young 2014 | 25.5% | [20.0, 32.4] | 26,641 | All ages, diagnostic interview |
| Ginsberg 2010 | 40.0% | — | 30 | Long-term male inmates, high-security |

**Chart Specs**: SVG 560×280, padding {t:30, r:40, b:60, l:140}, maxVal=50, barH=44, gap=20  
**Reference Line**: Red dashed at 3.5% (general population) with label  
**Error Bars**: Horizontal line CI low–high with caps at midpoint

**Cards**:
- "1 in 12 prisoners (random sampling) — Fazel 2024 corrected for selection bias"
- "Up to 8× overrepresentation — Ginsberg 2010 40% in long-term male inmates"

**Insight**: Methodology drives prevalence — unselected samples ~8%, selected/high-security ~25–40%; even lowest estimate 2.4× general population

---

### 11. ComorbidityBreakdown.svelte

**Title**: Comorbidities in Prison ADHD  
**Type**: Horizontal bar chart (% of ADHD prisoners with each comorbidity)  
**Data**: Embedded static (Ginsberg 2010, n=30 confirmed ADHD of 34 assessed from 315 screened, Swedish high-security):
| Comorbidity | % |
|-------------|---|
| Substance Use Disorder | 100 |
| Personality Disorders | 96 |
| Antisocial PD | 96 |
| Borderline PD | 74 |
| Mood & Anxiety | 73 |
| Autism Spectrum | 23 |
| Psychopathy (PCL-R ≥30) | 10 |

**Chart Specs**: SVG 560×300, padding {t:20, r:60, b:20, l:200}, maxVal=100, barH=32, gap=8  
**Opacity**: 0.3 + 0.7×(percent/100)  
**Note**: "n = 30 confirmed ADHD cases (of 34 assessed from 315 screened)"

**Cards**:
- "100% had lifetime substance use disorder"
- "Only 7% had a childhood ADHD diagnosis despite most needing services"

**Insight**: Near-universal SUD + personality disorder comorbidity in prison ADHD; childhood diagnosis rate 7% = catastrophic early identification failure

---

### 12. SUDbySubstance.svelte

**Title**: ADHD in Substance Use Disorder  
**Type**: Horizontal bars with 95% CI + overall reference line  
**Data**: Embedded static (Rohner 2023 meta-analysis, n=12,524 across 31 studies):
| Substance | % ADHD | 95% CI | n Studies |
|-----------|--------|--------|-----------|
| Alcohol | 25% | [18.5, 33.6] | 7 |
| Cocaine | 19% | [10.6, 31.0] | 7 |
| Opioid | 18% | [7.8, 35.1] | 3 |
| **Overall** | **21%** | [17.4, 25.5] | — |

**Chart Specs**: SVG 560×260, padding {t:40, r:40, b:50, l:60}, maxVal=40  
**Overall Line**: Blue #3b82f6 dashed at 21% with label "Overall: 21%"  
**Bars**: Amber #f59e0b, height=36, CI lines at mid-height with caps

**Cards**:
- "~1 in 5 SUD patients have ADHD — Rohner 2023, n=12,524 across 31 studies"
- "Alcohol highest at 25%, Cocaine 19%, Opioid 18% — wide CIs due to small n"

**Insight**: ADHD screening in addiction treatment could identify 20%+ missed cases; alcohol SUD highest comorbidity but all substances elevated

---

### 13. SexComparison.svelte

**Title**: ADHD by Sex  
**Type**: Grouped vertical bar chart (LayerChart wrapper) — Prevalence & Incidence per 100k (ages 10–24, 2021)  
**Data**: Embedded static (GBD 2021):
| Sex | Prevalence | Incidence |
|-----|------------|-----------|
| Male | 3,072.73 | 16.91 |
| Female | 1,228.19 | 6.61 |

**Component**: Uses `BarChart` from `layerchart` with custom `marks` snippet rendering two bars per group (blue prevalence, green incidence) with value labels

**Cards**:
- "Males diagnosed 2.5x more often"
- "Prevalence: 3,073 vs 1,228 per 100k"

**Insight**: Consistent 2.5:1 male:female ratio across GBD and WMH studies; female ADHD likely underdiagnosed due to inattentive presentation, referral bias

---

### 14. AgePyramid.svelte

**Title**: ADHD Prevalence by Age Group  
**Type**: Vertical bar chart (LayerChart) — 3 age bands per 100k  
**Data**: Embedded static (GBD 2021):
| Age Group | Prevalence | Incidence |
|-----------|------------|-----------|
| 10–14 | 2,713.36 | 33.66 |
| 15–19 | 2,157.35 | 0 |
| 20–24 | 1,587.64 | 0 |

**Insight**: Peak prevalence 10–14; **all incidence occurs 10–14** (GBD definition: onset before age 12); decline in older bands reflects persistence/remission, not new onset — early detection window is narrow

---

### 15. SDIScatter.svelte

**Title**: SDI vs ADHD Prevalence  
**Type**: Scatter plot (7 regional points) — SDI (0–1) vs prevalence % (under-20, 2021)  
**Data**: Embedded static regional aggregates:
| Region | SDI | Prevalence % | Label |
|--------|-----|--------------|-------|
| High SDI | 0.90 | 2.88 | High SDI |
| High-Middle SDI | 0.70 | 2.20 | High-Middle SDI |
| Australasia | 0.85 | 5.37 | Australasia |
| Caribbean | 0.65 | 4.50 | Caribbean |
| East Asia | 0.72 | 3.80 | East Asia |
| N. Africa / ME | 0.60 | 1.80 | N. Africa / ME |
| South Asia | 0.50 | 1.20 | South Asia |

**Chart Specs**: SVG 500×350, padding {t:30, r:30, b:50, l:60}, xTicks=[0,0.2..1.0], yTicks=[0..6]  
**Insight**: Nonlinear positive correlation — higher sociodevelopmental index → higher diagnosed prevalence; Australasia extreme outlier (Australia 5.62%); greatest increases 1990–2021 in high-SDI regions (detection improvement, not true incidence rise)

---

### 16. RegionalRanking.svelte

**Title**: ADHD Prevalence by Region  
**Type**: Horizontal progress bars (4 regions)  
**Data**: Embedded static (GBD 2021, ages 10–24):
| Region | Prevalence/100k | Incidence/100k |
|--------|-----------------|----------------|
| Australasia | 6,366.3 | 33.74 |
| Caribbean | 6,001.95 | — |
| East Asia | 4,411.22 | 25.93 |
| N. America | 4,184.7 | 21.77 |

**Chart Specs**: Simple flex rows with percentage-width bar-fill (linear gradient #3b82f6→#8b5cf6), value label right

**Insight**: Australasia leads (driven by Australia 5.62%); Caribbean surprisingly high — may reflect diagnostic intensity or genetic/environmental factors

---

### 17. TreatmentAccessIndex.svelte

**Title**: Treatment Access Index  
**Type**: Ranked horizontal progress bars with country flags (composite score 0–100)  
**Data**: Computed in `data.ts`:
```typescript
function computeTreatmentAccessIndex(): {country_code, score, healthExp, lifeExp}[] {
  const healthPct = percentileRanks(healthExpenditure)  // %ile of health exp % GDP
  const lifePct = percentileRanks(lifeExpectancyWb)     // %ile of life expectancy
  // Intersection of countries with both
  return countries.map(c => ({code: c, score: (healthPct[c]+lifePct[c])/2, ...}))
    .sort((a,b)=>b.score-a.score)
}
```
**View Modes**: Top 20, Bottom 20, All (scrollable)  
**Flags**: `flagcdn.com/24x18/{iso2}.png` via `iso3ToIso2()`  
**Color Scale**: Score→RGB: R=220-200t, G=50+150t, B=50+100t (red→green)

**Cards**:
- "Treatment access depends on infrastructure — ADHD diagnosis and treatment require healthcare spending and good health outcomes"
- "Low-income countries face barriers — underfunded health systems and weak governance make ADHD treatment nearly unavailable"

**Insight**: Composite captures healthcare capacity + population health; top scorers (Nordic, W. Europe) have both funding and outcomes; bottom (conflict zones, low-income) lack both

---

### 18. EducationPressure.svelte

**Title**: Education Context  
**Type**: Dual horizontal bars per country (Primary=blue, Secondary=purple pupil-teacher ratio)  
**Data Source**: `educationData` (pupilTeacherPrimary, pupilTeacherSecondary Maps), `getIncomeGroup()`, `countryName()`  
**Chart Specs**: SVG 600×400, padding {t:20, r:40, b:40, l:140}, barH=18, gap=22 (2 bars per country)  
**Scale**: Dynamic `maxVal` from filtered rows (primary+secondary)  
**Filters**: Income group (All / High / Upper Middle / Lower Middle / Low); Sort by Primary or Secondary  
**Top 20** by selected sort

**Insight**: Low-income countries: 40–60 pupils/teacher (e.g., Malawi 69 primary, CAR 83 secondary) — individual attention impossible, ADHD symptoms invisible; correlates with Tier 4 treatment access

---

### 19. TimelineView.svelte

**Title**: ADHD Treatment Timeline  
**Type**: Vertical timeline with tier-colored dots + expandable events  
**Data**: Embedded static (5 milestones):
| Year | Event | Tier |
|------|-------|------|
| 1937 | Amphetamine first prescribed for ADHD | 1 |
| 1955 | Methylphenidate (Ritalin) introduced | 2 |
| 1996 | Atomoxetine (Strattera) approved | 3 |
| 2002 | Extended-release formulations become standard | 1 |
| 2021 | Vyvanse (lisdexamfetamine) approved in EU | 1 |

**Chart Specs**: CSS-based timeline (not SVG) — flex column with left border line, absolute-positioned dots (12px) colored by tier (from `COLORS`), click to select/highlight

**Insight**: 84 years from first stimulant to modern formulations; Tier 1 countries benefited from each innovation, Tier 4 still awaiting 1955-level access

---

### 20. StatsView.svelte

**Title**: Global ADHD Treatment Overview  
**Type**: 5 stat cards with count, percentage, progress bar  
**Data**: Aggregated from `countryStatus.json` at runtime:
```typescript
const tierCounts = $derived.by(() => {
  const counts: Record<TierKey, number> = {'1':0,'2':0,'3':0,'4':0,unknown:0}
  for (const entry of Object.values(statusData.countries)) {
    counts[String(entry.tier)]++
  }
  return counts
})
```
**Cards**: Tier 1–4 + Unknown; each shows color bar (4px), count (1.6rem), label, percentage, progress bar (width=percentage%)

**Insight**: Dashboard summary — global treatment landscape at a glance; unknown tier = data gaps

---

### 21. SexDiffSUD.svelte

**Title**: SUD in ADHD by Sex  
**Type**: Grouped vertical bar chart (4 substance categories × 2 sexes) + HR labels  
**Data**: Embedded static (Moldekleiv 2025, Norwegian cohort n=49,815 ADHD ages 18–31):
| SUD Type | Male % | Female % | Male HR | Female HR |
|----------|--------|----------|---------|-----------|
| Any SUD | 11.4 | 10.9 | 4.1× | 4.5× |
| Cannabis | 6.8 | 4.3 | 5.5× | 6.5× |
| Stimulant | 3.7 | 3.4 | 7.3× | 8.0× |
| Opioid | 1.5 | 1.4 | 7.6× | 7.4× |

**Chart Specs**: SVG 560×300, padding {t:40, r:40, b:50, l:80}, maxVal=14, barW=28, groupGap=40  
**Bars**: Blue #3b82f6 (male), Pink #ec4899 (female) side-by-side per group  
**Labels**: Prevalence % above bars; HR below x-axis: "HR ♂ 4.1× / ♀ 4.5×"

**Insight**: **Females show higher relative risk (HR) despite lower absolute prevalence** — stimulant SUD HR 8.0× vs 7.3×; suggests ADHD females who develop SUD have more severe trajectory

---

### 22. TrendLine.svelte

**Title**: ADHD Global Trends  
**Type**: 3 stat cards with start→end values, % change, progress bar  
**Data**: Embedded static (GBD 2021, ages 10–24, 1990→2021):
| Metric | 1990 | 2021 | Change | Unit |
|--------|------|------|--------|------|
| Prevalence | 2,382 | 2,173 | -5.7% | per 100k |
| Incidence | 12.6 | 11.9 | -5.7% | per 100k |
| DALYs | 30.3 | 26.6 | -12.4% | per 100k |

**Cards**: Start value (gray) → arrow → End value (large white); green badge with % decline; progress bar fill = (end/start)×100%

**Insight**: Rates declining but **absolute cases rising +9.7%** due to population growth (per GBD 2021) — prevalence down, burden up

---

### 23. SuicideRisk.svelte

**Title**: ADHD & Suicide Risk  
**Type**: Horizontal bar cards with OR + 95% CI visualization + summary cards  
**Data**: Embedded static (Garas 2025 meta-analysis):
| Outcome | OR | 95% CI | n Studies | p |
|---------|-----|--------|-----------|---|
| Suicidal Ideation | 3.956 | [1.996, 7.841] | 2 | <0.001 |
| Suicide Death | 3.891 | [2.103, 7.198] | 2 | <0.001 |
| Suicide Attempt | 3.344 | [1.682, 6.650] | 6 | 0.001 |
| Overall Suicidality | 3.336 | [2.201, 5.057] | 9 | <0.001 |

**Visualization**: Each card — track (gray), CI band (purple 0.2 opacity), OR bar (purple full), OR value large (1.6rem), label, meta line  
**Summary Row** (3 cards):
- 3.3× overall suicidality risk (OR 3.34, CI [2.20–5.06])
- 140k ADHD youth studied vs 4.3M controls across 9 studies
- ≥10yr follow-up needed (risk significant only with long follow-up)

**Insight**: ADHD confers 3–4× suicide risk independent of comorbidities; early treatment reduces risk — screening critical

---

### 24. DataExplorer.svelte

**Title**: Data Files  
**Type**: Searchable card grid of all 22 data files with metadata viewer  
**Implementation**: Dynamic imports via `import.meta.glob`:
```typescript
const dataModules = import.meta.glob('../../../data/*.json', {eager:true})
const mdModules = import.meta.glob('../../../data/*.md', {query:'?raw', eager:true})
```
Merges with `README_DATA.json` metadata by filename key  
**Card**: Filename, source, description, top-level keys (for JSON) or sections (for MD)  
**Modal Click**: Opens formatted JSON (syntax highlighted via `<pre>`) or rendered Markdown

**Insight**: Developer transparency tool — every dataset documented, browsable, traceable to source

---

## COLOR SYSTEM (`src/lib/colors.ts`)

Re-exports from `countryStatus.json._meta`:

```json
{
  "1": "#22c55e",    // Amphetamine (Tier 1)
  "2": "#3b82f6",    // Methylphenidate Only (Tier 2)
  "3": "#f59e0b",    // Non-Stimulants Only (Tier 3)
  "4": "#ef4444",    // No Treatment (Tier 4)
  "unknown": "#6b7280"
}
```
Used by: `WorldMap`, `StatsView`, `TimelineView`, `MentalHealthWorldMap` (indicator colors derived separately)

---

## KEY DATA PROCESSING FUNCTIONS (`src/lib/data.ts`)

| Function | Signature | Purpose |
|----------|-----------|---------|
| `isCountryCode(code)` | `(string) => boolean` | Filters 24 WB aggregate codes (AFE, WLD, etc.) |
| `latestPerCountry(rows)` | `T[] => T[]` | Deduplicates WB data → latest year per ISO-3 |
| `latestPerCountrySex(rows)` | `WHOrows[] => WHOrows[]` | Filters SEX_BTSX, latest year per country |
| `percentileRanks(Map)` | `Map<string,number> => Map<string,number>` | Converts values to 0–100 percentile ranks |
| `wbTimeSeries(indicator, code3)` | `(string,string) => {year,value}[]` | Time series for one country/indicator |
| `wbGlobalAverage(indicator)` | `string => {year,value}[]` | Yearly global mean across countries |
| `computeTreatmentAccessIndex()` | `() => {code,score,healthExp,lifeExp}[]` | Composite: mean(healthExp%ile, lifeExp%ile) |
| `countryName(code3)` | `string => string` | Lookup name from WB GDP data |
| `countryNameToCode3(name)` | `string => string\|undefined` | Reverse lookup for WHR matching |
| `getIncomeGroup(code3)` | `string => 'Low Income'\|'Lower Middle'\|'Upper Middle'\|'High Income'\|'Unknown'` | WB income classification (hardcoded arrays) |
| `iso3ToIso2(code3)` | `string => string\|undefined` | ISO-3 → ISO-2 via country name matching |

---

## ARCHITECTURE NOTES FOR CONTRIBUTORS

1. **Add new data**: Place JSON in `data/`, add entry to `README_DATA.json`, import in `data.ts`, export typed helper
2. **Add new view**: Create `src/lib/components/YourView.svelte`, import in `+page.svelte`, add to `COMPONENTS`, `CATEGORIES`, if/else chain
3. **Static data in components**: Embed small datasets directly (e.g., `PrisonPrevalence`, `SUDbySubstance`) — no pipeline needed
4. **LayerChart**: Wrapper for reusable chart primitives (used by `SexComparison`, `AgePyramid`, `SexDiffSUD` via custom marks)
5. **Map data**: `src/lib/mapData.ts` provides `countryFeatures` (TopoJSON→GeoJSON with centroids cx/cy) and `bordersPath`
6. **Country status**: `src/lib/countryStatus.json` = single source of truth for treatment tiers (schema v2.0)
7. **No runtime fetch**: All data imported at build → static deployment
8. **Engine strict**: `.npmrc` has `engine-strict=true` — Node must match `package.json` engines

---

## DOCUMENTED DATA GAPS & LIMITATIONS

From `adhd_prevalence_sources_metadata.json` and `TODO_FETCH_MANUALLY.json`:

| Gap | Impact |
|-----|--------|
| WMH 20-country study paywalled (Springer) | Only 10-country subset (3.4% global) accessible |
| Workplace impact data blocked (ResearchGate 403) | Economic burden estimates incomplete |
| Adult-specific GBD data unavailable | GBD models underestimate vs surveys (1.13% vs 3.4%) |
| TI CPI unavailable → substituted WB Governance | Corruption proxy less ADHD-specific |
| IMF, PISA, UNESCO, GPI, Legatum APIs inaccessible | Missing economic, education, peace, prosperity context |

**Key Insight**: WMH survey data (3.4% adult ADHD) consistently shows **3× higher prevalence than GBD modeled estimates (1.13%)** — GBD likely underestimates due to reliance on clinical records vs population surveys

---

## VISUAL DESIGN PHILOSOPHY — Statistics, Perception, Design, and Rhetoric

This section documents the intentional design decisions at the intersection of statistical communication, perceptual psychology, information design, and rhetorical strategy. The goal is not merely to display data but to make the case that ADHD is a global health crisis demanding systemic response — and to do so through the visual language itself, not just the numbers.

---

### 1. The Dark Canvas: Why Dark Mode Is Not Cosmetic

The entire dashboard uses a near-black background (#0f0f23 / #1a1a2e) with light text. This is not an aesthetic preference — it is a rhetorical and perceptual choice.

**Perceptual psychology**: Dark backgrounds reduce overall luminance, causing the pupil to dilate. This makes bright-colored data marks (bars, dots, map fills) appear to glow — they become figures against a ground with maximal contrast. The eye is drawn to the data, not to the white space around it. In visualization research, this is called the "pop-out effect" — pre-attentive processing where color/brightness differences are detected in <200ms without conscious scanning.

**Rhetorical effect**: Dark mode evokes "dashboard" — monitoring, surveillance, urgency. It is the visual language of control rooms, night shifts, and medical monitors. This frames ADHD not as a lifestyle infographic but as a public health monitoring system. The darkness says: this is serious, this is being watched, this matters.

**Accessibility note**: Dark mode reduces eye strain in low-light viewing (common for the target audience of ADHD adults who often screen-use at night). The tradeoff is reduced readability in bright environments — acceptable for a digital-first presentation tool.

---

### 2. The Palette: Color as Rhetoric

The tier color system is not arbitrary — it follows a **traffic light + grey** pattern that maps to universal cognitive associations:

| Tier | Color | Association | Rhetorical Effect |
|------|-------|-------------|-------------------|
| 1 (Amphetamine) | #22c55e Green | "Go", "Access", "Good" | Tier 1 countries are *fortunate* — green signals permission, availability |
| 2 (Methylphenidate Only) | #3b82f6 Blue | "Info", "Partial", "Standard" | Blue is neutral — Tier 2 is adequate but incomplete |
| 3 (Non-Stimulants Only) | #f59e0b Amber | "Caution", "Warning" | Amber signals delay — Tier 3 countries have treatment but not first-line |
| 4 (No Treatment) | #ef4444 Red | "Stop", "Danger", "Bad" | Red is alarm — Tier 4 countries have nothing. The eye catches red first. |
| Unknown | #6b7280 Grey | "No data", "Absent" | Grey is the color of invisibility — these countries don't even have data |

**Pre-attentive processing**: Red-green-blue-amber are processed by the visual cortex's V4 color area before conscious attention. The tier map is readable *before reading any labels*. A viewer scanning the world map instantly sees: green Americas/Europe, red Africa/South Asia. The argument is made by color alone.

**Colorblindness consideration**: The red-green pairing is problematic for protanopia/deuteranopia (~8% of males). The project does not currently include pattern/texture encoding as a fallback — this is a known accessibility gap. However, the tier buttons use colored dots + text labels, and the tooltip provides text-based tier identification, partially mitigating this.

**Indicator color independence**: MentalHealthWorldMap uses a different palette (dark blue → red gradient per indicator) to avoid confusion with the tier system. Each indicator's color scale is self-contained — the viewer re-learns the scale per indicator switch, which is cognitively cheaper than trying to remember a global scale.

---

### 3. Chart Type Selection: The Grammar of Graphics

Each visualization uses a specific chart type chosen for the **data relationship** it encodes:

| Data Relationship | Chart Type | Components Using It | Why This Type |
|-------------------|------------|---------------------|---------------|
| **Ranking** (one categorical × one quantitative) | Horizontal bar | EconomicSnapshot, PrisonMentalHealthLink, EducationPressure, TreatmentAccessIndex | Bars enable precise length comparison; horizontal allows long country names; ranking by default (sorted descending) |
| **Distribution** (one quantitative, multiple categories) | Grouped vertical bar | SexComparison, AgePyramid, SexDiffSUD | Vertical bars enable height comparison across groups; grouping allows sex/age cross-tabulation |
| **Composition** (part-of-whole across categories) | Stacked horizontal bar | HappinessRankings | Stacking shows both total score and factor decomposition; horizontal allows country name labels |
| **Trend** (quantitative over time) | Multi-series line | GlobalHealthTrends | Lines encode continuity and direction; multiple series enable comparison; time on x-axis is universal |
| **Correlation** (two quantitives) | Scatter plot | WealthVsWellbeing, SDIScatter | Scatter reveals relationship shape (linear, logarithmic, clustered); position is the most accurate visual encoding (Cleveland & McGill 1984) |
| **Geography** (spatial distribution) | Choropleth map | WorldMap, MentalHealthWorldMap | Maps leverage spatial cognition — viewers already know country locations; choropleth encodes magnitude as color intensity |
| **Profile** (multivariate comparison) | Radar/spider | GovernanceRadar | Radar shows "shape" of a country's governance — asymmetric profiles reveal strengths/weaknesses at a glance |
| **Timeline** (events in sequence) | Vertical timeline | TimelineView | Vertical flow matches reading direction; dots mark discrete events; tier-coloring connects to the map |
| **Summary** (aggregate counts) | Stat cards | StatsView, TrendLine, SuicideRisk | Cards emphasize single numbers; the "big number" rhetorical device — 3.3× is more memorable than a table of odds ratios |
| **Uncertainty** (point estimate + interval) | Error bars | PrisonPrevalence, SUDbySubstance, SuicideRisk | Error bars make uncertainty visible — the CI is not hidden; viewers see the range of plausible values, not just the point estimate |

**The bar chart dominance**: 8 of 24 views use bar charts. This is intentional — bar charts are the most perceptually accurate for comparing magnitudes (Cleveland & McGill 1984: position along a common scale > length > angle > area > volume). For ADHD advocacy, precise magnitude comparison matters: "8× overrepresentation" must be visually *felt*, not just read.

---

### 4. Position Encoding: The Most Powerful Visual Channel

Bertin's *Semiology of Graphics* (1967) and Cleveland & McGill's perceptual hierarchy (1984) both establish that **position along a common scale** is the most accurate visual encoding for quantitative data. This project uses position encoding in:

- **Scatter plots** (WealthVsWellbeing, SDIScatter): x and y positions encode two variables simultaneously — the viewer extracts correlation, clusters, outliers, and trends from position alone
- **Bar charts** (all): bar endpoint position encodes magnitude — the viewer compares lengths by comparing endpoint positions along a shared axis
- **Line charts** (GlobalHealthTrends): point positions along y encode value at each time point — the slope between positions encodes rate of change

**What is NOT used**: Pie charts (angle encoding is less accurate than position), treemaps (area encoding), bubble charts (area encoding). The project avoids these despite their popularity because they sacrifice accuracy for aesthetics.

---

### 5. The Logarithmic Scale: Making Inequality Visible

WealthVsWellbeing uses a **log10 x-axis** for GDP per capita (500 → 100,000). This is a critical design choice:

**Why log**: GDP per capita spans ~260× (DRC ~$600 → Norway ~$130,000). On a linear scale, all countries below $10k collapse into an indistinguishable cluster on the left 5% of the chart. The log scale preserves relative differences at both ends — the gap between $600 and $6,000 is visually equal to the gap between $6,000 and $60,000.

**Rhetorical effect**: The log scale reveals that the relationship between GDP and happiness is *log-linear* — each doubling of GDP adds roughly the same amount of happiness. This is more honest than a linear scale which would show a "diminishing returns" curve that overemphasizes the flattening at high GDP. The log says: poverty reduction matters as much as wealth creation.

**ADHD relevance**: Treatment costs (methylphenidate ~$4/month generic) are trivial at high GDP but impossible at low GDP. The log scale makes visible the 100× GDP gap that determines whether a country can afford treatment infrastructure.

---

### 6. The Reference Line: Anchoring Perception

Multiple views use dashed reference lines (GlobalHealthTrends: global average; PrisonPrevalence: 3.5% general population; SUDbySubstance: 21% overall). These serve a specific perceptual function:

**Anchoring**: Reference lines create a perceptual anchor — the viewer's eye compares every data point to the line, not just to other data points. This is a form of **anchoring bias** used constructively: the line says "this is the baseline, everything above/below is notable."

**The 3.5% line in PrisonPrevalence**: The red dashed line at 3.5% is the most important visual element in that chart. It makes the overrepresentation *immediately visible* — every bar extends far beyond the line. Without the line, the viewer would need to read the 3.5% value from a legend or text, then mentally compare. The line offloads that computation to the visual system.

**White dashed line in GlobalHealthTrends**: The global average line is rendered in white at 0.6 opacity — visually distinct from the colored country lines but not competing for attention. It says: "here is the center of gravity; see how countries deviate."

---

### 7. Opacity as Data: Encoding Confidence and Completeness

The project uses opacity as a **secondary encoding channel**:

- **MentalHealthWorldMap**: Countries without data are rendered at 0.15 opacity vs 1.0 for data-present. This creates a visual distinction between "no data" and "zero prevalence" — the viewer sees gray/transparent countries as *missing information*, not as *no problem*.
- **ComorbidityBreakdown**: Bar opacity = 0.3 + 0.7×(percent/100). The 100% SUD bar is fully opaque; the 10% psychopathy bar is semi-transparent. This creates a visual weight that reinforces the numerical weight — the eye lingers on the dense, opaque bars.
- **PrisonMentalHealthLink**: Bar opacity scales with rate — high-incarceration countries are visually heavier. This creates a natural visual hierarchy without explicit sorting (though the data is also sorted).

**Perceptual principle**: Opacity is a **preattentive attribute** — the visual system processes opacity differences automatically, before conscious attention. The viewer *feels* the weight of high-incarceration countries without reading numbers.

---

### 8. Typography as Hierarchy

The typography system uses a strict hierarchy:

| Level | Size | Weight | Color | Use |
|-------|------|--------|-------|-----|
| Title | 1.8rem | 700 | #e0e0e0 | Component heading — white, bold, largest |
| Subtitle | 0.9rem | 400 | #888 | Description/context — gray, smaller |
| Axis label | 10–12px | 500 | #888 | Chart axes — functional, not distracting |
| Bar label | 10–13px | 600–700 | #e0e0e0 or metric color | Data values — readable, prominent |
| Card label | 0.9–1rem | 600 | #e0e0e0 | Insight headlines — white, bold |
| Card note | 0.75–0.8rem | 400 | #888 | Supporting detail — gray, smaller |
| Meta value | 0.65–0.7rem | 400 | #555–#666 | Units, sources, counts — smallest, dimmest |

**The insight cards**: Every component ends with 1–2 cards containing a bold headline and gray supporting text. This is **rhetorical framing** — the card says "here is what this chart means." It prevents the viewer from needing to interpret raw data and instead provides the interpretation directly. This is a tension in visualization philosophy (Tufte: "let the data speak" vs. Kelleher & Fong: "guide the viewer") — this project takes the guided approach, appropriate for advocacy.

**Readability in dark mode**: Gray text (#888) on dark background (#0f0f23) has a contrast ratio of ~5.5:1, exceeding WCAG AA (4.5:1) for normal text. The dimmest text (#555) at ~3.5:1 is used only for non-essential metadata.

---

### 9. Map Cognition: Spatial Memory and Choropleth Bias

The two choropleth maps (WorldMap, MentalHealthWorldMap) exploit **spatial cognition** — the viewer's pre-existing knowledge of world geography.

**Advantage**: The viewer already knows where Africa, Europe, and South Asia are. A choropleth map doesn't need to teach geography — it piggybacks on existing spatial memory. This makes the map instantly interpretable: "red in Africa = Tier 4 = no treatment" is processed in <1 second.

**Known bias**: Choropleth maps are area-weighted — large countries (Russia, Canada, Brazil) dominate visually even if their data is less important. Small countries (Belgium, Singapore) are nearly invisible. This is partially mitigated by:
- Hover tooltips (reveal data for small countries)
- The sidebar's bar chart views (rank countries by value, not area)
- The filter buttons (isolate one tier, making small countries visible as colored dots)

**The Mercator problem**: The map uses a projection that inflates polar regions (Greenland appears same size as Africa). This is acceptable for this project because the data is country-level, not area-level — the visual area of a country doesn't encode data, only its color does.

**Two maps, different purposes**:
- **WorldMap** (Treatment Tier): Categorical encoding (4 tiers + unknown) — the map answers "what treatment is available WHERE?"
- **MentalHealthWorldMap** (Prevalence): Continuous encoding (gradient) — the map answers "how much mental illness is WHERE?"
- The categorical map uses discrete, named colors; the continuous map uses a gradient. This distinction prevents confusion between "tier assignment" (a policy decision) and "prevalence measurement" (an epidemiological observation).

---

### 10. Interaction as Rhetoric: The Argument Through Exploration

Each interactive element makes a rhetorical move:

| Interaction | Rhetorical Move | Example |
|-------------|-----------------|---------|
| **Metric selector** (EconomicSnapshot) | "Look at this from multiple angles" — shows that GDP, poverty, inequality, and population tell different stories about the same countries | Switching from GDP to Gini reveals that rich countries can be unequal |
| **Indicator selector** (MentalHealthWorldMap, GlobalHealthTrends) | "This is not one disease — it's six" — switching between depression, anxiety, schizophrenia shows different geographies | Depression clusters in wealthy nations; substance use clusters differently |
| **Tier filter** (WorldMap) | "Isolate the problem" — clicking Tier 4 dims everything else, making the red countries the visual focus | The map goes dark except for Africa/South Asia — the crisis is spatially concentrated |
| **Year selector** (WealthVsWellbeing, HappinessRankings) | "This changes over time" — the viewer can watch the relationship evolve | Happiness-GDP slope flattens over decades |
| **Compare mode** (GovernanceRadar) | "Two countries, side by side" — overlaying two governance profiles makes disparities visceral | Norway (high on all axes) vs Somalia (collapsed polygon) |
| **Country search** (HDIExplorer) | "Find YOUR country" — personalizes the global data | A Nepali viewer searches "Nepal" and sees their country's position |
| **Screenshot export** (WorldMap) | "Share this" — enables viral spread of the tier map | The map becomes a shareable artifact, extending the argument beyond the dashboard |

**The tooltip as micro-narrative**: Hovering a country on the WorldMap reveals not just the tier but confidence, evidence, last_verified, notes, and approved drugs. This is a **nested disclosure** pattern — the overview is simple (color), the detail is available on demand (tooltip). The viewer can engage at their preferred depth.

---

### 11. The Uncertainty Visualization: Honest Statistics

Three views explicitly visualize uncertainty (95% CI error bars): PrisonPrevalence, SUDbySubstance, SuicideRisk.

**Why this matters**: Most advocacy visualizations hide uncertainty behind point estimates. Showing CIs is a **credibility move** — it says "we are confident enough in our data to show you exactly how uncertain it is." This is counterintuitive but effective: audiences trust uncertain-but-honest data more than precise-but-suspicious data.

**Visual encoding**: Error bars use:
- Horizontal line (CI range) with vertical caps at endpoints
- Centered on the point estimate (the bar endpoint)
- Same color as the bar, slightly lighter

**The Ginsberg 2010 problem**: In PrisonPrevalence, Ginsberg 2010 has no CI (n=30, high-security). The chart simply omits the error bar for this study, which is visually honest — the absence of an error bar says "this estimate has no reported uncertainty" without hiding it.

**SuicideRisk's CI visualization**: The suicide risk cards use a more sophisticated encoding — a purple CI band behind the OR bar. This makes the CI feel like a "shadow" of the estimate, visually communicating that the true value lies somewhere in that range. The wider the shadow, the less certain we are.

---

### 12. The Narrative Arc Across 24 Views

The 24 components are not random — they follow a **rhetorical structure**:

**Act 1: The Global Landscape (EconomicSnapshot, HDIExplorer, HappinessRankings, WealthVsWellbeing)**
- Establishes the economic and developmental context
- Rhetorical question: "Can these countries afford ADHD treatment?"

**Act 2: The Health System (GlobalHealthTrends, GovernanceRadar, TreatmentAccessIndex, EducationPressure)**
- Maps healthcare capacity and institutional quality
- Rhetorical question: "Do these countries have the infrastructure to diagnose and treat?"

**Act 3: The Crisis (MentalHealthWorldMap, WorldMap, PrisonMentalHealthLink, PrisonPrevalence, ComorbidityBreakdown, SUDbySubstance)**
- Reveals the mental health burden and the treatment gap
- Rhetorical question: "What happens when ADHD goes untreated?"

**Act 4: The Evidence (SexComparison, AgePyramid, SDIScatter, RegionalRanking, SexDiffSUD)**
- Presents epidemiological evidence from GBD and cohort studies
- Rhetorical question: "Who is affected and where?"

**Act 5: The Consequences (SuicideRisk, TrendLine, TimelineView, StatsView)**
- Stakes the argument: suicide risk, global trends, treatment history
- Rhetorical move: urgency + hope (treatment exists but isn't accessible)

**Act 6: Transparency (DataExplorer)**
- "Here is everything we used — verify it yourself"
- Rhetorical move: trust-building through radical transparency

This arc moves from **context** → **capacity** → **crisis** → **evidence** → **stakes** → **trust** — a classical rhetorical structure adapted for data storytelling.

---

### 13. Cognitive Load Management

The project manages cognitive load through several patterns:

**Progressive disclosure**: Overview (bar chart/map) → hover (tooltip detail) → click (expanded view). The viewer is never overwhelmed with all data at once.

**Consistent layout**: Every component follows the same structure: Title → Subtitle → Controls → Chart → Legend → Cards. This predictability means the viewer learns the layout once and applies it to all 24 views.

**Limited palette per view**: Each chart uses 2–4 colors maximum. The HappinessRankings (7 colors) is the exception — necessary for 7 factors — but uses a consistent legend.

**No animation**: The project uses no entrance animations, transitions between views, or animated data reveals. This is a deliberate choice — animation increases cognitive load and can mislead (perception of change where none exists). The Svelte transitions (`opacity 0.15s`, `width 0.4s ease`) are limited to hover feedback, not data presentation.

**The 15-country limit**: EconomicSnapshot shows only top 15 countries. This prevents information overload — showing all 200+ countries would make the chart unreadable. The viewer can infer "the rest are below" from the sorted order.

---

### 14. Rhetorical Devices in Data Visualization

Beyond standard visualization principles, the project employs specific rhetorical strategies:

**Enumeration (lists as evidence)**: The ComorbidityBreakdown lists 7 comorbidities with exact percentages. The list format creates a sense of accumulation — "not just one problem, but seven." This is Aristotle's *enumeratio* adapted for data.

**Antithesis (contrast as argument)**: The contrast between 3.5% (general population) and 40% (prison ADHD) is the core antithesis. The reference line in PrisonPrevalence makes this contrast visual, not just numerical. The two cards below the chart repeat the antithesis in text: "25–40% vs ~3.5%."

**Anaphora (repetition for emphasis)**: The subtitle pattern — "Prevalence across meta-analyses vs general population," "Global incarceration rates — ADHD is 4–10× overrepresented" — repeats the structure of [scope] + [claim] to build cumulative force.

**Ethos (credibility through sourcing)**: Every static dataset cites its source (Fazel 2024, Rohner 2023, Garas 2025). The DataExplorer provides full transparency. The README_DATA.json documents every file. This builds trust through verifiability.

**Pathos (emotional impact through numbers)**: "Only 7% had a childhood ADHD diagnosis" — the small number (7%) against the large context (100% with SUD) creates emotional impact. The bar chart makes the 100% bar fill the entire width, visually overwhelming the 7% that could have been caught.

**Logos (logical structure)**: The TreatmentAccessIndex composite (health expenditure percentile + life expectancy percentile) is explicitly documented in code. The formula is transparent. The viewer can evaluate whether the composite is reasonable.

---

### 15. The Dashboard as Argument

The entire project is a **data-driven argument**, not a neutral display. The argument structure:

1. **Premise**: ADHD is a neurodevelopmental disorder with effective treatments (stimulants work, evidence is clear)
2. **Problem**: Treatment access is globally unequal — some countries have amphetamines, some have nothing
3. **Evidence**: Economic, health, governance, education data shows *why* the gap exists (poverty, weak institutions, underfunded health systems)
4. **Consequences**: Untreated ADHD leads to prison, substance use, suicide — quantified with meta-analyses
5. **Call to action**: The tier map is a tool for advocacy — it makes the invisible (treatment access) visible (color-coded geography)

The visualization doesn't just present data — it constructs a **narrative of injustice** through visual means: the red countries on the map, the 8× overrepresentation bars, the 100% SUD comorbidity. The numbers speak, but the visual encoding makes them shout.

---

### 16. Design Limitations and Honest Gaps

**No responsive layout**: The charts use fixed SVG dimensions (600×400, etc.) that don't adapt to mobile screens. This limits accessibility on phones — a significant gap given that many viewers in Tier 4 countries access the internet primarily via mobile.

**No animation for data entry**: Data appears instantly — no entrance animation that could guide the eye from zero to value. This is efficient but misses an opportunity to create "aha moments" as bars grow.

**Limited color encoding**: The continuous gradient in MentalHealthWorldMap is not perceptually uniform (Brewer scales would be better). The tier colors are categorical but don't encode ordinal information (the distance between Tier 1 and Tier 2 is not the same as Tier 3 and Tier 4).

**No explicit uncertainty for computed indices**: The TreatmentAccessIndex is a composite with no confidence interval — the percentile ranks are precise but the composite is not validated. This is documented nowhere in the UI.

**The narrative is embedded, not explorable**: The rhetorical arc (Act 1–6) is implicit in the sidebar order — a viewer randomly clicking views won't experience the intended sequence. A guided tour or "start here" affordance would strengthen the narrative.

---

## SUGGESTED EXTENSIONS FOR DEEPER ANALYSIS

### 1. Treatment Tier × Socioeconomic Correlation Matrix
Cross-reference `countryStatus.json` tiers with:
- GDP pc, Gini, HDI, Governance scores, Happiness factors
- Quantify: "How much does GDP explain tier? (R²)", "Does governance add predictive power?"
- Output: Correlation heatmap, regression coefficients

### 2. Longitudinal Treatment Access Model
Track tier transitions 1996–2021 using drug approval dates:
- 1996: Atomoxetine (Tier 3 entry)
- 2002: ER formulations (Tier 1/2 improvement)
- 2007: Lisdexamfetamine US
- 2013: Guanfacine XR
- 2021: Lisdexamfetamine EU
Model country-level tier evolution; identify "stuck" countries

### 3. Prison ADHD Cost Calculator
```typescript
// For each country:
untreatedPrisonADHD = prisonPop × incarcerationRate × ADHDprevalencePrison × (1 - childhoodDxRate)
annualCost = untreatedPrisonADHD × costPerInmateYear × recidivismReductionFromTreatment
```
Data: `prisonData`, `PrisonPrevalence` stats, World Bank cost estimates

### 4. Education Screening ROI Model
```typescript
// Per country:
screeningCost = pupilTeacherRatio × costPerScreen × studentPopulation
earlyDxGain = screeningCost × detectionRate × lifetimeOutcomeImprovement
```
Data: `educationData` pupil-teacher ratios, literature on screening efficacy

### 5. Female Underdiagnosis Quantification
- Expected female prevalence if 1:1 ratio: `malePrev / 2.5 × 1` → compare to observed
- Estimate missed cases: `(expected - observed) × femalePopulation`
- Map to treatment tier: missed cases concentrated in Tier 3/4?

### 6. Policy Simulation: "Tier 4 → Tier 2"
Scenario: All Tier 4 countries achieve methylphenidate access (Tier 2)
- Projected new patients: `Tier4Pop × ADHDprevalence × diagnosisRate`
- Cost: `patients × annualMethylphenidateCost`
- Benefit: DALYs averted, productivity gain, reduced SUD/incarceration

### 7. Substance Use Mediation Path Analysis
Path: ADHD → (untreated) → SUD → Incarceration → (no treatment) → Recidivism
Quantify at each node using:
- `SUDbySubstance` (ADHD→SUD risk)
- `PrisonPrevalence` (SUD→incarceration overlap)
- `ComorbidityBreakdown` (ADHD in prison)
- Treatment access tier (treatment→recidivism reduction)

### 8. Narrative-Data Integration
Embed Nepali script sections (`section-01..04-*.md`, `finalADHD.md`) as interactive story panels:
- Section 1 (med access) → WorldMap Tier 4 highlight
- Section 2 (eyeglasses metaphor) → TimelineView + TreatmentAccessIndex
- Section 3 (metagnosis) → SexComparison + AgePyramid (late diagnosis)
- Section 4 (neurochemistry) → ComorbidityBreakdown + SuicideRisk

---

## FILE STRUCTURE QUICK REFERENCE

```
graphicsForADHD/
├── data/
│   ├── README_DATA.json           # Master data index (442 lines)
│   ├── worldbank_indicators.json  # 11 WB indicators
│   ├── who_health_indicators.json # 7 WHO GHO indicators
│   ├── world_happiness_report_2026.json
│   ├── undp_hdi.json
│   ├── transparency_cpi_2024.json # WB Governance proxy
│   ├── world_prison_brief.json
│   ├── education_indicators.json
│   ├── countryStatus.json         # TIER DATASET (schema v2.0)
│   └── [14 reference/narrative files]
├── src/
│   ├── lib/
│   │   ├── data.ts                # Pipeline entrypoint (329 lines)
│   │   ├── colors.ts              # Tier color re-exports
│   │   ├── mapData.ts             # TopoJSON→GeoJSON paths + centroids
│   │   ├── countryStatus.json     # Copy of tier data
│   │   └── components/            # 24 .svelte files
│   └── routes/
│       └── +page.svelte           # Dashboard shell, sidebar, view switcher
├── package.json
├── vite.config.ts
└── AGENTS.md
```

---

## VERIFICATION COMMANDS

```bash
npm run dev      # Dev server at localhost:5173
npm run build    # Production build
npm run check    # svelte-check (TypeScript)
npm run lint     # ESLint (Svelte + TS rules)
npm run test     # Vitest (run once)
npm run test:watch # Vitest watch mode
```