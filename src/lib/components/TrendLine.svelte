<script lang="ts">
	import { t, currentLocale } from '$lib/i18n/store.svelte';
	import { interpolate, getViewInfo } from '$lib/i18n/index';
	import RichText from './RichText.svelte';

	const metrics = $derived([
		{
			labelKey: 'views.trends.labelPrevalence',
			start: 2382,
			end: 2173,
			period: '1990 → 2021'
		},
		{
			labelKey: 'views.trends.labelIncidence',
			start: 12.6,
			end: 11.9,
			period: '1990 → 2021'
		},
		{
			labelKey: 'views.trends.labelDalys',
			start: 30.3,
			end: 26.6,
			period: '1990 → 2021'
		}
	]);

	const howToRead = $derived(getViewInfo('trends', currentLocale())?.howToRead ?? '');

	const changeText = (m: { start: number; end: number }) =>
		(((m.end - m.start) / m.start) * 100).toFixed(1);

	const ratioText = (m: { start: number; end: number }) =>
		interpolate(t('views.trends.ratioLabel'), { pct: ((m.end / m.start) * 100).toFixed(1) });
</script>

<div class="view">
	<h1 class="title">{t('views.trends.title')}</h1>
	<p class="subtitle">{t('views.trends.subtitle')}</p>
	<p class="sowhat"><RichText text={t('views.trends.sowhat')} /></p>
	<p class="howtoread">
		<span class="howtoread-label">{t('common.howToRead')}: </span><RichText text={howToRead} />
	</p>

	<div class="cards">
		{#each metrics as m}
			<div class="card">
				<div class="card-header">
					<span class="card-label">{t(m.labelKey)}</span>
					<span class="card-period">{m.period}</span>
				</div>
				<div class="card-values">
					<span class="value-start">{m.start.toLocaleString()}</span>
					<span class="arrow">→</span>
					<span class="value-end">{m.end.toLocaleString()}</span>
				</div>
				<div class="card-change">
					<span class="change-badge">{changeText(m)}%</span>
					<span class="change-label">{t('views.trends.decline')}</span>
				</div>
			<div class="card-bar-track">
				<div class="card-bar-fill" style="width:{((m.end / m.start) * 100).toFixed(1)}%"></div>
			</div>
			<span class="card-ratio">{ratioText(m)}</span>
			<span class="card-unit">{t('views.trends.unit')}</span>
			</div>
		{/each}
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
	.cards {
		display: flex;
		gap: 1.25rem;
		max-width: 720px;
		width: 100%;
	}
	@media (max-width: 640px) {
		.cards {
			flex-direction: column;
		}
	}
	.card {
		flex: 1;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.card-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #aaa;
	}
	.card-period {
		font-size: 0.7rem;
		color: #555;
		font-variant-numeric: tabular-nums;
	}
	.card-values {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}
	.value-start {
		font-size: 1.1rem;
		color: #888;
		font-variant-numeric: tabular-nums;
	}
	.arrow {
		font-size: 1rem;
		color: #555;
	}
	.value-end {
		font-size: 1.6rem;
		font-weight: 700;
		color: #e0e0e0;
		font-variant-numeric: tabular-nums;
	}
	.card-change {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.change-badge {
		font-size: 1.3rem;
		font-weight: 700;
		color: #10b981;
	}
	.change-label {
		font-size: 0.8rem;
		color: #10b981;
		opacity: 0.7;
	}
	.card-bar-track {
		width: 100%;
		height: 6px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 3px;
		overflow: hidden;
	}
	.card-bar-fill {
		height: 100%;
		background: #10b981;
		border-radius: 3px;
		transition: width 0.6s ease;
	}
	.card-ratio {
		font-size: 0.7rem;
		color: #888;
	}
	.card-unit {
		font-size: 0.7rem;
		color: #555;
	}
</style>
