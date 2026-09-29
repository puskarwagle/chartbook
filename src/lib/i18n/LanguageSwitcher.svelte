<script lang="ts">
	import { LOCALES, currentLocale, setLocale, t } from './store.svelte';
</script>

<div class="lang-switch" role="group" aria-label={t('common.language')}>
	{#each LOCALES as loc (loc.code)}
		<button
			class="lang-btn"
			class:active={currentLocale() === loc.code}
			onclick={() => setLocale(loc.code)}
			title={loc.label}
			aria-pressed={currentLocale() === loc.code}
		>
			{loc.short}
		</button>
	{/each}
</div>

<style>
	.lang-switch {
		display: flex;
		gap: 4px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 8px;
		padding: 3px;
	}
	.lang-btn {
		background: transparent;
		border: 1px solid transparent;
		border-radius: 6px;
		color: #888;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		padding: 0.3rem 0.5rem;
		cursor: pointer;
		transition: all 0.15s;
	}
	.lang-btn:hover {
		color: #ddd;
		background: rgba(255, 255, 255, 0.06);
	}
	.lang-btn.active {
		background: rgba(99, 102, 241, 0.2);
		border-color: rgba(99, 102, 241, 0.4);
		color: #a5b4fc;
	}
</style>
