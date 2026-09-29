<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION, baseTooltip, valueXAxis } from '$lib/echartsTheme';
	import { educationData, getIncomeGroup, countryName } from '$lib/data';

	type GroupKey = 'all' | 'Low Income' | 'Lower Middle' | 'Upper Middle' | 'High Income';

	let group = $state<GroupKey>('all');
	let sortKey = $state<'ptrPrimary' | 'ptrSecondary'>('ptrPrimary');

	const GROUPS: { key: GroupKey; label: string }[] = [
		{ key: 'all', label: 'All Countries' },
		{ key: 'High Income', label: 'High Income' },
		{ key: 'Upper Middle', label: 'Upper Middle' },
		{ key: 'Lower Middle', label: 'Lower Middle' },
		{ key: 'Low Income', label: 'Low Income' }
	];

	const filteredRows = $derived.by(() => {
		const allCodes = new Set([
			...educationData.pupilTeacherPrimary.keys(),
			...educationData.pupilTeacherSecondary.keys()
		]);
		const rows: { code: string; name: string; primary: number; secondary: number }[] = [];
		for (const code of allCodes) {
			const p = educationData.pupilTeacherPrimary.get(code);
			const s = educationData.pupilTeacherSecondary.get(code);
			if (p === undefined && s === undefined) continue;
			const g = getIncomeGroup(code);
			if (group !== 'all' && g !== group) continue;
			rows.push({ code, name: countryName(code), primary: p ?? 0, secondary: s ?? 0 });
		}
		rows.sort((a, b) => (sortKey === 'ptrPrimary' ? b.primary - a.primary : b.secondary - a.secondary));
		return rows.slice(0, 20);
	});

	const option = $derived.by((): echarts.EChartsCoreOption => {
		const rows = filteredRows;
		const names = rows.map((r) => (r.name.length > 18 ? r.name.slice(0, 16) + '…' : r.name));
		return {
			backgroundColor: 'transparent',
			...BASE_ANIMATION,
			tooltip: {
				...baseTooltip((v) => `${Number(v).toFixed(1)} pupils/teacher`),
				trigger: 'axis',
				axisPointer: { type: 'shadow' }
			},
			legend: {
				bottom: 0,
				textStyle: { color: PALETTE.muted },
				data: ['Primary', 'Secondary']
			},
			grid: { left: 8, right: 48, top: 16, bottom: 56, containLabel: true },
			xAxis: valueXAxis(),
			yAxis: {
				type: 'category',
				data: names,
				inverse: true,
				axisLine: { lineStyle: { color: PALETTE.axisLine } },
				axisTick: { show: false },
				axisLabel: { color: PALETTE.text, fontSize: 10 }
			},
			series: [
				{
					name: 'Primary',
					type: 'bar',
					data: rows.map((r) => r.primary),
					itemStyle: { color: PALETTE.blue, borderRadius: [0, 4, 4, 0], opacity: 0.85 },
					label: {
						show: true,
						position: 'right',
						color: '#93c5fd',
						fontSize: 9,
						fontWeight: 600,
						formatter: (p: { value: number }) =>
							Number(p.value) > 0 ? Number(p.value).toFixed(1) : ''
					}
				},
				{
					name: 'Secondary',
					type: 'bar',
					data: rows.map((r) => r.secondary),
					itemStyle: { color: PALETTE.purple, borderRadius: [0, 4, 4, 0], opacity: 0.85 },
					label: {
						show: true,
						position: 'right',
						color: '#c4b5fd',
						fontSize: 9,
						fontWeight: 600,
						formatter: (p: { value: number }) =>
							Number(p.value) > 0 ? Number(p.value).toFixed(1) : ''
					}
				}
			]
		};
	});
</script>

<div class="view">
	<h1 class="title">Education Context</h1>
	<p class="subtitle">Pupil-teacher ratios — more students per teacher means less individual attention — ECharts</p>

	<div class="controls">
		<div class="control-group">
			{#each GROUPS as g}
				<button class="filter-btn" class:active={group === g.key} onclick={() => group = g.key}>{g.label}</button>
			{/each}
		</div>
		<div class="control-group">
			<button class="sort-btn" class:active={sortKey === 'ptrPrimary'} onclick={() => sortKey = 'ptrPrimary'}>Primary</button>
			<button class="sort-btn" class:active={sortKey === 'ptrSecondary'} onclick={() => sortKey = 'ptrSecondary'}>Secondary</button>
		</div>
	</div>

	<div class="chart-container">
		<EChart {option} />
	</div>

	<div class="card">
		<span class="card-label">High ratios = missed ADHD</span>
		<span class="card-note">In countries with 50+ pupils per teacher, individual learning differences go unnoticed. ADHD children in under-resourced schools are less likely to be identified or supported.</span>
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
	.subtitle { font-size: 0.9rem; color: #888; margin: 0 0 1rem; }
	.controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
		align-items: center;
	}
	.control-group {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.filter-btn, .sort-btn {
		background: rgba(255,255,255,0.06);
		border: 1.5px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 0.3rem 0.6rem;
		font-size: 0.7rem;
		font-weight: 500;
		cursor: pointer;
		color: #bbb;
		transition: all 0.15s;
	}
	.filter-btn:hover, .sort-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
	.filter-btn.active {
		background: rgba(59, 130, 246, 0.15);
		border-color: rgba(59, 130, 246, 0.3);
		color: #60a5fa;
	}
	.sort-btn.active {
		background: rgba(139, 92, 246, 0.15);
		border-color: rgba(139, 92, 246, 0.3);
		color: #c4b5fd;
	}
	.chart-container {
		width: 100%;
		max-width: 640px;
		height: 420px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem;
		box-sizing: border-box;
	}
	.card {
		margin-top: 1.25rem;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-width: 640px;
		width: 100%;
		box-sizing: border-box;
	}
	.card-label { font-size: 1rem; font-weight: 600; color: #e0e0e0; }
	.card-note { font-size: 0.8rem; color: #888; line-height: 1.4; }
</style>
