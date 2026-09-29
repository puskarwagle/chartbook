export interface ViewInfoEntry {
	/** What the visualization shows (1–2 sentences). */
	what: string;
	/** How to read / interact with the chart. */
	howToRead: string;
	/** Data source(s) and coverage. */
	source: string;
	/** Key takeaway / insight. */
	insight: string;
	/** Limitations and caveats. */
	limitation: string;
}

export const VIEW_INFO: Record<string, ViewInfoEntry> = {
	worldmap: {
		what: 'World map color-coded by each country\u2019s ADHD medication access tier — from full amphetamine availability (Tier 1) to no approved pharmacological treatment (Tier 4).',
		howToRead: 'Hover a country for a quick summary, click to pin its detail card. Use the tier buttons below the map to isolate one tier, and toggle Names to label countries. The tooltip shows confidence, evidence level, verification date, and per-drug approvals.',
		source: 'Research-sourced tier dataset: src/lib/countryStatus.json (schema v2.0), with per-country confidence, evidence, sources, notes, and last_verified fields. Geography: world-atlas 110m + Natural Earth projection.',
		insight: 'Access is highly uneven — a small set of high-income countries has full stimulant access while large parts of the world rely on non-stimulants only or have no treatment infrastructure.',
		limitation: 'Tiers reflect documented approvals and evidence quality, not actual prescription rates or affordability. "Unknown" means insufficient evidence, not necessarily no treatment. Data is a snapshot — verify dates per country.'
	},
	mhmap: {
		what: 'Choropleth world map of six WHO mental-health and substance-use indicators: depression, anxiety, schizophrenia, eating disorders, alcohol use, and drug use.',
		howToRead: 'Pick an indicator with the buttons above the map. Darker shades mean higher prevalence. Hover or click a country to see its value and compare across indicators.',
		source: 'WHO Global Health Observatory via data/who_health_indicators.json (both-sexes, latest year per country), joined to World Bank country names in src/lib/data.ts.',
		insight: 'Depression and anxiety dominate the global burden and cluster differently from substance-use disorders — mental-health burden does not simply track wealth.',
		limitation: 'WHO estimates carry wide uncertainty intervals and uneven reporting quality. Cross-country comparisons reflect diagnostic practice and reporting as well as true prevalence.'
	},
	stats: {
		what: 'Summary cards counting how many tracked countries fall into each ADHD treatment tier, with share-of-total percentages.',
		howToRead: 'Each card is one tier: count, label, and percentage bar. Together they sum to all tracked countries.',
		source: 'Same tier dataset as the World Map: src/lib/countryStatus.json.',
		insight: 'The distribution makes the access gap concrete — compare the Tier 1 share against Tiers 3, 4, and Unknown.',
		limitation: 'Counts are country counts, not population-weighted. A small country and a large one count equally here.'
	},
	timeline: {
		what: 'Interactive timeline of key milestones in ADHD stimulant medication history, from first amphetamine use to modern extended-release formulations.',
		howToRead: 'Click any event dot to expand it. Dots are color-coded by the treatment tier that milestone enabled.',
		source: 'Curated historical milestones (hardcoded in TimelineView.svelte), cross-referenced with the tier definitions in countryStatus.json.',
		insight: 'Treatment options expanded in waves — each new drug class unlocked access for a new group of countries, but diffusion took decades.',
		limitation: 'A simplified, illustrative timeline — not an exhaustive regulatory history. Approval years vary by country.'
	},
	age: {
		what: 'ADHD prevalence by age group for ages 10–24, shown as global rates per 100,000 population in 2021.',
		howToRead: 'Bars are split by age band. Longer bars mean higher prevalence in that group. Compare bands to see where prevalence peaks.',
		source: 'data/adolescents_young_adults_10_24.json (Global Burden of Disease–derived adolescent/young-adult dataset).',
		insight: 'Prevalence is highest in early adolescence and tapers with age — consistent with developmental remission patterns reported in longitudinal studies.',
		limitation: 'Global modeled estimates; age bands and diagnostic thresholds differ across source studies. Rates are per 100k, not absolute case counts.'
	},
	sex: {
		what: 'Side-by-side comparison of ADHD prevalence in males vs females (ages 10–24, per 100k).',
		howToRead: 'Paired bars per region or age band: compare lengths to see the male–female gap. Ratios above 1 mean higher male prevalence.',
		source: 'data/adolescents_young_adults_10_24.json, split by sex.',
		insight: 'Males show substantially higher diagnosed prevalence at these ages — partly true difference, partly referral and diagnostic bias toward externalizing presentations.',
		limitation: 'Female ADHD is widely considered underdiagnosed, especially inattentive presentations. Gaps likely overstate the true biological difference.'
	},
	region: {
		what: 'Ranked bar chart of ADHD prevalence by world region (ages 10–24, per 100k, 2021), with incidence where available.',
		howToRead: 'Regions are sorted highest to lowest. Bar length is prevalence; the sub-label shows incidence (new cases) per 100k where reported.',
		source: 'Regional aggregates from data/adolescents_young_adults_10_24.json (GBD-based).',
		insight: 'Australasia and high-income regions report the highest rates — reflecting both awareness/screening intensity and true variation.',
		limitation: 'Only a subset of regions is shown and regional aggregates hide large within-region differences. Higher reported rates partly reflect better detection.'
	},
	trends: {
		what: 'Three cards tracking global ADHD prevalence, incidence, and DALYs (disability-adjusted life years) from 1990 to 2021 for ages 10–24.',
		howToRead: 'Each card shows the 1990 value → 2021 value and the percent change. Negative change means a decline in the age-standardized rate.',
		source: 'GBD-derived trend data (1990–2021) bundled with the adolescent dataset.',
		insight: 'Age-standardized rates declined modestly even as absolute case counts grew with population — DALYs fell fastest, suggesting better management.',
		limitation: 'Rates are age-standardized modeled estimates. Absolute numbers of people with ADHD rose over the same period due to population growth.'
	},
	sdi: {
		what: 'Scatter plot of Sociodemographic Index (SDI, 0–1) against ADHD prevalence (%) by region for under-20s in 2021.',
		howToRead: 'Each dot is a region: rightward means more developed, upward means higher prevalence. Labels identify regions; the pattern slopes upward.',
		source: 'data/sdi_regions.json (SDI vs prevalence by region).',
		insight: 'Higher-SDI regions report higher ADHD prevalence — a nonlinear positive correlation, with the largest 1990–2021 increases in high-SDI regions.',
		limitation: 'Ecological correlation: it does not prove development causes ADHD. Detection, screening, and diagnostic culture rise with SDI and inflate the gradient.'
	},
	prison: {
		what: 'ADHD prevalence found in prison populations across published meta-analyses, compared against general-population prevalence.',
		howToRead: 'Each bar is one study or pooled estimate. Compare prison bars against the general-population baseline to see the overrepresentation multiple.',
		source: 'data/prison_adhd_studies.json (meta-analyses of prison ADHD prevalence).',
		insight: 'ADHD is roughly 4–10× more common in prison populations than in the general public — one of the strongest overrepresentations in psychiatry.',
		limitation: 'Studies vary in screening tools, diagnostic cutoffs, and prison types. Pooled figures blend heterogeneous methods and settings.'
	},
	comorbid: {
		what: 'Breakdown of psychiatric comorbidities among 30 confirmed ADHD cases in a high-security Swedish prison sample.',
		howToRead: 'Bars show the share of the ADHD group meeting criteria for each additional condition (e.g. substance use, mood, personality disorders).',
		source: 'Ginsberg et al. 2010 via data/comorbidities.json (n=30 confirmed ADHD cases).',
		insight: '"Pure" ADHD is the exception here — most incarcerated individuals with ADHD meet criteria for multiple additional disorders, compounding outcomes.',
		limitation: 'Very small, single-site, all-high-security sample (n=30). Not generalizable to community ADHD or other justice systems.'
	},
	sud: {
		what: 'Prevalence of comorbid ADHD among people with substance use disorders, split by primary substance type.',
		howToRead: 'Each bar is one substance category. Higher bars mean a larger share of people with that SUD also meet ADHD criteria.',
		source: 'Rohner et al. 2023 via data/sud_by_substance.json.',
		insight: 'Stimulant and cannabis use disorders show among the highest ADHD comorbidity — consistent with self-medication and shared impulsivity pathways.',
		limitation: 'Treatment-seeking samples overrepresent severe cases. Direction of causality (ADHD → SUD vs shared risk) cannot be read from these bars.'
	},
	sudsex: {
		what: 'Sex-split view of substance use disorder comorbidity in ADHD, from a large Norwegian cohort aged 18–31.',
		howToRead: 'Paired bars compare males vs females with ADHD on each SUD outcome. Gaps show where one sex carries higher comorbid burden.',
		source: 'Moldekleiv et al. 2025 via data/sud_by_sex.json (n=49,815 with ADHD, Norway, ages 18–31).',
		insight: 'Both sexes with ADHD carry elevated SUD risk, with substance-specific sex differences — males skew toward alcohol/drug dependence in this cohort.',
		limitation: 'Single-country registry cohort (Norway). Prescription, cultural, and ascertainment patterns may not transfer to other settings.'
	},
	suicide: {
		what: 'Odds ratios linking ADHD to suicidal ideation, suicide attempt, suicide death, and overall suicidality from a longitudinal meta-analysis.',
		howToRead: 'Bars show the odds ratio (risk multiple vs people without ADHD); whiskers show the 95% confidence interval. Anything above 1.0 means elevated risk. Wider whiskers mean less precise estimates.',
		source: 'Garas et al. 2025 longitudinal meta-analysis (hardcoded estimates with CIs, study counts, and p-values).',
		insight: 'ADHD roughly triples the odds of suicidality across all outcomes — ideation, attempt, and death alike — making risk screening a core part of ADHD care.',
		limitation: 'Odds ratios pool heterogeneous studies; confounding (e.g. comorbid depression, impulsivity) is only partly adjusted. Some outcomes rest on few studies (n=2).'
	},
	prisonmh: {
		what: 'Global incarceration rates per 100k joined with the ADHD-in-prison story — how many people are imprisoned and why ADHD screening there matters.',
		howToRead: 'Bars rank countries by prisoners per 100k. Read alongside the Prison ADHD view: high-incarceration settings concentrate ADHD at high rates.',
		source: 'World Prison Brief via data/world_prison_brief.json (prison population totals and rates per 100k).',
		insight: 'Incarceration rates vary enormously by country, and ADHD is concentrated wherever incarceration is high — prison mental-health services are ADHD services.',
		limitation: 'Prison census data varies in year and definition across countries. Rates reflect policy and sentencing, not crime or ADHD prevalence alone.'
	},
	wealth: {
		what: 'Scatter of GDP per capita (log scale) against World Happiness Report life-evaluation scores, colored by income inequality (Gini). Outliers labeled; dashed line is the OLS trend in log-GDP space.',
		howToRead: 'Rightward means richer, upward means happier. Color runs green (equal) → pink (unequal). Toggle the trend line and switch years with the year buttons. Hover any dot for GDP, happiness, and Gini.',
		source: 'World Happiness Report (life evaluation) + World Bank GDP per capita and Gini index, joined in src/lib/data.ts.',
		insight: 'Wealth predicts wellbeing but with diminishing returns — and inequality matters: high-GDP + high-Gini countries systematically underperform on happiness and mental-health outcomes.',
		limitation: 'Cross-sectional snapshot; GDP–happiness correlation is not causal. Gini coverage is patchy (grey = missing) and happiness scores are survey-based averages.'
	},
	happiness: {
		what: 'Stacked bars decomposing the top-20 countries\u2019 happiness scores into six explanatory factors plus a residual (Dystopia + residual).',
		howToRead: 'Total bar length is the life-evaluation score (0–10). Colored segments show each factor\u2019s modeled contribution. Switch years to see rankings move.',
		source: 'World Happiness Report 2026 via data/world_happiness_report_2026.json.',
		insight: 'Top-ranked countries win on social support, freedom, and low corruption — not GDP alone. The residual segment shows how much remains unexplained.',
		limitation: 'Factor contributions are model-based decompositions, not direct measurements. Rankings shift with survey sampling and year-to-year noise.'
	},
	hdi: {
		what: 'Explorer for UNDP Human Development Index rankings with component breakdowns: life expectancy, expected and mean schooling, and GNI per capita.',
		howToRead: 'Rows are ranked by HDI (0–1). Expand or sort a country to see which component drags its score up or down.',
		source: 'UNDP HDI via data/undp_hdi.json (Table 1, parsed in src/lib/data.ts).',
		insight: 'HDI contextualizes ADHD care capacity — countries scoring high on health and education components tend to have earlier detection and broader treatment access.',
		limitation: 'HDI is a national average that hides internal inequality (see IHDI for that). Education and income components lag by reporting year.'
	},
	economy: {
		what: 'Snapshot of core economic indicators by country: GDP per capita, poverty rate, Gini index, and population (latest available per country).',
		howToRead: 'Select an indicator to re-rank the bar chart. Values are latest-available per country, so years differ across rows.',
		source: 'World Bank indicators via data/worldbank_indicators.json (latest value per country, aggregates excluded).',
		insight: 'Economic context frames everything else in this dashboard — treatment access, happiness, and health spending all scale with these baselines.',
		limitation: 'Latest-available means mixed vintages across countries. Informal economies and purchasing-power differences are imperfectly captured.'
	},
	education: {
		what: 'Education context through pupil–teacher ratios (primary and secondary) and enrollment rates — proxies for how much individual attention students get.',
		howToRead: 'Higher pupil–teacher ratios mean less individual attention — a tougher environment for ADHD learners. Filter or group by income band to compare like with like.',
		source: 'Education indicators via data/education_indicators.json + World Bank education expenditure (parsed in src/lib/data.ts).',
		insight: 'Crowded classrooms amplify ADHD-related disadvantage: detection is later and support thinner where ratios are highest.',
		limitation: 'Ratios measure quantity, not teaching quality or special-needs provision. Data gaps are largest for low-income countries.'
	},
	governance: {
		what: 'Radar chart of six World Bank Worldwide Governance Indicators: control of corruption, rule of law, government effectiveness, regulatory quality, political stability, and voice & accountability.',
		howToRead: 'Each axis is one indicator (roughly −2.5 to +2.5). Larger, balanced polygons mean stronger governance. Overlay countries to compare shapes.',
		source: 'World Bank WGI via data/transparency_cpi_2024.json (year shown in subtitle), parsed in src/lib/data.ts.',
		insight: 'Government effectiveness and rule of law track closely with treatment-access tiers — regulatory capacity is a prerequisite for sustained medication supply.',
		limitation: 'Perception-based composite indicators with estimation uncertainty. Scores compare governance quality, not health policy specifically.'
	},
	healthtrends: {
		what: 'Time-series trends of key health indicators (e.g. life expectancy, mortality, health expenditure) for the top-10 economies by GDP, plus the global average.',
		howToRead: 'Pick an indicator and countries to overlay. Lines show trajectories over time; the global-average line benchmarks progress.',
		source: 'World Bank time series via data/worldbank_indicators.json (wbTimeSeries / wbGlobalAverage helpers in src/lib/data.ts).',
		insight: 'Health outcomes improved almost everywhere over recent decades, but the pace and level diverge sharply — context for interpreting ADHD care trends.',
		limitation: 'Top-10-by-GDP framing skews toward large economies. Older years have thinner country coverage, shifting the global average.'
	},
	treatment: {
		what: 'Composite Treatment Access Index ranking countries by combining healthcare spending effort and health outcomes into a single 0–100 score.',
		howToRead: 'Higher scores (left/top of ranking) mean better structural access. The score averages each country\u2019s percentile ranks on health expenditure (% of GDP) and life expectancy.',
		source: 'Computed in src/lib/data.ts (computeTreatmentAccessIndex) from World Bank health expenditure and life expectancy; governance/HDI used as context.',
		insight: 'The index separates structural capacity from wealth alone — some mid-income countries outrank richer ones on access-efficiency.',
		limitation: 'A rough proxy: it measures system inputs/outcomes, not ADHD-specific availability, affordability, or prescribing practice. Equal weighting of components is a judgment call.'
	},
	dataexplorer: {
		what: 'Browser for the raw JSON datasets powering every view — inspect files, fields, and row counts directly.',
		howToRead: 'Pick a file to preview its structure and sample rows. Use it to verify any number you see in a chart back to its source record.',
		source: 'All files under data/ plus their documentation in data/README_DATA.json.',
		insight: 'Every chart in this dashboard traces back to a file you can open here — the fastest way to answer "where did that number come from?".',
		limitation: 'Raw files include mixed vintages, missing values, and aggregate codes; the views apply cleaning (e.g. dropping World Bank aggregates) that you must replicate for exact matches.'
	}
};
