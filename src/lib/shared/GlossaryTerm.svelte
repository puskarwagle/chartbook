<script lang="ts">
	import { GLOSSARY } from '$lib/glossary';

	let { term }: { term: string } = $props();

	const entry = $derived(GLOSSARY[term.toLowerCase()] ?? null);
</script>

{#if entry}
	<span class="gloss" title={entry.definition}>{entry.label}</span>
{/if}

<style>
	.gloss {
		text-decoration: underline dotted;
		text-underline-offset: 2px;
		cursor: help;
		white-space: nowrap;
	}
</style>
