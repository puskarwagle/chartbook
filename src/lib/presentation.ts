/**
 * presentation.ts — generic step-by-step map reveal engine.
 *
 * One player component + one JSON file per topic = one video.
 * Copy `data/presentation_adhd_tier1.json` to
 * `data/presentation_<topic>.json`, edit the steps array, and the same
 * `MapPresentation.svelte` player renders it with no code changes.
 *
 * Schema (per JSON file):
 * {
 *   "id": "adhd-tier1",
 *   "title": "Human-readable title",
 *   "startAllUnknown": true,        // step -1 = every country grey
 *   "autoplayMs": 1800,             // ms per step when playing
 *   "steps": [
 *     { "iso2": "US", "tier": "1", "year": 1937,
 *       "label": "United States — Benzedrine",
 *       "talkingPoints": ["Your narration cue…"] }
 *   ]
 * }
 *
 * Step fields: iso2 required. tier optional ("1".."4", defaults to the
 * country's tier in countryStatus.json). year/label/talkingPoints are
 * display-only — the player never validates them, so cancer/depression
 * sequences just use "found here" / "approved here" labels.
 */

export type TierKey = '1' | '2' | '3' | '4' | 'unknown';

/**
 * Optional diffusion enrichment: countries known to have had access by this
 * event. Every entry MUST carry a `source` (URL or citation) — enforced by
 * test (`diffusion.test.ts`), so an unsourced claim is a red build, not a
 * judgment call. Leave steps blank where the facts aren't known.
 */
export interface AlsoLitEntry {
	iso2: string;
	note?: string;
	source: string;
}

export type StepKind = 'event' | 'tierWave';

export interface PresentationStep {
	/** Stable id — diffusion.json keys into this. */
	id?: string;
	/** Country where the event happened. Null = narrative beat, map stays as-is. */
	iso2?: string | null;
	/** 'event' (default): light origin + alsoLit. 'tierWave': light a whole tier (finale). */
	kind?: StepKind;
	tier?: TierKey | string;
	year?: number | string | null;
	label?: string;
	talkingPoints?: string[];
	/** Attached at load from diffusion.json — never hand-edited into the timeline. */
	alsoLit?: AlsoLitEntry[];
}

/** diffusion.json shape: event-step ids → enrichment entries. */
export type DiffusionMap = Record<string, AlsoLitEntry[]>;

/** Merge diffusion entries onto timeline steps by step id. Pure + tested. */
export function attachDiffusion(
	sequence: PresentationSequence,
	diffusion: DiffusionMap
): PresentationSequence {
	return {
		...sequence,
		steps: sequence.steps.map((s) => {
			const extra = s.id ? diffusion[s.id] : undefined;
			if (!extra || extra.length === 0) return s;
			return { ...s, alsoLit: [...(s.alsoLit ?? []), ...extra] };
		})
	};
}

export interface PresentationSequence {
	id: string;
	title: string;
	startAllUnknown?: boolean;
	autoplayMs?: number;
	steps: PresentationStep[];
}

/** Step index -1 means "nothing revealed yet" (all unknown). */
export const REVEAL_NONE = -1;

export function clampStep(step: number, total: number): number {
	if (total <= 0) return REVEAL_NONE;
	if (step < REVEAL_NONE) return REVEAL_NONE;
	if (step > total - 1) return total - 1;
	return step;
}

/** `,` or `<` — prev step. e.key is "," / "<" depending on shift. */
export function isPrevKey(key: string): boolean {
	return key === ',' || key === '<';
}

/** `.` or `>` — next step. */
export function isNextKey(key: string): boolean {
	return key === '.' || key === '>';
}

/** Spacebar (play/pause). e.key is " " for space. */
export function isPlayPauseKey(key: string): boolean {
	return key === ' ' || key === 'Spacebar';
}

/**
 * ISO codes revealed at `step` (inclusive): origins + alsoLit, cumulative
 * union. Event-only — does NOT expand `tierWave` steps (see tierWaveTiers).
 * The map only ever gains — nothing disappears, so no step can imply
 * de-approval. (A future chapter reset would be an explicit `reset: true`.)
 */
export function revealedIso2(sequence: PresentationSequence, step: number): Set<string> {
	const out = new Set<string>();
	if (step < 0) return out;
	for (let i = 0; i <= step && i < sequence.steps.length; i++) {
		const s = sequence.steps[i];
		if (s.iso2) out.add(s.iso2.toUpperCase());
		for (const a of s.alsoLit ?? []) {
			if (a.iso2) out.add(a.iso2.toUpperCase());
		}
	}
	return out;
}

/**
 * Tiers lit by `tierWave` steps at `step` (inclusive), in first-seen order.
 * Pair with a tier-membership lookup to expand the full reveal — see
 * `revealedWithWaves`. Kept in the engine (not the component) so counters,
 * exports, and second players share one source of truth.
 */
export function tierWaveTiers(sequence: PresentationSequence, step: number): TierKey[] {
	const out: TierKey[] = [];
	if (step < 0) return out;
	for (let i = 0; i <= step && i < sequence.steps.length; i++) {
		const s = sequence.steps[i];
		if (s.kind === 'tierWave' && s.tier) {
			const t = String(s.tier) as TierKey;
			if (!out.includes(t)) out.push(t);
		}
	}
	return out;
}

/**
 * Full reveal including tier-wave expansion. `tierMembers` maps a wave tier
 * to its member ISO codes (upper- or lower-case; normalized here). Pure —
 * geography stays with the caller.
 */
export function revealedWithWaves(
	sequence: PresentationSequence,
	step: number,
	tierMembers: (tier: TierKey) => Iterable<string>
): Set<string> {
	const out = revealedIso2(sequence, step);
	for (const t of tierWaveTiers(sequence, step)) {
		for (const iso of tierMembers(t)) {
			if (iso) out.add(iso.toUpperCase());
		}
	}
	return out;
}

export interface RevealStyle {
	/** Upper-case ISO codes lit so far (from revealedIso2). */
	revealed: Set<string>;
	/** Active tier circle, if any. */
	filterTier: TierKey | null;
	/** Hex for unlit countries when no filter is active. */
	unknownHex: string;
	/** Hex for filtered-out countries. Defaults to near-background. */
	dimHex?: string;
}

/**
 * Fill color for one country. With no filter, unlit countries stay grey and
 * lit ones show their real tier. With a filter active, the circle previews
 * TRUE tier membership straight through the reveal (unlit members included) —
 * toggling the circle off restores the exact reveal state.
 */
export function resolveFill(
	iso2: string,
	realTier: TierKey,
	colors: Record<string, string>,
	style: RevealStyle
): string {
	const dim = style.dimHex ?? '#1a1a2e';
	if (style.filterTier !== null) {
		if (realTier !== style.filterTier) return dim;
		return colors[realTier] ?? colors.unknown;
	}
	if (!style.revealed.has(iso2.toUpperCase())) return style.unknownHex;
	return colors[realTier] ?? colors.unknown;
}

/** Opacity mirroring resolveFill: filtered-out 0.15, unlit 0.55, else 1. */
export function resolveOpacity(
	iso2: string,
	realTier: TierKey,
	style: RevealStyle,
	unlitOpacity = 0.55
): number {
	if (style.filterTier !== null) return realTier === style.filterTier ? 1 : 0.15;
	return style.revealed.has(iso2.toUpperCase()) ? 1 : unlitOpacity;
}
