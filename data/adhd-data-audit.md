# Comprehension Audit — 13 non-overview ADHD views

**Cross-cutting findings (apply to all 13):**

- Every "How to read it" / "Key insight" / "Limitation" already exists but is hidden behind the top-right **ⓘ** button — first-time viewers never see it.
- 8 of 13 subtitles end in **"— ECharts · JSON-driven"** — developer metadata shown to readers.
- **"per 100k"** is never expanded to "per 100,000 people" anywhere.

---

## 1. By Age (`age`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Should be: "ADHD prevalence peaks at 10–14 then falls; new diagnoses stop after ~14." Title only names the topic. |
| 2 | JARGON | Prevalence, incidence, per 100k, **GBD** (in card, never expanded), "ECharts · JSON-driven". None spelled out. |
| 3 | AXES/UNITS | Both y-axes have units, but dual scale: prevalence 0–2700 vs incidence 0–34. Which is "good/bad" never said. |
| 4 | CONTEXT | Only 3 age bands against each other; no global average or reference line. |
| 5 | HOW TO READ | Not on canvas — ⓘ only. |
| 6 | MISREADING | Readers compare blue vs green bar heights across incompatible axes; incidence "0" bars read as *missing data* rather than *no new cases*; "2,713/100k" never converted to "≈2.7%". |
| 7 | CHART FIT | Dual-axis grouped bars for 3 groups is fragile; card claims "all incidence at 10–14" but bars show literal zeros. |

## 2. By Sex (`sex`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Should be: "Boys are diagnosed ~2.5× more often than girls." Title is topic-only; the finding is buried in the card below. |
| 2 | JARGON | Prevalence, incidence, per 100k, "ECharts · JSON-driven". |
| 3 | AXES/UNITS | Dual axis again (0–3000 vs 0–17); no direction guidance. |
| 4 | CONTEXT | Male vs female only; no both-sexes average line. |
| 5 | HOW TO READ | ⓘ only — **and it's wrong**: says "paired bars per region or age band" and "ratios above 1" — this chart has neither regions nor ratios. |
| 6 | MISREADING | Read as biological difference (diagnostic-bias caveat is ⓘ-only); readers trust the mismatched ⓘ instructions. |
| 7 | CHART FIT | Bar comparison fine; dual axis is the weak point. |

## 3. By Region (`region`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Should be: "Australasia's rate is 50% above the next region." Title names topic only. |
| 2 | JARGON | Prevalence/incidence never defined; "N. America" abbreviation; per 100k only in subtitle. |
| 3 | AXES/UNITS | No axes at all; bar values (6,366) carry **no unit** — units live only in the subtitle. |
| 4 | CONTEXT | Bars scaled to the max region; no average, no global benchmark. |
| 5 | HOW TO READ | ⓘ only. |
| 6 | MISREADING | **Only 4 regions are shown but nothing says so** — reads as a complete world ranking. Card says "Australia alone: 6,366" but the chart row says "Australasia" — reader can't find Australia. |
| 7 | CHART FIT | Ranked horizontal bars: correct type. |

## 4. Trends (`trends`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Should be: "ADHD rates fell slightly 1990–2021; burden (DALYs) fell twice as fast." Title names topic only. |
| 2 | JARGON | **DALYs** never expanded on screen; prevalence, incidence, age-standardized (ⓘ only). |
| 3 | AXES/UNITS | No axes; "per 100k" is tiny grey text at card bottom; **−5.7% badge next to "per 100k" unit invites reading it as a rate**. The unlabeled ratio bar (end/start) means nothing to a reader. |
| 4 | CONTEXT | Start → end with % change: good. But only 2 endpoints — no trajectory. |
| 5 | HOW TO READ | ⓘ only. |
| 6 | MISREADING | "Decline" in green read as "ADHD improving" (vs diagnostic/population changes); absolute case counts rose — ⓘ-only. |
| 7 | CHART FIT | A view called "Trends" is three stat cards with no time axis — weakest fit in the set (chart-type change out of scope per constraints; at minimum label what the bar shows). |

## 5. SDI Scatter (`sdi`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Claimed: "More developed regions report more ADHD." Card jargonizes it as "Nonlinear positive correlation"; title names neither. |
| 2 | JARGON | **SDI** expanded twice, *inconsistently*: subtitle/axis say "Sociodevelopmental Index", ⓘ says "Sociodemographic Index" (GBD's real term is Sociodemographic — on-screen version is wrong). "N. Africa / ME" (ME undefined). "Nonlinear positive correlation" = stats jargon. |
| 3 | AXES/UNITS | Both axes labeled with units (best in set); 0–1 range of SDI never explained (what is 0.5 vs 0.9?). |
| 4 | CONTEXT | No trend line — yet the card asserts a correlation the reader must eyeball. |
| 5 | HOW TO READ | ⓘ only. |
| 6 | MISREADING | (a) causal read (ⓘ-only caveat); (b) dots mix **geographic regions** ("Caribbean") with **SDI groupings** ("High SDI", "High-Middle SDI") as if all are regions; (c) data isn't even monotonic (Caribbean 4.5% > East Asia 3.8% at higher SDI) — claim oversells the pattern. |
| 7 | CHART FIT | Scatter is right for the question; needs the fitted/reference line the claim depends on. |

## 6. Prison ADHD (`prison`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Should be: "Prisoners have 2–10× the ADHD rate of the public." Title names topic; subtitle gestures at it. |
| 2 | JARGON | "meta-analyses", **95% CI** (never expanded to "confidence interval" on screen), "General pop", "n = 3,919", "corrected for selection bias", author-year study labels (fine as citations, unexplained as *studies*). |
| 3 | AXES/UNITS | **X-axis has no label at all** — no "%", no "prevalence" (only bar labels carry %). |
| 4 | CONTEXT | Red dashed "General pop ~3.5%" line — good, the best reference line in the set. |
| 5 | HOW TO READ | ⓘ only (whiskers explained there, not here). |
| 6 | MISREADING | Whiskers read as "bar range" or error; readers mentally average three incomparable studies; 40% (n=30, one high-security prison) read as a general prison figure. |
| 7 | CHART FIT | Bars + reference line + CI: correct type. |

## 7. Comorbidities (`comorbid`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Should be: "In this prison sample, nearly every ADHD case had 2+ other disorders." Title names topic. |
| 2 | JARGON | **"Comorbidities"** never defined; **"Antisocial PD"**, **"Borderline PD"** (PD = personality disorder, unexpanded); **"Psychopathy (PCL-R ≥30)"** — clinical checklist acronym + cutoff, totally unexplained; "Mood & Anxiety" (disorders? symptoms?). |
| 3 | AXES/UNITS | X-axis 0–100 unlabeled (no %); no indication these are *lifetime* shares of one group. |
| 4 | CONTEXT | No comparison group; no "share of 30 people" counts. |
| 5 | HOW TO READ | ⓘ only; small print note shows n = 30. |
| 6 | MISREADING | **Bars are nested but look parallel**: 96% "Personality Disorders" *contains* 96% Antisocial PD + 74% Borderline PD — readers sum them or count separate conditions. 74% read as precise when it's 22 of 30 people. |
| 7 | CHART FIT | Parallel bars wrong for overlapping categories — needs grouping/indentation (explanation-level fix: label subsets). |

## 8. SUD & ADHD (`sud`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Should be: "About 1 in 5 people in SUD treatment have ADHD." Card says it; title doesn't. |
| 2 | JARGON | **SUD** never expanded anywhere on screen (sidebar too); comorbid, 95% CI, "n = 7 studies", pooled/overall. |
| 3 | AXES/UNITS | X-axis unlabeled (no %); CI whiskers unexplained. |
| 4 | CONTEXT | Blue "Overall: 21%" dashed line — good. |
| 5 | HOW TO READ | ⓘ only. |
| 6 | MISREADING | Card "Alcohol highest at 25%" read as a real ranking — but CIs overlap massively (18.5–33.6 vs 17.4–25.5), so the ordering is noise. ⓘ insight claims "stimulant and cannabis highest" — **those substances aren't even on the chart** (only Alcohol/Cocaine/Opioid shown). |
| 7 | CHART FIT | Bars + CI + baseline: correct type. |

## 9. SUD by Sex (`sudsex`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Should be: "Men with ADHD have more SUD, but women carry greater *relative* excess risk." Card hints; title doesn't. |
| 2 | JARGON | SUD (unexpanded); **HR — never defined on screen OR in ⓘ**; "♂/♀"; "cohort"; "relative risk vs prevalence". Heaviest jargon load in the set. |
| 3 | AXES/UNITS | Y-axis label is just "%" (of what?); x-axis second line shows HR values with no unit or baseline. |
| 4 | CONTEXT | Male vs female bars compare well; HR baseline (vs whom?) is never stated. |
| 5 | HOW TO READ | ⓘ only, and it **never mentions HR at all**. |
| 6 | MISREADING | **Two metrics welded together**: bars = prevalence %, labels = HR ×. Bars show males higher, card says females higher — looks like a contradiction. HR 8.0× read as "8%" or as share-of-bar. |
| 7 | CHART FIT | Grouped bars fine, but encoding prevalence in bars and HR in axis sublabels is the core comprehension failure. |

## 10. Suicide Risk (`suicide`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Should be: "ADHD roughly triples the odds of suicide attempts and death." Title names topic; subtitle names method. |
| 2 | JARGON | **"Odds ratios"** (subtitle, unexplained on screen), **95% CI** band (unlabeled), "meta-analysis", "≥10yr" summary card, "p-values" (in data, thankfully not displayed). |
| 3 | AXES/UNITS | **No axis, no ticks, no scale** — bars silently scaled to 8×. **No 1.0 = "no difference" marker** — the single most important line for an OR chart is absent. |
| 4 | CONTEXT | Comparison vs non-ADHD controls only mentioned in fine-print summary note. |
| 5 | HOW TO READ | ⓘ only (it explains OR/whiskers properly — just not on the canvas). |
| 6 | MISREADING | "3.9×" read as "3.9 times more *likely*" (odds ≠ risk); CI band read as part of the bar; without the 1.0 line readers can't tell "elevated" from "neutral". |
| 7 | CHART FIT | It's a forest plot with the axis and null line removed — add those and the type is right. |

## 11. Prison & MH (`prisonmh`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Chart's actual takeaway: "Incarceration rates vary 10× across countries." The *claimed* takeaway (ADHD concentration) is subtitle/cards only. |
| 2 | JARGON | "incarceration", per 100k, "overrepresentation", **MH in sidebar never expanded**; subtitle says "4–10×" while cards say "up to 8×" — conflicting numbers on one screen. |
| 3 | AXES/UNITS | Bar labels carry /100k and a global-avg line exists — units OK. |
| 4 | CONTEXT | Amber "Global avg" dashed line — good. |
| 5 | HOW TO READ | ⓘ only. |
| 6 | MISREADING | **Y-axis is "#12, #87…" with no country names anywhere** — readers assume rank = ADHD prevalence, or that the app is broken (tooltip literally says "country names unavailable in source"). Title promises "Mental Health"; chart shows zero mental-health data. |
| 7 | CHART FIT | A ranking whose labels are only ranks is uninterpretable — the explanation (or names) must be fixed before the chart means anything. |

## 12. Treatment Access (`treatment`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Actual: "Health-system capacity (spending + life expectancy) ranks X high, Y low." **Title implies ADHD treatment access — it isn't that.** |
| 2 | JARGON | **HDI** (subtitle, never expanded), "Composite", "Index", percentile ranks (ⓘ only). |
| 3 | AXES/UNITS | Score bars show a bare number (e.g. 85.2) — no "%" sign, no 0–100 scale, no explanation of what a point means. Direction (high = good) only in ⓘ. |
| 4 | CONTEXT | Top 20 / Bottom 20 toggle gives relative context; no median/average marker. |
| 5 | HOW TO READ | ⓘ only. |
| 6 | MISREADING | **Biggest in the collection**: read as "where can I get ADHD meds" (wrong — it's generic health expenditure + life expectancy). Worse, **subtitle and card contradict**: subtitle says ingredients are "healthcare spending, government effectiveness, and HDI"; card says "health expenditure % GDP and life expectancy" (the real computation). Countries excluded for missing inputs are never mentioned. |
| 7 | CHART FIT | Ranked bar list: correct type; the *definition* is the problem, not the chart. |

## 13. Data Files (`dataexplorer`)

| # | Question | Finding / problem |
|---|----------|-------------------|
| 1 | TAKEAWAY | Should be: "Every chart traces to a file you can open here." Title "Data Files" says nothing about that purpose. |
| 2 | JARGON | **JSON** (never explained), "Exempt", "Pending", "inline data", **"…deferred until the API-route decision is made"** — pure developer prose shown to readers; Title-Case filename slugs ("Wmh 20 Country Adult Adhd Access Notes"); nav labels carried over ("SDI Scatter", "Prison & MH"). |
| 3 | AXES/UNITS | N/A. |
| 4 | CONTEXT | N/A — but "linked/exempt/pending" states have no legend. |
| 5 | HOW TO READ | Subtitle ("click to view") is adequate; ⓘ adds purpose. |
| 6 | MISREADING | Read as a data-quality report or download page; "Pending/Exempt" read as *broken charts*. |
| 7 | CHART FIT | File browser is the right form; wording is the issue. |

---

## Ranked fixes (explanation only — no new views/features)

| Rank | Fix | Views | Why first |
|------|-----|-------|-----------|
| 1 | **Finding-style titles + one "so what" line** under each (e.g. "Prisoners have 2–10× the ADHD rate of the public", "About 1 in 5 people in SUD treatment have ADHD") | all 13 | Every view currently opens with a topic label; this alone answers Q1 for every view. |
| 2 | **Correct the actively-wrong on-screen text**: `treatment` subtitle lists wrong ingredients (gov effectiveness/HDI vs actual spending+life expectancy); `sex` ⓘ instructions describe a chart that doesn't exist; `sdi` "Sociodevelopmental" → "Sociodemographic"; `prisonmh` 4–10× vs 8× conflict; `sud` ⓘ insight cites substances not shown | 5 views | Wrong information is worse than none. |
| 3 | **Promote one visible "How to read this" line onto the canvas** (the prose already exists in `viewInfo.howToRead` — surface it, don't write new) | all 13 | Fixes Q5 everywhere with near-zero new writing. |
| 4 | **Spell out every abbreviation at first use + add hover definitions**: SUD, HR (hazard ratio — currently undefined *anywhere*), OR (odds ratio), CI (confidence interval), DALYs, GBD, SDI, HDI, PD, PCL-R ≥30, MH, meta-analysis, comorbidity, prevalence vs incidence, "per 100,000 people" | all 13 | The jargon list is the #1 stated complaint; HR and PCL-R are the worst offenders (zero explanation on screen or in ⓘ for HR). |
| 5 | **Axis units + null/reference markers**: label "%" on prison/sud/comorbid x-axes; add an **OR = 1.0 "no difference" line** to `suicide`; show 0–100 scale endpoints on `treatment`; resolve the dual-axis trap in `age`/`sex` (or annotate "different scales — do not compare heights") | 7 views | Answers Q3 and prevents the top misreadings in charts full of numbers. |
| 6 | **Annotate the key insight on the chart itself**: "4× general population" arrow on `prison`; "2.5×" callout on `sex`; caution note "CIs overlap — differences not significant" on `sud`; explain bars=prevalence / labels=HR on `sudsex`; trend line or reworded claim on `sdi` | 5 views | Answers Q4/Q6 where comparison context is missing or misleading. |
| 7 | **Give `prisonmh` country names, or retitle it** "Prison rates by rank" and move the ADHD claims out of the chart title — plus reconcile its conflicting multiplier numbers | 1 | Unreadable as shipped; a chart of anonymous ranks teaches nothing. |
| 8 | **Mark subsets and small samples on the face of charts**: "4 highest of N regions" (`region`); "x of 30 people" bar-end counts (`comorbid`); "3 of 8 substance types shown" (`sud`); label nested categories as subsets (`comorbid`'s Personality Disorders → Antisocial/Borderline PD) | 3 views | Fixes the three likeliest factual misreadings. |
| 9 | **Strip "— ECharts · JSON-driven" from all subtitles** | 8 views | One-line change; removes dev metadata from every first impression. |
| 10 | **Plain-English `dataexplorer` states**: "Exempt/Pending… API-route decision" → "No data file — this is a short written timeline" / "Data not yet extracted"; add one sentence "JSON = the raw data file format" | 1 | Only view whose own UI text is developer prose. |
| 11 | **Disambiguate `trends` labels**: put "%" and "per 100k" in fixed positions (not tiny grey text), label the ratio bar ("2021 = 94% of 1990"), note "two endpoints, not the full path" | 1 | Prevents −5.7% being read as a rate. |
| 12 | **Rewrite ⓘ limitations in plain English** (they're technically good but written for researchers), and keep the drawer as the home for all caveats | all 13 | Per the brief: caveats live in ⓘ, but readable by non-experts. |

**Note on chart types:** Q7 flagged real fit problems — `trends` (cards for a trend question), `suicide` (forest plot missing its axis), `comorbid` (nested bars), `prisonmh` (rank-only labels), `age`/`sex` (dual axes). All were left out of the ranked fixes since swapping chart types would be a feature change; items 5–7 extract most of the value while keeping the existing charts.
