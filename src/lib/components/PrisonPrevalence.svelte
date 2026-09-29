<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION, baseTooltip, valueXAxis } from '$lib/echartsTheme';
	import prisonRaw from '../../../data/prison_adhd_studies.json';
	import { t } from '$lib/i18n/store.svelte';
	import { interpolate } from '$lib/i18n/index';

	// JSON-driven: values come from data/prison_adhd_studies.json.
	interface Study {
		name: string;
		prevalence: number;
		ci_low: number | null;
		ci_high: number | null;
		n: number;
		note: string;
	}
	const raw = prisonRaw as unknown as { general_population_pct: number; studies: Study[] };
	const studies = raw.studies;
	const generalPop = raw.general_population_pct;

	// CI whiskers only for studies that report a CI (Ginsberg has none).
	const ciData = studies
		.map((s, i) => ({ s, i }))
		.filter(({ s }) => s.ci_low !== null && s.ci_high !== null)
		.map(({ s, i }) => [s.ci_low as number, s.ci_high as number, i]);

	function renderWhisker(params: any, api: any) {
		const low = api.value(0) as number;
		const high = api.value(1) as number;
		const idx = api.value(2) as number;
		const y = api.coord([low, idx])[1] as number;
		const xLow = api.coord([low, idx])[0] as number;
		const xHigh = api.coord([high, idx])[0] as number;
		const cap = 6;
		return {
			type: 'group',
			children: [
				{ type: 'line', shape: { x1: xLow, y1: y, x2: xHigh, y2: y }, style: { stroke: '#e0e0e0', lineWidth: 2 } },
				{ type: 'line', shape: { x1: xLow, y1: y - cap, x2: xLow, y2: y + cap }, style: { stroke: '#e0e0e0', lineWidth: 2 } },
				{ type: 'line', shape: { x1: xHigh, y1: y - cap, x2: xHigh, y2: y + cap }, style: { stroke: '#e0e0e0', lineWidth: 2 } }
			]
		};
	}

	const option = $derived<echarts.EChartsCoreOption>({
		backgroundColor: 'transparent',
		...BASE_ANIMATION,
		tooltip: {
			...baseTooltip(),
			trigger: 'axis',
			axisPointer: { type: 'shadow' },
			formatter: (params: unknown) => {
				const p = (params as { dataIndex: number; marker: string }[])[0];
				const s = studies[p.dataIndex];
				const ci =
					s.ci_low !== null && s.ci_high !== null
						? interpolate(t('views.prison.tooltipCi'), { lo: s.ci_low, hi: s.ci_high })
						: t('views.prison.tooltipNoCi');
				return interpolate(t('views.prison.tooltip'), {
					name: s.name,
					marker: p.marker,
					pct: s.prevalence,
					ci,
					n: s.n.toLocaleString(),
					note: s.note
				});
			}
		},
		grid: { left: 8, right: 88, top: 32, bottom: 32, containLabel: true },
		xAxis: { ...valueXAxis(), max: 50 },
		yAxis: {
			type: 'category',
			data: studies.map((s) => s.name),
			inverse: true,
			axisLine: { lineStyle: { color: PALETTE.axisLine } },
			axisTick: { show: false },
			axisLabel: { color: PALETTE.text, fontSize: 12, fontWeight: 600 }
		},
		series: [
			{
				type: 'bar',
				data: studies.map((s) => s.prevalence),
				itemStyle: { color: PALETTE.purple, borderRadius: [0, 5, 5, 0], opacity: 0.85 },
				label: {
					show: true,
					position: 'right',
					color: PALETTE.text,
					fontWeight: 700,
					formatter: (p: any) => {
						const s = studies[p.dataIndex as number];
						return `{b|${s.prevalence}%}\n{s|${interpolate(t('views.prison.barSub'), { n: s.n.toLocaleString() })}}`;
					},
					rich: {
						b: { color: PALETTE.text, fontSize: 13, fontWeight: 700, lineHeight: 18 },
						s: { color: 'rgba(255,255,255,0.5)', fontSize: 9, lineHeight: 13 }
					}
				},
				markLine: {
					symbol: 'none',
					lineStyle: { color: PALETTE.red, type: 'dashed', width: 1.5 },
					label: {
						color: PALETTE.red,
						fontSize: 10,
						formatter: () => interpolate(t('views.prison.generalPop'), { value: generalPop })
					},
					data: [{ xAxis: generalPop }]
				}
			},
			{
				type: 'custom',
				coordinateSystem: 'cartesian2d',
				data: ciData,
				renderItem: renderWhisker,
				tooltip: { show: false },
				z: 3
			}
		]
	});
</script>

<div class="view">
	<h1 class="title">{t('views.prison.title')}</h1>
	<p class="subtitle">{t('views.prison.subtitle')}</p>

	<div class="chart-container">
		<EChart {option} />
	</div>

	<div class="cards">
		<div class="card">
			<span class="card-label">{t('views.prison.card1Label')}</span>
			<span class="card-note">{t('views.prison.card1Note')}</span>
		</div>
		<div class="card">
			<span class="card-label">{t('views.prison.card2Label')}</span>
			<span class="card-note">{t('views.prison.card2Note')}</span>
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
