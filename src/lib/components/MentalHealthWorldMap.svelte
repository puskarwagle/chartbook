<script lang="ts">
	import { countryFeatures, bordersPath, nameToIso2 } from '$lib/mapData';
	import {
		depressionData,
		anxietyData,
		schizophreniaData,
		eatingDisordersData,
		alcoholData,
		drugsData,
		mentalHealthByCountry,
		countryName
	} from '$lib/data';

	type Indicator = 'depression' | 'anxiety' | 'schizophrenia' | 'eating' | 'alcohol' | 'drugs';

	let indicator = $state<Indicator>('depression');
	let hovered = $state<string | null>(null);
	let hoveredData = $state<{ depression?: number; anxiety?: number; schizophrenia?: number; eating?: number; alcohol?: number; drugs?: number; lifeExp?: number } | null>(null);

	const INDICATORS: { key: Indicator; label: string }[] = [
		{ key: 'depression', label: 'Depression' },
		{ key: 'anxiety', label: 'Anxiety' },
		{ key: 'schizophrenia', label: 'Schizophrenia' },
		{ key: 'eating', label: 'Eating Disorders' },
		{ key: 'alcohol', label: 'Alcohol Use' },
		{ key: 'drugs', label: 'Drug Use' }
	];

	const dataByIndicator: Record<Indicator, { country_code: string; value: number }[]> = {
		depression: depressionData,
		anxiety: anxietyData,
		schizophrenia: schizophreniaData,
		eating: eatingDisordersData,
		alcohol: alcoholData,
		drugs: drugsData
	};

	const code3ToIso2 = $derived.by(() => {
		const map = new Map<string, string>();
		for (const row of dataByIndicator[indicator]) {
			const iso2 = nameToIso2(countryName(row.country_code));
			if (iso2) map.set(row.country_code, iso2);
		}
		return map;
	});

	const valueRange = $derived.by(() => {
		const values = dataByIndicator[indicator].map(r => r.value).filter(v => v > 0);
		if (values.length === 0) return { min: 0, max: 100 };
		return { min: Math.min(...values), max: Math.max(...values) };
	});

	const valueMap = $derived.by(() => {
		const map = new Map<string, number>();
		for (const row of dataByIndicator[indicator]) {
			const iso2 = code3ToIso2.get(row.country_code);
			if (iso2) map.set(iso2, row.value);
		}
		return map;
	});

	function colorForValue(val: number | undefined): string {
		if (val === undefined || val === 0) return '#1a1a2e';
		const range = valueRange;
		const t = Math.min(1, (val - range.min) / (range.max - range.min || 1));
		const r = Math.round(30 + t * 200);
		const g = Math.round(30 + (1 - t) * 100);
		const b = Math.round(80 + (1 - t) * 80);
		return `rgb(${r}, ${g}, ${b})`;
	}

	function opacityFor(iso2: string): number {
		const val = valueMap.get(iso2);
		return val !== undefined && val > 0 ? 1 : 0.15;
	}

	function handleHover(iso2: string) {
		hovered = iso2;
		const cc3 = Array.from(code3ToIso2.entries()).find(([_, i2]) => i2 === iso2)?.[0];
		if (cc3) {
			hoveredData = mentalHealthByCountry.get(cc3) ?? null;
		} else {
			hoveredData = null;
		}
	}

	function formatVal(v: number | undefined): string {
		return v !== undefined ? v.toFixed(1) + '%' : '—';
	}
</script>

<div id="mh-map-container">
	<svg viewBox="0 -10 960 520" id="mh-map">
		{#each countryFeatures as c (c.iso2)}
			<path
				d={c.path}
				fill={colorForValue(valueMap.get(c.iso2))}
				opacity={opacityFor(c.iso2)}
				stroke="#fff"
				stroke-width={hovered === c.iso2 ? 1.5 : 0.5}
				class="country"
				onmouseenter={() => handleHover(c.iso2)}
				onmouseleave={() => { hovered = null; hoveredData = null; }}
			/>
		{/each}
		<path d={bordersPath} fill="none" stroke="#999" stroke-width={0.3} />
	</svg>
</div>

{#if hovered}
	{@const feat = countryFeatures.find(c => c.iso2 === hovered)}
	<div id="tooltip">
		<div class="tooltip-name">{feat?.name ?? hovered}</div>
		{#if hoveredData}
			<div class="tooltip-row">
				<span class="tooltip-label">Depression:</span> {formatVal(hoveredData.depression)}
			</div>
			<div class="tooltip-row">
				<span class="tooltip-label">Anxiety:</span> {formatVal(hoveredData.anxiety)}
			</div>
			<div class="tooltip-row">
				<span class="tooltip-label">Schizophrenia:</span> {formatVal(hoveredData.schizophrenia)}
			</div>
			<div class="tooltip-row">
				<span class="tooltip-label">Eating Disorders:</span> {formatVal(hoveredData.eating)}
			</div>
			<div class="tooltip-row">
				<span class="tooltip-label">Alcohol:</span> {formatVal(hoveredData.alcohol)}
			</div>
			<div class="tooltip-row">
				<span class="tooltip-label">Drugs:</span> {formatVal(hoveredData.drugs)}
			</div>
		{:else}
			<div class="tooltip-meta">No WHO data</div>
		{/if}
	</div>
{/if}

<div id="mh-controls">
	<div class="controls-row">
		{#each INDICATORS as ind}
			<button
				class="indicator-btn"
				class:active={indicator === ind.key}
				onclick={() => indicator = ind.key}
			>
				{ind.label}
			</button>
		{/each}
	</div>
</div>

<style>
	#mh-map-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#mh-map {
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
	#tooltip {
		position: fixed;
		bottom: 6rem;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(15, 15, 30, 0.95);
		color: #fff;
		padding: 0.75rem 1.2rem;
		border-radius: 10px;
		font-size: 0.82rem;
		pointer-events: none;
		max-width: 360px;
		line-height: 1.5;
		z-index: 100;
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}
	.tooltip-name {
		font-weight: 700;
		font-size: 1rem;
		margin-bottom: 0.3rem;
	}
	.tooltip-row {
		color: #ccc;
		font-size: 0.78rem;
	}
	.tooltip-label {
		color: #888;
	}
	.tooltip-meta {
		color: #666;
		font-size: 0.72rem;
	}
	#mh-controls {
		position: fixed;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(15, 15, 30, 0.85);
		backdrop-filter: blur(10px);
		padding: 0.6rem 1rem;
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		z-index: 50;
	}
	.controls-row {
		display: flex;
		gap: 0.3rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.indicator-btn {
		background: rgba(255, 255, 255, 0.06);
		border: 1.5px solid rgba(255, 255, 255, 0.08);
		border-radius: 16px;
		padding: 0.35rem 0.7rem;
		font-size: 0.72rem;
		font-weight: 500;
		cursor: pointer;
		color: #bbb;
		transition: all 0.15s;
		white-space: nowrap;
	}
	.indicator-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}
	.indicator-btn.active {
		background: rgba(139, 92, 246, 0.2);
		border-color: rgba(139, 92, 246, 0.5);
		color: #c4b5fd;
	}
</style>
