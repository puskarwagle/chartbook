/**
 * glossary.ts — single source of truth for technical terms shown on screen.
 *
 * Each entry has a short `label` (rendered where space is tight) and a plain
 * `definition` (shown on hover). Chart and view text spells every term out at
 * first use; the `[TOKEN]` markers in i18n strings (e.g. views.*.sowhat,
 * viewInfo howToRead) are rendered as hover definitions by RichText.svelte.
 * Translators: preserve [TOKEN] markers verbatim when translating a string.
 */
export interface GlossaryEntry {
	/** Short label rendered in place of [TOKEN]. */
	label: string;
	/** Plain-language definition shown on hover. */
	definition: string;
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
	prevalence: {
		label: 'prevalence',
		definition: 'The share of a group who have a condition right now — e.g. 2,700 per 100,000 is about 2.7%.'
	},
	incidence: {
		label: 'incidence',
		definition: 'The share who newly develop a condition over a period — new cases only, not all cases.'
	},
	per100k: {
		label: 'per 100,000',
		definition: 'Per 100,000 people — the standard way to compare rates; 1,000 per 100,000 is 1%.'
	},
	pp: {
		label: 'pp',
		definition: 'Percentage points — the plain gap between two percentages.'
	},
	ci: {
		label: 'CI',
		definition: 'Confidence interval — the range the true value likely falls in; wider means less certain.'
	},
	or: {
		label: 'OR',
		definition: 'Odds ratio — how many times higher the odds are versus a comparison group; 1.0 means no difference.'
	},
	hr: {
		label: 'HR',
		definition:
			'Hazard ratio — how many times higher the rate is for people with ADHD versus without; 1.0 means no difference.'
	},
	daly: {
		label: 'DALY',
		definition: 'Disability-adjusted life year — one lost year of healthy life; how disease burden is counted.'
	},
	sud: {
		label: 'SUD',
		definition: 'Substance use disorder — harmful use of, or dependence on, alcohol or other drugs.'
	},
	comorbidity: {
		label: 'comorbidity',
		definition: 'Having two or more conditions at the same time.'
	},
	'meta-analysis': {
		label: 'meta-analysis',
		definition: 'A study that pools many smaller studies into one combined result.'
	},
	sdi: {
		label: 'SDI',
		definition: 'Sociodemographic Index (0–1) — a development score built from income, schooling and fertility.'
	},
	hdi: {
		label: 'HDI',
		definition: 'Human Development Index (0–1) — a development score built from health, schooling and income.'
	},
	gbd: {
		label: 'GBD',
		definition: 'Global Burden of Disease — the research project these worldwide estimates come from.'
	},
	pd: {
		label: 'PD',
		definition: 'Personality disorder — a long-term pattern of thinking and behaving that causes serious problems.'
	},
	'pcl-r': {
		label: 'PCL-R',
		definition: 'Psychopathy Checklist-Revised — the rating scale used here; a score of 30 or more marks psychopathy.'
	},
	json: {
		label: 'JSON',
		definition: 'The plain-text format the raw data files are stored in.'
	},
	pooled: {
		label: 'pooled',
		definition: 'Combined across studies into one average figure.'
	},
	percentile: {
		label: 'percentile',
		definition: 'Percentile rank — the percentage of countries scoring below this one.'
	},
	'age-standardized': {
		label: 'age-standardized',
		definition: 'Adjusted so that different age mixes do not distort the comparison.'
	}
};
