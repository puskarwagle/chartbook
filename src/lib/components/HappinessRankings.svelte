<script lang="ts">
	import { happinessYears, happinessForYear } from '$lib/data';

	let selectedYear = $state(Math.max(...happinessYears));

	const yearData = $derived(happinessForYear(selectedYear).slice(0, 20));

	const factors = [
		{ key: 'gdp', label: 'GDP', color: '#3b82f6' },
		{ key: 'social', label: 'Social Support', color: '#8b5cf6' },
		{ key: 'health', label: 'Health', color: '#10b981' },
		{ key: 'freedom', label: 'Freedom', color: '#f59e0b' },
		{ key: 'generosity', label: 'Generosity', color: '#ef4444' },
		{ key: 'corruption', label: 'Corruption', color: '#06b6d4' },
		{ key: 'dystopia', label: 'Dystopia', color: '#6b7280' }
	] as const;

	const maxScore = Math.max(...yearData.map(r => r.score), 1);

	const barW = 500;
	const barH = 22;
	const barGap = 6;
	const labelW = 140;
	const chartW = barW + labelW + 80;
	const chartH = yearData.length * (barH + barGap) + 40;
	const pad = { top: 20, right: 20, bottom: 20, left: 0 };

	function segmentWidth(val: number, total: number) {
		return (val / total) * barW * (total / maxScore);
	}
</script>

<div class="view">
	<h1 class="title">World Happiness Report</h1>
	<p class="subtitle">Top 20 countries — factor contributions to life evaluation ({selectedYear})</p>

	<div class="year-controls">
		{#each happinessYears as y}
			<button class="year-btn" class:active={selectedYear === y} onclick={() => selectedYear = y}>{y}</button>
		{/each}
	</div>

	<div class="chart-container" style="height:{chartH}px">
		<svg viewBox="0 0 {chartW} {chartH}" width="100%" height="100%">
			{#each yearData as r, i}
				{@const y = pad.top + i * (barH + barGap)}
				<text x={labelW - 8} y={y + barH / 2 + 4} text-anchor="end" fill="#e0e0e0" font-size="10.5" font-weight="500">
					{r.country.length > 16 ? r.country.slice(0, 14) + '…' : r.country}
				</text>
				<text x={labelW - 28} y={y + barH / 2 + 4} text-anchor="end" fill="#555" font-size="9">
					{r.rank}
				</text>

				{@const totalVal = r.gdp + r.social + r.health + r.freedom + r.generosity + r.corruption + r.dystopia}
				{@const scaleX = barW / maxScore}

				<rect x={labelW} y={y} width={Math.max(r.gdp * scaleX, 0)} height={barH} fill="#3b82f6" rx={i === 0 ? 4 : 0} opacity={0.85} />
				<rect x={labelW + r.gdp * scaleX} y={y} width={Math.max(r.social * scaleX, 0)} height={barH} fill="#8b5cf6" opacity={0.85} />
				<rect x={labelW + (r.gdp + r.social) * scaleX} y={y} width={Math.max(r.health * scaleX, 0)} height={barH} fill="#10b981" opacity={0.85} />
				<rect x={labelW + (r.gdp + r.social + r.health) * scaleX} y={y} width={Math.max(r.freedom * scaleX, 0)} height={barH} fill="#f59e0b" opacity={0.85} />
				<rect x={labelW + (r.gdp + r.social + r.health + r.freedom) * scaleX} y={y} width={Math.max(r.generosity * scaleX, 0)} height={barH} fill="#ef4444" opacity={0.85} />
				<rect x={labelW + (r.gdp + r.social + r.health + r.freedom + r.generosity) * scaleX} y={y} width={Math.max(r.corruption * scaleX, 0)} height={barH} fill="#06b6d4" opacity={0.85} />
				<rect x={labelW + (r.gdp + r.social + r.health + r.freedom + r.generosity + r.corruption) * scaleX} y={y} width={Math.max(r.dystopia * scaleX, 0)} height={barH} fill="#6b7280" rx={i === 0 ? 0 : 4} opacity={0.85} />

				<text x={labelW + totalVal * scaleX + 6} y={y + barH / 2 + 4} fill="#aaa" font-size="10" font-weight="600">{r.score.toFixed(3)}</text>
			{/each}
		</svg>
	</div>

	<div class="legend">
		{#each factors as f}
			<span class="legend-item">
				<span class="dot" style="background:{f.color}"></span>
				{f.label}
			</span>
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
	.title { font-size: 1.8rem; font-weight: 700; margin: 0 0 0.25rem; color: #e0e0e0; }
	.subtitle { font-size: 0.9rem; color: #888; margin: 0 0 1rem; }
	.year-controls {
		display: flex;
		gap: 0.2rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-bottom: 1rem;
		max-width: 600px;
	}
	.year-btn {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 8px;
		padding: 0.2rem 0.5rem;
		font-size: 0.65rem;
		font-weight: 500;
		cursor: pointer;
		color: #888;
		transition: all 0.15s;
	}
	.year-btn:hover { background: rgba(255,255,255,0.08); color: #ddd; }
	.year-btn.active {
		background: rgba(139, 92, 246, 0.2);
		border-color: rgba(139, 92, 246, 0.4);
		color: #c4b5fd;
	}
	.chart-container {
		width: 100%;
		max-width: 660px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem;
		box-sizing: border-box;
		overflow-y: auto;
	}
	.legend {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 1rem;
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
