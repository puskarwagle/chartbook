<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION, baseTooltip, valueXAxis } from '$lib/echartsTheme';
	import comorbiditiesRaw from '../../../data/comorbidities.json';
	import { t } from '$lib/i18n/store.svelte';
	import { interpolate } from '$lib/i18n/index';

	// JSON-driven: values come from data/comorbidities.json (Ginsberg 2010).
	const raw = comorbiditiesRaw as unknown as {
		study: { n_confirmed_adhd: number; n_assessed: number; n_screened: number };
		comorbidities: { name: string; percent: number }[];
	};
	const items = raw.comorbidities;

	const option = $derived<echarts.EChartsCoreOption>({
		backgroundColor: 'transparent',
		...BASE_ANIMATION,
		tooltip: baseTooltip((v) => interpolate(t('views.comorbid.tooltip'), { value: v })),
		grid: { left: 8, right: 64, top: 16, bottom: 32, containLabel: true },
		xAxis: { ...valueXAxis(), max: 100 },
		yAxis: {
			type: 'category',
			data: items.map((c) => c.name),
			inverse: true,
			axisLine: { lineStyle: { color: PALETTE.axisLine } },
			axisTick: { show: false },
			axisLabel: { color: PALETTE.text, fontSize: 11.5 }
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
					formatter: (p: { value: number }) => `${p.value}%`
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
