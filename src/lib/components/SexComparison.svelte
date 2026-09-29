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
	import { t } from '$lib/i18n/store.svelte';
	import { interpolate } from '$lib/i18n/index';

	// JSON-driven: values come from data/adolescents_young_adults_10_24.json (by_sex),
	// not hardcoded. Edit the JSON and this chart updates.
	const bySex = (adolescentsRaw as unknown as Record<string, Record<string, Record<string, number>>>).by_sex;
	const source = (adolescentsRaw as unknown as Record<string, string>).source;
	const sexData = [
		{
			sexKey: 'male' as const,
			prevalence: bySex.male.prevalence_rate_2021_per_100k,
			incidence: bySex.male.incidence_rate_2021_per_100k
		},
		{
			sexKey: 'female' as const,
			prevalence: bySex.female.prevalence_rate_2021_per_100k,
			incidence: bySex.female.incidence_rate_2021_per_100k
		}
	];

	const sexLabel = (key: 'male' | 'female') => t(`common.${key}`);

	const option = $derived<echarts.EChartsCoreOption>({
		backgroundColor: 'transparent',
		...BASE_ANIMATION,
		tooltip: baseTooltip((v) => interpolate(t('views.sex.tooltip'), { value: v.toLocaleString() })),
		legend: legendBottom([t('views.sex.legendPrevalence'), t('views.sex.legendIncidence')]),
		grid: { left: 64, right: 56, top: 32, bottom: 56 },
		xAxis: categoryXAxis(sexData.map((d) => sexLabel(d.sexKey))),
		yAxis: [
			valueYAxis(t('views.sex.axisPrevalence')),
			{
				...valueYAxis(t('views.sex.axisIncidence')),
				position: 'right',
				axisLabel: { color: PALETTE.green }
			}
		],
		series: [
			barSeries(t('views.sex.legendPrevalence'), sexData.map((d) => d.prevalence), PALETTE.blue, (v) =>
				v.toFixed(0)
			),
			barSeries(
				t('views.sex.legendIncidence'),
				sexData.map((d) => d.incidence),
				PALETTE.green,
				(v) => v.toFixed(1),
				1
			)
		]
	});

	const cardNote = $derived(
		interpolate(t('views.sex.cardNote'), {
			male: sexData[0].prevalence.toLocaleString(),
			female: sexData[1].prevalence.toLocaleString(),
			source
		})
	);
</script>

<div class="view">
	<h1 class="title">{t('views.sex.title')}</h1>
	<p class="subtitle">
		{t('views.sex.subtitle')}
	</p>

	<div class="chart-container">
		<EChart {option} />
	</div>

	<div class="card">
		<span class="card-label">{t('views.sex.cardLabel')}</span>
		<span class="card-note">{cardNote}</span>
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
	.title {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		color: #e0e0e0;
	}
	.subtitle {
		font-size: 0.9rem;
		color: #888;
		margin: 0 0 2rem;
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
