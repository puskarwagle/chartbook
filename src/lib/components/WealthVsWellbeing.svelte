<script lang="ts">
	import { happinessData, happinessYears, happinessForYear, gdpPerCapita, giniIndex, countryNameToCode3 } from '$lib/data';

	let selectedYear = $state(Math.max(...happinessYears));
	let showTrend = $state(true);
	let hovered = $state<number | null>(null);

	const chartW = 600;
	const chartH = 400;
	const pad = { top: 30, right: 30, bottom: 50, left: 60 };

	const yearData = $derived(happinessForYear(selectedYear));

	const joinedData = $derived.by(() => {
		const result: { country: string; gdp: number; score: number; gini: number | null }[] = [];
		for (const row of yearData) {

			const code3 = countryNameToCode3(row.country);
			if (!code3) continue;
			const gdp = gdpPerCapita.get(code3);
			const gini = giniIndex.get(code3);
			if (gdp && gdp > 0) {
				result.push({ country: row.country, gdp, score: row.score, gini: gini ?? null });
			}
		}
		return result;
	});

	const xMin = 500;
	const xMax = 100000;
	const yMin = 2;
	const yMax = 9;

	function xPos(gdp: number) {
		const logMin = Math.log10(xMin);
		const logMax = Math.log10(xMax);
		const logVal = Math.log10(Math.max(gdp, xMin));
		return pad.left + ((logVal - logMin) / (logMax - logMin)) * (chartW - pad.left - pad.right);
	}

	function yPos(score: number) {
		return pad.top + (1 - (score - yMin) / (yMax - yMin)) * (chartH - pad.top - pad.bottom);
	}

	const xTicks = [1000, 5000, 10000, 50000, 100000];

	const trendLine = $derived.by(() => {
		if (!showTrend || joinedData.length < 3) return null;
		const data = joinedData;
		const n = data.length;
		let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
		for (const d of data) {
			const lx = Math.log10(d.gdp);
			sumX += lx; sumY += d.score; sumXY += lx * d.score; sumX2 += lx * lx;
		}
		const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
		const intercept = (sumY - slope * sumX) / n;
		const x1 = Math.log10(xMin);
		const x2 = Math.log10(xMax);
		return { x1: xPos(xMin), y1: yPos(slope * x1 + intercept), x2: xPos(xMax), y2: yPos(slope * x2 + intercept) };
	});

	function giniColor(gini: number | null): string {
		if (gini === null) return '#6b7280';
		const t = Math.min(1, Math.max(0, (gini - 25) / 45));
		const r = Math.round(16 + t * 220);
		const g = Math.round(185 - t * 150);
		const b = Math.round(129 - t * 90);
		return `rgb(${r}, ${g}, ${b})`;
	}

	const outliers = $derived.by(() => {
		const data = joinedData;
		if (data.length === 0) return [];
		const sorted = [...data].sort((a, b) => b.score - a.score);
		const top3 = sorted.slice(0, 3).map(d => d.country);
		const bottom3 = sorted.slice(-3).map(d => d.country);
		return [...top3, ...bottom3];
	});
</script>

<div class="view">
	<h1 class="title">Wealth & Wellbeing</h1>
	<p class="subtitle">GDP per capita vs happiness score ({selectedYear}) — color = Gini inequality index</p>

	<div class="chart-container">
		<svg viewBox="0 0 {chartW} {chartH}" width="100%" height="100%">
			{#each xTicks as t}
				<line x1={xPos(t)} y1={pad.top} x2={xPos(t)} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.06)" />
				<text x={xPos(t)} y={chartH - pad.bottom + 18} text-anchor="middle" fill="#888" font-size="10">
					{t >= 1000 ? `$${t / 1000}k` : `$${t}`}
				</text>
			{/each}
			{#each [3, 4, 5, 6, 7, 8] as t}
				<line x1={pad.left} y1={yPos(t)} x2={chartW - pad.right} y2={yPos(t)} stroke="rgba(255,255,255,0.06)" />
				<text x={pad.left - 10} y={yPos(t) + 4} text-anchor="end" fill="#888" font-size="11">{t}</text>
			{/each}

			<line x1={pad.left} y1={chartH - pad.bottom} x2={chartW - pad.right} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.15)" />
			<line x1={pad.left} y1={pad.top} x2={pad.left} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.15)" />

			<text x={chartW / 2} y={chartH - 4} text-anchor="middle" fill="#888" font-size="11">GDP per capita (log scale)</text>
			<text x={14} y={chartH / 2} text-anchor="middle" fill="#888" font-size="11" transform="rotate(-90, 14, {chartH / 2})">Happiness score</text>

			{#if trendLine}
				<line
					x1={trendLine.x1} y1={trendLine.y1}
					x2={trendLine.x2} y2={trendLine.y2}
					stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="6,4"
				/>
			{/if}

			{#each joinedData as d, i}
				<circle
					cx={xPos(d.gdp)}
					cy={yPos(d.score)}
					r={hovered === i ? 7 : 5}
					fill={giniColor(d.gini)}
					opacity={hovered === i ? 1 : 0.8}
					stroke={hovered === i ? '#fff' : 'none'}
					stroke-width={1}
					role="button"
					tabindex="0"
					aria-label="{d.country}: happiness {d.score}"
					onmouseenter={() => hovered = i}
					onmouseleave={() => hovered = null}
					onfocus={() => hovered = i}
					onblur={() => hovered = null}
					class="dot"
				/>
				{#if outliers.includes(d.country)}
					<text x={xPos(d.gdp) + 8} y={yPos(d.score) + 4} fill="#ccc" font-size="9" font-weight="500">{d.country}</text>
				{/if}
			{/each}
		</svg>
	</div>

	<div class="legend">
		<span class="legend-label">Low inequality (Gini 25)</span>
		<div class="legend-bar"></div>
		<span class="legend-label">High inequality (Gini 70)</span>
	</div>

	<div class="card">
		<span class="card-label">ADHD outcomes improve with economic resources</span>
		<span class="card-note">But inequality matters as much as wealth — high-GDP + high-Gini countries show worse mental health outcomes. Treatment access correlates with both GDP and low inequality.</span>
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
	.chart-container {
		width: 100%;
		max-width: 640px;
		height: 420px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem;
		box-sizing: border-box;
	}
	.dot { cursor: pointer; transition: r 0.15s, opacity 0.15s; }
	.legend {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}
	.legend-label { font-size: 0.7rem; color: #666; }
	.legend-bar {
		width: 120px;
		height: 8px;
		border-radius: 4px;
		background: linear-gradient(90deg, rgb(16, 185, 129), rgb(236, 72, 153));
	}
	.card {
		margin-top: 1.25rem;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-width: 640px;
		width: 100%;
		box-sizing: border-box;
	}
	.card-label { font-size: 1rem; font-weight: 600; color: #e0e0e0; }
	.card-note { font-size: 0.8rem; color: #888; line-height: 1.4; }
</style>
