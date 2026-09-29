import { describe, it, expect } from 'vitest';
import { countryFeatures, bordersPath, iso2ToName, nameToIso2 } from '$lib/mapData';

describe('mapData', () => {
	it('exports a non-empty array of country features', () => {
		expect(countryFeatures).toBeDefined();
		expect(Array.isArray(countryFeatures)).toBe(true);
		expect(countryFeatures.length).toBeGreaterThan(100);
	});

	it('each feature has required fields', () => {
		for (const f of countryFeatures) {
			expect(f.id).toBeDefined();
			expect(f.iso2).toMatch(/^[A-Z]{2}$/);
			expect(f.name).toBeDefined();
			expect(typeof f.path).toBe('string');
			expect(f.path).toMatch(/^M/);
		}
	});

	it('exports a borders SVG path string', () => {
		expect(typeof bordersPath).toBe('string');
		expect(bordersPath.length).toBeGreaterThan(0);
	});

	it('iso2ToName returns name for known code', () => {
		const name = iso2ToName('US');
		expect(name).toBe('United States of America');
	});

	it('iso2ToName falls back to code for unknown', () => {
		expect(iso2ToName('ZZ')).toBe('ZZ');
	});

	it('nameToIso2 returns code for known name', () => {
		const code = nameToIso2('France');
		expect(code).toBe('FR');
	});

	it('nameToIso2 is case-insensitive', () => {
		expect(nameToIso2('france')).toBe('FR');
	});

	it('nameToIso2 returns undefined for unknown name', () => {
		expect(nameToIso2('Narnia')).toBeUndefined();
	});
});
