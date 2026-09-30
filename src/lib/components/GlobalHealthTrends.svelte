<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION } from '$lib/echartsTheme';
	import { wbTimeSeries, wbGlobalAverage, countryName, gdpLatestRows } from '$lib/data';
	import { t } from '$lib/i18n/store.svelte';

	type Indicator = 'life_expectancy' | 'infant_mortality' | 'maternal_mortality';

	const INDICATORS: { key: Indicator; labelKey: string; unitKey: string }[] = [
		{ key: 'life_expectancy', labelKey: 'indicators.lifeExpectancy', unitKey: 'views.healthtrends.unitYears' },
		{ key: 'infant_mortality', labelKey: 'indicators.infantMortality', unitKey: 'views.healthtrends.unitPer1k' },
		{ key: 'maternal_mortality', labelKey: 'indicators.maternalMortality', unitKey: 'views.healthtrends.unitPer100k' }
	];

	const LINE_COLORS = [
		PALETTE.blue, PALETTE.purple, PALETTE.green, PALETTE.amber, PALETTE.red,
		PALETTE.cyan, '#ec4899', '#f97316', '#14b8a6', '#a855f7'
	];

	let indicator = $state<Indicator>('life_expectancy');

	const topCountries = $derived(gdpLatestRows.slice(0, 10).map((r) => r.country_code));
	const globalAvg = $derived(wbGlobalAverage(indicator));

	const allSeries = $derived.by(() => {
		const series: { code: string; name: string; data: { year: number; value: number }[] }[] = [];
		for (const code of topCountries) {
			const data = wbTimeSeries(indicator, code);
			if (data.length > 0) {
				series.push({ code, name: countryName(code), data });
			}
		}
		return series;
	});

	const unit = $derived(t(INDICATORS.find((i) => i.key === indicator)?.unitKey ?? 'views.healthtrends.unitYears'));

	const option = $derived.by((): echarts.EChartsCoreOption => {
		const u = unit;
		const avgLabel = t('views.healthtrends.globalAvg');
		return {
			backgroundColor: 'transparent',
			...BASE_ANIMATION,
			tooltip: {
				trigger: 'axis',
				valueFormatter: (v: unknown) => `${Number(v).toFixed(1)} ${u}`
			},
			legend: {
				bottom: 0,
				textStyle: { color: PALETTE.muted, fontSize: 9 },
				data: [avgLabel, ...allSeries.map((s) => s.name)]
			},
			grid: { left: 56, right: 24, top: 24, bottom: 64 },
			xAxis: {
				type: 'value',
				name: t('views.healthtrends.axisYear'),
				nameLocation: 'middle',
				nameGap: 30,
				nameTextStyle: { color: PALETTE.muted },
				splitLine: { lineStyle: { color: PALETTE.grid } },
				axisLabel: { color: PALETTE.muted, formatter: (v: number) => v.toFixed(0) }
			},
			yAxis: {
				type: 'value',
				name: u,
				nameTextStyle: { color: PALETTE.muted, fontSize: 11 },
				scale: true,
				splitLine: { lineStyle: { color: PALETTE.grid } },
				axisLabel: { color: PALETTE.muted }
			},
			series: [
				{
					name: avgLabel,
					type: 'line',
					data: globalAvg.map((d) => [d.year, Number(d.value.toFixed(2))]),
					lineStyle: { color: '#fff', width: 2.5, type: 'dashed', opacity: 0.6 },
					itemStyle: { color: '#fff' },
					symbol: 'none',
					emphasis: { focus: 'series' }
				},
				...allSeries.map((s, i) => ({
					name: s.name,
					type: 'line' as const,
					data: s.data.map((d) => [d.year, Number(d.value.toFixed(2))]),
					lineStyle: { color: LINE_COLORS[i % LINE_COLORS.length], width: 1.5, opacity: 0.85 },
					itemStyle: { color: LINE_COLORS[i % LINE_COLORS.length] },
					symbol: 'none',
					emphasis: { focus: 'series' as const }
				}))
			]
		};
	});
</script>

<div class="view">
	<h1 class="title">{t('views.healthtrends.title')}</h1>
	<p class="subtitle">{t('views.healthtrends.subtitle')}</p>

	<div class="controls">
		{#each INDICATORS as ind}
			<button class="ind-btn" class:active={indicator === ind.key} onclick={() => indicator = ind.key}>
				{t(ind.labelKey)}
			</button>
		{/each}
	</div>

	<div class="chart-container">
		<EChart {option} />
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
		gap: 0.3rem;
		margin-bottom: 1rem;
	}
	.ind-btn {
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
	.ind-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
	.ind-btn.active {
		background: rgba(59, 130, 246, 0.15);
		border-color: rgba(59, 130, 246, 0.3);
		color: #60a5fa;
	}
	.chart-container {
		width: 100%;
		max-width: 640px;
		height: 400px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem;
		box-sizing: border-box;
	}
</style>
