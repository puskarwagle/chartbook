import { describe, it, expect } from 'vitest';
import {
	REVEAL_NONE,
	attachDiffusion,
	clampStep,
	isPrevKey,
	isNextKey,
	isPlayPauseKey,
	revealedIso2,
	revealedWithWaves,
	tierWaveTiers,
	resolveFill,
	resolveOpacity,
	type PresentationSequence
} from '$lib/presentation';

const seq: PresentationSequence = {
	id: 'test',
	title: 'Test sequence',
	steps: [
		{ iso2: 'US', year: 1937, label: 'US event' },
		{ iso2: 'GB', year: 1944, label: 'GB event' },
		{ iso2: null, year: 1950, label: 'Narrative beat' },
		{ iso2: 'DE', year: 1960, label: 'DE event' }
	]
};

describe('presentation engine', () => {
	it('reveals nothing at REVEAL_NONE', () => {
		expect(revealedIso2(seq, REVEAL_NONE).size).toBe(0);
	});

	it('cumulatively reveals every country up to the current step', () => {
		expect(revealedIso2(seq, 0)).toEqual(new Set(['US']));
		expect(revealedIso2(seq, 1)).toEqual(new Set(['US', 'GB']));
		// Narrative beat (no country): set unchanged.
		expect(revealedIso2(seq, 2)).toEqual(new Set(['US', 'GB']));
		expect(revealedIso2(seq, 3)).toEqual(new Set(['US', 'GB', 'DE']));
	});

	it('merges diffusion onto steps by id and unions alsoLit into the reveal', () => {
		const withIds: PresentationSequence = {
			id: 't',
			title: 't',
			steps: [{ id: 'a', iso2: 'US' }, { id: 'b', iso2: null }]
		};
		const merged = attachDiffusion(withIds, {
			b: [{ iso2: 'CH', source: 'https://example.com' }],
			ghost: [{ iso2: 'FR', source: 'https://example.com' }]
		});
		expect(merged.steps[0].alsoLit).toBeUndefined();
		expect(merged.steps[1].alsoLit).toEqual([{ iso2: 'CH', source: 'https://example.com' }]);
		expect(revealedIso2(merged, 1)).toEqual(new Set(['US', 'CH']));
		// Unknown keys ignored, original untouched.
		expect(withIds.steps[1].alsoLit).toBeUndefined();
	});

	it('clamps steps to [-1, total-1]', () => {
		expect(clampStep(-5, 4)).toBe(REVEAL_NONE);
		expect(clampStep(99, 4)).toBe(3);
		expect(clampStep(2, 4)).toBe(2);
		expect(clampStep(0, 0)).toBe(REVEAL_NONE);
	});

	describe('circle filter (resolveFill / resolveOpacity)', () => {
		const colors = { '1': '#10b981', '2': '#3b82f6', unknown: '#64748b' };
		const step1 = revealedIso2(seq, 1); // US + GB lit

		it('shows grey for unlit and tier color for lit with no filter', () => {
			const style = { revealed: step1, filterTier: null, unknownHex: colors.unknown };
			expect(resolveFill('DE', '1', colors, style)).toBe(colors.unknown);
			expect(resolveFill('US', '1', colors, style)).toBe(colors['1']);
			expect(resolveOpacity('DE', '1', style)).toBe(0.55);
			expect(resolveOpacity('US', '1', style)).toBe(1);
		});

		it('previews true tier membership straight through the reveal', () => {
			// Regression: at the all-grey opening frame, clicking a circle
			// used to paint the whole map near-background dark (looked dead).
			const empty = { revealed: revealedIso2(seq, REVEAL_NONE), filterTier: '1' as const, unknownHex: colors.unknown };
			expect(resolveFill('US', '1', colors, empty)).toBe(colors['1']);
			expect(resolveFill('DE', '1', colors, empty)).toBe(colors['1']);
			expect(resolveFill('FR', '2', colors, empty)).toBe('#1a1a2e');
			expect(resolveOpacity('US', '1', empty)).toBe(1);
			expect(resolveOpacity('FR', '2', empty)).toBe(0.15);
		});

		it('dims lit countries of other tiers while filtered', () => {
			const style = { revealed: step1, filterTier: '2' as const, unknownHex: colors.unknown };
			expect(resolveFill('US', '1', colors, style)).toBe('#1a1a2e');
			expect(resolveOpacity('US', '1', style)).toBe(0.15);
		});
	});

	it('maps transport keys (comma/period/space, shifted or not)', () => {
		expect(isPrevKey(',')).toBe(true);
		expect(isPrevKey('<')).toBe(true);
		expect(isNextKey('.')).toBe(true);
		expect(isNextKey('>')).toBe(true);
		expect(isPlayPauseKey(' ')).toBe(true);
		expect(isPrevKey('.')).toBe(false);
		expect(isNextKey(',')).toBe(false);
	});

	it('expands tierWave steps via the engine (finale undercount guard)', () => {
		const wave: PresentationSequence = {
			id: 'w',
			title: 'w',
			steps: [
				{ id: 'a', iso2: 'US' },
				{ id: 'b', kind: 'tierWave', tier: '1' }
			]
		};
		// Event-only reveal ignores the wave.
		expect(revealedIso2(wave, 1)).toEqual(new Set(['US']));
		expect(tierWaveTiers(wave, 0)).toEqual([]);
		expect(tierWaveTiers(wave, 1)).toEqual(['1']);
		const full = revealedWithWaves(wave, 1, (t) =>
			t === '1' ? ['US', 'GB', 'de'] : []
		);
		expect(full).toEqual(new Set(['US', 'GB', 'DE']));
	});
});
