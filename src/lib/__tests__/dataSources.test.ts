import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { VIEW_DATA_SOURCES } from '$lib/dataSources';
import { NAV_GROUPS } from '$lib/navGroups';

const dataDir = join(import.meta.dirname, '../../../data');
const onDisk = new Set(readdirSync(dataDir));

describe('view data sources', () => {
	it('references each view exactly once', () => {
		const ids = VIEW_DATA_SOURCES.map((v) => v.viewId);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('points every view at data files that exist on disk', () => {
		for (const view of VIEW_DATA_SOURCES) {
			for (const file of view.files) {
				expect(onDisk.has(file), `${view.viewId} → ${file}`).toBe(true);
			}
		}
	});

	it('covers every sidebar view id from NAV_GROUPS', () => {
		const ids = new Set(VIEW_DATA_SOURCES.map((v) => v.viewId));
		for (const group of NAV_GROUPS) {
			for (const id of group.ids) {
				expect(ids.has(id), `no registry entry for ${id}`).toBe(true);
			}
		}
	});
});
