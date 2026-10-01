/**
 * dataSources.ts — maps each dashboard view to the raw data file(s) behind it.
 *
 * Powers the "By visualization" section of the Data Files explorer
 * (DataExplorer.svelte): each view card links through to its raw JSON file(s).
 * `files` holds data/*.json filenames.
 *
 * Views with no backing file carry an explicit `state` instead of a bare
 * `files: []`:
 * - `exempt` — deliberately inline under the inline-data rule (see
 *   data/README_DATA.json); `reasonKey` points at the explanation.
 * - `pending` — extraction planned but deferred; `reasonKey` says why.
 */
export interface ViewDataSource {
	/** Matches the view id in +page.svelte COMPONENTS (and the nav.<id> i18n key). */
	viewId: string;
	/** Raw data/*.json filenames backing this view; empty when inline. */
	files: string[];
	/** Set only for views with no backing file. Omitted = linked. */
	state?: 'exempt' | 'pending';
	/** i18n key explaining the exempt/pending state (blank mirrors in ne/hi). */
	reasonKey?: string;
}

export const VIEW_DATA_SOURCES: ViewDataSource[] = [
	{ viewId: 'worldmap', files: ['countryStatus.json'] },
	{ viewId: 'brain', files: ['brain_regions.json'] },
	{ viewId: 'mhmap', files: ['who_health_indicators.json'] },
	{ viewId: 'stats', files: ['countryStatus.json'] },
	{ viewId: 'timeline', files: [], state: 'exempt', reasonKey: 'views.dataexplorer.exemptTimeline' },
	{ viewId: 'age', files: ['adolescents_young_adults_10_24.json'] },
	{ viewId: 'sex', files: ['adolescents_young_adults_10_24.json'] },
	{ viewId: 'region', files: ['adolescents_young_adults_10_24.json'] },
	{ viewId: 'trends', files: [], state: 'pending', reasonKey: 'views.dataexplorer.pendingTrends' },
	{ viewId: 'sdi', files: ['sdi_regions.json'] },
	{ viewId: 'prison', files: ['prison_adhd_studies.json'] },
	{ viewId: 'comorbid', files: ['comorbidities.json'] },
	{ viewId: 'sud', files: ['sud_by_substance.json'] },
	{ viewId: 'sudsex', files: ['sud_by_sex.json'] },
	{ viewId: 'suicide', files: ['suicide_risk_studies.json'] },
	{ viewId: 'prisonmh', files: ['world_prison_brief.json'] },
	{ viewId: 'wealth', files: ['world_happiness_report_2026.json', 'worldbank_indicators.json'] },
	{ viewId: 'happiness', files: ['world_happiness_report_2026.json'] },
	{ viewId: 'hdi', files: ['undp_hdi.json'] },
	{ viewId: 'economy', files: ['worldbank_indicators.json'] },
	{ viewId: 'education', files: ['education_indicators.json'] },
	{ viewId: 'governance', files: ['transparency_cpi_2024.json'] },
	{ viewId: 'healthtrends', files: ['worldbank_indicators.json'] },
	{ viewId: 'treatment', files: ['worldbank_indicators.json'] },
	{ viewId: 'dataexplorer', files: [], state: 'exempt', reasonKey: 'views.dataexplorer.exemptMeta' }
];
