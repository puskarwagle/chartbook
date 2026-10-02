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
		const onResize = () => chart?.resize();
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
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
