import en from './locales/en.json';
import ne from './locales/ne.json';
import hi from './locales/hi.json';

/**
 * store.svelte.ts — locale state + dictionary lookup.
 *
 * Custom lightweight i18n (no dependency): short-code locale rune persisted
 * to localStorage, synced to <html lang>, with per-key English fallback.
 * Empty-string values in ne/hi dictionaries mean "untranslated" and fall back.
 *
 * Usage in a component:
 *   import { t, currentLocale, setLocale } from '$lib/i18n/store.svelte';
 *   <h1>{t('nav.worldmap')}</h1>   <!-- reactive: re-renders on locale change -->
 */

export type Locale = 'en' | 'ne' | 'hi';

export interface LocaleOption {
	code: Locale;
	/** Display name in English (keeps the switcher readable before fonts load). */
	label: string;
	/** Short badge text. */
	short: string;
}

export const LOCALES: LocaleOption[] = [
	{ code: 'en', label: 'English', short: 'EN' },
	{ code: 'ne', label: 'Nepali', short: 'NE' },
	{ code: 'hi', label: 'Hindi', short: 'HI' }
];

export const DEFAULT_LOCALE: Locale = 'en';
export const STORAGE_KEY = 'app-locale';

type Dict = Record<string, unknown>;

const DICTS: Record<Locale, Dict> = {
	en: en as unknown as Dict,
	ne: ne as unknown as Dict,
	hi: hi as unknown as Dict
};

function isLocale(value: unknown): value is Locale {
	return value === 'en' || value === 'ne' || value === 'hi';
}

function lookup(dict: Dict, key: string): unknown {
	let node: unknown = dict;
	for (const part of key.split('.')) {
		if (typeof node !== 'object' || node === null) return undefined;
		node = (node as Dict)[part];
	}
	return node;
}

class LocaleState {
	current = $state<Locale>(DEFAULT_LOCALE);

	get tag(): string {
		return this.current === 'ne' ? 'ne' : this.current === 'hi' ? 'hi' : 'en';
	}
}

export const localeState = new LocaleState();

/** Reactive current locale — read in $derived/template for auto re-render. */
export function currentLocale(): Locale {
	return localeState.current;
}

/**
 * Translate a dotted key (e.g. 'nav.worldmap'). Resolution order:
 * current locale → English → the key itself. Reactive via localeState.
 */
export function t(key: string): string {
	const localized = lookup(DICTS[localeState.current], key);
	if (typeof localized === 'string' && localized.length > 0) return localized;
	const fallback = lookup(DICTS.en, key);
	if (typeof fallback === 'string' && fallback.length > 0) return fallback;
	return key;
}

/** True when the key has a real (non-empty) translation in the given locale. */
export function hasTranslation(key: string, locale: Locale): boolean {
	const value = lookup(DICTS[locale], key);
	return typeof value === 'string' && value.length > 0;
}

function applyHtmlLang(locale: Locale): void {
	try {
		if (typeof document !== 'undefined' && document.documentElement) {
			document.documentElement.lang = localeStateTag(locale);
		}
	} catch {
		// non-DOM environment (SSR/prerender) — ignore
	}
}

function localeStateTag(locale: Locale): string {
	return locale === 'ne' ? 'ne' : locale === 'hi' ? 'hi' : 'en';
}

function readStored(): Locale | null {
	try {
		if (typeof localStorage === 'undefined') return null;
		const raw = localStorage.getItem(STORAGE_KEY);
		return isLocale(raw) ? raw : null;
	} catch {
		return null;
	}
}

export function setLocale(locale: Locale): void {
	if (!isLocale(locale)) return;
	localeState.current = locale;
	try {
		localStorage.setItem(STORAGE_KEY, locale);
	} catch {
		// private mode / no storage — locale still applies for the session
	}
	applyHtmlLang(locale);
}

/** Call once on app mount (see +layout.svelte). Idempotent. */
export function initLocale(): Locale {
	const stored = readStored();
	localeState.current = stored ?? DEFAULT_LOCALE;
	applyHtmlLang(localeState.current);
	return localeState.current;
}
