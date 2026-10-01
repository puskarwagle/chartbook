<script lang="ts">
	import type { ViewInfoEntry } from '$lib/viewInfo';

	let { info }: { info: ViewInfoEntry } = $props();
</script>

<div class="view-info">
	<div class="view-info-body">
		<div class="info-row">
			<span class="info-heading">What this shows</span>
			<span class="info-text">{info.what}</span>
		</div>
		<div class="info-row">
			<span class="info-heading">How to read it</span>
			<span class="info-text">{info.howToRead}</span>
		</div>
		<div class="info-row">
			<span class="info-heading">Data source</span>
			<span class="info-text">{info.source}</span>
		</div>
		{#if info.coverage}
			<div class="info-row">
				<span class="info-heading">Coverage</span>
				<span class="info-text">{info.coverage}</span>
			</div>
		{/if}
		{#if info.sample}
			<div class="info-row">
				<span class="info-heading">Sample</span>
				<span class="info-text">{info.sample}</span>
			</div>
		{/if}
		<div class="info-row">
			<span class="info-heading">Key insight</span>
			<span class="info-text">{info.insight}</span>
		</div>
		<div class="info-row">
			<span class="info-heading">Limitations</span>
			<span class="info-text">{info.limitation}</span>
		</div>
	</div>
</div>

<style>
	.view-info {
		width: 100%;
		background: rgba(99, 102, 241, 0.06);
		border: 1px solid rgba(99, 102, 241, 0.18);
		border-radius: 10px;
		overflow: hidden;
		box-sizing: border-box;
	}

	.view-info-body {
		padding: 0.9rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.info-row {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.info-heading {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #818cf8;
	}

	.info-text {
		font-size: 0.8rem;
		line-height: 1.5;
		color: #bbb;
	}
</style>
