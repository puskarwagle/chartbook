<script lang="ts">
	import { educationData, getIncomeGroup, countryName } from '$lib/data';

	type GroupKey = 'all' | 'Low Income' | 'Lower Middle' | 'Upper Middle' | 'High Income';

	let group = $state<GroupKey>('all');
	let sortKey = $state<'ptrPrimary' | 'ptrSecondary'>('ptrPrimary');

	const GROUPS: { key: GroupKey; label: string }[] = [
		{ key: 'all', label: 'All Countries' },
		{ key: 'High Income', label: 'High Income' },
		{ key: 'Upper Middle', label: 'Upper Middle' },
		{ key: 'Lower Middle', label: 'Lower Middle' },
		{ key: 'Low Income', label: 'Low Income' }
	];

	const chartW = 600;
	const chartH = 400;
	const pad = { top: 20, right: 40, bottom: 40, left: 140 };
	const barH = 18;
	const barGap = 22;

	const filteredRows = $derived(() => {
		const allCodes = new Set([
			...educationData.pupilTeacherPrimary.keys(),
			...educationData.pupilTeacherSecondary.keys()
		]);
		const rows: { code: string; name: string; primary: number; secondary: number; group: string }[] = [];
		for (const code of allCodes) {
			const p = educationData.pupilTeacherPrimary.get(code);
			const s = educationData.pupilTeacherSecondary.get(code);
			if (p === undefined && s === undefined) continue;
			const g = getIncomeGroup(code);
			if (group !== 'all' && g !== group) continue;
			rows.push({ code, name: countryName(code), primary: p ?? 0, secondary: s ?? 0, group: g });
		}
		rows.sort((a, b) => sortKey === 'ptrPrimary' ? b.primary - a.primary : b.secondary - a.secondary);
		return rows.slice(0, 20);
	});

	const maxVal = $derived(() => {
		const allVals = filteredRows().flatMap(r => [r.primary, r.secondary]);
		return Math.max(...allVals, 1);
	});

	function xBar(val: number) {
		return pad.left + (val / maxVal()) * (chartW - pad.left - pad.right);
	}
</script>

<div class="view">
	<h1 class="title">Education Context</h1>
	<p class="subtitle">Pupil-teacher ratios — more students per teacher means less individual attention</p>

	<div class="controls">
		<div class="control-group">
			{#each GROUPS as g}
				<button class="filter-btn" class:active={group === g.key} onclick={() => group = g.key}>{g.label}</button>
			{/each}
		</div>
		<div class="control-group">
			<button class="sort-btn" class:active={sortKey === 'ptrPrimary'} onclick={() => sortKey = 'ptrPrimary'}>Primary</button>
			<button class="sort-btn" class:active={sortKey === 'ptrSecondary'} onclick={() => sortKey = 'ptrSecondary'}>Secondary</button>
		</div>
	</div>

	<div class="chart-container">
		<svg viewBox="0 0 {chartW} {chartH}" width="100%" height="100%">
			{#each [0, 10, 20, 30, 40, 50] as t}
				{#if t <= maxVal()}
					<line x1={xBar(t)} y1={pad.top} x2={xBar(t)} y2={chartH - pad.bottom} stroke="rgba(255,255,255,0.06)" />
					<text x={xBar(t)} y={chartH - pad.bottom + 16} text-anchor="middle" fill="#888" font-size="10">{t}</text>
				{/if}
			{/each}

			{#each filteredRows() as r, i}
				{@const y = pad.top + i * (barH * 2 + barGap)}
				<text x={pad.left - 8} y={y + barH - 2} text-anchor="end" fill="#e0e0e0" font-size="10" font-weight="500">
					{r.name.length > 18 ? r.name.slice(0, 16) + '…' : r.name}
				</text>
				{#if r.primary > 0}
					<rect x={pad.left} y={y - barH + 4} width={Math.max(xBar(r.primary) - pad.left, 2)} height={barH} fill="#3b82f6" rx={3} opacity={0.8} />
					<text x={xBar(r.primary) + 4} y={y - barH + 4 + barH / 2 + 3} fill="#93c5fd" font-size="9" font-weight="600">{r.primary.toFixed(1)}</text>
				{/if}
				{#if r.secondary > 0}
					<rect x={pad.left} y={y + 4} width={Math.max(xBar(r.secondary) - pad.left, 2)} height={barH} fill="#8b5cf6" rx={3} opacity={0.8} />
					<text x={xBar(r.secondary) + 4} y={y + 4 + barH / 2 + 3} fill="#c4b5fd" font-size="9" font-weight="600">{r.secondary.toFixed(1)}</text>
				{/if}
			{/each}
		</svg>
	</div>

	<div class="legend">
		<span class="legend-item"><span class="dot blue"></span> Primary</span>
		<span class="legend-item"><span class="dot purple"></span> Secondary</span>
	</div>

	<div class="card">
		<span class="card-label">High ratios = missed ADHD</span>
		<span class="card-note">In countries with 50+ pupils per teacher, individual learning differences go unnoticed. ADHD children in under-resourced schools are less likely to be identified or supported.</span>
	</div>
</div>

<style>
	.view {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		box-sizing: border-box;
	}
	.title { font-size: 1.8rem; font-weight: 700; margin: 0 0 0.25rem; color: #e0e0e0; }
	.subtitle { font-size: 0.9rem; color: #888; margin: 0 0 1rem; }
	.controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
		align-items: center;
	}
	.control-group {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.filter-btn, .sort-btn {
		background: rgba(255,255,255,0.06);
		border: 1.5px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 0.3rem 0.6rem;
		font-size: 0.7rem;
		font-weight: 500;
		cursor: pointer;
		color: #bbb;
		transition: all 0.15s;
	}
	.filter-btn:hover, .sort-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
	.filter-btn.active {
		background: rgba(59, 130, 246, 0.15);
		border-color: rgba(59, 130, 246, 0.3);
		color: #60a5fa;
	}
	.sort-btn.active {
		background: rgba(139, 92, 246, 0.15);
		border-color: rgba(139, 92, 246, 0.3);
		color: #c4b5fd;
	}
	.chart-container {
		width: 100%;
		max-width: 640px;
		height: 420px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem;
		box-sizing: border-box;
	}
	.legend {
		display: flex;
		gap: 1.5rem;
		margin-top: 0.75rem;
	}
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.75rem;
		color: #888;
	}
	.dot {
		width: 10px;
		height: 10px;
		border-radius: 3px;
	}
	.dot.blue { background: #3b82f6; }
	.dot.purple { background: #8b5cf6; }
	.card {
		margin-top: 1.25rem;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px;
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-width: 640px;
		width: 100%;
		box-sizing: border-box;
	}
	.card-label { font-size: 1rem; font-weight: 600; color: #e0e0e0; }
	.card-note { font-size: 0.8rem; color: #888; line-height: 1.4; }
</style>
