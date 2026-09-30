<script lang="ts">
	// CustomPagePreview — fullscreen image view inside the normal dashboard
	// content area. For screen recording: edit the page, then hit Present.
	let {
		imageUrl,
		title,
		onExit
	}: {
		imageUrl: string;
		title: string;
		onExit: () => void;
	} = $props();

	let container: HTMLDivElement | null = null;

	function toggleBrowserFullscreen() {
		try {
			if (document.fullscreenElement) void document.exitFullscreen();
			else void container?.requestFullscreen();
		} catch { /* fullscreen not available — ignore */ }
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') onExit();
	}
</script>

<svelte:window on:keydown={onKey} />

<div class="preview" bind:this={container}>
	<div class="bar">
		<span class="title">{title}</span>
		<div class="spacer"></div>
		<button class="btn" onclick={toggleBrowserFullscreen} title="Browser fullscreen">⛶ Fullscreen</button>
		<button class="btn" onclick={onExit} title="Back to edit">✕ Exit (Esc)</button>
	</div>
	<div class="stage">
		{#if imageUrl}
			<img src={imageUrl} alt={title} />
		{:else}
			<p class="muted">No image yet — exit and add one.</p>
		{/if}
	</div>
</div>

<style>
	.preview {
		width: 100%;
		height: 100%;
		background: #000;
		display: flex;
		flex-direction: column;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: rgba(15, 15, 30, 0.9);
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
	}
	.title {
		font-size: 0.85rem;
		font-weight: 600;
		color: #ddd;
	}
	.spacer {
		flex: 1;
	}
	.btn {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: #ccc;
		border-radius: 8px;
		padding: 0.35rem 0.7rem;
		font-size: 0.78rem;
		cursor: pointer;
	}
	.btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}
	.stage {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		min-height: 0;
	}
	.stage img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
	.muted {
		color: #666;
	}
</style>
