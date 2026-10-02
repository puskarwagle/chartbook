<script lang="ts">
	import { countryFeatures, bordersPath } from '$lib/mapData';
	import { COLORS } from '$lib/colors';
	import statusData from '../../../data/countryStatus.json';
	import { t, currentLocale } from '$lib/i18n/store.svelte';
	import { tierShortLabel, countryNoteLocalized, interpolate } from '$lib/i18n/index';
		import { spring } from 'svelte/motion';
	import {
		REVEAL_NONE,
		clampStep,
		isPrevKey,
		isNextKey,
		isPlayPauseKey,
		revealedIso2,
		tierWaveTiers,
		resolveFill,
		resolveOpacity,
		type PresentationSequence
	} from '$lib/presentation';

	type TierKey = '1' | '2' | '3' | '4' | 'unknown';

	interface Props {
		sequence: PresentationSequence;
	}

	let { sequence }: Props = $props();

	const total = $derived(sequence.steps.length);
	const autoplayMs = $derived(sequence.autoplayMs ?? 1800);

	// Presentation state: step -1 = all unknown, nothing lit yet.
	let step = $state<number>(REVEAL_NONE);
	let playing = $state(false);
	// Complete = the full colorful map (every tier). Reached by collapsing
	// the active step or toggling a circle off; any timeline move exits it.
	let showAll = $state(false);
	const ALL_ISO2 = new Set(countryFeatures.map((c) => c.iso2));

	let filterTier = $state<TierKey | null>(null);
	let hovered = $state<string | null>(null);
	let selected = $state<string | null>(null);
	// True when the pin came from the timeline (stepping), false when the user
	// clicked the map directly. Step pins show the EVENT story; map picks and
	// hovers show COUNTRY info — same tooltip box, different text.
	let stepPinned = $state(false);
	let listEl = $state<HTMLElement | null>(null);

	const current = $derived(step >= 0 && step < total ? sequence.steps[step] : null);
	const originIso = $derived(current?.iso2?.toUpperCase() ?? null);
	const originFeat = $derived(
		originIso ? countryFeatures.find((c) => c.iso2 === originIso) : undefined
	);

	// Hover temporarily wins so comparison-by-hover works even while a step
	// pin is active; falling back to the pinned selection when not hovering.
	let shown = $derived(hovered ?? selected);

	// No-Treatment (Tier 4) intentionally left out — not needed for this story.
	const TIER_KEYS: TierKey[] = ['1', '2', '3', 'unknown'];

	const tierButtons = $derived(
		TIER_KEYS.map((key) => ({
			key,
			label: tierShortLabel(key, currentLocale()),
			hex: key === 'unknown' ? COLORS.unknown : COLORS[key]
		}))
	);

	function tierOf(iso2: string): TierKey {
		const upper = iso2.toUpperCase();
		const found = sequence.steps.find((s) => s.iso2?.toUpperCase() === upper);
		if (found?.tier) return String(found.tier) as TierKey;
		const entry = (statusData.countries as Record<string, { tier: unknown }>)[upper];
		return entry ? (String(entry.tier) as TierKey) : 'unknown';
	}

	// Tier-wave steps light a whole present-day tier at once (the finale) —
	// unioned with the event reveal, so the map still only ever gains.
	// Tier list comes from the engine (tierWaveTiers); expansion stays here
	// where geography lives.
	const waveLit = $derived.by(() => {
		const out = new Set<string>();
		for (const t of tierWaveTiers(sequence, step)) {
			for (const c of countryFeatures) {
				if (tierOf(c.iso2) === String(t)) out.add(c.iso2);
			}
		}
		return out;
	});

	const revealed = $derived(
		new Set<string>([
			...revealedIso2(sequence, step),
			...waveLit,
			...(showAll ? ALL_ISO2 : [])
		])
	);

	// Camera: zoom to the event origin when it changes, hold on narrative
	// beats, pull all the way out for the tier-wave finale.
	const VIEW_CX = 480;
	const VIEW_CY = 250;
	const zoom = spring({ k: 1, x: VIEW_CX, y: VIEW_CY }, { stiffness: 0.08, damping: 0.5 });

	function zoomFull() {
		zoom.set({ k: 1, x: VIEW_CX, y: VIEW_CY });
	}

	$effect(() => {
		const s = current;
		if (!s) {
			zoomFull();
			return;
		}
		if (s.kind === 'tierWave') {
			zoomFull();
			return;
		}
		const iso = s.iso2?.toUpperCase();
		if (!iso) return; // narrative beat: hold zoom
		const feat = countryFeatures.find((c) => c.iso2 === iso);
		if (feat) zoom.set({ k: 2.4, x: feat.cx, y: feat.cy });
	});

	// Single derived style object — fillFor/tierOpacity share it instead of
	// allocating a wrapper per country per render (hot during zoom frames).
	const revealStyle = $derived({
		revealed,
		filterTier,
		unknownHex: COLORS.unknown
	});

	function fillFor(iso2: string): string {
		return resolveFill(
			iso2,
			tierOf(iso2),
			COLORS as unknown as Record<string, string>,
			revealStyle
		);
	}

	function tierOpacity(iso2: string): number {
		return resolveOpacity(iso2, tierOf(iso2), revealStyle);
	}

	interface CountryStatusEntry {
		tier: string | number;
		confidence: string | null;
		evidence: string | null;
		last_verified: string | null;
		notes?: string | null;
		approved?: Record<string, boolean | null>;
		countryname?: string;
	}

	function getEntry(iso2: string): CountryStatusEntry | null {
		return (statusData.countries as unknown as Record<string, CountryStatusEntry>)[iso2] ?? null;
	}

	function selectedFor(s: { iso2?: string | null } | undefined): string | null {
		return s?.iso2 ? s.iso2.toUpperCase() : null;
	}

	// Collapsing the active step (or closing a circle) lands on the complete
	// colorful map; clicking again dives back into the reveal. Any timeline
	// move below exits the complete view.
	function toggleComplete() {
		showAll = !showAll;
		filterTier = null;
		if (showAll) {
			zoomFull();
			return;
		}
		const iso = current?.kind === 'tierWave' ? null : current?.iso2?.toUpperCase();
		const feat = iso ? countryFeatures.find((c) => c.iso2 === iso) : undefined;
		if (feat) zoom.set({ k: 2.4, x: feat.cx, y: feat.cy });
		else zoomFull();
	}

	function goTo(n: number) {
		playing = false;
		step = clampStep(n, total);
		showAll = false;
		// Timeline takes over: a stale tier filter would paint the pinned
		// origin dark while its tooltip shows — contradictory. Clear it.
		filterTier = null;
		// Pin the newly lit country's tooltip so the EVENT story follows the
		// reveal. Narrative beats (no country) pin nothing — the map stays as-is.
		selected = step >= 0 && step < total ? selectedFor(sequence.steps[step]) : null;
		stepPinned = selected !== null;
	}

	// Tier circles are a temporary lens: activating one pulls the camera out to
	// show the whole preview, closing it lands on the complete colorful map.
	function toggleFilter(key: TierKey) {
		if (filterTier === key) {
			filterTier = null;
			if (!showAll) toggleComplete();
			else zoomFull();
		} else {
			filterTier = key;
			zoomFull();
		}
	}

	function next() {
		goTo(step + 1);
	}

	function prev() {
		goTo(step - 1);
	}

	function reset() {
		playing = false;
		step = REVEAL_NONE;
		showAll = false;
		filterTier = null;
		selected = null;
		stepPinned = false;
		zoomFull();
	}

	function togglePlay() {
		if (total === 0) return;
		if (!playing) {
			// (Re)starting always resumes the reveal, never the complete view.
			showAll = false;
			if (step >= total - 1) {
				step = REVEAL_NONE;
				selected = null;
				stepPinned = false;
			}
		}
		playing = !playing;
	}

	// Autoplay: advance one step per tick, stop at the end.
	$effect(() => {
		if (!playing) return;
		const id = setInterval(() => {
			if (step >= total - 1) {
				playing = false;
				return;
			}
			step = clampStep(step + 1, total);
			filterTier = null;
			selected = step >= 0 && step < total ? selectedFor(sequence.steps[step]) : null;
			stepPinned = selected !== null;
		}, autoplayMs);
		return () => clearInterval(id);
	});

	// Keep the current step visible in the clickable list.
	$effect(() => {
		if (step !== undefined) {
			listEl?.querySelector('.step.now')?.scrollIntoView?.({ block: 'nearest' });
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		const tag = (e.target as HTMLElement)?.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
		// Space doubles as native button activation (click on Space) for
		// focused .step buttons and country paths. Let the element handle it —
		// otherwise one keystroke both selects and toggles autoplay.
		if (isPlayPauseKey(e.key)) {
			const t = e.target as HTMLElement | null;
			if (t?.closest?.('button, [role="button"]')) return;
		}
		if (isPrevKey(e.key)) {
			e.preventDefault();
			prev();
		} else if (isNextKey(e.key)) {
			e.preventDefault();
			next();
		} else if (isPlayPauseKey(e.key)) {
			e.preventDefault();
			togglePlay();
		} else if (e.key === 'Home') {
			e.preventDefault();
			reset();
		} else if (e.key === 'End') {
			e.preventDefault();
			goTo(total - 1);
		}
	}

</script>

<svelte:window on:keydown={handleKeydown} />

<div class="map-layout">
<div class="present-body">
<div id="map-container">
	<svg viewBox="0 -10 960 520" id="map">
		<g transform="translate({VIEW_CX} {VIEW_CY}) scale({$zoom.k}) translate({-$zoom.x} {-$zoom.y})">
		{#each countryFeatures as c (c.iso2)}
			<path
				d={c.path}
				fill={fillFor(c.iso2)}
				opacity={tierOpacity(c.iso2)}
				stroke={selected === c.iso2 ? '#818cf8' : '#fff'}
				stroke-width={selected === c.iso2 ? 1.5 : hovered === c.iso2 ? 1.5 : 0.5}
				class="country"
				role="button"
				tabindex="0"
				aria-label={c.name}
				aria-pressed={selected === c.iso2}
				onmouseenter={() => (hovered = c.iso2)}
				onmouseleave={() => (hovered = null)}
				onclick={() => { selected = selected === c.iso2 ? null : c.iso2; stepPinned = false; }}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						selected = selected === c.iso2 ? null : c.iso2;
						stepPinned = false;
					}
				}}
			/>

		{/each}
		<path d={bordersPath} fill="none" stroke="#999" stroke-width={0.3} />
		{#if originFeat && (!filterTier || (originIso !== null && tierOf(originIso) === filterTier))}
			{#key step}
				<circle cx={originFeat.cx} cy={originFeat.cy} r="14" class="ping" />
			{/key}
		{/if}
		</g>
	</svg>
</div>

{#if shown}
	{@const feat = countryFeatures.find((c) => c.iso2 === shown)}
	{@const entry = getEntry(shown)}
	{@const isLit = revealed.has(shown)}
	{@const stepEvent = stepPinned && current?.iso2?.toUpperCase() === shown ? current : null}
	<div id="tooltip">
		{#if stepEvent}
			<div class="tooltip-name">{stepEvent.label ?? feat?.name ?? shown}</div>
			{#if stepEvent.year}<div class="tooltip-tier">{stepEvent.year}</div>{/if}
			{#if stepEvent.talkingPoints?.length}
				{#each stepEvent.talkingPoints as tp}
					<div class="tooltip-notes">{tp}</div>
				{/each}
			{/if}
		{:else}
		<div class="tooltip-name">{feat?.name ?? shown}</div>
		{#if !isLit}
			<div class="tooltip-meta">Not lit yet — step forward to reveal</div>
		{:else}
			{#if selected}
				<div class="tooltip-pinned">{interpolate(t('views.worldmap.pinned'), { name: feat?.name ?? shown })}</div>
			{/if}
			{#if entry}
				<div class="tooltip-tier">{interpolate(t('views.worldmap.tierLine'), { tier: entry.tier, label: tierShortLabel(String(entry.tier) as TierKey, currentLocale()) })}</div>
				{#if entry.confidence}
					<div class="tooltip-meta">
						{interpolate(t('views.worldmap.metaLine'), { confidence: entry.confidence ?? '', evidence: entry.evidence ?? '', verified: entry.last_verified ?? '' })}
					</div>
				{/if}
				<div class="tooltip-notes">{countryNoteLocalized(shown, currentLocale(), entry.notes ?? '')}</div>
				{#if entry.approved && Object.keys(entry.approved).length > 0}
					<div class="tooltip-approved">
						{#each Object.entries(entry.approved) as [drug, ok]}
							{#if ok === true}<span class="approved-yes">{drug}</span>{:else if ok === false}<span class="approved-no">{drug}</span>{/if}
						{/each}
					</div>
				{/if}
			{:else}
				<div class="tooltip-meta">{t('views.worldmap.noData')}</div>
			{/if}
		{/if}
		{/if}
	</div>
{/if}

<aside class="timeline-panel">
	<div class="tier-circles" role="group" aria-label="Tier filter">
		{#each tierButtons as p}
			<button
				class="tier-circle"
				class:active={filterTier === p.key}
				style="background:{p.hex}"
				title={p.label}
				aria-label={p.label}
				aria-pressed={filterTier === p.key}
				onclick={() => toggleFilter(p.key)}
			></button>
		{/each}
	</div>
	<div class="now-card">
		{#if current}
			<div class="cap-head">
				{#if current.year}<span class="cap-year">{current.year}</span>{/if}
				<span class="cap-label">{current.label ?? current.iso2}</span>
			</div>
			<div class="cap-counter">Step {step + 1} of {total} · {revealed.size} lit</div>
			{#if current.talkingPoints?.length}
				<div class="cap-point">{current.talkingPoints[0]}</div>
			{/if}
		{:else}
			<div class="cap-head"><span class="cap-label">{sequence.title}</span></div>
			<div class="cap-point dim">Click a step below, or press Space to play.</div>
		{/if}
	</div>
	<div class="step-list" bind:this={listEl} role="list" aria-label="Steps">
		{#each sequence.steps as s, i}
			{@const extra = s.alsoLit?.length ?? 0}
			<button
				class="step"
				class:done={i <= step}
				class:now={i === step}
				class:wave={s.kind === 'tierWave'}
				onclick={() => (i === step ? toggleComplete() : goTo(i))}
				title={(s.label ?? s.iso2 ?? `Step ${i + 1}`) + (i === step ? ' — click again for the full map' : '')}
				aria-label={`Step ${i + 1}: ${s.label ?? s.iso2 ?? 'narrative beat'}`}
			>
				<span class="step-num">{i + 1}</span>
				{#if s.year}<span class="step-year">{s.year}</span>{/if}
				<span class="step-label">{s.label ?? s.iso2}</span>
				{#if extra > 0}<span class="step-extra">+{extra}</span>{/if}
			</button>
		{/each}
	</div>
	<div class="footnote">Highlights follow the events shown — not a complete regulatory history.</div>
</aside>
</div>
</div>

<style>
	.map-layout {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		min-height: 0;
		overflow: hidden;
		position: relative;
	}

	#map-container {
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	#map {
		width: 100%;
		height: 100%;
	}

	.country {
		cursor: pointer;
		transition: fill 0.35s, opacity 0.3s, stroke-width 0.1s;
	}

	.country:hover {
		filter: brightness(1.3);
	}

	.tier-circles {
		display: flex;
		flex-direction: row;
		gap: 0.7rem;
		align-items: center;
		justify-content: center;
		padding: 0.8rem 0.5rem 0.5rem;
	}

	.tier-circle {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2px solid transparent;
		cursor: pointer;
		padding: 0;
		opacity: 0.8;
		transition: transform 0.12s, opacity 0.12s, border-color 0.12s, box-shadow 0.12s;
	}

	.tier-circle:hover {
		transform: scale(1.2);
		opacity: 1;
	}

	.tier-circle.active {
		border-color: #fff;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.35);
		opacity: 1;
	}

	#tooltip {
		position: absolute;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(15, 15, 30, 0.95);
		color: #fff;
		padding: 0.75rem 1.2rem;
		border-radius: 10px;
		font-size: 0.82rem;
		pointer-events: none;
		max-width: min(520px, calc(100% - 2rem));
		line-height: 1.45;
		z-index: 100;
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}

	.tooltip-name {
		font-weight: 700;
		font-size: 1rem;
		margin-bottom: 0.25rem;
	}

	.tooltip-pinned {
		color: #818cf8;
		font-size: 0.72rem;
		margin-bottom: 0.3rem;
	}

	.tooltip-tier {
		color: #aaa;
		margin-bottom: 0.3rem;
		font-size: 0.78rem;
	}

	.tooltip-meta {
		color: #666;
		font-size: 0.72rem;
		margin-bottom: 0.3rem;
	}

	.tooltip-notes {
		color: #ccc;
		margin-bottom: 0.3rem;
	}

	.tooltip-approved {
		display: flex;
		gap: 0.35rem;
		flex-wrap: wrap;
	}

	.approved-yes {
		background: rgba(16, 185, 129, 0.2);
		color: #10b981;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		font-size: 0.7rem;
	}

	.approved-no {
		background: rgba(220, 38, 38, 0.15);
		color: #dc2626;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		font-size: 0.7rem;
		text-decoration: line-through;
	}

	.present-body {
		flex: 1 1 auto;
		min-height: 0;
		display: flex;
		flex-direction: row;
		overflow: hidden;
	}

	.timeline-panel {
		flex: 0 0 300px;
		width: 300px;
		min-height: 0;
		display: flex;
		flex-direction: column;
		background: rgba(15, 15, 30, 0.6);
		border-left: 1px solid rgba(255, 255, 255, 0.08);
		/* Clear the overlay language + info buttons top-right. */
		padding-top: 3rem;
	}

	.now-card {
		flex: 0 0 auto;
		padding: 0.8rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.step-list {
		flex: 1 1 auto;
		min-height: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 0.5rem;
	}

	.step {
		display: flex;
		align-items: baseline;
		gap: 0.55rem;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 8px;
		color: #bbb;
		padding: 0.4rem 0.6rem;
		font-size: 0.8rem;
		cursor: pointer;
		text-align: left;
		transition: background 0.12s, color 0.12s;
	}

	.step:hover {
		background: rgba(255, 255, 255, 0.05);
		color: #fff;
	}

	.step.now {
		background: rgba(16, 185, 129, 0.12);
		border-color: rgba(16, 185, 129, 0.4);
		color: #fff;
	}

	.step-num {
		color: #555;
		font-size: 0.7rem;
		min-width: 1.8rem;
		text-align: right;
		font-variant-numeric: tabular-nums;
		flex-shrink: 0;
	}

	.step.done .step-num {
		color: #10b981;
	}

	.step-year {
		color: #10b981;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		flex-shrink: 0;
	}

	.step.now .step-year {
		color: #34d399;
	}

	.step-label {
		flex: 1;
		line-height: 1.35;
	}

	.step-extra {
		color: #10b981;
		font-size: 0.7rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.step.wave {
		background: rgba(243, 156, 18, 0.08);
		border-color: rgba(243, 156, 18, 0.3);
	}

	.cap-counter {
		color: #666;
		font-size: 0.72rem;
		margin-top: 0.2rem;
		font-variant-numeric: tabular-nums;
	}

	.footnote {
		flex: 0 0 auto;
		padding: 0.6rem 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		color: #555;
		font-size: 0.68rem;
		line-height: 1.4;
	}

	.ping {
		fill: none;
		stroke: #fff;
		stroke-width: 2;
		pointer-events: none;
		transform-box: fill-box;
		transform-origin: center;
		animation: ping-ring 1.3s ease-out forwards;
	}

	@keyframes ping-ring {
		0% { transform: scale(0.5); opacity: 1; }
		100% { transform: scale(2.4); opacity: 0; }
	}

	@media (max-width: 800px) {
		.present-body {
			flex-direction: column;
		}
		.timeline-panel {
			flex: 0 0 40%;
			width: auto;
			border-left: none;
			border-top: 1px solid rgba(255, 255, 255, 0.08);
		}
	}

	.cap-head { display: flex; gap: 0.6rem; align-items: baseline; }
	.cap-year {
		font-weight: 800;
		color: #10b981;
		font-variant-numeric: tabular-nums;
	}
	.cap-label { font-weight: 700; color: #fff; }
	.cap-point { color: #bbb; font-size: 0.82rem; margin-top: 0.25rem; line-height: 1.4; }
	.cap-point.dim { color: #666; }
</style>
