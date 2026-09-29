<script lang="ts">
	const categories = [
		{
			name: 'Any SUD',
			male: 11.4,
			female: 10.9,
			hrMale: 4.1,
			hrFemale: 4.5
		},
		{
			name: 'Cannabis',
			male: 6.8,
			female: 4.3,
			hrMale: 5.5,
			hrFemale: 6.5
		},
		{
			name: 'Stimulant',
			male: 3.7,
			female: 3.4,
			hrMale: 7.3,
			hrFemale: 8.0
		},
		{
			name: 'Opioid',
			male: 1.5,
			female: 1.4,
			hrMale: 7.6,
			hrFemale: 7.4
		}
	];

	const chartW = 560;
	const chartH = 300;
	const pad = { top: 40, right: 40, bottom: 50, left: 80 };
	const maxVal = 14;
	const barW = 28;
	const groupGap = 40;

	function yPos(val: number) {
		return pad.top + (1 - val / maxVal) * (chartH - pad.top - pad.bottom);
	}

	function groupX(i: number) {
		const totalW = chartW - pad.left - pad.right;
		const groupW = totalW / categories.length;
		return pad.left + i * groupW + groupW / 2;
	}
</script>

<div class="view">
	<h1 class="title">SUD in ADHD by Sex</h1>
	<p class="subtitle">Norwegian cohort, ages 18–31 (Moldekleiv 2025, n=49,815 ADHD)</p>

	<div class="chart-container">
		<svg viewBox="0 0 {chartW} {chartH}" width="100%" height="100%">
			<line x1={pad.left} y1={pad.top} x2={pad.left} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />
			<line x1={pad.left} y1={chartH - pad.bottom} x2={chartW - pad.right} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />

			{#each [0, 2, 4, 6, 8, 10, 12, 14] as t}
				<line x1={pad.left} y1={yPos(t)} x2={chartW - pad.right} y2={yPos(t)} stroke="rgba(255,255,255,0.04)" />
				<text x={pad.left - 10} y={yPos(t) + 4} text-anchor="end" fill="#888" font-size="10">{t}%</text>
			{/each}

			{#each categories as cat, i}
				{@const gx = groupX(i)}
				{@const maleY = yPos(cat.male)}
				{@const femaleY = yPos(cat.female)}
				{@const barBottom = yPos(0)}

				<rect x={gx - barW - 4} y={maleY} width={barW} height={barBottom - maleY} fill="#3b82f6" rx={4} opacity={0.85} />
				<rect x={gx + 4} y={femaleY} width={barW} height={barBottom - femaleY} fill="#ec4899" rx={4} opacity={0.85} />

				<text x={gx - barW / 2 - 4} y={maleY - 6} text-anchor="middle" fill="#3b82f6" font-size="11" font-weight="700">{cat.male}%</text>
				<text x={gx + barW / 2 + 4} y={femaleY - 6} text-anchor="middle" fill="#ec4899" font-size="11" font-weight="700">{cat.female}%</text>

				<text x={gx} y={chartH - pad.bottom + 18} text-anchor="middle" fill="#e0e0e0" font-size="11" font-weight="500">{cat.name}</text>

				<text x={gx} y={chartH - pad.bottom + 32} text-anchor="middle" fill="#888" font-size="9">HR ♂ {cat.hrMale}× / ♀ {cat.hrFemale}×</text>
			{/each}
		</svg>
	</div>

	<div class="legend">
		<div class="legend-item">
			<div class="legend-dot" style="background:#3b82f6"></div>
			<span>Males (n=31,146)</span>
		</div>
		<div class="legend-item">
			<div class="legend-dot" style="background:#ec4899"></div>
			<span>Females (n=18,669)</span>
		</div>
	</div>

	<div class="card">
		<span class="card-label">Females show higher relative risk despite lower prevalence</span>
		<span class="card-note">Stimulant SUD: HR 8.0× in females vs 7.3× in males — larger relative effect</span>
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
		height: 360px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1.5rem;
		box-sizing: border-box;
	}
	.legend { display: flex; gap: 1.5rem; margin-top: 1rem; }
	.legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: #aaa; }
	.legend-dot { width: 12px; height: 12px; border-radius: 3px; }
	.card {
		margin-top: 1.5rem;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		max-width: 620px;
		width: 100%;
		box-sizing: border-box;
	}
	.card-label { font-size: 1rem; font-weight: 600; color: #e0e0e0; }
	.card-note { font-size: 0.8rem; color: #888; }
</style>
