<script lang="ts">
	import type * as echarts from 'echarts';
	import EChart from './EChart.svelte';
	import { PALETTE, BASE_ANIMATION, baseTooltip, valueXAxis } from '$lib/echartsTheme';
	import { prisonData } from '$lib/data';
	import { t, currentLocale } from '$lib/i18n/store.svelte';
	import { interpolate, getViewInfo } from '$lib/i18n/index';
	import RichText from './RichText.svelte';

	const sorted = [...prisonData].sort(
		(a, b) => b.prison_population_rate_per_100k - a.prison_population_rate_per_100k
	);
	const top20 = sorted.slice(0, 20);
	const maxRate = Math.max(...top20.map((r) => r.prison_population_rate_per_100k), 1);

	const names = top20.map((r) => `#${r.rank}`);

	const howToRead = $derived(getViewInfo('prisonmh', currentLocale())?.howToRead ?? '');

	const option = $derived<echarts.EChartsCoreOption>({
		backgroundColor: 'transparent',
		...BASE_ANIMATION,
		tooltip: {
			...baseTooltip(),
			trigger: 'axis',
			axisPointer: { type: 'shadow' },
			formatter: (params: unknown) => {
				const p = (params as { dataIndex: number; value: number; marker: string }[])[0];
				const row = top20[p.dataIndex];
				return interpolate(t('views.prisonmh.tooltip'), {
					rank: row.rank,
					marker: p.marker,
					rate: row.prison_population_rate_per_100k,
					total: row.prison_population_total.toLocaleString()
				});
			}
		},
		grid: { left: 8, right: 72, top: 32, bottom: 32, containLabel: true },
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
				type: 'bar',
				data: top20.map((r) => r.prison_population_rate_per_100k),
				itemStyle: {
					borderRadius: [0, 4, 4, 0],
					color: (p: { value: number }) => {
						const alpha = 0.4 + (Number(p.value) / maxRate) * 0.6;
						return `rgba(239, 68, 68, ${alpha.toFixed(2)})`;
					}
				},
				label: {
					show: true,
					position: 'right',
					color: '#fca5a5',
					fontSize: 10,
					fontWeight: 600,
					formatter: (p: { value: number }) => interpolate(t('views.prisonmh.barLabel'), { value: p.value })
				}
			}
		]
	});
</script>

<div class="view">
	<h1 class="title">{t('views.prisonmh.title')}</h1>
	<p class="subtitle">{t('views.prisonmh.subtitle')}</p>
	<p class="sowhat"><RichText text={t('views.prisonmh.sowhat')} /></p>
	<p class="howtoread">
		<span class="howtoread-label">{t('common.howToRead')}: </span><RichText text={howToRead} />
	</p>

	<div class="chart-container">
		<EChart {option} />
	</div>

	<div class="cards">
		<div class="card">
			<span class="card-label">{t('views.prisonmh.card1Label')}</span>
			<span class="card-note">{t('views.prisonmh.card1Note')}</span>
		</div>
		<div class="card">
			<span class="card-label">{t('views.prisonmh.card2Label')}</span>
			<span class="card-note">{t('views.prisonmh.card2Note')}</span>
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
		margin: 0 0 1rem;
		max-width: 640px;
		text-align: center;
	}
	.howtoread-label {
		font-weight: 600;
		color: #aaa;
	}
	.chart-container {
		width: 100%;
		max-width: 640px;
		height: 500px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem;
		box-sizing: border-box;
	}
	.cards {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
		max-width: 640px;
		width: 100%;
	}
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
	.card-label { font-size: 0.9rem; font-weight: 600; color: #e0e0e0; }
	.card-note { font-size: 0.75rem; color: #888; line-height: 1.4; }
</style>
