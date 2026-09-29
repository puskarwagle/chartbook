import { json } from '@sveltejs/kit';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';

// Tiny personal-use persistence: writes custom page list/meta to
// src/lib/customPages.json so pages survive localStorage clears.
// No auth — this app is local-only for video production.

const JSON_PATH = path.resolve('src/lib/customPages.json');

async function readPages(): Promise<any[]> {
	try {
		const raw = await readFile(JSON_PATH, 'utf-8');
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

async function writePages(pages: any[]) {
	await mkdir(path.dirname(JSON_PATH), { recursive: true });
	await writeFile(JSON_PATH, JSON.stringify(pages, null, 2) + '\n', 'utf-8');
}

function makeId(title: string): string {
	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 30);
	return `custom-${slug || 'page'}-${Date.now().toString(36)}`;
}

export const GET: RequestHandler = async () => {
	return json(await readPages());
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	const title = String(body.title ?? 'Untitled').slice(0, 80) || 'Untitled';
	const pages = await readPages();
	const entry = { id: makeId(title), title, createdAt: new Date().toISOString() };
	pages.push(entry);
	await writePages(pages);
	return json(entry, { status: 201 });
};

export const PATCH: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	const id = String(body.id ?? '');
	const pages = await readPages();
	const idx = pages.findIndex((p) => p.id === id);
	if (idx === -1) return json({ error: 'not found' }, { status: 404 });
	if (typeof body.title === 'string') pages[idx].title = body.title.slice(0, 80);
	if (body.data !== undefined) {
		// Guard: never persist data: URLs to disk (bloats JSON). Local only.
		const d = body.data ?? {};
		const img = typeof d.imageUrl === 'string' ? d.imageUrl : '';
		pages[idx].data = {
			imageUrl: img.startsWith('data:') ? '' : img.slice(0, 2000),
			notes: typeof d.notes === 'string' ? d.notes.slice(0, 20000) : ''
		};
	}
	pages[idx].updatedAt = new Date().toISOString();
	await writePages(pages);
	return json(pages[idx]);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	const id = String(body.id ?? '');
	const pages = await readPages();
	const next = pages.filter((p) => p.id !== id);
	if (next.length === pages.length) return json({ error: 'not found' }, { status: 404 });
	await writePages(next);
	return json({ ok: true, id });
};
