<script lang="ts">
	import { gdpPerCapita, povertyRate, giniIndex, populationData, gdpLatestRows, countryName } from '$lib/data';

	type Metric = 'gdp' | 'poverty' | 'gini' | 'population';

	let metric = $state<Metric>('gdp');

	const METRICS: { key: Metric; label: string; unit: string; color: string }[] = [
		{ key: 'gdp', label: 'GDP per Capita', unit: 'USD', color: '#3b82f6' },
		{ key: 'poverty', label: 'Poverty Rate', unit: '% below $2.15/day', color: '#ef4444' },
		{ key: 'gini', label: 'Inequality (Gini)', unit: '0–100', color: '#f59e0b' },
		{ key: 'population', label: 'Population', unit: 'total', color: '#10b981' }
	];

	const metricMaps: Record<Metric, Map<string, number>> = {
		gdp: gdpPerCapita,
		poverty: povertyRate,
		gini: giniIndex,
		population: populationData
	};

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

	const maxValue = $derived(Math.max(...displayData.map(r => r.value), 1));

	const globalStats = $derived.by(() => {
		const map = metricMaps[metric];
		const vals = Array.from(map.values()).filter(v => v > 0);
		const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
		const sorted = [...vals].sort((a, b) => a - b);
		const median = sorted[Math.floor(sorted.length / 2)];
		return { avg, median, count: vals.length };
	});

	const chartW = 600;
	const chartH = 380;
	const pad = { top: 30, right: 80, bottom: 30, left: 150 };
	const barH = 18;
	const barGap = 6;

	function xPos(val: number) {
		return pad.left + (val / maxValue) * (chartW - pad.left - pad.right);
	}

	function formatVal(v: number): string {
		if (metric === 'population') {
			if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B';
			if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
			if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
			return v.toFixed(0);
		}
		if (metric === 'gdp') return '$' + v.toLocaleString(undefined, { maximumFractionDigits: 0 });
		return v.toFixed(1) + '%';
	}

	function barColor(val: number): string {
		const t = val / maxValue;
		const meta = METRICS.find(m => m.key === metric)!;
		return meta.color;
	}
</script>

<div class="view">
	<h1 class="title">Economic Overview</h1>
	<p class="subtitle">Global economic indicators — latest available data by country</p>

	<div class="controls">
		{#each METRICS as m}
			<button class="metric-btn" class:active={metric === m.key} onclick={() => metric = m.key} style="--c:{m.color}">
				{m.label}
			</button>
		{/each}
	</div>

	<div class="stats-row">
		<div class="stat">
			<span class="stat-label">Countries</span>
			<span class="stat-value">{globalStats.count}</span>
		</div>
		<div class="stat">
			<span class="stat-label">Global Average</span>
			<span class="stat-value">{formatVal(globalStats.avg)}</span>
		</div>
		<div class="stat">
			<span class="stat-label">Median</span>
			<span class="stat-value">{formatVal(globalStats.median)}</span>
		</div>
	</div>

	<div class="chart-container">
		<svg viewBox="0 0 {chartW} {chartH}" width="100%" height="100%">
			<line x1={pad.left} y1={pad.top} x2={pad.left} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />
			<line x1={pad.left} y1={chartH - pad.bottom} x2={chartW - pad.right} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />

			{#each displayData as d, i}
				{@const y = pad.top + i * (barH + barGap)}
				{@const barWidth = xPos(d.value) - pad.left}
				<text x={pad.left - 8} y={y + barH / 2 + 4} text-anchor="end" fill="#e0e0e0" font-size="10" font-weight="500">
					{d.name.length > 18 ? d.name.slice(0, 16) + '…' : d.name}
				</text>
				<rect x={pad.left} y={y} width={Math.max(barWidth, 2)} height={barH} fill={barColor(d.value)} rx={4} opacity={0.8} />
				<text x={xPos(d.value) + 6} y={y + barH / 2 + 4} fill="#ccc" font-size="9.5" font-weight="600">
					{formatVal(d.value)}
				</text>
			{/each}
		</svg>
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
