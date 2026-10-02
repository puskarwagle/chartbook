export interface Collection {
	/** Stable id, persisted in localStorage. */
	id: string;
	/** Short label shown in the Settings picker. */
	title: string;
	/** One-line description shown under the picker. */
	blurb: string;
	/** Built-in view ids in this collection. Custom pages are always global. */
	viewIds: string[];
}

export const DEFAULT_COLLECTION_ID = 'all';

export const COLLECTIONS: Collection[] = [
	{
		id: 'all',
		title: 'All views',
		blurb: 'Everything in the chartbook, grouped by topic.',
		viewIds: [
			'present',
			'worldmap',
			'brain',
			'mhmap',
			'stats',
			'timeline',
			'age',
			'sex',
			'region',
			'trends',
			'sdi',
			'prison',
			'comorbid',
			'sud',
			'sudsex',
			'suicide',
			'prisonmh',
			'wealth',
			'happiness',
			'hdi',
			'economy',
			'education',
			'governance',
			'healthtrends',
			'treatment',
			'dataexplorer'
		]
	},
	{
		id: 'adhd',
		title: 'ADHD',
		blurb: 'Prevalence, treatment access, comorbidities, and justice-system overlap.',
		viewIds: [
			'present',
			'worldmap',
			'brain',
			'stats',
			'timeline',
			'age',
			'sex',
			'region',
			'trends',
			'sdi',
			'prison',
			'comorbid',
			'sud',
			'sudsex',
			'suicide',
			'prisonmh',
			'treatment',
			'mhmap',
			'dataexplorer'
		]
	},
	{
		id: 'wellbeing',
		title: 'Global Wellbeing',
		blurb: 'Mental health, happiness, development, and health trends worldwide.',
		viewIds: ['mhmap', 'wealth', 'happiness', 'hdi', 'healthtrends', 'dataexplorer']
	},
	{
		id: 'society',
		title: 'Society & Systems',
		blurb: 'Economy, education, governance, and incarceration in context.',
		viewIds: ['economy', 'education', 'governance', 'prison', 'prisonmh', 'dataexplorer']
	}
];
