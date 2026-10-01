/**
 * navGroups.ts — static sidebar grouping: i18n key per category + view ids.
 *
 * Single source of truth for "which views exist, in which group, in what
 * order". +page.svelte localizes the names; dataSources.test.ts asserts every
 * id here has a VIEW_DATA_SOURCES entry so a newly added view can't silently
 * miss the Data Files registry.
 */
export interface NavGroup {
	key: string;
	ids: string[];
}

export const NAV_GROUPS: NavGroup[] = [
	{ key: 'categories.overview', ids: ['worldmap', 'brain', 'mhmap', 'stats', 'timeline'] },
	{ key: 'categories.demographics', ids: ['age', 'sex', 'region', 'trends', 'sdi'] },
	{ key: 'categories.adhd', ids: ['prison', 'comorbid', 'sud', 'sudsex', 'suicide', 'prisonmh'] },
	{
		key: 'categories.socioeconomic',
		ids: ['wealth', 'happiness', 'hdi', 'economy', 'education', 'governance', 'healthtrends', 'treatment']
	},
	{ key: 'categories.reference', ids: ['dataexplorer'] }
];
