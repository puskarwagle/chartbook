<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION, baseTooltip, valueXAxis } from '$lib/echartsTheme';
	import comorbiditiesRaw from '../../../data/comorbidities.json';
	import { t, currentLocale } from '$lib/i18n/store.svelte';
	import { interpolate, getViewInfo } from '$lib/i18n/index';
	import RichText from './RichText.svelte';

	// JSON-driven: values come from data/comorbidities.json (Ginsberg 2010).
	const raw = comorbiditiesRaw as unknown as {
		study: { n_confirmed_adhd: number; n_assessed: number; n_screened: number };
		comorbidities: { name: string; percent: number; count: number; n_total: number }[];
	};
	const items = raw.comorbidities;

	// Personality-disorder subtypes (e.g. "Antisocial PD") are counted inside the
	// "Personality Disorders" parent bar — indent them so the nesting reads correctly.
	// Matched structurally (ends with " PD") rather than by hardcoded English names
	// so a JSON category rename doesn't silently break the indentation.
	const isPdSubset = (name: string) => name.endsWith(' PD');

	const yAxisLabel = {
		color: PALETTE.text,
		fontSize: 11.5,
		formatter: (name: string) => (isPdSubset(name) ? `↳ ${name}` : name)
	};

	const howToRead = $derived(getViewInfo('comorbid', currentLocale())?.howToRead ?? '');

	const option = $derived<echarts.EChartsCoreOption>({
		backgroundColor: 'transparent',
		...BASE_ANIMATION,
		tooltip: baseTooltip((v) => interpolate(t('views.comorbid.tooltip'), { value: v })),
		grid: { left: 8, right: 64, top: 16, bottom: 32, containLabel: true },
		xAxis: {
			...valueXAxis(),
			max: 100,
			name: t('views.comorbid.axisX'),
			nameLocation: 'middle',
			nameGap: 30,
			nameTextStyle: { color: PALETTE.muted, fontSize: 11 }
		},
		yAxis: {
			type: 'category',
			data: items.map((c) => c.name),
			inverse: true,
			axisLine: { lineStyle: { color: PALETTE.axisLine } },
			axisTick: { show: false },
			axisLabel: yAxisLabel
		},
		series: [
			{
				type: 'bar',
				data: items.map((c) => c.percent),
				itemStyle: {
					borderRadius: [0, 4, 4, 0],
					color: (p: { value: number }) => {
						const alpha = 0.3 + (Number(p.value) / 100) * 0.7;
						return `rgba(139, 92, 246, ${alpha.toFixed(2)})`;
					}
				},
				label: {
					show: true,
					position: 'right',
					color: PALETTE.text,
					fontWeight: 700,
					formatter: (p: { value: number; dataIndex: number }) => {
						const item = items[p.dataIndex as number];
						return `{b|${p.value}%}\n{s|${interpolate(t('views.comorbid.countLabel'), { count: item.count.toLocaleString(), total: item.n_total.toLocaleString() })}}`;
					},
					rich: {
						b: { color: PALETTE.text, fontSize: 13, fontWeight: 700, lineHeight: 18 },
						s: { color: 'rgba(255,255,255,0.5)', fontSize: 10, lineHeight: 14 }
					}
				}
		}
	],
		// Narrow screens: truncate long condition names (full name stays in the tooltip)
		// and hide the x-axis tick numbers (each bar carries its own value).
		media: [
			{
				query: { maxWidth: 560 },
				option: {
					yAxis: {
						axisLabel: { ...yAxisLabel, overflow: 'truncate', width: 110 }
					},
					xAxis: {
						axisLabel: { show: false }
					}
				}
			}
		]
	});

	const note = $derived(
		interpolate(t('views.comorbid.note'), {
			confirmed: raw.study.n_confirmed_adhd,
			assessed: raw.study.n_assessed,
			screened: raw.study.n_screened
		})
	);
</script>

<div class="view">
	<h1 class="title">{t('views.comorbid.title')}</h1>
	<p class="subtitle">{t('views.comorbid.subtitle')}</p>
	<p class="sowhat"><RichText text={t('views.comorbid.sowhat')} /></p>
	<p class="howtoread">
		<span class="howtoread-label">{t('common.howToRead')}: </span><RichText text={howToRead} />
	</p>

	<div class="chart-container">
		<EChart {option} height="300px" />
		<p class="note">{note}</p>
	</div>

	<div class="card">
		<span class="card-label">{t('views.comorbid.cardLabel')}</span>
		<span class="card-note">{t('views.comorbid.cardNote')}</span>
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
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1.5rem;
		box-sizing: border-box;
	}
	.note { font-size: 0.75rem; color: #666; margin: 0.75rem 0 0; text-align: center; }
	.card {
		margin-top: 1.5rem;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		max-width: 620px;
		width: 100%;
		box-sizing: border-box;
	}
	.card-label { font-size: 1rem; font-weight: 600; color: #e0e0e0; }
	.card-note { font-size: 0.8rem; color: #888; }
</style>
