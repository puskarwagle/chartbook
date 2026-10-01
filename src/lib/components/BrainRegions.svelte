<script lang="ts">
	import { t } from '$lib/i18n/store.svelte';
	import { BRAIN_REGIONS, BRAIN_NETWORK_NOTE } from '$lib/brainRegions';

	let selectedRegionId = $state('pfc');
	let selectedFuncIndex = $state(0);

	const selectedRegion = $derived(
		BRAIN_REGIONS.find((r) => r.id === selectedRegionId) ?? BRAIN_REGIONS[0]
	);
	const selectedFunc = $derived(
		selectedRegion.functions[Math.min(selectedFuncIndex, selectedRegion.functions.length - 1)]
	);
	const selectedGroup = $derived(
		selectedRegion.groups.find((g) => g.name === selectedFunc.group) ?? selectedRegion.groups[0]
	);

	// Center pane: every function, clustered under its group divider so the
	// source doc's grouping stays visible. `index` is the position in the
	// region's flat function list (used for selection + numbering).
	const groupedFunctions = $derived(
		selectedRegion.groups
			.map((group) => ({
				group,
				items: selectedRegion.functions
					.map((fn, index) => ({ fn, index }))
					.filter(({ fn }) => fn.group === group.name)
			}))
			.filter((g) => g.items.length > 0)
	);

	function selectRegion(id: string) {
		selectedRegionId = id;
		selectedFuncIndex = 0;
	}

	function regionOpacity(id: string): number {
		return id === selectedRegionId ? 1 : 0.35;
	}
</script>

<div class="brain-view">
	<h1 class="brain-title">{t('views.brain.title')}</h1>
	<p class="brain-subtitle">{t('views.brain.subtitle')}</p>

	<div class="brain-diagram" role="img" aria-label={t('views.brain.title')}>
		<svg viewBox="0 0 600 330" class="diagram-svg">
			<!-- skull/brain outline: side view, facing left -->
			<path
				d="M 95 205 C 85 130, 150 55, 270 48 C 390 41, 470 85, 488 165 C 498 210, 488 245, 462 262 L 175 272 C 128 270, 102 248, 95 205 Z"
				fill="rgba(255,255,255,0.04)"
				stroke="rgba(255,255,255,0.25)"
				stroke-width="2"
			/>
			<!-- cerebellum sits outside the main outline, lower right -->
			<g
				role="button"
				tabindex="0"
				aria-label="Cerebellum"
				class="region"
				opacity={regionOpacity('cerebellum')}
				onclick={() => selectRegion('cerebellum')}
				onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRegion('cerebellum'); } }}
			>
				<ellipse cx="478" cy="272" rx="52" ry="34" fill="#34d399" fill-opacity="0.35" stroke="#34d399" stroke-width="2" />
				<path d="M 436 262 C 455 255, 500 255, 518 264" fill="none" stroke="#34d399" stroke-width="1.5" opacity="0.8" />
				<path d="M 434 274 C 455 267, 502 267, 521 276" fill="none" stroke="#34d399" stroke-width="1.5" opacity="0.8" />
				<path d="M 438 286 C 458 279, 498 279, 516 287" fill="none" stroke="#34d399" stroke-width="1.5" opacity="0.8" />
				<text x="478" y="322" text-anchor="middle" class="diagram-label">Cerebellum</text>
			</g>
			<!-- prefrontal cortex: front-left wedge -->
			<g
				role="button"
				tabindex="0"
				aria-label="Prefrontal Cortex"
				class="region"
				opacity={regionOpacity('pfc')}
				onclick={() => selectRegion('pfc')}
				onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRegion('pfc'); } }}
			>
				<path
					d="M 98 200 C 92 135, 145 68, 238 54 L 252 180 C 200 195, 145 200, 98 200 Z"
					fill="#a78bfa"
					fill-opacity="0.35"
					stroke="#a78bfa"
					stroke-width="2"
				/>
				<text x="150" y="120" text-anchor="middle" class="diagram-label">Prefrontal cortex</text>
			</g>
			<!-- corpus callosum: arch band across the middle -->
			<g
				role="button"
				tabindex="0"
				aria-label="Corpus Callosum"
				class="region"
				opacity={regionOpacity('callosum')}
				onclick={() => selectRegion('callosum')}
				onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRegion('callosum'); } }}
			>
				<path
					d="M 205 165 C 275 120, 365 118, 435 158"
					fill="none"
					stroke="#fbbf24"
					stroke-width="20"
					stroke-linecap="round"
					opacity="0.55"
				/>
				<path
					d="M 205 165 C 275 120, 365 118, 435 158"
					fill="none"
					stroke="#fbbf24"
					stroke-width="2"
				/>
				<text x="320" y="105" text-anchor="middle" class="diagram-label">Corpus callosum</text>
			</g>
			<!-- striatum: deep nucleus -->
			<g
				role="button"
				tabindex="0"
				aria-label="Striatum"
				class="region"
				opacity={regionOpacity('striatum')}
				onclick={() => selectRegion('striatum')}
				onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRegion('striatum'); } }}
			>
				<circle cx="262" cy="205" r="22" fill="#38bdf8" fill-opacity="0.4" stroke="#38bdf8" stroke-width="2" />
				<text x="262" y="248" text-anchor="middle" class="diagram-label">Striatum</text>
			</g>
			<!-- limbic system / amygdala: small almond below striatum -->
			<g
				role="button"
				tabindex="0"
				aria-label="Limbic System"
				class="region"
				opacity={regionOpacity('limbic')}
				onclick={() => selectRegion('limbic')}
				onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRegion('limbic'); } }}
			>
				<ellipse cx="228" cy="240" rx="17" ry="11" transform="rotate(-20 228 240)" fill="#f472b6" fill-opacity="0.45" stroke="#f472b6" stroke-width="2" />
				<text x="172" y="262" text-anchor="middle" class="diagram-label">Limbic system</text>
			</g>
		</svg>
	</div>

	<div class="panes">
		<section class="pane" aria-label="Brain regions">
			<h2 class="pane-heading">1 · Regions</h2>
			<div class="list">
				{#each BRAIN_REGIONS as region}
					<button
						class="row"
						class:selected={region.id === selectedRegionId}
						style="--accent:{region.color}"
						onclick={() => selectRegion(region.id)}
					>
						<span class="dot"></span>
						<span class="row-text">
							<span class="row-name">{region.name}</span>
							<span class="row-sub">{region.nickname} · {region.functions.length} functions</span>
						</span>
					</button>
				{/each}
			</div>
		</section>

		<section class="pane" aria-label="Region functions">
			<h2 class="pane-heading">2 · {selectedRegion.name}</h2>
			<div class="list scroll">
				{#each groupedFunctions as { group, items }}
					<div class="group-divider">{group.name}</div>
					{#each items as { fn, index }}
						<button
							class="row"
							class:selected={index === selectedFuncIndex}
							style="--accent:{selectedRegion.color}"
							onclick={() => (selectedFuncIndex = index)}
						>
							<span class="index">{index + 1}</span>
							<span class="row-text">
								<span class="row-name">{fn.title}</span>
							</span>
						</button>
					{/each}
				{/each}
			</div>
		</section>

		<section class="pane detail" aria-label="Function detail">
			<h2 class="pane-heading">3 · In detail</h2>
			{#key selectedFunc.title}
				<div class="detail-card" style="--accent:{selectedRegion.color}">
					<div class="detail-region">{selectedRegion.name}</div>
					<h3 class="detail-title">{selectedFunc.title}</h3>
					<p class="detail-label">{selectedGroup.name}</p>
					<p class="detail-text">{selectedGroup.explanation}</p>
					<p class="detail-label">When it goes wrong in ADHD</p>
					<p class="detail-text">{selectedGroup.adhd}</p>
				</div>
			{/key}
		</section>
	</div>

	<p class="network-note">
		{BRAIN_NETWORK_NOTE.explanation} Together they govern
		<strong>{BRAIN_NETWORK_NOTE.functions.join(', ')}</strong>.
	</p>
</div>

<style>
	.brain-view {
		width: 100%;
		height: 100%;
		overflow: hidden;
		padding: 1.75rem 2rem 1.5rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.brain-title {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		color: #e0e0e0;
		text-align: center;
		flex-shrink: 0;
	}

	.brain-subtitle {
		font-size: 0.9rem;
		color: #888;
		margin: 0 0 1.25rem;
		text-align: center;
		max-width: 640px;
		flex-shrink: 0;
	}

	.brain-diagram {
		width: 100%;
		max-width: 620px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		padding: 0.5rem 1rem 0;
		margin-bottom: 1.25rem;
		flex-shrink: 0;
	}

	.diagram-svg {
		width: 100%;
		height: auto;
		display: block;
	}

	.region {
		cursor: pointer;
		transition: opacity 0.2s ease;
	}
	.region:hover,
	.region:focus-visible {
		opacity: 1 !important;
		outline: none;
	}
	.region:focus-visible :is(path, circle, ellipse):first-child {
		stroke-width: 3.5;
	}

	.diagram-label {
		fill: #a8a8b8;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.panes {
		width: 100%;
		max-width: 1180px;
		display: grid;
		grid-template-columns: 1fr 1.15fr 1.25fr;
		gap: 1rem;
		align-items: stretch;
		flex: 1;
		min-height: 0;
	}

	.pane {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		padding: 1rem 1rem 1.1rem;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
	}

	.pane-heading {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #888;
		margin: 0 0 0.75rem;
		flex-shrink: 0;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.list.scroll {
		overflow-y: auto;
		min-height: 0;
		padding-right: 0.25rem;
	}

	.group-divider {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: #888;
		margin: 0.5rem 0 0.1rem;
		padding-top: 0.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
	}
	.group-divider:first-child {
		margin-top: 0;
		padding-top: 0;
		border-top: none;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		text-align: left;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 10px;
		padding: 0.65rem 0.75rem;
		color: #e0e0e0;
		cursor: pointer;
		transition: border-color 0.15s ease, background 0.15s ease;
		font: inherit;
	}
	.row:hover {
		border-color: color-mix(in srgb, var(--accent) 55%, transparent);
	}
	.row.selected {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 12%, transparent);
	}

	.dot {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		background: var(--accent);
		flex-shrink: 0;
	}

	.index {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--accent);
		border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
		flex-shrink: 0;
	}

	.row-text {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
	}

	.row-name {
		font-size: 0.92rem;
		font-weight: 600;
	}

	.row-sub {
		font-size: 0.76rem;
		color: #888;
	}

	.detail-card {
		border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
		background: color-mix(in srgb, var(--accent) 7%, transparent);
		border-radius: 12px;
		padding: 1.1rem 1.15rem;
		overflow-y: auto;
		min-height: 0;
	}

	.detail-region {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--accent);
		font-weight: 700;
		margin-bottom: 0.3rem;
	}

	.detail-title {
		font-size: 1.25rem;
		margin: 0 0 0.9rem;
		color: #fff;
	}

	.detail-label {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: #888;
		margin: 0 0 0.25rem;
	}

	.detail-text {
		font-size: 0.92rem;
		line-height: 1.6;
		color: #d6d6e2;
		margin: 0 0 0.9rem;
	}
	.detail-text:last-child {
		margin-bottom: 0;
	}

	.network-note {
		max-width: 1180px;
		margin: 1.25rem 0 0;
		font-size: 0.88rem;
		line-height: 1.6;
		color: #999;
		text-align: center;
		flex-shrink: 0;
	}
	.network-note strong {
		color: #e0e0e0;
	}

	@media (max-width: 900px) {
		/* Stacked panes can't share one fixed viewport — fall back to page scroll. */
		.brain-view {
			overflow-y: auto;
		}
		.panes {
			grid-template-columns: 1fr;
			flex: none;
		}
		.pane {
			overflow: visible;
		}
		.list.scroll,
		.detail-card {
			overflow: visible;
		}
	}
</style>
