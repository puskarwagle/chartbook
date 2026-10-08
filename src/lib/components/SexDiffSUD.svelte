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
	import sudBySexRaw from '../../../data/sud_by_sex.json';
	import { t, currentLocale } from '$lib/i18n/store.svelte';
	import { interpolate, getViewInfo } from '$lib/i18n/index';
	import RichText from './RichText.svelte';

	// JSON-driven: values come from data/sud_by_sex.json (Moldekleiv 2025).
	interface Category {
		name: string;
		male_pct: number;
		female_pct: number;
		hr_male: number;
		hr_female: number;
	}
	const raw = sudBySexRaw as unknown as {
		cohort: { n_males: number; n_females: number };
		categories: Category[];
	};
	const categories = raw.categories;
	const hrByName = new Map(categories.map((c) => [c.name, c]));

	const howToRead = $derived(getViewInfo('sudsex', currentLocale())?.howToRead ?? '');

	const hrText = (hr: { hr_male: number; hr_female: number }) =>
		interpolate(t('views.sudsex.tooltipHr'), { male: hr.hr_male, female: hr.hr_female });

	const option = $derived<echarts.EChartsCoreOption>({
		backgroundColor: 'transparent',
		...BASE_ANIMATION,
		tooltip: {
			...baseTooltip((v) => `${v}%`),
			formatter: (params: unknown) => {
				const rows = params as { seriesName: string; value: number; marker: string }[];
				const name = (params as { name?: string }[])[0]?.name ?? rows[0]?.seriesName ?? '';
				const hr = hrByName.get(String(name));
				let html = `<b>${name}</b>`;
				for (const r of rows) {
					html += `<br/>${r.marker} ${r.seriesName}: <b>${r.value}%</b>`;
				}
				if (hr) html += `<br/><span style="color:#888">${hrText(hr)}</span>`;
				return html;
			}
		},
		legend: legendBottom([t('common.males'), t('common.females')]),
		grid: { left: 48, right: 24, top: 32, bottom: 72 },
		xAxis: {
			...categoryXAxis(categories.map((c) => c.name)),
			axisLabel: {
				color: PALETTE.text,
				fontSize: 11,
				formatter: (name: string) => {
					const hr = hrByName.get(name);
					return `{name|${name}}\n{hr|${hr ? hrText(hr) : ''}}`;
				},
				rich: {
					name: { color: PALETTE.text, fontSize: 11, lineHeight: 18 },
					hr: { color: PALETTE.muted, fontSize: 9, lineHeight: 14 }
				}
			}
		},
		yAxis: { ...valueYAxis('%'), max: 14 },
		series: [
			barSeries(t('common.males'), categories.map((c) => c.male_pct), PALETTE.blue, (v) => `${v}%`),
			barSeries(t('common.females'), categories.map((c) => c.female_pct), '#ec4899', (v) => `${v}%`)
		]
	});

	const cohortMales = $derived(
		interpolate(t('views.sudsex.cohortLabel'), { sex: t('common.males'), n: raw.cohort.n_males.toLocaleString() })
	);
	const cohortFemales = $derived(
		interpolate(t('views.sudsex.cohortLabel'), { sex: t('common.females'), n: raw.cohort.n_females.toLocaleString() })
	);
</script>

<div class="view">
	<h1 class="title">{t('views.sudsex.title')}</h1>
	<p class="subtitle">{t('views.sudsex.subtitle')}</p>
	<p class="sowhat"><RichText text={t('views.sudsex.sowhat')} /></p>
	<p class="howtoread">
		<span class="howtoread-label">{t('common.howToRead')}: </span><RichText text={howToRead} />
	</p>

	<div class="chart-container">
		<EChart {option} />
		<p class="chart-note">{t('views.sudsex.chartNote')}</p>
	</div>

	<div class="legend">
		<div class="legend-item">
			<div class="legend-dot" style="background:#3b82f6"></div>
			<span>{cohortMales}</span>
		</div>
		<div class="legend-item">
			<div class="legend-dot" style="background:#ec4899"></div>
			<span>{cohortFemales}</span>
		</div>
	</div>

	<div class="card">
		<span class="card-label">{t('views.sudsex.cardLabel')}</span>
		<span class="card-note">{t('views.sudsex.cardNote')}</span>
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
		height: 360px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
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
	.legend { display: flex; gap: 1.5rem; margin-top: 1rem; }
	.legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: #aaa; }
	.legend-dot { width: 12px; height: 12px; border-radius: 3px; }
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
