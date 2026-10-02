import { describe, it, expect } from 'vitest';
import {
	computeTreatmentAccessIndex,
	treatmentAccessCoverage,
	healthExpenditure,
	lifeExpectancyWb
} from '$lib/data';

describe('treatment access coverage', () => {
	it('scores exactly the countries with both inputs', () => {
		const { scored, excluded, total } = treatmentAccessCoverage();
		expect(scored).toBe(computeTreatmentAccessIndex().length);
		expect(scored + excluded).toBe(total);
		expect(scored).toBeGreaterThan(0);
	});

	it('excludes only countries missing at least one input', () => {
		const { total } = treatmentAccessCoverage();
		const union = new Set([...healthExpenditure.keys(), ...lifeExpectancyWb.keys()]);
		expect(union.size).toBe(total);
		for (const code of union) {
			const hasBoth = healthExpenditure.has(code) && lifeExpectancyWb.has(code);
			if (!hasBoth) {
				expect(
					healthExpenditure.has(code) && lifeExpectancyWb.has(code),
					`${code} counted inconsistently`
				).toBe(false);
			}
		}
	});

	it('gives every scored country finite percentile ranks', () => {
		for (const row of computeTreatmentAccessIndex()) {
			expect(Number.isFinite(row.score)).toBe(true);
			expect(row.score).toBeGreaterThanOrEqual(0);
			expect(row.score).toBeLessThanOrEqual(100);
		}
	});
});
