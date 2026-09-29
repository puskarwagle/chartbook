<script lang="ts">
	import { BarChart } from 'layerchart';

	const sexData = [
		{ sex: 'Male', prevalence: 3072.73, incidence: 16.91 },
		{ sex: 'Female', prevalence: 1228.19, incidence: 6.61 }
	];
</script>

<div class="view">
	<h1 class="title">ADHD by Sex</h1>
	<p class="subtitle">Global prevalence & incidence rates per 100k (ages 10–24, 2021)</p>

	<div class="chart-container">
		<BarChart
			data={sexData}
			x="sex"
			y="prevalence"
			orientation="vertical"
			grid={true}
			axis={true}
			tooltipContext={{ mode: 'band' }}
			series={[
				{ key: 'prevalence', label: 'Prevalence (per 100k)', value: 'prevalence' },
				{ key: 'incidence', label: 'Incidence (per 100k)', value: 'incidence' }
			]}
			seriesLayout="group"
		>
			{#snippet marks({ context })}
				{@const barGroups = context.data ?? []}
				{#each barGroups as d, i}
					{@const x = context.xScale?.(d.sex) ?? 0}
					{@const groupWidth = context.xScale?.bandwidth?.() ?? 80}
					{@const seriesCount = 2}
					{@const barWidth = groupWidth / seriesCount - 4}
					{@const prevY = context.yScale?.(d.prevalence) ?? 0}
					{@const prevHeight = (context.height ?? 400) - prevY}
					{@const incY = context.yScale?.(d.incidence) ?? 0}
					{@const incHeight = (context.height ?? 400) - incY}
					<rect x={x} y={prevY} width={barWidth} height={prevHeight} fill="#3b82f6" rx={4} opacity={0.9} />
					<text x={x + barWidth / 2} y={prevY - 6} text-anchor="middle" fill="#e0e0e0" font-size="12" font-weight="600">
						{d.prevalence.toFixed(0)}
					</text>
					<rect x={x + barWidth + 4} y={incY} width={barWidth} height={incHeight} fill="#10b981" rx={4} opacity={0.9} />
					<text x={x + barWidth + 4 + barWidth / 2} y={incY - 6} text-anchor="middle" fill="#e0e0e0" font-size="12" font-weight="600">
						{d.incidence.toFixed(1)}
					</text>
				{/each}
			{/snippet}
		</BarChart>
	</div>

	<div class="legend">
		<div class="legend-item">
			<div class="legend-dot" style="background:#3b82f6"></div>
			<span>Prevalence</span>
		</div>
		<div class="legend-item">
			<div class="legend-dot" style="background:#10b981"></div>
			<span>Incidence</span>
		</div>
	</div>

	<div class="card">
		<span class="card-label">Males diagnosed 2.5x more often</span>
		<span class="card-note">Prevalence: 3,073 vs 1,228 per 100k</span>
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
		height: 350px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		padding: 1.5rem;
		box-sizing: border-box;
	}
	.legend {
		display: flex;
		gap: 1.5rem;
		margin-top: 1rem;
	}
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		color: #aaa;
	}
	.legend-dot {
		width: 12px;
		height: 12px;
		border-radius: 3px;
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
