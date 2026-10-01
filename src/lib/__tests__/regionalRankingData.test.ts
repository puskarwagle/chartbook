import { describe, it, expect } from 'vitest';
import adolescentsRaw from '../../../data/adolescents_young_adults_10_24.json';

interface RegionalRates {
	prevalence_rate_per_100k: number;
	incidence_rate_per_100k?: number;
}

const section = (
	adolescentsRaw as unknown as { regional_2021_highest_rates: Record<string, RegionalRates> }
).regional_2021_highest_rates;

describe('regional ranking source data', () => {
	it('pins the four keys, values, and the Caribbean null that RegionalRanking reads', () => {
		expect(section.australasia.prevalence_rate_per_100k).toBe(6366.3);
		expect(section.australasia.incidence_rate_per_100k).toBe(33.74);
		expect(section.caribbean.prevalence_rate_per_100k).toBe(6001.95);
		// Caribbean reports no incidence: the component's `?? null` hides the sub-label.
		expect(section.caribbean.incidence_rate_per_100k ?? null).toBeNull();
		expect(section.east_asia.prevalence_rate_per_100k).toBe(4411.22);
		expect(section.east_asia.incidence_rate_per_100k).toBe(25.93);
		expect(section.high_income_north_america.prevalence_rate_per_100k).toBe(4184.7);
		expect(section.high_income_north_america.incidence_rate_per_100k).toBe(21.77);
	});
});
