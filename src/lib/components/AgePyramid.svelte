<script lang="ts">
	import { BarChart } from 'layerchart';

	const ageData = [
		{ group: '10–14', prevalence: 2713.36, incidence: 33.66 },
		{ group: '15–19', prevalence: 2157.35, incidence: 0 },
		{ group: '20–24', prevalence: 1587.64, incidence: 0 }
	];
</script>

<div class="view">
	<h1 class="title">ADHD Prevalence by Age Group</h1>
	<p class="subtitle">Ages 10–24, global rates per 100k (2021)</p>

	<div class="chart-container">
		<BarChart
			data={ageData}
			x="group"
			y="prevalence"
			orientation="vertical"
			grid={true}
			axis={true}
			tooltipContext={{ mode: 'band' }}
		>
			{#snippet marks({ context })}
				{#each context.data ?? [] as d, i}
					{@const x = context.xScale?.(d.group) ?? 0}
					{@const y = context.yScale?.(d.prevalence) ?? 0}
					{@const barWidth = context.xScale?.bandwidth?.() ?? 60}
					{@const barHeight = (context.height ?? 400) - y}
					<rect
						x={x}
						y={y}
						width={barWidth}
						height={barHeight}
						fill="#3b82f6"
						rx={4}
						opacity={0.9}
					/>
					<text
						x={x + barWidth / 2}
						y={y - 8}
						text-anchor="middle"
						fill="#e0e0e0"
						font-size="13"
						font-weight="600"
					>
						{d.prevalence.toFixed(0)}
					</text>
				{/each}
			{/snippet}
		</BarChart>
	</div>

	<div class="card">
		<span class="card-label">All ADHD incidence occurs ages 10–14</span>
		<span class="card-note">Onset is before age 12 per GBD definition</span>
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
