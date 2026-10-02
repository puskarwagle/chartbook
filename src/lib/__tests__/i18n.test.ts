import { describe, it, expect, afterEach } from 'vitest';
import enDict from '$lib/i18n/locales/en.json';
import neDict from '$lib/i18n/locales/ne.json';
import hiDict from '$lib/i18n/locales/hi.json';
import { t, setLocale, currentLocale, LOCALES } from '$lib/i18n/store.svelte';
import {
	tierShortLabel,
	tierDescription,
	getViewInfo,
	countryNameLocalized,
	interpolate,
	truncate,
	formatInt,
	formatPercent
} from '$lib/i18n/index';

afterEach(() => {
	setLocale('en');
});

describe('locale store + dictionary', () => {
	it('defaults to English', () => {
		expect(currentLocale()).toBe('en');
		expect(t('nav.worldmap')).toBe('World Map');
	});

	it('resolves Nepali keys once translated', () => {
		setLocale('ne');
		expect(t('nav.worldmap')).toBe('विश्व नक्सा');
		expect(t('categories.adhd')).toBe('ADHD र सहरुग्णता');
		expect(t('common.close')).toBe('बन्द गर्नुहोस्');
	});

	it('falls back to English for blank overlay values', () => {
		setLocale('hi'); // hi.json is entirely blank
		expect(t('nav.worldmap')).toBe('World Map');
		expect(t('tiers.short.1')).toBe('Amphetamine');
	});

	it('resolves per-view keys with English fallback', () => {
		expect(t('views.stats.title')).toBe('Global ADHD Treatment Overview');
		setLocale('ne');
		expect(t('views.stats.title')).toBe('Global ADHD Treatment Overview'); // blank → fallback
	});

	it('returns the key itself when missing everywhere', () => {
		expect(t('does.not.exist')).toBe('does.not.exist');
	});

	it('offers exactly the supported locales', () => {
		expect(LOCALES.map((l) => l.code).sort()).toEqual(['en', 'ne']);
	});
});

describe('locale-aware data accessors', () => {
	it('returns translated tier labels in Nepali', () => {
		expect(tierShortLabel('1', 'ne')).toBe('एम्फेटामिन');
		expect(tierShortLabel('2', 'ne')).toBe('मिथाइलफेनिडेट मात्र');
		expect(tierShortLabel('unknown', 'ne')).toBe('अज्ञात');
	});

	it('falls back to English tier labels', () => {
		expect(tierShortLabel('1', 'en')).toBe('Amphetamine');
		expect(tierShortLabel('1', 'hi')).toBe('Amphetamine');
	});

	it('returns translated tier descriptions in Nepali', () => {
		const desc = tierDescription('2', 'ne');
		expect(desc).toContain('मिथाइलफेनिडेट');
		expect(desc).toContain('Ritalin/Concerta');
	});

	it('returns translated viewInfo prose with tech tokens intact', () => {
		const info = getViewInfo('stats', 'ne');
		expect(info).not.toBeNull();
		expect(info?.what).toContain('तह');
		const gov = getViewInfo('governance', 'ne');
		expect(gov?.source).toContain('data/transparency_cpi_2024.json');
	});

	it('falls back to English viewInfo for untranslated locales', () => {
		const info = getViewInfo('stats', 'hi');
		expect(info?.what).toContain('Summary cards');
	});

	it('returns English country names until the overlay is filled', () => {
		expect(countryNameLocalized('NPL', 'ne')).toBe(countryNameLocalized('NPL', 'en'));
		expect(countryNameLocalized('NPL', 'en')).toBe('Nepal');
	});
});

describe('dictionary parity + placeholders', () => {
	function leafPaths(obj: unknown, prefix = ''): Map<string, string> {
		const out = new Map<string, string>();
		if (typeof obj !== 'object' || obj === null) return out;
		for (const [k, v] of Object.entries(obj)) {
			if (k === '_meta') continue;
			const path = prefix ? `${prefix}.${k}` : k;
			if (typeof v === 'object' && v !== null) {
				for (const [p, s] of leafPaths(v, path)) out.set(p, s);
			} else {
				out.set(path, String(v));
			}
		}
		return out;
	}

	function placeholders(s: string): string[] {
		return [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
	}

	const en = leafPaths(enDict);

	it('ne.json mirrors every en.json key', () => {
		const ne = leafPaths(neDict);
		for (const path of en.keys()) {
			expect(ne.has(path), `ne.json missing ${path}`).toBe(true);
		}
		for (const path of ne.keys()) {
			expect(en.has(path), `ne.json has extra ${path}`).toBe(true);
		}
	});

	it('hi.json mirrors every en.json key', () => {
		const hi = leafPaths(hiDict);
		for (const path of en.keys()) {
			expect(hi.has(path), `hi.json missing ${path}`).toBe(true);
		}
		for (const path of hi.keys()) {
			expect(en.has(path), `hi.json has extra ${path}`).toBe(true);
		}
	});

	it('translated values preserve en placeholders', () => {
		for (const overlay of [neDict, hiDict] as const) {
			const leaves = leafPaths(overlay);
			for (const [path, enValue] of en) {
				const value = leaves.get(path) ?? '';
				if (value.length === 0) continue; // blank = fallback, checked separately
				expect(placeholders(value), `${path}`).toEqual(placeholders(enValue));
			}
		}
	});
});

describe('format helpers', () => {
	it('interpolates placeholders', () => {
		expect(interpolate('{count} countries tracked', { count: 170 })).toBe('170 countries tracked');
		expect(interpolate('{count} देशको तथ्याङ्क', { count: 170 })).toBe('170 देशको तथ्याङ्क');
	});

	it('formats integers and percents without throwing', () => {
		expect(formatInt(1234567, 'en')).toBe('1,234,567');
		expect(formatPercent(0.123, 'en')).toContain('12');
	});

	it('truncates without splitting Devanagari graphemes', () => {
		const out = truncate('मानसिक स्वास्थ्य नक्सा', 10);
		expect(out.endsWith('…')).toBe(true);
		// No dangling combining marks (U+094D virama, U+093E–U+094C vowel signs) at the cut edge
		expect(out.slice(-2, -1)).not.toMatch(/[्ेैोौंःँ]/u);
	});
});
