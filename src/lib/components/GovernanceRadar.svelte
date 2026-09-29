<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION } from '$lib/echartsTheme';
	import { govIndicators, govCountryNames, govYear } from '$lib/data';

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

	type DimKey = (typeof dimensions)[number]['key'];

	const allCountryCodes = $derived(
		Array.from(govCountryNames.entries())
			.map(([code, name]) => ({ code, name }))
			.sort((a, b) => a.name.localeCompare(b.name))
	);

	function getValues(code: string): number[] {
		return dimensions.map((d) => {
			const map = govIndicators[d.key as DimKey];
			return map.get(code) ?? 0;
		});
	}

	const values1 = $derived(getValues(country1));
	const values2 = $derived(compareMode && country2 ? getValues(country2) : null);
	const name1 = $derived(govCountryNames.get(country1) ?? country1);
	const name2 = $derived(compareMode && country2 ? (govCountryNames.get(country2) ?? country2) : '');

	const option = $derived.by((): echarts.EChartsCoreOption => {
		const series: Record<string, unknown>[] = [
			{
				name: name1,
				type: 'radar',
				data: [{ value: values1, name: name1 }],
				lineStyle: { color: PALETTE.blue, width: 2 },
				itemStyle: { color: PALETTE.blue },
				areaStyle: { color: 'rgba(59, 130, 246, 0.2)' },
				symbolSize: 5
			}
		];
		if (values2 && name2) {
			series.push({
				name: name2,
				type: 'radar',
				data: [{ value: values2, name: name2 }],
				lineStyle: { color: PALETTE.red, width: 2 },
				itemStyle: { color: PALETTE.red },
				areaStyle: { color: 'rgba(239, 68, 68, 0.15)' },
				symbolSize: 5
			});
		}
		return {
			backgroundColor: 'transparent',
			...BASE_ANIMATION,
			tooltip: { trigger: 'item' },
			legend: {
				bottom: 0,
				textStyle: { color: PALETTE.muted },
				data: values2 && name2 ? [name1, name2] : [name1]
			},
			radar: {
				indicator: dimensions.map((d) => ({ name: d.label, min: -2.5, max: 2.5 })),
				axisName: { color: '#aaa', fontSize: 9 },
				splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
				splitArea: { show: false },
				axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
			},
			series
		};
	});
</script>

<div class="view">
	<h1 class="title">Governance Scores</h1>
	<p class="subtitle">World Bank Worldwide Governance Indicators ({govYear}) — ECharts</p>

	<div class="controls">
		<div class="select-group">
			<label class="select-label" for="gov-country-1">Country 1</label>
			<select id="gov-country-1" class="select" bind:value={country1}>
				{#each allCountryCodes as c}
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
					{#each allCountryCodes as c}
						<option value={c.code}>{c.name}</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>

	<div class="chart-container">
		<EChart {option} />
	</div>

	<div class="legend">
		<span class="legend-item"><span class="dot" style="background:#3b82f6"></span> {name1}</span>
		{#if compareMode && country2}
			<span class="legend-item"><span class="dot" style="background:#ef4444"></span> {name2}</span>
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
