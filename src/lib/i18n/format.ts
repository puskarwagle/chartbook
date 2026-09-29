import type { Locale } from './store.svelte';

/**
 * format.ts — locale-aware number/date/text helpers.
 *
 * All functions take an explicit `locale` (a short code like 'en' | 'ne' | 'hi')
 * and map it to a full Intl tag. Default behavior matches today's English
 * output, so adopting these helpers changes nothing visually until a
 * non-English locale is selected.
 */

const TAGS: Record<Locale, string> = {
	en: 'en-US',
	ne: 'en-NP', // Arabic digits by default; switch to 'ne-NP' for Devanagari digits (०-९)
	hi: 'hi-IN'
};

/** Full Intl locale tag for a short locale code. Exported for ECharts and <html lang> use. */
export function localeTag(locale: Locale): string {
	return TAGS[locale] ?? 'en-US';
}

/** Devanagari-digit variant of the tag (ne-NP). Reserved for a future digits toggle. */
export function localeTagNativeDigits(locale: Locale): string {
	if (locale === 'ne') return 'ne-NP';
	return TAGS[locale] ?? 'en-US';
}

export function formatNumber(value: number, locale: Locale = 'en', options?: Intl.NumberFormatOptions): string {
	return new Intl.NumberFormat(localeTag(locale), options).format(value);
}

export function formatInt(value: number, locale: Locale = 'en'): string {
	return formatNumber(value, locale, { maximumFractionDigits: 0 });
}

export function formatPercent(value: number, locale: Locale = 'en', digits = 1): string {
	return formatNumber(value, locale, {
		style: 'percent',
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
}

/** Compact notation: 1.2M / 3.4K. Replaces hand-rolled B/M/K suffix code. */
export function formatCompact(value: number, locale: Locale = 'en', digits = 1): string {
	return formatNumber(value, locale, {
		notation: 'compact',
		maximumFractionDigits: digits
	});
}

export function formatCurrency(value: number, locale: Locale = 'en', currency = 'USD'): string {
	return new Intl.NumberFormat(localeTag(locale), {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	}).format(value);
}

export function formatYear(year: number | string): string {
	return String(year); // years are never localized — data vintages stay Gregorian
}

/**
 * Grapheme-safe truncation for ECharts axis labels and tooltips.
 * String.slice() splits Devanagari combining characters; Intl.Segmenter does not.
 * Falls back to slice() where Segmenter is unavailable (older browsers, some tests).
 */
export function truncate(text: string, max = 18): string {
	if (text.length <= max) return text;
	try {
		const Segmenter = (Intl as unknown as Record<string, unknown>)['Segmenter'] as
			| (new (locale: string, opts: { granularity: string }) => { segment(s: string): Iterable<{ segment: string }> })
			| undefined;
		if (Segmenter) {
			const seg = new Segmenter('en', { granularity: 'grapheme' });
			let out = '';
			let count = 0;
			for (const { segment } of seg.segment(text)) {
				if (count >= max - 1) break;
				out += segment;
				count += 1;
			}
			return out + '…';
		}
	} catch {
		// fall through to slice
	}
	return text.slice(0, max - 1) + '…';
}

/** Simple {count}/{n} placeholder interpolation used by dictionary strings. */
export function interpolate(template: string, vars: Record<string, string | number>): string {
	let out = template;
	for (const [key, value] of Object.entries(vars)) {
		out = out.replaceAll(`{${key}}`, String(value));
	}
	return out;
}
