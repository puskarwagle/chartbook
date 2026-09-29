<script lang="ts">
	// PageInspector — per-page gear drawer (top-right of every view).
	// Dynamic: shows current page id, JSON dump, and media (custom pages may
	// have an image; built-ins have none).
	let {
		open,
		pageId,
		title,
		isCustom,
		jsonText,
		imageUrl,
		onClose
	}: {
		open: boolean;
		pageId: string;
		title: string;
		isCustom: boolean;
		jsonText: string;
		imageUrl: string | null;
		onClose: () => void;
	} = $props();
</script>

{#if open}
	<div class="drawer" role="dialog" aria-label="Page info">
		<div class="drawer-head">
			<div>
				<div class="drawer-title">{title}</div>
				<div class="drawer-sub">{pageId} · {isCustom ? 'custom (JSON-backed)' : 'built-in component'}</div>
			</div>
			<button class="x" onclick={onClose} aria-label="Close">✕</button>
		</div>

		<h4>Media</h4>
		{#if imageUrl}
			<img class="media" src={imageUrl} alt="page media" />
		{:else}
			<p class="muted">{isCustom ? 'No image on this custom page yet — add one in edit mode.' : 'No media attached — built-in views render live charts, they have no image field.'}</p>
		{/if}

		<h4>JSON</h4>
		<pre class="json">{jsonText}</pre>
	</div>
{/if}

<style>
	.drawer {
		position: absolute;
		top: 3.25rem;
		right: 1rem;
		width: min(380px, calc(100% - 2rem));
		max-height: calc(100% - 4.5rem);
		overflow-y: auto;
		background: rgba(15, 15, 30, 0.97);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 1rem 1.1rem;
		z-index: 120;
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.55);
	}
	.drawer-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.drawer-title {
		font-weight: 700;
		font-size: 0.95rem;
	}
	.drawer-sub {
		font-size: 0.72rem;
		color: #666;
		margin-top: 0.15rem;
	}
	.x {
		background: transparent;
		border: none;
		color: #888;
		cursor: pointer;
		font-size: 0.9rem;
	}
	.x:hover {
		color: #fff;
	}
	h4 {
		margin: 0.9rem 0 0.4rem;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #777;
	}
	.muted {
		color: #666;
		font-size: 0.8rem;
		line-height: 1.5;
	}
	.media {
		width: 100%;
		border-radius: 8px;
		max-height: 220px;
		object-fit: contain;
		background: #000;
	}
	.json {
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 8px;
		padding: 0.6rem;
		font-size: 0.7rem;
		line-height: 1.5;
		color: #a5b4fc;
		white-space: pre-wrap;
		word-break: break-word;
		margin: 0;
		max-height: 300px;
		overflow-y: auto;
	}
</style>
