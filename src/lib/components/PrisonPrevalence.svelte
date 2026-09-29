<script lang="ts">
	const studies = [
		{
			name: 'Fazel 2024',
			prevalence: 8.3,
			ciLow: 3.8,
			ciHigh: 12.8,
			n: 3919,
			note: 'Unselected adults, random sampling'
		},
		{
			name: 'Young 2014',
			prevalence: 25.5,
			ciLow: 20.0,
			ciHigh: 32.4,
			n: 26641,
			note: 'All ages, diagnostic interview'
		},
		{
			name: 'Ginsberg 2010',
			prevalence: 40.0,
			ciLow: null,
			ciHigh: null,
			n: 30,
			note: 'Long-term male inmates, high-security'
		}
	];

	const generalPop = 3.5;
	const maxVal = 50;
	const chartW = 560;
	const chartH = 280;
	const pad = { top: 30, right: 40, bottom: 60, left: 140 };
	const barH = 44;
	const gap = 20;

	function xPos(val: number) {
		return pad.left + (val / maxVal) * (chartW - pad.left - pad.right);
	}
</script>

<div class="view">
	<h1 class="title">ADHD in Prison Populations</h1>
	<p class="subtitle">Prevalence across meta-analyses vs general population</p>

	<div class="chart-container">
		<svg viewBox="0 0 {chartW} {chartH}" width="100%" height="100%">
			<line x1={pad.left} y1={pad.top} x2={pad.left} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />
			<line x1={pad.left} y1={chartH - pad.bottom} x2={chartW - pad.right} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.12)" />

			{#each [0, 10, 20, 30, 40, 50] as t}
				<line x1={xPos(t)} y1={pad.top} x2={xPos(t)} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.04)" />
				<text x={xPos(t)} y={chartH - pad.bottom + 18} text-anchor="middle" fill="#888" font-size="11">{t}%</text>
			{/each}

			<line x1={xPos(generalPop)} y1={pad.top} x2={xPos(generalPop)} y2={chartH - pad.bottom} stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3" />
			<text x={xPos(generalPop)} y={pad.top - 8} text-anchor="middle" fill="#ef4444" font-size="10">General pop ~3.5%</text>

			{#each studies as s, i}
				{@const y = pad.top + i * (barH + gap)}
				{@const barWidth = xPos(s.prevalence) - pad.left}
				<text x={pad.left - 8} y={y + barH / 2 + 4} text-anchor="end" fill="#e0e0e0" font-size="12" font-weight="600">{s.name}</text>
				<rect x={pad.left} y={y} width={barWidth} height={barH} fill="#8b5cf6" rx={5} opacity={0.85} />
				{#if s.ciLow !== null && s.ciHigh !== null}
					<line x1={xPos(s.ciLow)} y1={y + barH / 2} x2={xPos(s.ciHigh)} y2={y + barH / 2} stroke="#e0e0e0" stroke-width="2" />
					<line x1={xPos(s.ciLow)} y1={y + barH / 2 - 6} x2={xPos(s.ciLow)} y2={y + barH / 2 + 6} stroke="#e0e0e0" stroke-width="2" />
					<line x1={xPos(s.ciHigh)} y1={y + barH / 2 - 6} x2={xPos(s.ciHigh)} y2={y + barH / 2 + 6} stroke="#e0e0e0" stroke-width="2" />
				{/if}
				<text x={xPos(s.prevalence) + 8} y={y + barH / 2 + 5} fill="#e0e0e0" font-size="13" font-weight="700">{s.prevalence}%</text>
				<text x={pad.left + 6} y={y + barH - 4} fill="rgba(255,255,255,0.5)" font-size="9">n = {s.n.toLocaleString()}</text>
			{/each}
		</svg>
	</div>

	<div class="cards">
		<div class="card">
			<span class="card-label">1 in 12 prisoners (random sampling)</span>
			<span class="card-note">Fazel 2024 — corrected for selection bias</span>
		</div>
		<div class="card">
			<span class="card-label">Up to 8x overrepresentation</span>
			<span class="card-note">Ginsberg 2010 — 40% in long-term male inmates</span>
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
		padding: 1rem;
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
