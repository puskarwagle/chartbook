<script lang="ts">
	import { COLORS, TIERS } from '$lib/colors';
	import statusData from '$lib/countryStatus.json';

	type TierKey = '1' | '2' | '3' | '4' | 'unknown';

	const tierCounts = $derived.by(() => {
		const counts: Record<TierKey, number> = { '1': 0, '2': 0, '3': 0, '4': 0, unknown: 0 };
		for (const entry of Object.values(statusData.countries)) {
			const tier = String((entry as any).tier) as TierKey;
			counts[tier] = (counts[tier] ?? 0) + 1;
		}
		return counts;
	});

	const totalCountries = $derived(Object.keys(statusData.countries).length);

	const tierMeta: { key: TierKey; label: string }[] = [
		{ key: '1', label: 'Amphetamine' },
		{ key: '2', label: 'Methylphenidate Only' },
		{ key: '3', label: 'Non-Stimulants Only' },
		{ key: '4', label: 'No Treatment' },
		{ key: 'unknown', label: 'Unknown' }
	];
</script>

<div class="stats-view">
	<h1 class="stats-title">Global ADHD Treatment Overview</h1>
	<p class="stats-subtitle">{totalCountries} countries tracked</p>

	<div class="stats-grid">
		{#each tierMeta as t}
			{@const count = tierCounts[t.key] ?? 0}
			{@const pct = totalCountries > 0 ? ((count / totalCountries) * 100).toFixed(1) : '0'}
			<div class="stat-card">
				<div class="stat-color" style="background:{COLORS[t.key]}"></div>
				<div class="stat-info">
					<div class="stat-count">{count}</div>
					<div class="stat-label">{t.label}</div>
					<div class="stat-pct">{pct}%</div>
				</div>
				<div class="stat-bar">
					<div class="stat-bar-fill" style="width:{pct}%;background:{COLORS[t.key]}"></div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.stats-view {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		box-sizing: border-box;
	}

	.stats-title {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		color: #e0e0e0;
	}

	.stats-subtitle {
		font-size: 0.9rem;
		color: #888;
		margin: 0 0 2.5rem;
	}

	.stats-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		max-width: 480px;
	}

	.stat-card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		padding: 1rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stat-color {
		width: 100%;
		height: 4px;
		border-radius: 2px;
	}

	.stat-info {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
	}

	.stat-count {
		font-size: 1.6rem;
		font-weight: 700;
		color: #e0e0e0;
	}

	.stat-label {
		font-size: 0.85rem;
		color: #aaa;
		flex: 1;
	}

	.stat-pct {
		font-size: 0.85rem;
		color: #666;
		font-variant-numeric: tabular-nums;
	}

	.stat-bar {
		width: 100%;
		height: 6px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 3px;
		overflow: hidden;
	}

	.stat-bar-fill {
		height: 100%;
		border-radius: 3px;
		transition: width 0.4s ease;
	}
</style>
