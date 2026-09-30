<script lang="ts">
	import { tick } from 'svelte';
	import html2canvas from 'html2canvas';
	import { countryFeatures, bordersPath } from '$lib/mapData';
	import { COLORS } from '$lib/colors';
	import statusData from '$lib/countryStatus.json';
	import { t, currentLocale } from '$lib/i18n/store.svelte';
	import { tierShortLabel, countryNoteLocalized, interpolate } from '$lib/i18n/index';

	type TierKey = '1' | '2' | '3' | '4' | 'unknown';

	let filterTier = $state<TierKey | null>(null);
	let countryTiers = $state<Record<string, TierKey>>({});
	let hovered = $state<string | null>(null);
	let selected = $state<string | null>(null);
	let showNames = $state(false);
	let takingScreenshot = $state(false);

	function loadInitialTiers(): Record<string, TierKey> {
		const result: Record<string, TierKey> = {};
		for (const [iso2, entry] of Object.entries(statusData.countries)) {
			result[iso2] = String(entry.tier) as TierKey;
		}
		return result;
	}

	countryTiers = loadInitialTiers();

	// Pinned selection wins over hover so a clicked country's info stays put.
	let shown = $derived(selected ?? hovered);

	const TIER_KEYS: TierKey[] = ['1', '2', '3', '4', 'unknown'];

	const tierButtons = $derived(
		TIER_KEYS.map((key) => ({
			key,
			label: tierShortLabel(key, currentLocale()),
			hex: key === 'unknown' ? COLORS.unknown : COLORS[key]
		}))
	);

	function fillFor(iso2: string): string {
		const tier = countryTiers[iso2] ?? 'unknown';
		if (filterTier !== null && tier !== filterTier) return '#1a1a2e';
		return COLORS[tier] ?? COLORS.unknown;
	}

	function tierOpacity(iso2: string): number {
		const tier = countryTiers[iso2] ?? 'unknown';
		if (filterTier !== null && tier !== filterTier) return 0.15;
		return 1;
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

	const SHORT_NAMES: Record<string, string> = {
		US: 'USA', GB: 'UK', AE: 'UAE', NL: 'NED',
		SA: 'KSA', KP: 'N.Korea', KR: 'S.Korea',
		CD: 'DRC', CG: 'Congo', CF: 'CAR', GQ: 'Eq.Guinea',
		PG: 'PNG', TL: 'Timor', BA: 'Bosnia', CI: 'Côte',
		EH: 'W.Sahara', GN: 'Guinea', GW: 'G.Bissau',
		MK: 'N.Macedonia', MM: 'Myanmar', SS: 'S.Sudan',
		SZ: 'Eswatini', TF: 'Fr.S.Ant.', VA: 'Vatican',
	};

	function splitName(name: string): [string, string | null] {
		const idx = name.indexOf(' ');
		if (idx === -1 || name.length <= 8) return [name, null];
		return [name.slice(0, idx), name.slice(idx + 1)];
	}

	async function takeScreenshot() {
		takingScreenshot = true;
		await tick();
		const el = document.getElementById('map-container');
		if (!el) return;
		const canvas = await html2canvas(el, {
			backgroundColor: '#1a1a2e',
			scale: 2,
			useCORS: true
		});
		const link = document.createElement('a');
		link.download = 'worldmap.png';
		link.href = canvas.toDataURL('image/png');
		link.click();
		takingScreenshot = false;
	}
</script>

<div class="map-layout">
<div id="controls" class:hidden={takingScreenshot}>
	<div class="controls-row">
		{#each tierButtons as p}
			<button
				class="tier-btn"
				class:active={filterTier === p.key}
				onclick={() => (filterTier = filterTier === p.key ? null : p.key)}
			>
				<span class="tier-dot" style="background:{p.hex}"></span>
				{p.label}
			</button>
		{/each}
	</div>
	<div class="controls-row">
		<button
			class="toggle-btn"
			class:active={showNames}
			onclick={() => (showNames = !showNames)}
		>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
			<circle cx="12" cy="12" r="3"/>
		</svg>
			{t('views.worldmap.names')}
		</button>
		<button class="action-btn reset-btn" onclick={() => { countryTiers = loadInitialTiers(); filterTier = null; selected = null; }}>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M1 4v6h6M23 20v-6h-6"/>
			<path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
		</svg>
			{t('views.worldmap.reset')}
		</button>
		<button class="action-btn screenshot-btn" onclick={takeScreenshot}>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
			<circle cx="12" cy="13" r="4"/>
		</svg>
			{t('views.worldmap.screenshot')}
		</button>
	</div>
</div>
<div id="map-container">
	<svg viewBox="0 -10 960 520" id="map">
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
				onclick={() => (selected = selected === c.iso2 ? null : c.iso2)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						selected = selected === c.iso2 ? null : c.iso2;
					}
				}}
			/>
			{#if showNames && c.iso2 !== 'AQ'}
				{@const label = SHORT_NAMES[c.iso2] ?? c.name}
				{@const [line1, line2] = splitName(label)}
				<text
					x={c.cx}
					y={c.cy}
					class="country-label"
					class:hidden={takingScreenshot && false}
				>
					<tspan x={c.cx} dy={line2 ? '-0.4em' : '0'}>{line1}</tspan>
					{#if line2}<tspan x={c.cx} dy="1.1em">{line2}</tspan>{/if}
				</text>
			{/if}
		{/each}
		<path d={bordersPath} fill="none" stroke="#999" stroke-width={0.3} />
	</svg>
</div>

{#if shown && !takingScreenshot}
	{@const feat = countryFeatures.find((c) => c.iso2 === shown)}
	{@const entry = getEntry(shown)}
	<div id="tooltip">
		<div class="tooltip-name">{feat?.name ?? shown}</div>
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
	</div>
{/if}
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
		transition: fill 0.15s, opacity 0.3s, stroke-width 0.1s;
	}

	.country:hover {
		filter: brightness(1.3);
	}

	.country-label {
		font-size: 3.5px;
		text-anchor: middle;
		dominant-baseline: central;
		fill: #fff;
		pointer-events: none;
		font-weight: 700;
		paint-order: stroke;
		stroke: rgba(0, 0, 0, 0.8);
		stroke-width: 2px;
	}

	#controls {
		flex: 0 0 auto;
		align-self: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		max-width: calc(100% - 2rem);
		background: rgba(15, 15, 30, 0.85);
		backdrop-filter: blur(10px);
		padding: 0.75rem 1rem;
		margin-top: 1rem;
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		transition: opacity 0.2s;
	}

	#controls.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.controls-row {
		display: flex;
		flex-direction: row;
		gap: 0.35rem;
		align-items: center;
		justify-content: center;
		flex-wrap: nowrap;
		flex-shrink: 0;
		max-width: 100%;
		overflow-x: auto;
	}

	.tier-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		background: rgba(255, 255, 255, 0.06);
		border: 1.5px solid rgba(255, 255, 255, 0.08);
		border-radius: 20px;
		padding: 0.4rem 0.85rem;
		font-size: 0.78rem;
		font-weight: 500;
		cursor: pointer;
		color: #bbb;
		transition: all 0.15s;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.tier-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	.tier-btn.active {
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.3);
		color: #fff;
		box-shadow: 0 0 16px rgba(255, 255, 255, 0.08);
	}

	.tier-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.toggle-btn, .action-btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 8px;
		padding: 0.4rem 0.7rem;
		font-size: 0.78rem;
		font-weight: 500;
		cursor: pointer;
		color: #999;
		transition: all 0.15s;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.toggle-btn:hover, .action-btn:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #ddd;
	}

	.toggle-btn.active {
		background: rgba(16, 185, 129, 0.15);
		border-color: rgba(16, 185, 129, 0.3);
		color: #10b981;
	}

	.screenshot-btn {
		background: rgba(99, 102, 241, 0.12);
		border-color: rgba(99, 102, 241, 0.25);
		color: #818cf8;
	}

	.screenshot-btn:hover {
		background: rgba(99, 102, 241, 0.2);
		color: #a5b4fc;
	}

	.reset-btn {
		background: rgba(243, 156, 18, 0.12);
		border-color: rgba(243, 156, 18, 0.25);
		color: #f39c12;
	}

	.reset-btn:hover {
		background: rgba(243, 156, 18, 0.2);
		color: #f1c40f;
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
</style>
