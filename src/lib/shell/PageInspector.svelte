<script lang="ts">
	// PageInspector — per-page gear drawer (top-right of every view).
	// Shows the "About this chart" info for the active built-in view.
	import ViewInfo from '$lib/components/ViewInfo.svelte';
	import type { ViewInfoEntry } from '$lib/viewInfo';

	let {
		open,
		title,
		sub,
		info,
		isCustom,
		onClose
	}: {
		open: boolean;
		title: string;
		sub: string;
		info: ViewInfoEntry | null;
		isCustom: boolean;
		onClose: () => void;
	} = $props();
</script>

{#if open}
	<div class="drawer" role="dialog" aria-label="Page info">
		<div class="drawer-head">
			<div>
				<div class="drawer-title">{title}</div>
				<div class="drawer-sub">{sub}</div>
			</div>
			<button class="x" onclick={onClose} aria-label="Close">✕</button>
		</div>

		{#if info}
			<ViewInfo {info} />
		{:else if isCustom}
			<p class="muted">Custom page — edit its content directly in the page. No chart info for custom pages.</p>
		{:else}
			<p class="muted">No info available for this view yet.</p>
		{/if}
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
		margin-bottom: 0.75rem;
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
	.muted {
		color: #666;
		font-size: 0.8rem;
		line-height: 1.5;
	}
	.drawer :global(.view-info) {
		margin: 0;
		max-width: none;
	}
</style>
