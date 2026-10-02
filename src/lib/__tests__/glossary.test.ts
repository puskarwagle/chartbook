import { describe, it, expect } from 'vitest';
import enDict from '$lib/i18n/locales/en.json';
import { GLOSSARY } from '$lib/glossary';

const ADHD_VIEWS = [
	'age',
	'sex',
	'region',
	'trends',
	'sdi',
	'prison',
	'comorbid',
	'sud',
	'sudsex',
	'suicide',
	'prisonmh',
	'treatment',
	'dataexplorer'
] as const;

function collectStrings(node: unknown, out: string[]): void {
	if (typeof node === 'string') {
		out.push(node);
		return;
	}
	if (typeof node === 'object' && node !== null) {
		for (const v of Object.values(node)) collectStrings(v, out);
	}
}

const TOKEN_RE = /\[([A-Za-z][A-Za-z0-9-]*)\]/g;

describe('glossary', () => {
	it('resolves every [TOKEN] used in ADHD view strings', () => {
		const root = enDict as unknown as {
			views: Record<string, unknown>;
			viewInfo: Record<string, unknown>;
		};
		const strings: string[] = [];
		for (const id of ADHD_VIEWS) {
			collectStrings(root.views[id], strings);
			collectStrings(root.viewInfo[id], strings);
		}
		const tokens = new Set<string>();
		for (const s of strings) {
			for (const m of s.matchAll(TOKEN_RE)) tokens.add(m[1].toLowerCase());
		}
		expect(tokens.size).toBeGreaterThan(0);
		for (const token of tokens) {
			expect(GLOSSARY[token], `[${token}] has no glossary entry`).toBeDefined();
			expect(GLOSSARY[token].label.length).toBeGreaterThan(0);
			expect(GLOSSARY[token].definition.length).toBeGreaterThan(0);
		}
	});

	it('keeps developer metadata out of ADHD view subtitles', () => {
		const root = enDict as unknown as { views: Record<string, { subtitle?: string }> };
		for (const id of ADHD_VIEWS) {
			const subtitle = root.views[id]?.subtitle ?? '';
			expect(subtitle, `${id} subtitle`).not.toContain('ECharts');
		}
	});
});
