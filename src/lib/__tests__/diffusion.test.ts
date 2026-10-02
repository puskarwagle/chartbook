import { describe, it, expect } from 'vitest';
import timelineRaw from '../../../data/presentation_adhd_timeline.json';
import diffusionRaw from '../../../data/presentation_adhd_diffusion.json';
import statusRaw from '../../../data/countryStatus.json';
import { countryFeatures } from '$lib/mapData';
import type { AlsoLitEntry, PresentationSequence } from '$lib/presentation';

/**
 * diffusion.test.ts — honesty enforcement for the hybrid model.
 *
 * Diffusion enrichment (alsoLit) is the only part of the presentation that
 * makes claims beyond "this event happened here". Every entry must key to a
 * real step id, name a real country, and carry a source — otherwise an
 * unsourced claim could end up on a recorded video. Red build, not discipline.
 */
const timeline = timelineRaw as unknown as PresentationSequence;
const diffusion = diffusionRaw as unknown as { entries?: Record<string, AlsoLitEntry[]> };
const entries = diffusion.entries ?? {};
const validIso = new Set(countryFeatures.map((c) => c.iso2));

describe('diffusion data honesty', () => {
	it('keys every entry to a real step id', () => {
		const ids = new Set(timeline.steps.map((s) => s.id).filter(Boolean));
		for (const key of Object.keys(entries)) {
			expect(ids.has(key), `diffusion key '${key}' matches no step id`).toBe(true);
		}
	});

	it('requires iso2 + source on every entry, with valid country codes', () => {
		for (const [key, list] of Object.entries(entries)) {
			expect(Array.isArray(list) && list.length > 0, `'${key}' entry list is empty`).toBe(true);
			for (const e of list) {
				expect(e.iso2?.length ?? 0, `'${key}' entry missing iso2`).toBeGreaterThan(0);
				expect(
					validIso.has(e.iso2.toUpperCase()),
					`'${key}' names unknown country '${e.iso2}'`
				).toBe(true);
				expect(
					typeof e.source === 'string' && e.source.length > 0,
					`'${key}' → ${e.iso2} missing source`
				).toBe(true);
			}
		}
	});

	it('uses unique step ids and well-formed tierWave steps', () => {
		const ids = timeline.steps.map((s) => s.id).filter(Boolean);
		expect(ids.length, 'steps must carry stable ids for diffusion keys').toBe(
			timeline.steps.length
		);
		expect(new Set(ids).size, 'duplicate step id').toBe(ids.length);
		for (const s of timeline.steps) {
			if (s.kind === 'tierWave') {
				expect(['1', '2', '3', '4', 'unknown'], `tierWave '${s.id}' tier`).toContain(
					String(s.tier)
				);
			}
		}
	});

	it('keeps the tier-wave country count in sync with countryStatus.json', () => {
		const countries = (statusRaw as unknown as { countries: Record<string, { tier: unknown }> })
			.countries;
		const tier1 = Object.values(countries).filter((c) => String(c.tier) === '1').length;
		const wave = timeline.steps.find((s) => s.kind === 'tierWave' && String(s.tier) === '1');
		expect(wave, 'missing Tier-1 tierWave finale').toBeDefined();
		const claimed = Number(wave?.label?.match(/(\d+)\s+countries/)?.[1]);
		expect(Number.isFinite(claimed), `wave label names no country count: ${wave?.label}`).toBe(
			true
		);
		expect(claimed, 'timeline Tier-1 count drifted from countryStatus.json').toBe(tier1);
	});
});
