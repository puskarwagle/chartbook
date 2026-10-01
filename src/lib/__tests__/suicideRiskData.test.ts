import { describe, it, expect, afterEach } from 'vitest';
import suicideRaw from '../../../data/suicide_risk_studies.json';
import { formatSummaryValue } from '$lib/summaryFormat';
import { setLocale } from '$lib/i18n/store.svelte';
import { getViewInfo } from '$lib/i18n/index';

afterEach(() => {
	setLocale('en');
});

describe('suicide_risk_studies.json', () => {
	it('holds the four Garas 2025 findings in display order, each sourced', () => {
		expect(suicideRaw.findings.map((f) => f.id)).toEqual(['ideation', 'death', 'attempt', 'overall']);
		for (const f of suicideRaw.findings) {
			expect(f.source, f.id).toContain('Garas');
			expect(f.odds_ratio).toBeGreaterThan(1);
		}
	});

	it('pins the summary spec: raw numbers with units and qualifiers', () => {
		expect(suicideRaw.summary.map((s) => [s.value, s.unit, s.qualifier])).toEqual([
			[3.3, '×', null],
			[140654, 'k', null],
			[10, 'yr', '≥']
		]);
		for (const s of suicideRaw.summary) {
			expect(s.source, s.id).toContain('Garas');
		}
	});

	it('renders the pre-extraction summary strings exactly (no formatting drift)', () => {
		expect(suicideRaw.summary.map(formatSummaryValue)).toEqual(['3.3×', '140k', '≥10yr']);
	});

	it('ne falls back to English for the suicide source until retranslated', () => {
		// RETRANSLATION NEEDED: ne.json views.suicide.source was blanked because the
		// old Nepali text described the estimates as hardcoded, which is false now
		// that they live in data/suicide_risk_studies.json. Blank = English fallback.
		setLocale('ne');
		expect(getViewInfo('suicide', 'ne')?.source).toContain('data/suicide_risk_studies.json');
	});
});
