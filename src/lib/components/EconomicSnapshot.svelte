<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION, baseTooltip, valueXAxis } from '$lib/echartsTheme';
	import { gdpPerCapita, povertyRate, giniIndex, populationData, gdpLatestRows, countryName } from '$lib/data';
	import { t } from '$lib/i18n/store.svelte';

	type Metric = 'gdp' | 'poverty' | 'gini' | 'population';

	let metric = $state<Metric>('gdp');

	const METRICS: { key: Metric; labelKey: string; color: string }[] = [
		{ key: 'gdp', labelKey: 'indicators.gdp', color: PALETTE.blue },
		{ key: 'poverty', labelKey: 'indicators.poverty', color: PALETTE.red },
		{ key: 'gini', labelKey: 'indicators.gini', color: PALETTE.amber },
		{ key: 'population', labelKey: 'indicators.population', color: PALETTE.green }
	];

	const metricMaps: Record<Metric, Map<string, number>> = {
		gdp: gdpPerCapita,
		poverty: povertyRate,
		gini: giniIndex,
		population: populationData
	};

	function formatVal(m: Metric, v: number): string {
		if (m === 'population') {
			if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B';
			if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
			if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
			return v.toFixed(0);
		}
		if (m === 'gdp') return '$' + v.toLocaleString(undefined, { maximumFractionDigits: 0 });
		if (m === 'gini') return v.toFixed(1);
		return v.toFixed(1) + '%';
	}

	const displayData = $derived.by(() => {
		const map = metricMaps[metric];
		const rows: { code: string; name: string; value: number }[] = [];
		for (const r of gdpLatestRows) {
			const val = map.get(r.country_code);
			if (val !== undefined && val > 0) {
				rows.push({ code: r.country_code, name: countryName(r.country_code), value: val });
			}
		}
		rows.sort((a, b) => b.value - a.value);
		return rows.slice(0, 15);
	});

	const globalStats = $derived.by(() => {
		const map = metricMaps[metric];
		const vals = Array.from(map.values()).filter((v) => v > 0);
		const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
		const sorted = [...vals].sort((a, b) => a - b);
		const median = sorted[Math.floor(sorted.length / 2)];
		return { avg, median, count: vals.length };
	});

	const option = $derived.by((): echarts.EChartsCoreOption => {
		const m = metric;
		const meta = METRICS.find((x) => x.key === m)!;
		const rows = displayData;
		const names = rows.map((d) => (d.name.length > 18 ? d.name.slice(0, 16) + '…' : d.name));
		return {
			backgroundColor: 'transparent',
			...BASE_ANIMATION,
			tooltip: baseTooltip((v) => formatVal(m, v)),
			grid: { left: 8, right: 72, top: 16, bottom: 32, containLabel: true },
			xAxis: valueXAxis(),
			yAxis: {
				type: 'category',
				data: names,
				inverse: true,
				axisLine: { lineStyle: { color: PALETTE.axisLine } },
				axisTick: { show: false },
				axisLabel: { color: PALETTE.text, fontSize: 10 }
			},
			series: [
				{
					type: 'bar',
					data: rows.map((d) => d.value),
					itemStyle: { color: meta.color, borderRadius: [0, 4, 4, 0], opacity: 0.8 },
					label: {
						show: true,
						position: 'right',
						color: '#ccc',
						fontSize: 10,
						fontWeight: 600,
						formatter: (p: { value: number }) => formatVal(m, Number(p.value))
					}
				}
			]
		};
	});
</script>

<div class="view">
	<h1 class="title">{t('views.economy.title')}</h1>
	<p class="subtitle">{t('views.economy.subtitle')}</p>

	<div class="controls">
		{#each METRICS as m}
			<button class="metric-btn" class:active={metric === m.key} onclick={() => metric = m.key} style="--c:{m.color}">
				{t(m.labelKey)}
			</button>
		{/each}
	</div>

	<div class="stats-row">
		<div class="stat">
			<span class="stat-label">{t('views.economy.statCountries')}</span>
			<span class="stat-value">{globalStats.count}</span>
		</div>
		<div class="stat">
			<span class="stat-label">{t('views.economy.statAverage')}</span>
			<span class="stat-value">{formatVal(metric, globalStats.avg)}</span>
		</div>
		<div class="stat">
			<span class="stat-label">{t('views.economy.statMedian')}</span>
			<span class="stat-value">{formatVal(metric, globalStats.median)}</span>
		</div>
	</div>

	<div class="chart-container">
		<EChart {option} />
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
		gap: 0.3rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.metric-btn {
		background: rgba(255,255,255,0.06);
		border: 1.5px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 0.35rem 0.8rem;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		color: #bbb;
		transition: all 0.15s;
	}
	.metric-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
	.metric-btn.active {
		background: color-mix(in srgb, var(--c) 20%, transparent);
		border-color: color-mix(in srgb, var(--c) 50%, transparent);
		color: var(--c);
	}
	.stats-row {
		display: flex;
		gap: 2rem;
		margin-bottom: 1rem;
	}
	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
	}
	.stat-label { font-size: 0.65rem; color: #666; text-transform: uppercase; letter-spacing: 0.05em; }
	.stat-value { font-size: 1rem; font-weight: 700; color: #e0e0e0; font-variant-numeric: tabular-nums; }
	.chart-container {
		width: 100%;
		max-width: 640px;
		height: 400px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem;
		box-sizing: border-box;
	}
</style>
