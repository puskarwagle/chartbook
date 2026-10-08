<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION, baseTooltip, valueXAxis } from '$lib/echartsTheme';
	import sudRaw from '../../../data/sud_by_substance.json';
	import { t, currentLocale } from '$lib/i18n/store.svelte';
	import { interpolate, getViewInfo } from '$lib/i18n/index';
	import RichText from './RichText.svelte';

	// JSON-driven: values come from data/sud_by_substance.json (Rohner 2023).
	interface Substance {
		name: string;
		percent: number;
		ci_low: number;
		ci_high: number;
		n_studies: number;
	}
	const raw = sudRaw as unknown as {
		meta_analysis: { n_patients: number; n_studies: number };
		overall: { percent: number; ci_low: number; ci_high: number };
		substances: Substance[];
	};
	const substances = raw.substances;
	const overall = raw.overall;

	const howToRead = $derived(getViewInfo('sud', currentLocale())?.howToRead ?? '');

	// CI whiskers rendered as a custom series (horizontal line + caps).
	const ciData = substances.map((s, i) => [s.ci_low, s.ci_high, i]);

	function renderWhisker(
		_params: unknown,
		api: { value: (idx: number) => number; coord: (pt: [number, number]) => [number, number] }
	) {
		const low = api.value(0) as number;
		const high = api.value(1) as number;
		const idx = api.value(2) as number;
		const y = api.coord([low, idx])[1] as number;
		const xLow = api.coord([low, idx])[0] as number;
		const xHigh = api.coord([high, idx])[0] as number;
		const cap = 7;
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
				const s = substances[p.dataIndex];
				return interpolate(t('views.sud.tooltip'), {
					name: s.name,
					marker: p.marker,
					pct: s.percent,
					lo: s.ci_low,
					hi: s.ci_high,
					n: s.n_studies
				});
			}
		},
		grid: { left: 8, right: 88, top: 32, bottom: 32, containLabel: true },
		xAxis: {
			...valueXAxis(),
			max: 40,
			name: t('views.sud.axisX'),
			nameLocation: 'middle',
			nameGap: 30,
			nameTextStyle: { color: PALETTE.muted, fontSize: 11 }
		},
		yAxis: {
			type: 'category',
			data: substances.map((s) => s.name),
			inverse: true,
			axisLine: { lineStyle: { color: PALETTE.axisLine } },
			axisTick: { show: false },
			axisLabel: { color: PALETTE.text, fontSize: 13, fontWeight: 600 }
		},
		series: [
			{
				type: 'bar',
				data: substances.map((s) => s.percent),
				itemStyle: { color: PALETTE.amber, borderRadius: [0, 5, 5, 0], opacity: 0.8 },
				label: {
					show: true,
					position: 'right',
					color: PALETTE.text,
					fontWeight: 700,
					formatter: (p: { dataIndex: number }) => {
						const s = substances[p.dataIndex as number];
						return `{b|${s.percent}%}\n{s|${interpolate(t('views.sud.barSub'), { n: s.n_studies })}}`;
					},
					rich: {
						b: { color: PALETTE.text, fontSize: 13, fontWeight: 700, lineHeight: 18 },
						s: { color: PALETTE.muted, fontSize: 9, lineHeight: 13 }
					}
				},
				markLine: {
					symbol: 'none',
					lineStyle: { color: PALETTE.blue, type: 'dashed', width: 1.5 },
					label: {
						color: PALETTE.blue,
						fontSize: 10,
						fontWeight: 600,
						formatter: () => interpolate(t('views.sud.overall'), { value: overall.percent })
					},
					data: [{ xAxis: overall.percent }]
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
		],
		// Narrow screens: truncate long substance names (full name stays in the tooltip)
		// and hide the x-axis tick numbers (each bar carries its own value).
		media: [
			{
				query: { maxWidth: 560 },
				option: {
					yAxis: {
						axisLabel: { overflow: 'truncate', width: 110 }
					},
					xAxis: {
						axisLabel: { show: false }
					}
				}
			}
		]
	});

	const card1Note = $derived(
		interpolate(t('views.sud.card1Note'), {
			patients: raw.meta_analysis.n_patients.toLocaleString(),
			studies: raw.meta_analysis.n_studies
		})
	);

	// Headline "1 in N", computed from the pooled rate so it can't go stale.
	const title = $derived(
		interpolate(t('views.sud.title'), { n: Math.round(100 / overall.percent) })
	);
</script>

<div class="view">
	<h1 class="title">{title}</h1>
	<p class="subtitle">{t('views.sud.subtitle')}</p>
	<p class="sowhat"><RichText text={t('views.sud.sowhat')} /></p>
	<p class="howtoread">
		<span class="howtoread-label">{t('common.howToRead')}: </span><RichText text={howToRead} />
	</p>

	<div class="chart-container">
		<EChart {option} />
	</div>

	<div class="cards">
		<div class="card">
			<span class="card-label">{t('views.sud.card1Label')}</span>
			<span class="card-note">{card1Note}</span>
		</div>
		<div class="card">
			<span class="card-label">{t('views.sud.card2Label')}</span>
			<span class="card-note">{t('views.sud.card2Note')}</span>
		</div>
	</div>
</div>

<style>
	.view {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 2rem;
		box-sizing: border-box;
	}
	/* Safe centering: content is vertically centered when it fits, and
	   top-aligned with a working scrollbar when it overflows. Plain
	   justify-content:center clips the top unreachable when overflowing. */
	.view > :first-child {
		margin-top: auto;
	}
	.view > :last-child {
		margin-bottom: auto;
	}
	.title { font-size: 1.8rem; font-weight: 700; margin: 0 0 0.25rem; color: #e0e0e0; }
	.subtitle { font-size: 0.9rem; color: #888; margin: 0 0 0.75rem; }
	.sowhat {
		font-size: 0.95rem;
		color: #c9c9c9;
		margin: 0 0 0.4rem;
		max-width: 640px;
		text-align: center;
	}
	.howtoread {
		font-size: 0.8rem;
		color: #888;
		margin: 0 0 1.25rem;
		max-width: 640px;
		text-align: center;
	}
	.howtoread-label {
		font-weight: 600;
		color: #aaa;
	}
	.chart-container {
		width: 100%;
		max-width: 620px;
		height: 320px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1.5rem;
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
