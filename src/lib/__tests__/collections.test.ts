import { describe, it, expect } from 'vitest';
import { COLLECTIONS, DEFAULT_COLLECTION_ID } from '$lib/collections';

describe('collections', () => {
	it('has unique ids and a valid default', () => {
		const ids = COLLECTIONS.map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
		expect(ids).toContain(DEFAULT_COLLECTION_ID);
	});

	it('has a title, blurb, and non-empty unique view ids per collection', () => {
		for (const c of COLLECTIONS) {
			expect(c.title.length, `${c.id} title`).toBeGreaterThan(0);
			expect(c.blurb.length, `${c.id} blurb`).toBeGreaterThan(0);
			expect(c.viewIds.length, `${c.id} viewIds`).toBeGreaterThan(0);
			expect(new Set(c.viewIds).size, `${c.id} duplicates`).toBe(c.viewIds.length);
		}
	});

	it('covers every topical view id in the all collection', () => {
		const all = COLLECTIONS.find((c) => c.id === DEFAULT_COLLECTION_ID);
		expect(all).toBeDefined();
		const allIds = new Set(all!.viewIds);
		for (const c of COLLECTIONS) {
			for (const id of c.viewIds) {
				expect(allIds.has(id), `'${id}' from '${c.id}' missing in '${all!.id}'`).toBe(true);
			}
		}
	});

	it('includes dataexplorer in every collection', () => {
		for (const c of COLLECTIONS) {
			expect(c.viewIds, c.id).toContain('dataexplorer');
		}
	});
});
