<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import {
		PALETTE,
		BASE_ANIMATION,
		baseTooltip,
		categoryXAxis,
		valueYAxis,
		legendBottom,
		barSeries
	} from '$lib/echartsTheme';
	import adolescentsRaw from '../../../data/adolescents_young_adults_10_24.json';
	import { t, currentLocale } from '$lib/i18n/store.svelte';
	import { interpolate, getViewInfo } from '$lib/i18n/index';
	import RichText from './RichText.svelte';

	// JSON-driven: values come from data/adolescents_young_adults_10_24.json (by_age_group).
	const byAge = (
		adolescentsRaw as unknown as Record<string, Record<string, Record<string, number>>>
	).by_age_group;
	const ageData = [
		{
			group: '10–14',
			prevalence: byAge['10_to_14'].prevalence_rate_2021_per_100k,
			incidence: byAge['10_to_14'].incidence_rate_2021_per_100k ?? 0
		},
		{ group: '15–19', prevalence: byAge['15_to_19'].prevalence_rate_2021_per_100k, incidence: 0 },
		{ group: '20–24', prevalence: byAge['20_to_24'].prevalence_rate_2021_per_100k, incidence: 0 }
	];

	const howToRead = $derived(getViewInfo('age', currentLocale())?.howToRead ?? '');

	// Scale key for narrow screens, where the green axis labels are hidden.
	const chartNote = $derived(
		interpolate(t('views.age.chartNote'), {
			max: Math.max(...ageData.map((d) => d.incidence)).toFixed(0)
		})
	);

	const option = $derived<echarts.EChartsCoreOption>({
		backgroundColor: 'transparent',
		...BASE_ANIMATION,
		tooltip: baseTooltip((v) => interpolate(t('views.age.tooltip'), { value: v.toLocaleString() })),
		legend: legendBottom([t('views.age.legendPrevalence'), t('views.age.legendIncidence')]),
		grid: { left: 64, right: 56, top: 32, bottom: 56 },
		xAxis: categoryXAxis(ageData.map((d) => d.group)),
		yAxis: [
			valueYAxis(t('views.age.axisPrevalence')),
			{
				...valueYAxis(t('views.age.axisIncidence')),
				position: 'right',
				axisLabel: { color: PALETTE.green }
			}
		],
		series: [
			barSeries(t('views.age.legendPrevalence'), ageData.map((d) => d.prevalence), PALETTE.blue, (v) =>
				v.toFixed(0)
			),
			barSeries(
				t('views.age.legendIncidence'),
				ageData.map((d) => d.incidence),
				PALETTE.green,
				(v) => v.toFixed(v > 0 ? 2 : 0),
				1
			)
		],
		// Narrow screens: hide the axis titles and the green (incidence)
		// tick labels — the legend still says which color is which.
		// Bar values stay in tooltips. Legend wraps above the plot so it
		// can't cover the category labels or the tick labels.
		media: [
			{
				query: { maxWidth: 560 },
				option: {
					grid: { top: 84, bottom: 56 },
					legend: { top: 6, bottom: 'auto' },
					xAxis: { axisLabel: { interval: 0 } },
					yAxis: [
						{ name: '', splitNumber: 3 },
						{ name: '', axisLabel: { show: false } }
					],
					series: [{ label: { show: false } }, { label: { show: false } }]
				}
			}
		]
	});
</script>

<div class="view">
	<h1 class="title">{t('views.age.title')}</h1>
	<p class="subtitle">{t('views.age.subtitle')}</p>
	<p class="sowhat"><RichText text={t('views.age.sowhat')} /></p>
	<p class="howtoread">
		<span class="howtoread-label">{t('common.howToRead')}: </span><RichText text={howToRead} />
	</p>

	<div class="chart-container">
		<EChart {option} />
		<p class="chart-note">{chartNote}</p>
	</div>

	<div class="card">
		<span class="card-label">{t('views.age.cardLabel')}</span>
		<span class="card-note">{t('views.age.cardNote')}</span>
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
	.title {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		color: #e0e0e0;
	}
	.subtitle {
		font-size: 0.9rem;
		color: #888;
		margin: 0 0 0.75rem;
	}
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
		max-width: 600px;
		height: 350px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		padding: 1.5rem;
		box-sizing: border-box;
	}
	.chart-note {
		font-size: 0.72rem;
		color: #777;
		margin: 0.4rem 0 0;
		text-align: center;
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
