import { describe, it, expect } from 'vitest';
import { COLORS, TIERS } from '$lib/colors';

describe('colors', () => {
	it('has colors for all tiers', () => {
		expect(COLORS).toBeDefined();
		expect(COLORS['1']).toBeDefined();
		expect(COLORS['2']).toBeDefined();
		expect(COLORS['3']).toBeDefined();
		expect(COLORS['4']).toBeDefined();
		expect(COLORS['unknown']).toBeDefined();
	});

	it('has valid hex colors', () => {
		for (const [key, val] of Object.entries(COLORS)) {
			expect(val, `COLORS['${key}']`).toMatch(/^#[0-9a-fA-F]{6}$/);
		}
	});

	it('has tier labels', () => {
		expect(TIERS).toBeDefined();
		expect(typeof TIERS['1']).toBe('string');
		expect(TIERS['1'].length).toBeGreaterThan(0);
	});
});
