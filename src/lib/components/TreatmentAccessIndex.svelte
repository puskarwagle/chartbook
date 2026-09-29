<script lang="ts">
	import { computeTreatmentAccessIndex, countryName, iso3ToIso2 } from '$lib/data';

	type ViewMode = 'top20' | 'bottom20' | 'all';

	let mode = $state<ViewMode>('top20');

	const allData = computeTreatmentAccessIndex();

	const displayData = $derived(() => {
		if (mode === 'top20') return allData.slice(0, 20);
		if (mode === 'bottom20') return allData.slice(-20).reverse();
		return allData;
	});

	const maxScore = 100;

	function barColor(score: number): string {
		const t = score / 100;
		const r = Math.round(220 - t * 200);
		const g = Math.round(50 + t * 150);
		const b = Math.round(50 + t * 100);
		return `rgb(${r}, ${g}, ${b})`;
	}
</script>

<div class="view">
	<h1 class="title">Treatment Access Index</h1>
	<p class="subtitle">Composite of healthcare spending, government effectiveness, and HDI</p>

	<div class="controls">
		<button class="mode-btn" class:active={mode === 'top20'} onclick={() => mode = 'top20'}>Top 20</button>
		<button class="mode-btn" class:active={mode === 'bottom20'} onclick={() => mode = 'bottom20'}>Bottom 20</button>
		<button class="mode-btn" class:active={mode === 'all'} onclick={() => mode = 'all'}>All</button>
	</div>

	<div class="chart-container" class:scrollable={mode === 'all'}>
		{#each displayData() as d, i}
			{@const iso2 = iso3ToIso2(d.country_code)}
			{@const name = countryName(d.country_code)}
			<div class="row">
				<div class="rank">{mode === 'all' ? i + 1 : (mode === 'top20' ? i + 1 : allData.length - i)}</div>
				<div class="flag">
					{#if iso2}
						<img src="https://flagcdn.com/24x18/{iso2.toLowerCase()}.png" alt={name} width="24" height="18" loading="lazy" />
					{/if}
				</div>
				<div class="label-col">
					<span class="country-name">{name}</span>
				</div>
				<div class="bar-col">
					<div class="bar-track">
						<div class="bar-fill" style="width:{d.score}%;background:{barColor(d.score)}"></div>
					</div>
					<span class="bar-value">{d.score.toFixed(1)}</span>
				</div>
			</div>
		{/each}
	</div>

	<div class="cards">
		<div class="card">
			<span class="card-label">Treatment access depends on infrastructure</span>
			<span class="card-note">ADHD diagnosis and treatment require healthcare spending and good health outcomes — both captured in this composite of health expenditure % GDP and life expectancy.</span>
		</div>
		<div class="card">
			<span class="card-label">Low-income countries face barriers</span>
			<span class="card-note">Countries scoring lowest have underfunded health systems and weak governance, making ADHD treatment nearly unavailable.</span>
		</div>
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
	.subtitle { font-size: 0.9rem; color: #888; margin: 0 0 1.5rem; }
	.controls {
		display: flex;
		gap: 0.3rem;
		margin-bottom: 1rem;
	}
	.mode-btn {
		background: rgba(255,255,255,0.06);
		border: 1.5px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 0.4rem 0.9rem;
		font-size: 0.78rem;
		font-weight: 500;
		cursor: pointer;
		color: #bbb;
		transition: all 0.15s;
	}
	.mode-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
	.mode-btn.active {
		background: rgba(16, 185, 129, 0.15);
		border-color: rgba(16, 185, 129, 0.3);
		color: #10b981;
	}
	.chart-container {
		width: 100%;
		max-width: 620px;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.chart-container.scrollable {
		max-height: 400px;
		overflow-y: auto;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3rem 0;
	}
	.rank {
		width: 24px;
		text-align: right;
		font-size: 0.7rem;
		color: #555;
		font-variant-numeric: tabular-nums;
		flex-shrink: 0;
	}
	.flag {
		width: 24px;
		height: 18px;
		flex-shrink: 0;
	}
	.label-col {
		width: 140px;
		flex-shrink: 0;
	}
	.country-name {
		font-size: 0.82rem;
		font-weight: 500;
		color: #e0e0e0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.bar-col {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.bar-track {
		flex: 1;
		height: 18px;
		background: rgba(255,255,255,0.06);
		border-radius: 4px;
		overflow: hidden;
	}
	.bar-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.5s ease;
	}
	.bar-value {
		font-size: 0.75rem;
		font-weight: 600;
		color: #aaa;
		min-width: 36px;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.cards {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
		max-width: 620px;
		width: 100%;
	}
	.card {
		flex: 1;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.card-label { font-size: 0.9rem; font-weight: 600; color: #e0e0e0; }
	.card-note { font-size: 0.75rem; color: #888; line-height: 1.4; }
</style>
