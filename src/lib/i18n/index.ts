/**
 * i18n/index.ts — barrel + locale-aware data accessors.
 *
 * UI strings:  t('nav.worldmap') from store.svelte.
 * Numbers:     format.ts helpers.
 * Data:        helpers below overlay translated names/labels on top of the
 *              English pipelines, with fallback to English when untranslated.
 */
import { countryName as baseCountryName } from '$lib/data';
import { VIEW_INFO, type ViewInfoEntry } from '$lib/viewInfo';
import statusData from '$lib/countryStatus.json';
import countriesNe from './countries.ne.json';
import statusNe from './countryStatus.ne.json';
import enDict from './locales/en.json';
import neViewDict from './locales/ne.json';
import hiViewDict from './locales/hi.json';

export { t, currentLocale, setLocale, initLocale, LOCALES, STORAGE_KEY, DEFAULT_LOCALE } from './store.svelte';
export type { Locale, LocaleOption } from './store.svelte';
export {
	localeTag,
	localeTagNativeDigits,
	formatNumber,
	formatInt,
	formatPercent,
	formatCompact,
	formatCurrency,
	formatYear,
	truncate,
	interpolate
} from './format';
export type { ViewInfoEntry };

type TierKey = '1' | '2' | '3' | '4' | 'unknown';

const neCountries = (countriesNe as { countries?: Record<string, string> }).countries ?? {};
const neStatus = statusNe as { tiers?: Record<string, string>; countries?: Record<string, { notes?: string }> };

interface TierDict {
	tiers?: { short?: Record<string, string>; descriptions?: Record<string, string> };
}

const TIER_DICTS = {
	en: enDict as unknown as TierDict,
	ne: neViewDict as unknown as TierDict,
	hi: hiViewDict as unknown as TierDict
};

function dictTier(locale: string, section: 'short' | 'descriptions', key: string): string | undefined {
	const dict = TIER_DICTS[locale as keyof typeof TIER_DICTS] ?? TIER_DICTS.en;
	const hit = dict.tiers?.[section]?.[key];
	return typeof hit === 'string' && hit.length > 0 ? hit : undefined;
}

function nonEmpty(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** Short tier label for the active locale (StatsView cards, legends). Falls back to English. */
export function tierShortLabel(key: TierKey, locale: string): string {
	return (
		dictTier(locale, 'short', key) ??
		(locale === 'ne' ? nonEmpty(neStatus.tiers?.[key]) : undefined) ??
		dictTier('en', 'short', key) ??
		key
	);
}

/** Long tier definition for the active locale. Falls back to countryStatus.json English. */
export function tierDescription(key: TierKey, locale: string): string {
	return (
		dictTier(locale, 'descriptions', key) ??
		(locale === 'ne' ? nonEmpty(neStatus.tiers?.[key]) : undefined) ??
		nonEmpty((statusData as unknown as { _meta?: { tiers?: Record<string, string> } })._meta?.tiers?.[key]) ??
		key
	);
}

/**
 * Country display name for the active locale.
 * `code3` is the World Bank alpha-3 code used across data.ts.
 * Resolution: ne overlay (by alpha-2) → English pipeline → code itself.
 */
export function countryNameLocalized(code3: string, locale: string): string {
	const english = baseCountryName(code3);
	if (locale === 'ne') {
		const iso2 = code3ToIso2(code3);
		if (iso2) {
			const hit = neCountries[iso2];
			if (typeof hit === 'string' && hit.length > 0) return hit;
		}
	}
	return english;
}

/** Per-country translated note (countryStatus overlay). Falls back to English notes. */
export function countryNoteLocalized(iso2: string, locale: string, fallbackEnglish: string): string {
	if (locale === 'ne') {
		const hit = neStatus.countries?.[iso2]?.notes;
		if (typeof hit === 'string' && hit.length > 0) return hit;
	}
	return fallbackEnglish;
}

const VIEW_FIELDS = ['what', 'howToRead', 'source', 'insight', 'limitation'] as const;

/**
 * ViewInfo prose for the active locale. Reads locales/<locale>.json viewInfo
 * first (per-field), falls back to English, then to the legacy VIEW_INFO
 * English module. Empty-string values count as untranslated.
 * (en.json is currently canonical; VIEW_INFO remains as the code fallback.)
 */
export function getViewInfo(viewId: string, locale: string): ViewInfoEntry | null {
	const legacy = VIEW_INFO[viewId] ?? null;
	const dicts = {
		en: enDict as unknown as ViewDict,
		ne: neViewDict as unknown as ViewDict,
		hi: hiViewDict as unknown as ViewDict
	};
	const localized = (dicts[locale as keyof typeof dicts] ?? dicts.en).viewInfo?.[viewId];
	const english = dicts.en.viewInfo?.[viewId];
	if (!legacy && !english && !localized) return null;
	const entry = {} as Record<string, string>;
	for (const field of VIEW_FIELDS) {
		entry[field] = localized?.[field] || english?.[field] || legacy?.[field] || '';
	}
	return entry as unknown as ViewInfoEntry;
}

interface ViewDict {
	viewInfo?: Record<string, Record<string, string>>;
}

// Minimal alpha-3 → alpha-2 bridge for overlay lookups.
// Full mapping lives in mapData/world-atlas; this covers tracked countries lazily.
const ISO3_TO_2: Record<string, string> = {
	NPL: 'NP',
	USA: 'US',
	IND: 'IN',
	CHN: 'CN',
	GBR: 'GB'
};

function code3ToIso2(code3: string): string | undefined {
	return ISO3_TO_2[code3];
}
