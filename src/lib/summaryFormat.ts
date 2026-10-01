/**
 * summaryFormat.ts — renders curated summary values (raw number + unit +
 * optional qualifier) as display strings.
 *
 * The numbers live in JSON (e.g. data/suicide_risk_studies.json); the "×",
 * "k" and "yr" presentation lives here so formatting can be unit-tested and
 * can't drift silently when the data moves files.
 */
export interface SummaryValue {
	value: number;
	unit: string;
	qualifier: string | null;
}

export function formatSummaryValue(s: SummaryValue): string {
	// k-values floor to whole thousands (140654 → "140k"), never round up:
	// a cohort label must not overstate the sample size.
	const num = s.unit === 'k' ? `${Math.floor(s.value / 1000)}k` : `${s.value}${s.unit}`;
	return `${s.qualifier ?? ''}${num}`;
}
