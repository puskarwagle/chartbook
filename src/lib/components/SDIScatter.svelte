<script lang="ts">
	const sdiData = [
		{ region: 'High SDI', sdi: 0.9, prevalence: 2.88, label: 'High SDI' },
		{ region: 'High-Middle SDI', sdi: 0.7, prevalence: 2.2, label: 'High-Middle SDI' },
		{ region: 'Australasia', sdi: 0.85, prevalence: 5.37, label: 'Australasia' },
		{ region: 'Caribbean', sdi: 0.65, prevalence: 4.5, label: 'Caribbean' },
		{ region: 'East Asia', sdi: 0.72, prevalence: 3.8, label: 'East Asia' },
		{ region: 'N. Africa / ME', sdi: 0.6, prevalence: 1.8, label: 'N. Africa / ME' },
		{ region: 'South Asia', sdi: 0.5, prevalence: 1.2, label: 'South Asia' }
	];

	const maxSdi = 1;
	const maxPrev = 6;
	const chartW = 500;
	const chartH = 350;
	const pad = { top: 30, right: 30, bottom: 50, left: 60 };

	function x(sdi: number) {
		return pad.left + (sdi / maxSdi) * (chartW - pad.left - pad.right);
	}
	function y(prev: number) {
		return pad.top + (1 - prev / maxPrev) * (chartH - pad.top - pad.bottom);
	}

	const xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
	const yTicks = [0, 1, 2, 3, 4, 5, 6];
</script>

<div class="view">
	<h1 class="title">SDI vs ADHD Prevalence</h1>
	<p class="subtitle">Sociodevelopmental Index vs prevalence rate % by region (under-20, 2021)</p>

	<div class="chart-container">
		<svg viewBox="0 0 {chartW} {chartH}" width="100%" height="100%">
			{#each xTicks as t}
				<line x1={x(t)} y1={pad.top} x2={x(t)} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.06)" />
				<text x={x(t)} y={chartH - pad.bottom + 18} text-anchor="middle" fill="#888" font-size="11">{t}</text>
			{/each}
			{#each yTicks as t}
				<line x1={pad.left} y1={y(t)} x2={chartW - pad.right} y2={y(t)} stroke="rgba(255,255,255,0.06)" />
				<text x={pad.left - 10} y={y(t) + 4} text-anchor="end" fill="#888" font-size="11">{t}%</text>
			{/each}

			<line x1={pad.left} y1={chartH - pad.bottom} x2={chartW - pad.right} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.15)" stroke-width="1" />
			<line x1={pad.left} y1={pad.top} x2={pad.left} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.15)" stroke-width="1" />

			<text x={chartW / 2} y={chartH - 4} text-anchor="middle" fill="#888" font-size="12">Sociodevelopmental Index (SDI)</text>
			<text x={14} y={chartH / 2} text-anchor="middle" fill="#888" font-size="12" transform="rotate(-90, 14, {chartH / 2})">Prevalence %</text>

			{#each sdiData as d}
				<circle cx={x(d.sdi)} cy={y(d.prevalence)} r={8} fill="#3b82f6" opacity={0.85} stroke="#1a1a2e" stroke-width={2} />
				<text x={x(d.sdi) + 12} y={y(d.prevalence) + 4} fill="#ccc" font-size="11" font-weight="500">
					{d.label}
				</text>
			{/each}
		</svg>
	</div>

	<div class="card">
		<span class="card-label">Nonlinear positive correlation</span>
		<span class="card-note">Higher SDI generally correlates with higher ADHD prevalence. High SDI regions showed the greatest increases over 1990–2021.</span>
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
	.title {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		color: #e0e0e0;
	}
	.subtitle {
		font-size: 0.9rem;
		color: #888;
		margin: 0 0 2rem;
	}
	.chart-container {
		width: 100%;
		max-width: 600px;
		height: 400px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		padding: 1.5rem;
		box-sizing: border-box;
	}
	.card {
		margin-top: 1.5rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-width: 600px;
		width: 100%;
		box-sizing: border-box;
	}
	.card-label {
		font-size: 1rem;
		font-weight: 600;
		color: #e0e0e0;
	}
	.card-note {
		font-size: 0.8rem;
		color: #888;
	}
</style>
