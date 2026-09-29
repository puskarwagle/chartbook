<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION, baseTooltip } from '$lib/echartsTheme';
	import { happinessYears, happinessForYear } from '$lib/data';

	let selectedYear = $state(Math.max(...happinessYears));

	const factors = [
		{ key: 'gdp', label: 'GDP', color: PALETTE.blue },
		{ key: 'social', label: 'Social Support', color: PALETTE.purple },
		{ key: 'health', label: 'Health', color: PALETTE.green },
		{ key: 'freedom', label: 'Freedom', color: PALETTE.amber },
		{ key: 'generosity', label: 'Generosity', color: PALETTE.red },
		{ key: 'corruption', label: 'Corruption', color: PALETTE.cyan },
		{ key: 'dystopia', label: 'Dystopia', color: PALETTE.gray }
	] as const;

	type FactorKey = (typeof factors)[number]['key'];

	const yearData = $derived(happinessForYear(selectedYear).slice(0, 20));
	const maxScore = $derived(Math.max(...yearData.map((r) => r.score), 1));

	const option = $derived.by((): echarts.EChartsCoreOption => {
		const rows = yearData;
		const names = rows.map((r) => (r.country.length > 16 ? r.country.slice(0, 14) + '…' : r.country));
		return {
			backgroundColor: 'transparent',
			...BASE_ANIMATION,
			tooltip: {
				...baseTooltip(),
				trigger: 'axis',
				axisPointer: { type: 'shadow' },
				formatter: (params: unknown) => {
					const items = params as { seriesName: string; value: number; marker: string; dataIndex: number }[];
					const row = rows[items[0]?.dataIndex];
					if (!row) return '';
					let html = `<b>#${row.rank} ${row.country}</b> — score ${row.score.toFixed(3)}`;
					for (const it of items) {
						html += `<br/>${it.marker} ${it.seriesName}: <b>${Number(it.value).toFixed(3)}</b>`;
					}
					return html;
				}
			},
			legend: {
				bottom: 0,
				textStyle: { color: PALETTE.muted, fontSize: 10 },
				data: factors.map((f) => f.label)
			},
			grid: { left: 8, right: 56, top: 16, bottom: 64, containLabel: true },
			xAxis: {
				type: 'value',
				max: Math.ceil(maxScore * 10) / 10,
				splitLine: { lineStyle: { color: PALETTE.grid } },
				axisLabel: { color: PALETTE.muted }
			},
			yAxis: {
				type: 'category',
				data: names,
				inverse: true,
				axisLine: { lineStyle: { color: PALETTE.axisLine } },
				axisTick: { show: false },
				axisLabel: { color: PALETTE.text, fontSize: 10.5 }
			},
			series: factors.map((f, fi) => ({
				name: f.label,
				type: 'bar',
				stack: 'score',
				data: rows.map((r) => Number((r[f.key as FactorKey] ?? 0).toFixed(3))),
				itemStyle: {
					color: f.color,
					opacity: 0.85,
					...(fi === 0 ? { borderRadius: [4, 0, 0, 4] } : {}),
					...(fi === factors.length - 1 ? { borderRadius: [0, 4, 4, 0] } : {})
				}
			}))
		};
	});
</script>

<div class="view">
	<h1 class="title">World Happiness Report</h1>
	<p class="subtitle">Top 20 countries — factor contributions to life evaluation ({selectedYear}) — ECharts</p>

	<div class="year-controls">
		{#each happinessYears as y}
			<button class="year-btn" class:active={selectedYear === y} onclick={() => selectedYear = y}>{y}</button>
		{/each}
	</div>

	<div class="chart-container">
		<EChart {option} />
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
		height: 560px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem;
		box-sizing: border-box;
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
