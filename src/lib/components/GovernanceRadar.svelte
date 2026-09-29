<script lang="ts">
	import { govIndicators, govCountryNames } from '$lib/data';

	let country1 = $state('USA');
	let country2 = $state('');
	let compareMode = $state(false);

	const dimensions = [
		{ key: 'controlOfCorruption', label: 'Control of Corruption' },
		{ key: 'ruleOfLaw', label: 'Rule of Law' },
		{ key: 'govEffectiveness', label: 'Gov. Effectiveness' },
		{ key: 'regulatoryQuality', label: 'Regulatory Quality' },
		{ key: 'politicalStability', label: 'Political Stability' },
		{ key: 'voiceAccountability', label: 'Voice & Accountability' }
	] as const;

	type DimKey = typeof dimensions[number]['key'];

	const allCountryCodes = $derived(() => {
		return Array.from(govCountryNames.entries()).map(([code, name]) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name));
	});

	function getValues(code: string): number[] {
		return dimensions.map(d => {
			const map = govIndicators[d.key];
			return map.get(code) ?? 0;
		});
	}

	const chartSize = 300;
	const cx = chartSize / 2;
	const cy = chartSize / 2;
	const radius = 110;
	const levels = 5;

	function angleFor(i: number) {
		return (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
	}

	function pointFor(i: number, val: number): { x: number; y: number } {
		const angle = angleFor(i);
		const r = (val / 10) * radius;
		return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
	}

	function polygonPoints(values: number[]): string {
		return values.map((v, i) => {
			const p = pointFor(i, v);
			return `${p.x},${p.y}`;
		}).join(' ');
	}

	const values1 = $derived(getValues(country1));
	const values2 = $derived(compareMode && country2 ? getValues(country2) : null);
</script>

<div class="view">
	<h1 class="title">Governance Scores</h1>
	<p class="subtitle">World Bank Worldwide Governance Indicators (2023)</p>

	<div class="controls">
		<div class="select-group">
			<label class="select-label" for="gov-country-1">Country 1</label>
			<select id="gov-country-1" class="select" bind:value={country1}>
				{#each allCountryCodes() as c}
					<option value={c.code}>{c.name}</option>
				{/each}
			</select>
		</div>
		<button class="compare-btn" class:active={compareMode} onclick={() => compareMode = !compareMode}>
			{compareMode ? 'Comparing' : 'Compare'}
		</button>
		{#if compareMode}
			<div class="select-group">
				<label class="select-label" for="gov-country-2">Country 2</label>
				<select id="gov-country-2" class="select" bind:value={country2}>
					<option value="">Select...</option>
					{#each allCountryCodes() as c}
						<option value={c.code}>{c.name}</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>

	<div class="chart-container">
		<svg viewBox="0 0 {chartSize} {chartSize}" width="100%" height="100%">
			{#each Array.from({ length: levels }, (_, i) => i + 1) as lvl}
				<polygon
					points={polygonPoints(dimensions.map(() => (lvl / levels) * 10))}
					fill="none"
					stroke="rgba(255,255,255,0.08)"
					stroke-width="1"
				/>
			{/each}

			{#each dimensions as d, i}
				{@const p = pointFor(i, 10)}
				<line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.1)" stroke-width="1" />
				{@const labelP = pointFor(i, 11.5)}
				<text x={labelP.x} y={labelP.y} text-anchor="middle" dominant-baseline="central" fill="#aaa" font-size="8" font-weight="500">
					{d.label}
				</text>
			{/each}

			{#each [2, 4, 6, 8, 10] as lvl}
				{@const p = pointFor(0, lvl)}
				<text x={p.x + 6} y={p.y - 4} fill="#555" font-size="7">{lvl}</text>
			{/each}

			<polygon
				points={polygonPoints(values1)}
				fill="rgba(59, 130, 246, 0.2)"
				stroke="#3b82f6"
				stroke-width="2"
			/>
			{#each values1 as v, i}
				{@const p = pointFor(i, v)}
				<circle cx={p.x} cy={p.y} r="3" fill="#3b82f6" />
			{/each}

			{#if values2}
				<polygon
					points={polygonPoints(values2)}
					fill="rgba(239, 68, 68, 0.15)"
					stroke="#ef4444"
					stroke-width="2"
				/>
				{#each values2 as v, i}
					{@const p = pointFor(i, v)}
					<circle cx={p.x} cy={p.y} r="3" fill="#ef4444" />
				{/each}
			{/if}
		</svg>
	</div>

	<div class="legend">
		<span class="legend-item"><span class="dot" style="background:#3b82f6"></span> {govCountryNames.get(country1) ?? country1}</span>
		{#if compareMode && country2}
			<span class="legend-item"><span class="dot" style="background:#ef4444"></span> {govCountryNames.get(country2) ?? country2}</span>
		{/if}
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
	.controls {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.select-group { display: flex; align-items: center; gap: 0.3rem; }
	.select-label { font-size: 0.7rem; color: #888; }
	.select {
		background: rgba(255,255,255,0.06);
		border: 1px solid rgba(255,255,255,0.12);
		border-radius: 8px;
		padding: 0.35rem 0.5rem;
		font-size: 0.75rem;
		color: #e0e0e0;
		outline: none;
		cursor: pointer;
	}
	.select:focus { border-color: rgba(139, 92, 246, 0.5); }
	.compare-btn {
		background: rgba(255,255,255,0.06);
		border: 1.5px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 0.35rem 0.8rem;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		color: #bbb;
		transition: all 0.15s;
	}
	.compare-btn:hover { background: rgba(255,255,255,0.1); }
	.compare-btn.active {
		background: rgba(239, 68, 68, 0.15);
		border-color: rgba(239, 68, 68, 0.3);
		color: #fca5a5;
	}
	.chart-container {
		width: 100%;
		max-width: 400px;
		aspect-ratio: 1;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem;
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
		gap: 0.3rem;
		font-size: 0.75rem;
		color: #888;
	}
	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
</style>
