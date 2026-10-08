<script lang="ts">
	import { t, currentLocale } from '$lib/i18n/store.svelte';
	import { interpolate, getViewInfo } from '$lib/i18n/index';
	import { formatSummaryValue, type SummaryValue } from '$lib/summaryFormat';
	import suicideRaw from '../../../data/suicide_risk_studies.json';
	import RichText from './RichText.svelte';

	interface StudyFinding {
		id: string;
		nameKey: string;
		odds_ratio: number;
		ci_low: number;
		ci_high: number;
		n_studies: number;
		p_value: string;
		source: string;
	}

	interface SummaryRow extends SummaryValue {
		id: string;
		labelKey: string;
		noteKey: string;
		source: string;
		derivation: string;
	}

	// Numbers + provenance live in data/suicide_risk_studies.json (Garas et
	// al. 2025). Display order, label keys, and bar scaling stay here.
	const { findings, summary } = suicideRaw as unknown as {
		findings: StudyFinding[];
		summary: SummaryRow[];
	};

	const risks = findings.map((f) => ({
		nameKey: f.nameKey,
		or: f.odds_ratio,
		ciLow: f.ci_low,
		ciHigh: f.ci_high,
		nStudies: f.n_studies
	}));

	const maxOr = 8;

	// Headline range, computed from the findings so it can't go stale.
	const orMin = Math.min(...risks.map((r) => r.or)).toFixed(1);
	const orMax = Math.max(...risks.map((r) => r.or)).toFixed(1);
	const sowhat = $derived(
		interpolate(t('views.suicide.sowhat'), { lo: orMin, hi: orMax })
	);

	function orWidth(or: number) {
		return (or / maxOr) * 100;
	}

	function ciWidth(ciLow: number, ciHigh: number) {
		return ((ciHigh - ciLow) / maxOr) * 100;
	}

	function ciOffset(ciLow: number) {
		return (ciLow / maxOr) * 100;
	}

	// Position of the "no difference" marker, derived from the bar scale.
	const nullLeft = (1 / maxOr) * 100;

	const howToRead = $derived(getViewInfo('suicide', currentLocale())?.howToRead ?? '');
</script>

<div class="view">
	<h1 class="title">{t('views.suicide.title')}</h1>
	<p class="subtitle">{t('views.suicide.subtitle')}</p>
	<p class="sowhat"><RichText text={sowhat} /></p>
	<p class="howtoread">
		<span class="howtoread-label">{t('common.howToRead')}: </span><RichText text={howToRead} />
	</p>

	<div class="cards">
		{#each risks as r}
			<div class="card">
				<div class="card-bar-track">
					<div class="card-bar-ci" style="left:{ciOffset(r.ciLow)}%;width:{ciWidth(r.ciLow, r.ciHigh)}%"></div>
					<div class="card-bar-or" style="width:{orWidth(r.or)}%"></div>
					<div class="card-bar-null" style="left:{nullLeft}%" title={t('views.suicide.nullLabel')}></div>
				</div>
				<div class="card-or">{r.or.toFixed(1)}×</div>
				<div class="card-label">{interpolate(t('views.suicide.higherRisk'), { name: t(r.nameKey).toLowerCase() })}</div>
				<div class="card-meta">{interpolate(t('views.suicide.cardMeta'), { lo: r.ciLow.toFixed(1), hi: r.ciHigh.toFixed(1), n: r.nStudies })}</div>
			</div>
		{/each}
	</div>
	<p class="scale-note"><span class="scale-tick"></span>{t('views.suicide.nullLabel')}</p>

	<div class="summary">
		{#each summary as s}
			<div class="summary-card">
				<span class="summary-value">{formatSummaryValue(s)}</span>
				<span class="summary-label">{t(s.labelKey)}</span>
				<span class="summary-note">{t(s.noteKey)}</span>
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
	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		max-width: 680px;
		width: 100%;
	}
	.card {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.card-bar-track {
		position: relative;
		width: 100%;
		height: 8px;
		background: rgba(255,255,255,0.06);
		border-radius: 4px;
		overflow: hidden;
	}
	.card-bar-ci {
		position: absolute;
		top: 0;
		height: 100%;
		background: rgba(139, 92, 246, 0.2);
		border-radius: 4px;
	}
	.card-bar-or {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: #8b5cf6;
		border-radius: 4px;
		transition: width 0.6s ease;
	}
	.card-bar-null {
		position: absolute;
		top: -2px;
		bottom: -2px;
		width: 2px;
		background: rgba(255, 255, 255, 0.65);
	}
	.scale-note {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		color: #888;
		margin: 0.75rem 0 0;
	}
	.scale-tick {
		display: inline-block;
		width: 2px;
		height: 12px;
		background: rgba(255, 255, 255, 0.65);
	}
	.card-or {
		font-size: 1.6rem;
		font-weight: 700;
		color: #e0e0e0;
	}
	.card-label {
		font-size: 0.85rem;
		color: #aaa;
	}
	.card-meta {
		font-size: 0.7rem;
		color: #555;
		font-variant-numeric: tabular-nums;
	}
	.summary {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
		max-width: 680px;
		width: 100%;
	}
	.summary-card {
		flex: 1;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
	.summary-value { font-size: 1.3rem; font-weight: 700; color: #8b5cf6; }
	.summary-label { font-size: 0.8rem; font-weight: 600; color: #aaa; }
	.summary-note { font-size: 0.7rem; color: #666; }
</style>
