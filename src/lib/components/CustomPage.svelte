<script lang="ts">
	// CustomPage — user-created video page. JSON-backed (no new .svelte file
	// per page; the JSON entry + this generic renderer is the page).
	// Image + script notes persist per-page in localStorage; title + small
	// meta also sync to customPages.json on disk via /api/custom-pages.
	import CustomPagePreview from './CustomPagePreview.svelte';

	let {
		pageId,
		title,
		onRename
	}: {
		pageId: string;
		title: string;
		onRename: (id: string, newTitle: string) => void;
	} = $props();

	interface PageData {
		imageUrl: string;
		notes: string;
	}

	const DATA_KEY = $derived(`custom-page-${pageId}`);

	function loadData(): PageData {
		try {
			const raw = localStorage.getItem(`custom-page-${pageId}`);
			if (raw) {
				const parsed = JSON.parse(raw);
				return {
					imageUrl: parsed.imageUrl ?? '',
					notes: parsed.notes ?? ''
				};
			}
		} catch {}
		return { imageUrl: '', notes: '' };
	}

	let data = $state<PageData>(loadData());
	let editingTitle = $state(false);
	let titleDraft = $state('');
	let titleInputEl: HTMLInputElement | null = $state(null);
	let imageUrlDraft = $state(data.imageUrl);
	let presenting = $state(false);

	$effect(() => {
		if (!editingTitle) titleDraft = title;
	});

	$effect(() => {
		if (editingTitle) titleInputEl?.focus();
	});

	function saveData() {
		try {
			localStorage.setItem(DATA_KEY, JSON.stringify(data));
			// Sync small meta to disk, but NEVER send data: URLs (they bloat
			// customPages.json — e.g. the golum page). Local only for uploads.
			const diskImage = data.imageUrl.startsWith('data:') ? '' : data.imageUrl;
			fetch('/api/custom-pages', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: pageId, data: { imageUrl: diskImage, notes: data.notes } })
			}).catch(() => {});
		} catch {}
	}

	function commitTitle() {
		const next = titleDraft.trim() || 'Untitled';
		editingTitle = false;
		if (next !== title) onRename(pageId, next);
	}

	function applyImageUrl() {
		data.imageUrl = imageUrlDraft.trim();
		saveData();
	}

	function onImageFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const result = String(reader.result ?? '');
			if (result.length > 4_000_000) {
				alert('Image too large for localStorage (>~3MB). Drop it in static/images/ and reference /images/foo.jpg instead.');
				return;
			}
			data.imageUrl = result;
			imageUrlDraft = result;
			saveData();
		};
		reader.readAsDataURL(file);
	}

	function clearImage() {
		data.imageUrl = '';
		imageUrlDraft = '';
		saveData();
	}
</script>

{#if presenting}
	<CustomPagePreview imageUrl={data.imageUrl} title={title} onExit={() => (presenting = false)} />
{:else}
<div class="custom-page">
	<div class="title-row">
		{#if editingTitle}
			<input
				class="title-input"
				bind:this={titleInputEl}
				bind:value={titleDraft}
				onkeydown={(e) => {
					if (e.key === 'Enter') commitTitle();
					if (e.key === 'Escape') {
						titleDraft = title;
						editingTitle = false;
					}
				}}
				onblur={commitTitle}
			/>
		{:else}
			<button
				class="title-btn"
				onclick={() => {
					titleDraft = title;
					editingTitle = true;
				}}
				title="Click to rename"
			>
				<h1>{title}</h1>
				<span class="rename-hint">✎ click to rename</span>
			</button>
		{/if}
		{#if data.imageUrl}
			<div>
				<button class="btn present" onclick={() => (presenting = true)}>⛶ Present — fullscreen image</button>
			</div>
		{/if}
	</div>

	<section class="card">
		<h2>Image</h2>
		<div class="row">
			<input
				class="text-input"
				placeholder="Paste image URL… or /images/foo.jpg"
				bind:value={imageUrlDraft}
				onkeydown={(e) => {
					if (e.key === 'Enter') applyImageUrl();
				}}
			/>
			<button class="btn" onclick={applyImageUrl}>Set</button>
		</div>
		<div class="row">
			<label class="btn file-label">
				Upload / download &amp; show…
				<input type="file" accept="image/*,video/*" hidden onchange={onImageFile} />
			</label>
			{#if data.imageUrl}
				<button class="btn ghost" onclick={clearImage}>Clear</button>
			{/if}
		</div>
		{#if data.imageUrl}
			<img class="preview" src={data.imageUrl} alt="custom page visual" />
		{:else}
			<p class="muted">No image yet. Download what you need elsewhere, then upload here — or drop files in <code>static/images/</code> and use <code>/images/name.jpg</code>.</p>
		{/if}
	</section>

	<section class="card notes">
		<h2>Script / notes</h2>
		<textarea
			class="notes-area"
			placeholder="Talking points for this screen… (autosaves)"
			bind:value={data.notes}
			oninput={saveData}
		></textarea>
	</section>
</div>
{/if}

<style>
	.custom-page {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		padding: 2.5rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}
	.title-row {
		width: 100%;
		max-width: 900px;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		align-items: center;
	}
	.title-btn {
		background: transparent;
		border: none;
		cursor: text;
		color: #e0e0e0;
	}
	.title-btn h1 {
		font-size: 2rem;
		margin: 0;
		font-weight: 700;
	}
	.rename-hint {
		font-size: 0.72rem;
		color: #555;
	}
	.title-btn:hover .rename-hint {
		color: #818cf8;
	}
	.title-input {
		font-size: 1.8rem;
		font-weight: 700;
		text-align: center;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(99, 102, 241, 0.4);
		border-radius: 10px;
		color: #fff;
		padding: 0.4rem 1rem;
		width: min(600px, 90%);
		outline: none;
	}
	.card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		padding: 1rem 1.25rem;
		width: 100%;
		max-width: 900px;
		box-sizing: border-box;
	}
	.card h2 {
		margin: 0 0 0.75rem;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #888;
	}
	.row {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.text-input {
		flex: 1;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: #ddd;
		padding: 0.5rem 0.75rem;
		font-size: 0.82rem;
		outline: none;
		min-width: 0;
	}
	.text-input:focus {
		border-color: rgba(99, 102, 241, 0.5);
	}
	.btn {
		background: rgba(99, 102, 241, 0.15);
		border: 1px solid rgba(99, 102, 241, 0.3);
		color: #a5b4fc;
		border-radius: 8px;
		padding: 0.5rem 0.9rem;
		font-size: 0.8rem;
		cursor: pointer;
		white-space: nowrap;
	}
	.btn:hover {
		background: rgba(99, 102, 241, 0.25);
	}
	.btn.ghost {
		background: transparent;
		border-color: rgba(255, 255, 255, 0.12);
		color: #888;
	}
	.btn.present {
		background: rgba(16, 185, 129, 0.15);
		border-color: rgba(16, 185, 129, 0.35);
		color: #6ee7b7;
	}
	.file-label {
		display: inline-block;
	}
	.preview {
		width: 100%;
		border-radius: 8px;
		margin-top: 0.5rem;
		max-height: 420px;
		object-fit: contain;
		background: #000;
	}
	.notes-area {
		width: 100%;
		min-height: 140px;
		box-sizing: border-box;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: #ddd;
		padding: 0.75rem;
		font-size: 0.9rem;
		line-height: 1.5;
		resize: vertical;
		outline: none;
	}
	.notes-area:focus {
		border-color: rgba(99, 102, 241, 0.5);
	}
	.muted {
		color: #666;
		font-size: 0.8rem;
		line-height: 1.5;
	}
	.muted code {
		background: rgba(255, 255, 255, 0.08);
		padding: 0.1rem 0.35rem;
		border-radius: 4px;
		font-size: 0.75rem;
	}
</style>
