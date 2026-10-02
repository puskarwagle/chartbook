<script lang="ts">
	import { GLOSSARY } from '$lib/glossary';
	import GlossaryTerm from './GlossaryTerm.svelte';

	/**
	 * Renders an i18n string, replacing [TOKEN] markers with hover-defined
	 * glossary terms. Unknown tokens render literally so a missing glossary
	 * entry degrades to plain text, never to a blank.
	 */
	let { text }: { text: string } = $props();

	interface Part {
		kind: 'text' | 'term';
		value: string;
	}

	const parts = $derived.by<Part[]>(() => {
		const out: Part[] = [];
		const re = /\[([A-Za-z][A-Za-z0-9-]*)\]/g;
		let last = 0;
		let m: RegExpExecArray | null;
		// Fresh regex state per evaluation (module-level regex would need lastIndex reset).
		while ((m = re.exec(text)) !== null) {
			if (m.index > last) out.push({ kind: 'text', value: text.slice(last, m.index) });
			const key = m[1].toLowerCase();
			if (GLOSSARY[key]) out.push({ kind: 'term', value: key });
			else out.push({ kind: 'text', value: m[0] });
			last = m.index + m[0].length;
		}
		if (last < text.length) out.push({ kind: 'text', value: text.slice(last) });
		return out;
	});
</script>

{#each parts as p}
	{#if p.kind === 'term'}
		<GlossaryTerm term={p.value} />
	{:else}{p.value}{/if}
{/each}
