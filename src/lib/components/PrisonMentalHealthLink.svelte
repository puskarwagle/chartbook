<script lang="ts">
	import { prisonData } from '$lib/data';

	const sorted = [...prisonData].sort((a, b) => b.prison_population_rate_per_100k - a.prison_population_rate_per_100k);

	const top20 = sorted.slice(0, 20);
	const maxRate = Math.max(...top20.map(r => r.prison_population_rate_per_100k), 1);
	const globalAvg = $derived.by(() => {
		const vals = prisonData.map(r => r.prison_population_rate_per_100k);
		return vals.reduce((a, b) => a + b, 0) / vals.length;
	});

	const chartW = 600;
	const chartH = 480;
	const pad = { top: 30, right: 60, bottom: 30, left: 200 };
	const barH = 18;
	const barGap = 6;

	function xPos(rate: number) {
		return pad.left + (rate / maxRate) * (chartW - pad.left - pad.right);
	}

	const avgX = $derived(xPos(globalAvg));

	function barOpacity(rate: number): number {
		return 0.4 + (rate / maxRate) * 0.6;
	}

	function formatNum(n: number): string {
		return n.toLocaleString();
	}
</script>

<div class="view">
	<h1 class="title">Prison Population & Mental Health</h1>
	<p class="subtitle">Global incarceration rates — ADHD is 4–10× overrepresented in prisons worldwide</p>

	<div class="chart-container">
		<svg viewBox="0 0 {chartW} {chartH}" width="100%" height="100%">
			<line x1={pad.left} y1={pad.top} x2={pad.left} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />
			<line x1={pad.left} y1={chartH - pad.bottom} x2={chartW - pad.right} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />

			{#each top20 as r, i}
				{@const y = pad.top + i * (barH + barGap)}
				{@const barWidth = xPos(r.prison_population_rate_per_100k) - pad.left}
				<text x={pad.left - 8} y={y + barH / 2 + 4} text-anchor="end" fill="#e0e0e0" font-size="10" font-weight="500">
					#{r.rank}
				</text>
				<rect x={pad.left} y={y} width={Math.max(barWidth, 2)} height={barH} fill="#ef4444" rx={3} opacity={barOpacity(r.prison_population_rate_per_100k)} />
				<text x={xPos(r.prison_population_rate_per_100k) + 6} y={y + barH / 2 + 4} fill="#fca5a5" font-size="10" font-weight="600">
					{r.prison_population_rate_per_100k}/100k
				</text>
				<text x={pad.left + 4} y={y + barH - 3} fill="rgba(255,255,255,0.4)" font-size="8">
					n={formatNum(r.prison_population_total)}
				</text>
			{/each}

			<line x1={avgX} y1={pad.top} x2={avgX} y2={chartH - pad.bottom} stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,3" />
			<text x={avgX} y={pad.top - 8} text-anchor="middle" fill="#f59e0b" font-size="9">Global avg: {globalAvg.toFixed(0)}/100k</text>
		</svg>
	</div>

	<div class="cards">
		<div class="card">
			<span class="card-label">ADHD prevalence in prisons: 25–40%</span>
			<span class="card-note">vs ~3.5% in general population. Up to 8× overrepresentation across studies.</span>
		</div>
		<div class="card">
			<span class="card-label">Only 7% had childhood diagnosis</span>
			<span class="card-note">Most ADHD prisoners were never identified or treated — a systemic failure of screening and support.</span>
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
	.chart-container {
		width: 100%;
		max-width: 640px;
		height: 500px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem;
		box-sizing: border-box;
	}
	.cards {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
		max-width: 640px;
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
