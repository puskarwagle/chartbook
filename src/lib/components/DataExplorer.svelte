<script lang="ts">
	import readme from '../../../data/README_DATA.json';
	import { t } from '$lib/i18n/store.svelte';
	import { interpolate } from '$lib/i18n/index';

	const dataModules = import.meta.glob<{
		default: unknown;
	}>('../../../data/*.json', { eager: true });
	const mdModules = import.meta.glob<{
		default: string;
	}>('../../../data/*.md', { query: '?raw', eager: true });

	interface DataFile {
		key: string;
		label: string;
		data: unknown;
		source?: string;
		description?: string;
	}

	function slugToLabel(slug: string): string {
		return slug
			.replace(/[-_]/g, ' ')
			.replace(/\.\w+$/, '')
			.replace(/\b\w/g, (c) => c.toUpperCase());
	}

	function buildFiles(): DataFile[] {
		const readmeMeta = readme as Record<string, any>;
		const entries: DataFile[] = [];

		for (const [path, mod] of Object.entries(dataModules)) {
			const key = path.split('/').pop()!;
			if (key === 'README_DATA.json') continue;
			const meta = readmeMeta[key] ?? {};
			entries.push({
				key,
				label: slugToLabel(key),
				data: mod.default,
				source: meta.source,
				description: meta.description
			});
		}

		for (const [path, mod] of Object.entries(mdModules)) {
			const key = path.split('/').pop()!;
			const meta = readmeMeta[key] ?? {};
			entries.push({
				key,
				label: slugToLabel(key),
				data: mod.default,
				source: meta.source,
				description: meta.description
			});
		}

		return entries.sort((a, b) => a.key.localeCompare(b.key));
	}

	const files = buildFiles();

	let selected = $state<DataFile | null>(null);
	let formattedJson = $state('');
	let loading = $state(false);

	function selectFile(file: DataFile) {
		selected = file;
		loading = true;
		formattedJson = '';
		setTimeout(() => {
			formattedJson = typeof file.data === 'string'
				? file.data
				: JSON.stringify(file.data, null, 2);
			loading = false;
		}, 0);
	}

	function closeViewer() {
		selected = null;
	}

	const subtitle = $derived(interpolate(t('views.dataexplorer.subtitle'), { count: files.length }));
</script>

<div class="explorer">
	{#if selected}
		<div class="viewer">
			<div class="viewer-header">
				<button class="back-btn" onclick={closeViewer}>&larr; {t('views.dataexplorer.back')}</button>
				<h2 class="viewer-title">{selected.label}</h2>
				{#if selected.source}
					<p class="viewer-source">{selected.source}</p>
				{/if}
			</div>
			{#if loading}
				<div class="spinner-container">
					<div class="spinner"></div>
					<span>{t('views.dataexplorer.loading')}</span>
				</div>
			{:else}
				<pre class="json-block"><code>{formattedJson}</code></pre>
			{/if}
		</div>
	{:else}
		<h1 class="explorer-title">{t('views.dataexplorer.title')}</h1>
		<p class="explorer-subtitle">{subtitle}</p>
		<div class="card-grid">
			{#each files as file}
				<button class="card" onclick={() => selectFile(file)}>
					<h3 class="card-label">{file.label}</h3>
					<p class="card-key">{file.key}</p>
					{#if file.description}
						<p class="card-desc">{file.description}</p>
					{/if}
					{#if file.source}
						<p class="card-source">{file.source}</p>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.explorer {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		padding: 2rem;
		box-sizing: border-box;
	}

	.explorer-title {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
	}

	.explorer-subtitle {
		margin: 0 0 1.5rem;
		opacity: 0.6;
		font-size: 0.85rem;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.card {
		background: #16213e;
		border: 1px solid #1a1a2e;
		border-radius: 8px;
		padding: 1rem;
		cursor: pointer;
		text-align: left;
		color: inherit;
		font: inherit;
		transition: border-color 0.15s, background 0.15s;
	}

	.card:hover {
		border-color: #4cc9f0;
		background: #1a2744;
	}

	.card-label {
		margin: 0 0 0.25rem;
		font-size: 1rem;
		font-weight: 600;
	}

	.card-key {
		margin: 0 0 0.5rem;
		font-size: 0.75rem;
		opacity: 0.5;
		font-family: monospace;
	}

	.card-desc {
		margin: 0 0 0.5rem;
		font-size: 0.8rem;
		opacity: 0.7;
		line-height: 1.4;
	}

	.card-source {
		margin: 0;
		font-size: 0.7rem;
		opacity: 0.4;
		word-break: break-all;
	}

	.viewer {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.viewer-header {
		margin-bottom: 1rem;
		flex-shrink: 0;
	}

	.back-btn {
		background: none;
		border: 1px solid #333;
		color: #4cc9f0;
		padding: 0.3rem 0.8rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
		margin-bottom: 0.75rem;
	}

	.back-btn:hover {
		background: #16213e;
	}

	.viewer-title {
		margin: 0 0 0.25rem;
		font-size: 1.3rem;
	}

	.viewer-source {
		margin: 0;
		font-size: 0.75rem;
		opacity: 0.5;
	}

	.json-block {
		flex: 1;
		overflow: auto;
		background: #0f0f23;
		border-radius: 6px;
		padding: 1rem;
		margin: 0;
		font-size: 0.78rem;
		line-height: 1.5;
		tab-size: 2;
		color: #c9d1d9;
	}

	.spinner-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		opacity: 0.6;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #333;
		border-top-color: #4cc9f0;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
