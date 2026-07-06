<script lang="ts">
	import { tick } from 'svelte';
	import html2canvas from 'html2canvas';
	import { countryFeatures, bordersPath } from '$lib/mapData';
	import { COLORS, TIERS } from '$lib/colors';
	import statusData from '$lib/countryStatus.json';

	type TierKey = '1' | '2' | '3' | '4' | 'unknown';

	let selectedTier = $state<TierKey>('1');
	let countryTiers = $state<Record<string, TierKey>>({});
	let hovered = $state<string | null>(null);
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

	const PALETTE: { key: TierKey; label: string; hex: string }[] = [
		{ key: '1', label: 'Amphetamine', hex: COLORS['1'] },
		{ key: '2', label: 'Methylphenidate Only', hex: COLORS['2'] },
		{ key: '3', label: 'Non-Stimulants Only', hex: COLORS['3'] },
		{ key: '4', label: 'No Treatment', hex: COLORS['4'] },
		{ key: 'unknown', label: 'Unknown', hex: COLORS.unknown }
	];

	function fillFor(iso2: string): string {
		const tier = countryTiers[iso2];
		return tier ? COLORS[tier] : COLORS.unknown;
	}

	function toggleCountry(iso2: string) {
		if (countryTiers[iso2] === selectedTier) {
			delete countryTiers[iso2];
			countryTiers = { ...countryTiers };
		} else {
			countryTiers = { ...countryTiers, [iso2]: selectedTier };
		}
	}

	function getEntry(iso2: string) {
		return (statusData.countries as any)[iso2] ?? null;
	}

	function getCentroid(path: string): { x: number; y: number } {
		const match = path.match(/M([\d.]+),([\d.]+)/);
		if (match) return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
		return { x: 0, y: 0 };
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

<div id="app">
	<header id="toolbar" class:hidden={takingScreenshot}>
		<div class="toolbar-group">
			{#each PALETTE as p}
				<button
					class="tier-btn"
					class:active={selectedTier === p.key}
					onclick={() => (selectedTier = p.key)}
				>
					<span class="tier-dot" style="background:{p.hex}"></span>
					{p.label}
				</button>
			{/each}
		</div>
	
	</header>

	<div id="map-container">
		<svg viewBox="0 0 960 500" id="map">
			{#each countryFeatures as c (c.iso2)}
				<path
					d={c.path}
					fill={fillFor(c.iso2)}
					stroke="#fff"
					stroke-width={hovered === c.iso2 ? 1.5 : 0.5}
					class="country"
					role="button"
					tabindex="0"
					aria-label={c.name}
					onclick={() => toggleCountry(c.iso2)}
					onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleCountry(c.iso2)}
					onmouseenter={() => (hovered = c.iso2)}
					onmouseleave={() => (hovered = null)}
				/>
				{#if showNames && c.iso2 !== 'AQ'}
					{@const pos = getCentroid(c.path)}
					<text
						x={pos.x}
						y={pos.y}
						class="country-label"
						class:hidden={takingScreenshot && false}
					>{c.iso2}</text>
				{/if}
			{/each}
			<path d={bordersPath} fill="none" stroke="#999" stroke-width={0.3} />
		</svg>
	</div>

	{#if hovered && !takingScreenshot}
		{@const feat = countryFeatures.find((c) => c.iso2 === hovered)}
		{@const entry = getEntry(hovered)}
		<div id="tooltip">
			<div class="tooltip-name">{feat?.name ?? hovered}</div>
			{#if entry}
				<div class="tooltip-tier">Tier {entry.tier} — {(TIERS as any)[String(entry.tier)] ?? 'Unknown'}</div>
				{#if entry.confidence}
					<div class="tooltip-meta">
						Confidence: {entry.confidence} | Evidence: {entry.evidence} | Verified: {entry.last_verified}
					</div>
				{/if}
				<div class="tooltip-notes">{entry.notes}</div>
				{#if entry.approved && Object.keys(entry.approved).length > 0}
					<div class="tooltip-approved">
						{#each Object.entries(entry.approved) as [drug, ok]}
							{#if ok === true}<span class="approved-yes">{drug}</span>{:else if ok === false}<span class="approved-no">{drug}</span>{/if}
						{/each}
					</div>
				{/if}
			{:else}
				<div class="tooltip-meta">No data</div>
			{/if}
		</div>
	{/if}

	<div id="bottom-bar" class:hidden={takingScreenshot}>
		<button
			class="toggle-btn"
			class:active={showNames}
			onclick={() => (showNames = !showNames)}
		>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
				<circle cx="12" cy="12" r="3"/>
			</svg>
			Names
		</button>
		<button class="action-btn reset-btn" onclick={() => (countryTiers = loadInitialTiers())}>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M1 4v6h6M23 20v-6h-6"/>
				<path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
			</svg>
			Reset
		</button>
		<button class="action-btn" onclick={() => (countryTiers = {})}>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
			</svg>
			Clear
		</button>
		<button class="action-btn screenshot-btn" onclick={takeScreenshot}>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
				<circle cx="12" cy="13" r="4"/>
			</svg>
			Screenshot
		</button>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background: #1a1a2e;
		color: #e0e0e0;
		font-family: 'Inter', system-ui, -apple-system, sans-serif;
	}

	#app {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
	}

	#toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 1200px;
		padding: 0.75rem 1.5rem;
		gap: 1rem;
		box-sizing: border-box;
		transition: opacity 0.2s;
	}

	#toolbar.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.toolbar-group {
		display: flex;
		gap: 0.35rem;
		align-items: center;
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
	}

	.toggle-btn:hover, .action-btn:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #ddd;
	}

	.toggle-btn.active {
		background: rgba(46, 204, 113, 0.15);
		border-color: rgba(46, 204, 113, 0.3);
		color: #2ecc71;
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

	#map-container {
		width: 95vw;
		max-width: 1100px;
	}

	#map {
		width: 100%;
		height: auto;
		display: block;
	}

	.country {
		cursor: pointer;
		transition: fill 0.15s, stroke-width 0.1s;
	}

	.country:hover {
		filter: brightness(1.3);
	}

	.country-label {
		font-size: 5px;
		text-anchor: middle;
		dominant-baseline: central;
		fill: rgba(255, 255, 255, 0.7);
		pointer-events: none;
		font-weight: 600;
		paint-order: stroke;
		stroke: rgba(0, 0, 0, 0.6);
		stroke-width: 1.5px;
	}

	#bottom-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		width: 100%;
		max-width: 1200px;
		box-sizing: border-box;
		transition: opacity 0.2s;
	}

	#bottom-bar.hidden {
		opacity: 0;
		pointer-events: none;
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
		position: fixed;
		bottom: 4.5rem;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(15, 15, 30, 0.95);
		color: #fff;
		padding: 0.75rem 1.2rem;
		border-radius: 10px;
		font-size: 0.82rem;
		pointer-events: none;
		max-width: 520px;
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
		background: rgba(46, 204, 113, 0.2);
		color: #2ecc71;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		font-size: 0.7rem;
	}

	.approved-no {
		background: rgba(231, 76, 60, 0.15);
		color: #e74c3c;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		font-size: 0.7rem;
		text-decoration: line-through;
	}
</style>
