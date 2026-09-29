<script lang="ts">
	const comorbidities = [
		{ name: 'Substance Use Disorder', percent: 100 },
		{ name: 'Personality Disorders', percent: 96 },
		{ name: 'Antisocial PD', percent: 96 },
		{ name: 'Borderline PD', percent: 74 },
		{ name: 'Mood & Anxiety', percent: 73 },
		{ name: 'Autism Spectrum', percent: 23 },
		{ name: 'Psychopathy (PCL-R ≥30)', percent: 10 }
	];

	const maxVal = 100;
	const chartW = 560;
	const chartH = 300;
	const pad = { top: 20, right: 60, bottom: 20, left: 200 };
	const barH = 32;
	const gap = 8;

	function xPos(val: number) {
		return pad.left + (val / maxVal) * (chartW - pad.left - pad.right);
	}

	function barOpacity(percent: number) {
		return 0.3 + (percent / 100) * 0.7;
	}
</script>

<div class="view">
	<h1 class="title">Comorbidities in Prison ADHD</h1>
	<p class="subtitle">Ginsberg 2010 — 30 confirmed ADHD cases, high-security Swedish prison</p>

	<div class="chart-container">
		<svg viewBox="0 0 {chartW} {chartH}" width="100%" height="100%">
			<line x1={pad.left} y1={pad.top} x2={pad.left} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />
			<line x1={pad.left} y1={chartH - pad.bottom} x2={chartW - pad.right} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />

			{#each [0, 25, 50, 75, 100] as t}
				<line x1={xPos(t)} y1={pad.top} x2={xPos(t)} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.04)" />
				<text x={xPos(t)} y={chartH - pad.bottom + 16} text-anchor="middle" fill="#888" font-size="11">{t}%</text>
			{/each}

			{#each comorbidities as c, i}
				{@const y = pad.top + i * (barH + gap)}
				{@const barWidth = xPos(c.percent) - pad.left}
				<text x={pad.left - 8} y={y + barH / 2 + 4} text-anchor="end" fill="#e0e0e0" font-size="11.5" font-weight="500">{c.name}</text>
				<rect x={pad.left} y={y} width={Math.max(barWidth, 2)} height={barH} fill="#8b5cf6" rx={4} opacity={barOpacity(c.percent)} />
				<text x={xPos(c.percent) + 8} y={y + barH / 2 + 4} fill="#e0e0e0" font-size="12" font-weight="700">{c.percent}%</text>
			{/each}
		</svg>
		<p class="note">n = 30 confirmed ADHD cases (of 34 assessed from 315 screened)</p>
	</div>

	<div class="card">
		<span class="card-label">100% had lifetime substance use disorder</span>
		<span class="card-note">Only 7% had a childhood ADHD diagnosis despite most needing services</span>
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
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1.5rem;
		box-sizing: border-box;
	}
	.note { font-size: 0.75rem; color: #666; margin: 0.75rem 0 0; text-align: center; }
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
