<script lang="ts">
	import { t } from '$lib/i18n/store.svelte';
	import { interpolate } from '$lib/i18n/index';
	import adolescentsRaw from '../../../data/adolescents_young_adults_10_24.json';

	interface RegionalRates {
		prevalence_rate_per_100k: number;
		incidence_rate_per_100k?: number;
	}
	const regionalRates = (
		adolescentsRaw as unknown as { regional_2021_highest_rates: Record<string, RegionalRates> }
	).regional_2021_highest_rates;

	// Display order + labels stay in the component (presentation). The numbers
	// come from data/adolescents_young_adults_10_24.json (GBD-based) — edit
	// the JSON and this chart updates.
	const ORDER = [
		{ key: 'australasia', label: 'Australasia' },
		{ key: 'caribbean', label: 'Caribbean' },
		{ key: 'east_asia', label: 'East Asia' },
		{ key: 'high_income_north_america', label: 'N. America' }
	] as const;

	const regions = ORDER.map((o) => {
		const r = regionalRates[o.key] as RegionalRates;
		return {
			region: o.label,
			prevalence: r.prevalence_rate_per_100k,
			incidence: r.incidence_rate_per_100k ?? null
		};
	});

	const maxPrevalence = Math.max(...regions.map((r) => r.prevalence));
</script>

<div class="view">
	<h1 class="title">{t('views.region.title')}</h1>
	<p class="subtitle">{t('views.region.subtitle')}</p>

	<div class="chart">
		{#each regions as r}
			{@const pct = (r.prevalence / maxPrevalence) * 100}
			<div class="row">
				<div class="label-col">
					<span class="region-name">{r.region}</span>
					{#if r.incidence !== null}
						<span class="region-sub">{interpolate(t('views.region.incidence'), { value: r.incidence })}</span>
					{/if}
				</div>
				<div class="bar-col">
					<div class="bar-track">
						<div class="bar-fill" style="width:{pct}%"></div>
					</div>
					<span class="bar-value">{r.prevalence.toLocaleString()}</span>
				</div>
			</div>
		{/each}
	</div>

	<div class="card">
		<span class="card-label">{t('views.region.cardLabel')}</span>
		<span class="card-note">{t('views.region.cardNote')}</span>
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
	.chart {
		width: 100%;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.label-col {
		width: 140px;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		text-align: right;
		flex-shrink: 0;
	}
	.region-name {
		font-size: 0.95rem;
		font-weight: 600;
		color: #e0e0e0;
	}
	.region-sub {
		font-size: 0.7rem;
		color: #888;
	}
	.bar-col {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.bar-track {
		flex: 1;
		height: 28px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 6px;
		overflow: hidden;
	}
	.bar-fill {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #8b5cf6);
		border-radius: 6px;
		transition: width 0.6s ease;
	}
	.bar-value {
		font-size: 0.85rem;
		font-weight: 600;
		color: #ccc;
		min-width: 60px;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.card {
		margin-top: 2rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-width: 600px;
		width: 100%;
		box-sizing: border-box;
	}
	.card-label {
		font-size: 1rem;
		font-weight: 600;
		color: #e0e0e0;
	}
	.card-note {
		font-size: 0.8rem;
		color: #888;
	}
</style>
