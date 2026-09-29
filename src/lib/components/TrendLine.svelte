<script lang="ts">
	import { t } from '$lib/i18n/store.svelte';

	const metrics = $derived([
		{
			labelKey: 'views.trends.labelPrevalence',
			start: 2382,
			end: 2173,
			change: -5.7,
			period: '1990 → 2021'
		},
		{
			labelKey: 'views.trends.labelIncidence',
			start: 12.6,
			end: 11.9,
			change: -5.7,
			period: '1990 → 2021'
		},
		{
			labelKey: 'views.trends.labelDalys',
			start: 30.3,
			end: 26.6,
			change: -12.4,
			period: '1990 → 2021'
		}
	]);
</script>

<div class="view">
	<h1 class="title">{t('views.trends.title')}</h1>
	<p class="subtitle">{t('views.trends.subtitle')}</p>

	<div class="cards">
		{#each metrics as m}
			<div class="card">
				<div class="card-header">
					<span class="card-label">{t(m.labelKey)}</span>
					<span class="card-period">{m.period}</span>
				</div>
				<div class="card-values">
					<span class="value-start">{m.start.toLocaleString()}</span>
					<span class="arrow">→</span>
					<span class="value-end">{m.end.toLocaleString()}</span>
				</div>
				<div class="card-change">
					<span class="change-badge">{m.change}%</span>
					<span class="change-label">{t('views.trends.decline')}</span>
				</div>
				<div class="card-bar-track">
					<div class="card-bar-fill" style="width:{((m.end / m.start) * 100).toFixed(1)}%"></div>
				</div>
				<span class="card-unit">{t('views.trends.unit')}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.view {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		box-sizing: border-box;
	}
	.title {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		color: #e0e0e0;
	}
	.subtitle {
		font-size: 0.9rem;
		color: #888;
		margin: 0 0 2.5rem;
	}
	.cards {
		display: flex;
		gap: 1.25rem;
		max-width: 720px;
		width: 100%;
	}
	.card {
		flex: 1;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.card-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #aaa;
	}
	.card-period {
		font-size: 0.7rem;
		color: #555;
		font-variant-numeric: tabular-nums;
	}
	.card-values {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}
	.value-start {
		font-size: 1.1rem;
		color: #888;
		font-variant-numeric: tabular-nums;
	}
	.arrow {
		font-size: 1rem;
		color: #555;
	}
	.value-end {
		font-size: 1.6rem;
		font-weight: 700;
		color: #e0e0e0;
		font-variant-numeric: tabular-nums;
	}
	.card-change {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.change-badge {
		font-size: 1.3rem;
		font-weight: 700;
		color: #10b981;
	}
	.change-label {
		font-size: 0.8rem;
		color: #10b981;
		opacity: 0.7;
	}
	.card-bar-track {
		width: 100%;
		height: 6px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 3px;
		overflow: hidden;
	}
	.card-bar-fill {
		height: 100%;
		background: #10b981;
		border-radius: 3px;
		transition: width 0.6s ease;
	}
	.card-unit {
		font-size: 0.7rem;
		color: #555;
	}
</style>
