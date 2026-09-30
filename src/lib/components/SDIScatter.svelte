<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION } from '$lib/echartsTheme';
	import sdiRaw from '../../../data/sdi_regions.json';
	import { t } from '$lib/i18n/store.svelte';
	import { interpolate } from '$lib/i18n/index';

	// JSON-driven: values come from data/sdi_regions.json.
	const raw = sdiRaw as unknown as {
		regions: { region: string; sdi: number; prevalence_pct: number }[];
	};
	const sdiData = raw.regions;

	const option = $derived<echarts.EChartsCoreOption>({
		backgroundColor: 'transparent',
		...BASE_ANIMATION,
		tooltip: {
			trigger: 'item',
			formatter: (p: { dataIndex: number; value: unknown }) =>
				interpolate(t('views.sdi.tooltip'), {
					region: sdiData[p.dataIndex as number].region,
					sdi: (p.value as number[])[0],
					pct: (p.value as number[])[1]
				})
		},
		grid: { left: 56, right: 96, top: 32, bottom: 56 },
		xAxis: {
			type: 'value',
			name: t('views.sdi.axisX'),
			nameLocation: 'middle',
			nameGap: 36,
			nameTextStyle: { color: PALETTE.muted, fontSize: 12 },
			min: 0,
			max: 1,
			splitLine: { lineStyle: { color: PALETTE.grid } },
			axisLabel: { color: PALETTE.muted }
		},
		yAxis: {
			type: 'value',
			name: t('views.sdi.axisY'),
			nameTextStyle: { color: PALETTE.muted, fontSize: 12 },
			min: 0,
			max: 6,
			splitLine: { lineStyle: { color: PALETTE.grid } },
			axisLabel: { color: PALETTE.muted, formatter: '{value}%' }
		},
		series: [
			{
				type: 'scatter',
				symbolSize: 16,
				data: sdiData.map((d) => [d.sdi, d.prevalence_pct]),
				itemStyle: { color: PALETTE.blue, opacity: 0.85, borderColor: '#1a1a2e', borderWidth: 2 },
				label: {
					show: true,
					position: 'right',
					color: '#ccc',
					fontSize: 11,
					formatter: (p: { dataIndex: number }) => sdiData[p.dataIndex as number].region
				},
				emphasis: { scale: 1.4 }
			}
		]
	});
</script>

<div class="view">
	<h1 class="title">{t('views.sdi.title')}</h1>
	<p class="subtitle">{t('views.sdi.subtitle')}</p>

	<div class="chart-container">
		<EChart {option} />
	</div>

	<div class="card">
		<span class="card-label">{t('views.sdi.cardLabel')}</span>
		<span class="card-note">{t('views.sdi.cardNote')}</span>
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
		height: 400px;
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
