<script lang="ts">
	import { onMount } from 'svelte';
	import * as echarts from 'echarts';

	interface Props {
		option: echarts.EChartsCoreOption;
		height?: string;
	}

	let { option, height = '100%' }: Props = $props();

	let el = $state<HTMLElement | null>(null);
	let chart: echarts.ECharts | null = null;

	onMount(() => {
		if (!el) return;
		chart = echarts.init(el, 'dark');
		chart.setOption(option);
		// ResizeObserver (not just window resize): sidebar toggles and other
		// in-DOM layout changes don't fire window resize, which used to leave
		// charts stuck at their init size — notably on narrow screens.
		const ro = new ResizeObserver(() => chart?.resize());
		ro.observe(el);
		return () => {
			ro.disconnect();
			chart?.dispose();
			chart = null;
		};
	});

	// Reactive updates when the parent rebuilds `option`
	// (e.g. year selector, metric switcher, income filter).
	$effect(() => {
		if (chart) chart.setOption(option);
	});
</script>

<div class="echart" style="height:{height}" bind:this={el}></div>

<style>
	.echart {
		width: 100%;
	}
</style>
