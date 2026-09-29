import type {
	TooltipComponentOption,
	XAxisComponentOption,
	YAxisComponentOption,
	LegendComponentOption
} from 'echarts';

/** Shared dark palette — matches existing card/legend colors. */
export const PALETTE = {
	blue: '#3b82f6',
	green: '#10b981',
	purple: '#8b5cf6',
	amber: '#f59e0b',
	red: '#ef4444',
	cyan: '#06b6d4',
	gray: '#6b7280',
	text: '#e0e0e0',
	muted: '#888',
	grid: 'rgba(255,255,255,0.06)',
	axisLine: 'rgba(255,255,255,0.15)'
} as const;

export const BASE_ANIMATION = { animationDuration: 800 };

export function baseTooltip(formatter?: (v: number) => string): TooltipComponentOption {
	return {
		trigger: 'axis',
		axisPointer: { type: 'shadow' },
		...(formatter ? { valueFormatter: (v: unknown) => formatter(Number(v)) } : {})
	};
}

export function categoryXAxis(data: string[]): XAxisComponentOption {
	return {
		type: 'category',
		data,
		axisLine: { lineStyle: { color: PALETTE.axisLine } },
		axisTick: { show: false },
		axisLabel: { color: PALETTE.text, fontSize: 12 }
	};
}

export function valueYAxis(name?: string): YAxisComponentOption {
	return {
		type: 'value',
		...(name
			? { name, nameTextStyle: { color: PALETTE.muted, fontSize: 11 } }
			: {}),
		splitLine: { lineStyle: { color: PALETTE.grid } },
		axisLabel: { color: PALETTE.muted }
	};
}

export function categoryYAxis(data: string[]): YAxisComponentOption {
	return {
		type: 'category',
		data,
		axisLine: { lineStyle: { color: PALETTE.axisLine } },
		axisTick: { show: false },
		axisLabel: { color: PALETTE.text, fontSize: 12 }
	};
}

export function valueXAxis(): XAxisComponentOption {
	return {
		type: 'value',
		splitLine: { lineStyle: { color: PALETTE.grid } },
		axisLabel: { color: PALETTE.muted }
	};
}

export function legendBottom(data: string[]): LegendComponentOption {
	return { bottom: 0, textStyle: { color: PALETTE.muted }, data };
}

export function barSeries(
	name: string,
	data: number[],
	color: string,
	labelFormatter?: (v: number) => string,
	yAxisIndex = 0
): Record<string, unknown> {
	return {
		name,
		type: 'bar',
		data,
		yAxisIndex,
		itemStyle: { color, borderRadius: [4, 4, 0, 0] },
		label: {
			show: true,
			position: 'top',
			color: PALETTE.text,
			fontWeight: 600,
			fontSize: 12,
			...(labelFormatter ? { formatter: (p: { value: number }) => labelFormatter(Number(p.value)) } : {})
		}
	};
}
