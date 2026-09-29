<script lang="ts">
	import { wbTimeSeries, wbGlobalAverage, countryName, gdpLatestRows } from '$lib/data';

	type Indicator = 'life_expectancy_wb' | 'infant_mortality' | 'maternal_mortality';

	const INDICATORS: { key: Indicator; label: string; unit: string }[] = [
		{ key: 'life_expectancy_wb', label: 'Life Expectancy', unit: 'years' },
		{ key: 'infant_mortality', label: 'Infant Mortality', unit: 'per 1k' },
		{ key: 'maternal_mortality', label: 'Maternal Mortality', unit: 'per 100k' }
	];

	let indicator = $state<Indicator>('life_expectancy_wb');

	const topCountries = $derived.by(() => {
		const rows = gdpLatestRows.slice(0, 10).map(r => r.country_code);
		return rows;
	});

	const globalAvg = $derived(wbGlobalAverage(indicator));

	const allSeries = $derived.by(() => {
		const series: { code: string; name: string; data: { year: number; value: number }[] }[] = [];
		for (const code of topCountries) {
			const data = wbTimeSeries(indicator, code);
			if (data.length > 0) {
				series.push({ code, name: countryName(code), data });
			}
		}
		return series;
	});

	const chartW = 600;
	const chartH = 380;
	const pad = { top: 20, right: 120, bottom: 40, left: 50 };

	const xRange = $derived.by(() => {
		const years = globalAvg.map(d => d.year);
		if (years.length === 0) return { min: 2000, max: 2023 };
		return { min: Math.min(...years), max: Math.max(...years) };
	});

	const yRange = $derived.by(() => {
		const allVals = [
			...globalAvg.map(d => d.value),
			...allSeries.flatMap(s => s.data.map(d => d.value))
		];
		if (allVals.length === 0) return { min: 0, max: 100 };
		return { min: Math.min(...allVals) * 0.9, max: Math.max(...allVals) * 1.1 };
	});

	function xPos(year: number) {
		const r = xRange;
		return pad.left + ((year - r.min) / (r.max - r.min || 1)) * (chartW - pad.left - pad.right);
	}

	function yPos(val: number) {
		const r = yRange;
		return pad.top + (1 - (val - r.min) / (r.max - r.min || 1)) * (chartH - pad.top - pad.bottom);
	}

	function pathD(data: { year: number; value: number }[]): string {
		return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xPos(d.year)} ${yPos(d.value)}`).join(' ');
	}

	const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#a855f7'];

	const xTicks = $derived.by(() => {
		const r = xRange;
		const step = Math.ceil((r.max - r.min) / 6);
		const ticks: number[] = [];
		for (let y = r.min; y <= r.max; y += step) ticks.push(y);
		return ticks;
	});

	const yTicks = $derived.by(() => {
		const r = yRange;
		const step = (r.max - r.min) / 5;
		const ticks: number[] = [];
		for (let v = r.min; v <= r.max; v += step) ticks.push(Math.round(v * 10) / 10);
		return ticks;
	});
</script>

<div class="view">
	<h1 class="title">Global Health Trends</h1>
	<p class="subtitle">Top 10 economies by GDP — health indicators over time</p>

	<div class="controls">
		{#each INDICATORS as ind}
			<button class="ind-btn" class:active={indicator === ind.key} onclick={() => indicator = ind.key}>
				{ind.label}
			</button>
		{/each}
	</div>

	<div class="chart-container">
		<svg viewBox="0 0 {chartW} {chartH}" width="100%" height="100%">
			{#each xTicks as t}
				<line x1={xPos(t)} y1={pad.top} x2={xPos(t)} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.06)" />
				<text x={xPos(t)} y={chartH - pad.bottom + 16} text-anchor="middle" fill="#888" font-size="10">{t}</text>
			{/each}
			{#each yTicks as t}
				<line x1={pad.left} y1={yPos(t)} x2={chartW - pad.right} y2={yPos(t)} stroke="rgba(255,255,255,0.06)" />
				<text x={pad.left - 8} y={yPos(t) + 4} text-anchor="end" fill="#888" font-size="10">{t}</text>
			{/each}

			<path d={pathD(globalAvg)} fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="6,4" opacity={0.6} />

			{#each allSeries as s, i}
				<path d={pathD(s.data)} fill="none" stroke={COLORS[i % COLORS.length]} stroke-width="1.5" opacity={0.85} />
			{/each}
		</svg>
	</div>

	<div class="legend">
		<span class="legend-item"><span class="line white dashed"></span> Global Avg</span>
		{#each allSeries as s, i}
			<span class="legend-item">
				<span class="line" style="background:{COLORS[i % COLORS.length]}"></span>
				{s.name}
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
	.controls {
		display: flex;
		gap: 0.3rem;
		margin-bottom: 1rem;
	}
	.ind-btn {
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
	.ind-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
	.ind-btn.active {
		background: rgba(59, 130, 246, 0.15);
		border-color: rgba(59, 130, 246, 0.3);
		color: #60a5fa;
	}
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
	.legend {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 0.75rem;
		max-width: 640px;
	}
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.65rem;
		color: #888;
	}
	.line {
		width: 12px;
		height: 3px;
		border-radius: 1px;
	}
	.line.white { background: #fff; }
	.line.dashed { background: none; border-top: 2px dashed rgba(255,255,255,0.6); height: 0; }
</style>
