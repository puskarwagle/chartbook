<script lang="ts">
	import { COLORS } from '$lib/colors';
	import { t } from '$lib/i18n/store.svelte';

	const events = $derived([
		{ year: 1937, label: t('views.timeline.event1937'), tier: '1' as const },
		{ year: 1955, label: t('views.timeline.event1955'), tier: '2' as const },
		{ year: 1996, label: t('views.timeline.event1996'), tier: '3' as const },
		{ year: 2002, label: t('views.timeline.event2002'), tier: '1' as const },
		{ year: 2021, label: t('views.timeline.event2021'), tier: '1' as const }
	]);

	let selected = $state<number | null>(null);
</script>

<div class="timeline-view">
	<h1 class="timeline-title">{t('views.timeline.title')}</h1>
	<p class="timeline-subtitle">{t('views.timeline.subtitle')}</p>

	<div class="timeline">
		<div class="timeline-line"></div>
		{#each events as ev, i}
			<button
				class="timeline-event"
				class:selected={selected === i}
				onclick={() => selected = selected === i ? null : i}
			>
				<div class="timeline-dot" style="background:{COLORS[ev.tier]}"></div>
				<div class="timeline-year">{ev.year}</div>
				<div class="timeline-label">{ev.label}</div>
			</button>
		{/each}
	</div>
</div>

<style>
	.timeline-view {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		box-sizing: border-box;
	}

	.timeline-title {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		color: #e0e0e0;
	}

	.timeline-subtitle {
		font-size: 0.9rem;
		color: #888;
		margin: 0 0 2.5rem;
	}

	.timeline {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0;
		width: 100%;
		max-width: 500px;
		padding-left: 2rem;
	}

	.timeline-line {
		position: absolute;
		left: 0.55rem;
		top: 0;
		bottom: 0;
		width: 2px;
		background: rgba(255, 255, 255, 0.1);
	}

	.timeline-event {
		position: relative;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 8px;
		cursor: pointer;
		text-align: left;
		color: #ccc;
		transition: all 0.15s;
	}

	.timeline-event:hover {
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.08);
	}

	.timeline-event.selected {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.12);
	}

	.timeline-dot {
		position: absolute;
		left: -1.65rem;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.timeline-year {
		font-size: 0.75rem;
		font-weight: 700;
		color: #888;
		min-width: 3rem;
		font-variant-numeric: tabular-nums;
	}

	.timeline-label {
		font-size: 0.85rem;
	}
</style>
