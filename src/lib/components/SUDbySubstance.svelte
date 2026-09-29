<script lang="ts">
	const substances = [
		{ name: 'Alcohol', percent: 25, ciLow: 18.5, ciHigh: 33.6, nStudies: 7 },
		{ name: 'Cocaine', percent: 19, ciLow: 10.6, ciHigh: 31.0, nStudies: 7 },
		{ name: 'Opioid', percent: 18, ciLow: 7.8, ciHigh: 35.1, nStudies: 3 }
	];

	const overall = { percent: 21, ciLow: 17.4, ciHigh: 25.5 };
	const chartW = 560;
	const chartH = 260;
	const pad = { top: 40, right: 40, bottom: 50, left: 60 };
	const maxVal = 40;

	function xPos(val: number) {
		return pad.left + (val / maxVal) * (chartW - pad.left - pad.right);
	}
</script>

<div class="view">
	<h1 class="title">ADHD in Substance Use Disorder</h1>
	<p class="subtitle">Prevalence of comorbid ADHD by substance type (Rohner 2023)</p>

	<div class="chart-container">
		<svg viewBox="0 0 {chartW} {chartH}" width="100%" height="100%">
			<line x1={pad.left} y1={pad.top} x2={pad.left} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />
			<line x1={pad.left} y1={chartH - pad.bottom} x2={chartW - pad.right} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />

			{#each [0, 10, 20, 30, 40] as t}
				<line x1={xPos(t)} y1={pad.top} x2={xPos(t)} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.04)" />
				<text x={xPos(t)} y={chartH - pad.bottom + 18} text-anchor="middle" fill="#888" font-size="11">{t}%</text>
			{/each}

			<line x1={xPos(overall.percent)} y1={pad.top} x2={xPos(overall.percent)} y2={chartH - pad.bottom} stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5,3" />
			<text x={xPos(overall.percent)} y={pad.top - 12} text-anchor="middle" fill="#3b82f6" font-size="10" font-weight="600">Overall: {overall.percent}%</text>

			{#each substances as s, i}
				{@const barX = pad.left}
				{@const barW = xPos(s.percent) - pad.left}
				{@const barY = pad.top + i * 70}
				{@const ciX1 = xPos(s.ciLow)}
				{@const ciX2 = xPos(s.ciHigh)}
				{@const midY = barY + 24}

				<text x={pad.left - 10} y={barY + 16} text-anchor="end" fill="#e0e0e0" font-size="13" font-weight="600">{s.name}</text>
				<rect x={barX} y={barY + 24} width={Math.max(barW, 2)} height={36} fill="#f59e0b" rx={5} opacity={0.8} />
				<line x1={ciX1} y1={midY} x2={ciX2} y2={midY} stroke="#e0e0e0" stroke-width="2" />
				<line x1={ciX1} y1={midY - 7} x2={ciX1} y2={midY + 7} stroke="#e0e0e0" stroke-width="2" />
				<line x1={ciX2} y1={midY - 7} x2={ciX2} y2={midY + 7} stroke="#e0e0e0" stroke-width="2" />
				<text x={xPos(s.percent) + 10} y={midY + 5} fill="#e0e0e0" font-size="13" font-weight="700">{s.percent}%</text>
				<text x={xPos(s.percent) + 10} y={midY + 20} fill="#888" font-size="9">n={s.nStudies} studies</text>
			{/each}
		</svg>
	</div>

	<div class="cards">
		<div class="card">
			<span class="card-label">~1 in 5 SUD patients have ADHD</span>
			<span class="card-note">Rohner 2023 — n=12,524 across 31 studies</span>
		</div>
		<div class="card">
			<span class="card-label">Alcohol highest at 25%</span>
			<span class="card-note">Cocaine 19%, Opioid 18% — wide CIs due to small n</span>
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
	.subtitle { font-size: 0.9rem; color: #888; margin: 0 0 2rem; }
	.chart-container {
		width: 100%;
		max-width: 620px;
		height: 320px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1.5rem;
		box-sizing: border-box;
	}
	.cards { display: flex; gap: 1rem; margin-top: 1.5rem; max-width: 620px; width: 100%; }
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
	.card-label { font-size: 0.95rem; font-weight: 600; color: #e0e0e0; }
	.card-note { font-size: 0.75rem; color: #888; }
</style>
