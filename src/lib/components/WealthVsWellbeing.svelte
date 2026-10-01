<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION } from '$lib/echartsTheme';
	import { happinessYears, happinessForYear, gdpPerCapita, giniIndex, countryNameToCode3 } from '$lib/data';
	import { t } from '$lib/i18n/store.svelte';
	import { interpolate } from '$lib/i18n/index';

	let selectedYear = $state(Math.max(...happinessYears));
	let showTrend = $state(true);

	const yearData = $derived(happinessForYear(selectedYear));

	const joinedData = $derived.by(() => {
		const result: { country: string; gdp: number; score: number; gini: number | null }[] = [];
		for (const row of yearData) {
			const code3 = countryNameToCode3(row.country);
			if (!code3) continue;
			const gdp = gdpPerCapita.get(code3);
			const gini = giniIndex.get(code3);
			if (gdp && gdp > 0) {
				result.push({ country: row.country, gdp, score: row.score, gini: gini ?? null });
			}
		}
		return result;
	});

	const outliers = $derived.by(() => {
		const data = joinedData;
		if (data.length === 0) return new Set<string>();
		const sorted = [...data].sort((a, b) => b.score - a.score);
		return new Set([...sorted.slice(0, 3), ...sorted.slice(-3)].map((d) => d.country));
	});

	// OLS trend in log10(GDP) space → endpoints for an ECharts markLine.
	const trendEnds = $derived.by(() => {
		const data = joinedData;
		if (!showTrend || data.length < 3) return null;
		const n = data.length;
		let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
		for (const d of data) {
			const lx = Math.log10(d.gdp);
			sumX += lx; sumY += d.score; sumXY += lx * d.score; sumX2 += lx * lx;
		}
		const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
		const intercept = (sumY - slope * sumX) / n;
		const x1 = 500, x2 = 100000;
		return {
			x1,
			y1: slope * Math.log10(x1) + intercept,
			x2,
			y2: slope * Math.log10(x2) + intercept
		};
	});

	const option = $derived.by((): echarts.EChartsCoreOption => {
		const data = joinedData;
		const out = outliers;
		const trend = trendEnds;
		return {
			backgroundColor: 'transparent',
			...BASE_ANIMATION,
			tooltip: {
				trigger: 'item',
				formatter: (p: { dataIndex: number }) => {
					const d = data[p.dataIndex as number];
					const gini = d.gini === null ? t('views.wealth.na') : d.gini.toFixed(1);
					return interpolate(t('views.wealth.tooltip'), {
						country: d.country,
						gdp: Math.round(d.gdp).toLocaleString(),
						score: d.score.toFixed(3),
						gini
					});
				}
			},
			grid: { left: 56, right: 24, top: 30, bottom: 64 },
			xAxis: {
				type: 'log',
				name: t('views.wealth.axisX'),
				nameLocation: 'middle',
				nameGap: 36,
				nameTextStyle: { color: PALETTE.muted, fontSize: 11 },
				min: 500,
				max: 100000,
				splitLine: { lineStyle: { color: PALETTE.grid } },
				axisLabel: {
					color: PALETTE.muted,
					formatter: (v: number) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`)
				}
			},
			yAxis: {
				type: 'value',
				name: t('views.wealth.axisY'),
				nameTextStyle: { color: PALETTE.muted, fontSize: 11 },
				min: 2,
				max: 9,
				splitLine: { lineStyle: { color: PALETTE.grid } },
				axisLabel: { color: PALETTE.muted }
			},
			visualMap: {
				show: false,
				dimension: 2,
				min: 25,
				max: 70,
				inRange: { color: ['#10b981', '#ec4899'] }
			},
			series: [
				{
					type: 'scatter',
					symbolSize: 10,
					data: data.map((d) => ({
						value: [d.gdp, d.score, d.gini ?? 47.5],
						name: d.country,
						label: {
							show: out.has(d.country),
							position: 'right',
							color: '#ccc',
							fontSize: 9,
							formatter: d.country
						}
					})),
					itemStyle: { color: '#6b7280', opacity: 0.8 },
					emphasis: { scale: 1.6, itemStyle: { borderColor: '#fff', borderWidth: 1 } },
					...(trend
						? {
								markLine: {
									symbol: 'none',
									lineStyle: { color: 'rgba(255,255,255,0.35)', type: 'dashed', width: 1.5 },
									label: { show: false },
									data: [[{ coord: [trend.x1, trend.y1] }, { coord: [trend.x2, trend.y2] }]]
								}
							}
						: {})
				}
			]
		};
	});
	const subtitle = $derived(interpolate(t('views.wealth.subtitle'), { year: selectedYear }));
</script>

<div class="view">
	<h1 class="title">{t('views.wealth.title')}</h1>
	<p class="subtitle">{subtitle}</p>

	<div class="controls">
		<div class="year-controls">
			{#each happinessYears as y}
				<button class="year-btn" class:active={selectedYear === y} onclick={() => selectedYear = y}>{y}</button>
			{/each}
		</div>
		<button class="trend-btn" class:active={showTrend} onclick={() => showTrend = !showTrend}>
			{showTrend ? t('views.wealth.trendOn') : t('views.wealth.trendOff')}
		</button>
	</div>

	<div class="chart-container">
		<EChart {option} />
	</div>

	<div class="legend">
		<span class="legend-label">{t('views.wealth.legendLow')}</span>
		<div class="legend-bar"></div>
		<span class="legend-label">{t('views.wealth.legendHigh')}</span>
	</div>

	<div class="card">
		<span class="card-label">{t('views.wealth.cardLabel')}</span>
		<span class="card-note">{t('views.wealth.cardNote')}</span>
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
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.year-controls {
		display: flex;
		gap: 0.2rem;
		flex-wrap: wrap;
		justify-content: center;
		max-width: 560px;
	}
	.year-btn {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 8px;
		padding: 0.2rem 0.5rem;
		font-size: 0.65rem;
		font-weight: 500;
		cursor: pointer;
		color: #888;
		transition: all 0.15s;
	}
	.year-btn:hover { background: rgba(255,255,255,0.08); color: #ddd; }
	.year-btn.active {
		background: rgba(139, 92, 246, 0.2);
		border-color: rgba(139, 92, 246, 0.4);
		color: #c4b5fd;
	}
	.trend-btn {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 8px;
		padding: 0.2rem 0.6rem;
		font-size: 0.65rem;
		font-weight: 500;
		cursor: pointer;
		color: #888;
		transition: all 0.15s;
	}
	.trend-btn.active {
		background: rgba(59, 130, 246, 0.15);
		border-color: rgba(59, 130, 246, 0.3);
		color: #60a5fa;
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
	.legend {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}
	.legend-label { font-size: 0.7rem; color: #666; }
	.legend-bar {
		width: 120px;
		height: 8px;
		border-radius: 4px;
		background: linear-gradient(90deg, rgb(16, 185, 129), rgb(236, 72, 153));
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
