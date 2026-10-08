/**
 * vite.config.ts — Build configuration
 *
 * SvelteKit options (adapter, $data alias, runes mode) live in
 * svelte.config.js. Keep this file to plain `sveltekit()` so the
 * config file isn't ignored.
 */
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
});
