<script lang="ts">
	import { hdiData } from '$lib/data';
	import { t } from '$lib/i18n/store.svelte';

	type Tier = 'all' | 'very-high' | 'high' | 'medium' | 'low';

	let tier = $state<Tier>('all');
	let search = $state('');

	const tiers: { key: Tier; labelKey: string; color: string }[] = [
		{ key: 'all', labelKey: 'views.hdi.tierAll', color: '#e0e0e0' },
		{ key: 'very-high', labelKey: 'views.hdi.tierVeryHigh', color: '#10b981' },
		{ key: 'high', labelKey: 'views.hdi.tierHigh', color: '#3b82f6' },
		{ key: 'medium', labelKey: 'views.hdi.tierMedium', color: '#f59e0b' },
		{ key: 'low', labelKey: 'views.hdi.tierLow', color: '#ef4444' }
	];

	function getTier(hdi: number): string {
		if (hdi >= 0.8) return 'very-high';
		if (hdi >= 0.55) return 'high';
		if (hdi >= 0.35) return 'medium';
		return 'low';
	}

	function getTierColor(hdi: number): string {
		if (hdi >= 0.8) return '#10b981';
		if (hdi >= 0.55) return '#3b82f6';
		if (hdi >= 0.35) return '#f59e0b';
		return '#ef4444';
	}

	const filtered = $derived(() => {
		let rows = hdiData.filter(r => r.hdi > 0);
		if (tier !== 'all') rows = rows.filter(r => getTier(r.hdi) === tier);
		if (search) rows = rows.filter(r => r.country.toLowerCase().includes(search.toLowerCase()));
		return rows.sort((a, b) => b.hdi - a.hdi).slice(0, 30);
	});

	const maxHdi = 1;
	const barW = 200;
</script>

<div class="view">
	<h1 class="title">{t('views.hdi.title')}</h1>
	<p class="subtitle">{t('views.hdi.subtitle')}</p>

	<div class="controls">
		<input
			type="text"
			class="search"
			placeholder={t('views.hdi.search')}
			bind:value={search}
		/>
		<div class="tier-btns">
			{#each tiers as tr}
				<button class="tier-btn" class:active={tier === tr.key} onclick={() => tier = tr.key} style="--c:{tr.color}">
					{t(tr.labelKey)}
				</button>
			{/each}
		</div>
	</div>

	<div class="chart-container">
		{#each filtered() as r}
			{@const hdiBarW = (r.hdi / maxHdi) * barW}
			{@const lifeW = (r.lifeExp / 90) * hdiBarW * 0.4}
			{@const eduW = (r.meanSchooling / 16) * hdiBarW * 0.3}
			{@const incW = hdiBarW - lifeW - eduW}
			<div class="row">
				<div class="rank">{r.rank}</div>
				<div class="label-col">
					<span class="country-name">{r.country}</span>
					<span class="country-hdi" style="color:{getTierColor(r.hdi)}">{r.hdi.toFixed(3)}</span>
				</div>
				<div class="bar-col">
					<div class="bar-track">
						<div class="bar-seg" style="width:{lifeW}px;background:#10b981"></div>
						<div class="bar-seg" style="width:{eduW}px;background:#3b82f6"></div>
						<div class="bar-seg" style="width:{Math.max(incW, 0)}px;background:#8b5cf6"></div>
					</div>
				</div>
				<div class="meta">
					<span class="meta-val">{r.lifeExp.toFixed(0)}y</span>
					<span class="meta-val">{r.meanSchooling.toFixed(0)}y</span>
					<span class="meta-val">${(r.gni / 1000).toFixed(0)}k</span>
				</div>
			</div>
		{/each}
	</div>

	<div class="legend">
		<span class="legend-item"><span class="dot" style="background:#10b981"></span> {t('indicators.lifeExpectancy')}</span>
		<span class="legend-item"><span class="dot" style="background:#3b82f6"></span> {t('views.hdi.legendEducation')}</span>
		<span class="legend-item"><span class="dot" style="background:#8b5cf6"></span> {t('views.hdi.legendIncome')}</span>
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
	.title { font-size: 1.8rem; font-weight: 700; margin: 0 0 0.25rem; color: #e0e0e0; }
	.subtitle { font-size: 0.9rem; color: #888; margin: 0 0 1rem; }
	.controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
		align-items: center;
	}
	.search {
		background: rgba(255,255,255,0.06);
		border: 1px solid rgba(255,255,255,0.12);
		border-radius: 8px;
		padding: 0.4rem 0.8rem;
		font-size: 0.8rem;
		color: #e0e0e0;
		outline: none;
		width: 200px;
	}
	.search::placeholder { color: #555; }
	.search:focus { border-color: rgba(139, 92, 246, 0.5); }
	.tier-btns { display: flex; gap: 0.25rem; }
	.tier-btn {
		background: rgba(255,255,255,0.04);
		border: 1.5px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 0.3rem 0.6rem;
		font-size: 0.7rem;
		font-weight: 500;
		cursor: pointer;
		color: #bbb;
		transition: all 0.15s;
	}
	.tier-btn:hover { background: rgba(255,255,255,0.08); }
	.tier-btn.active {
		background: color-mix(in srgb, var(--c) 20%, transparent);
		border-color: color-mix(in srgb, var(--c) 50%, transparent);
		color: var(--c);
	}
	.chart-container {
		width: 100%;
		max-width: 640px;
		max-height: 400px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0;
	}
	.rank {
		width: 28px;
		text-align: right;
		font-size: 0.7rem;
		color: #555;
		flex-shrink: 0;
	}
	.label-col {
		width: 160px;
		flex-shrink: 0;
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
	}
	.country-name {
		font-size: 0.8rem;
		font-weight: 500;
		color: #e0e0e0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.country-hdi {
		font-size: 0.7rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.bar-col {
		flex: 1;
	}
	.bar-track {
		display: flex;
		height: 14px;
		background: rgba(255,255,255,0.06);
		border-radius: 3px;
		overflow: hidden;
	}
	.bar-seg {
		height: 100%;
		opacity: 0.8;
		transition: width 0.4s ease;
	}
	.meta {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}
	.meta-val {
		font-size: 0.65rem;
		color: #666;
		font-variant-numeric: tabular-nums;
		width: 36px;
		text-align: right;
	}
	.legend {
		display: flex;
		gap: 1.5rem;
		margin-top: 0.75rem;
	}
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.7rem;
		color: #888;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 2px;
	}
</style>
