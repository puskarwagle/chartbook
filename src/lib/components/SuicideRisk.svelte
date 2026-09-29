<script lang="ts">
	const risks = [
		{
			name: 'Suicidal Ideation',
			or: 3.956,
			ciLow: 1.996,
			ciHigh: 7.841,
			nStudies: 2,
			p: '< 0.001'
		},
		{
			name: 'Suicide Death',
			or: 3.891,
			ciLow: 2.103,
			ciHigh: 7.198,
			nStudies: 2,
			p: '< 0.001'
		},
		{
			name: 'Suicide Attempt',
			or: 3.344,
			ciLow: 1.682,
			ciHigh: 6.650,
			nStudies: 6,
			p: '0.001'
		},
		{
			name: 'Overall Suicidality',
			or: 3.336,
			ciLow: 2.201,
			ciHigh: 5.057,
			nStudies: 9,
			p: '< 0.001'
		}
	];

	const maxOr = 8;

	function orWidth(or: number) {
		return (or / maxOr) * 100;
	}

	function ciWidth(ciLow: number, ciHigh: number) {
		return ((ciHigh - ciLow) / maxOr) * 100;
	}

	function ciOffset(ciLow: number) {
		return (ciLow / maxOr) * 100;
	}
</script>

<div class="view">
	<h1 class="title">ADHD & Suicide Risk</h1>
	<p class="subtitle">Odds ratios from longitudinal meta-analysis (Garas 2025)</p>

	<div class="cards">
		{#each risks as r}
			<div class="card">
				<div class="card-bar-track">
					<div class="card-bar-ci" style="left:{ciOffset(r.ciLow)}%;width:{ciWidth(r.ciLow, r.ciHigh)}%"></div>
					<div class="card-bar-or" style="width:{orWidth(r.or)}%"></div>
				</div>
				<div class="card-or">{r.or.toFixed(1)}×</div>
				<div class="card-label">higher risk of {r.name.toLowerCase()}</div>
				<div class="card-meta">95% CI [{r.ciLow.toFixed(1)}–{r.ciHigh.toFixed(1)}] · {r.nStudies} studies</div>
			</div>
		{/each}
	</div>

	<div class="summary">
		<div class="summary-card">
			<span class="summary-value">3.3×</span>
			<span class="summary-label">overall suicidality risk</span>
			<span class="summary-note">OR 3.34, 95% CI [2.20–5.06]</span>
		</div>
		<div class="summary-card">
			<span class="summary-value">140k</span>
			<span class="summary-label">ADHD youth studied</span>
			<span class="summary-note">vs 4.3M controls across 9 studies</span>
		</div>
		<div class="summary-card">
			<span class="summary-value">≥10yr</span>
			<span class="summary-label">follow-up needed</span>
			<span class="summary-note">Risk significant only with long follow-up</span>
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
	.subtitle { font-size: 0.9rem; color: #888; margin: 0 0 2.5rem; }
	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		max-width: 680px;
		width: 100%;
	}
	.card {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.card-bar-track {
		position: relative;
		width: 100%;
		height: 8px;
		background: rgba(255,255,255,0.06);
		border-radius: 4px;
		overflow: hidden;
	}
	.card-bar-ci {
		position: absolute;
		top: 0;
		height: 100%;
		background: rgba(139, 92, 246, 0.2);
		border-radius: 4px;
	}
	.card-bar-or {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: #8b5cf6;
		border-radius: 4px;
		transition: width 0.6s ease;
	}
	.card-or {
		font-size: 1.6rem;
		font-weight: 700;
		color: #e0e0e0;
	}
	.card-label {
		font-size: 0.85rem;
		color: #aaa;
	}
	.card-meta {
		font-size: 0.7rem;
		color: #555;
		font-variant-numeric: tabular-nums;
	}
	.summary {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
		max-width: 680px;
		width: 100%;
	}
	.summary-card {
		flex: 1;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
	.summary-value { font-size: 1.3rem; font-weight: 700; color: #8b5cf6; }
	.summary-label { font-size: 0.8rem; font-weight: 600; color: #aaa; }
	.summary-note { font-size: 0.7rem; color: #666; }
</style>
