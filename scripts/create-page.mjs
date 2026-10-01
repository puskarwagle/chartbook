#!/usr/bin/env node
// Personal helper: create a custom video page via node.
// Usage: node scripts/create-page.mjs "My Segment Title"
// Appends { id, title } to src/lib/customPages.json (the UI reads this as defaults).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_PATH = path.resolve(__dirname, '../src/lib/customPages.json');

const title = process.argv.slice(2).join(' ').trim() || 'Untitled';

async function main() {
  let pages = [];
  try {
    pages = JSON.parse(await readFile(JSON_PATH, 'utf-8'));
    if (!Array.isArray(pages)) pages = [];
  } catch { /* missing/corrupt JSON — start fresh */ }
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
  const id = `custom-${slug || 'page'}-${Date.now().toString(36)}`;
  pages.push({ id, title, createdAt: new Date().toISOString() });
  await mkdir(path.dirname(JSON_PATH), { recursive: true });
  await writeFile(JSON_PATH, JSON.stringify(pages, null, 2) + '\n');
  console.log(`Created page: ${id}  "${title}"`);
  console.log(`Run dev server and find it under "My Pages" in the sidebar.`);
}

main();
