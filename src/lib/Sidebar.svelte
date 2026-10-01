<script lang="ts">
	interface NavItem {
		id: string;
		label: string;
	}

	interface Category {
		name: string;
		ids: string[];
	}

	let { items, categories, activeId, onSelect, onReorder, onOpenSettings, collapsed = $bindable(false) }: {
		items: NavItem[];
		categories: Category[];
		activeId: string;
		onSelect: (id: string) => void;
		onReorder: (fromIndex: number, toIndex: number) => void;
		onOpenSettings: () => void;
		collapsed: boolean;
	} = $props();

	let dragIndex = $state<number | null>(null);
	let dragOverIndex = $state<number | null>(null);

	type GroupedEntry =
		| { type: 'category'; name: string }
		| { type: 'item'; id: string; label: string; itemIndex: number };

	const groupedItems = $derived.by<GroupedEntry[]>(() => {
		const result: GroupedEntry[] = [];
		const seen = new Set<string>();

		for (const cat of categories) {
			// Preserve drag order: items arrives in componentOrder, so filter
			// (don't follow cat.ids order) or reordering has no visible effect.
			const catItems = items.filter((it) => cat.ids.includes(it.id));
			if (catItems.length === 0) continue;

			result.push({ type: 'category', name: cat.name });
			for (const it of catItems) {
				result.push({ type: 'item', id: it.id, label: it.label, itemIndex: items.indexOf(it) });
				seen.add(it.id);
			}
		}

		for (const it of items) {
			if (!seen.has(it.id)) {
				result.push({ type: 'item', id: it.id, label: it.label, itemIndex: items.indexOf(it) });
			}
		}

		return result;
	});

	function onDragStart(e: DragEvent, index: number) {
		dragIndex = index;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', String(index));
		}
	}

	function onDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		dragOverIndex = index;
	}

	function onDragEnd() {
		if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
			onReorder(dragIndex, dragOverIndex);
		}
		dragIndex = null;
		dragOverIndex = null;
	}

	function onDragLeave() {
		dragOverIndex = null;
	}
</script>

<aside class="sidebar" class:collapsed>
	<div class="sidebar-top">
		<button class="collapse-btn" onclick={() => collapsed = !collapsed} aria-label="Toggle sidebar">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				{#if collapsed}
					<path d="M9 18l6-6-6-6"/>
				{:else}
					<path d="M15 18l-6-6 6-6"/>
				{/if}
			</svg>
		</button>

		{#if !collapsed}
			<ul class="nav-list">
				{#each groupedItems as entry}
					{#if entry.type === 'category'}
						<li class="category-header">
							<span class="category-label">{entry.name}</span>
						</li>
					{:else}
						<li
							class="nav-drop-zone"
							class:drag-over={dragOverIndex === entry.itemIndex}
							ondragover={(e) => onDragOver(e, entry.itemIndex)}
							ondragleave={onDragLeave}
							ondrop={(e) => { e.preventDefault(); onDragEnd(); }}
						>
							<div class="nav-row">
							<span
								class="drag-handle"
								role="button"
								tabindex="-1"
								draggable="true"
								ondragstart={(e) => onDragStart(e, entry.itemIndex)}
								ondragend={onDragEnd}
							>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
										<line x1="3" y1="6" x2="21" y2="6"/>
										<line x1="3" y1="12" x2="21" y2="12"/>
										<line x1="3" y1="18" x2="21" y2="18"/>
									</svg>
								</span>
								<button
									class="nav-item"
									class:active={activeId === entry.id}
									class:dragging={dragIndex === entry.itemIndex}
									onclick={() => onSelect(entry.id)}
								>
									{entry.label}
								</button>
							</div>
						</li>
					{/if}
				{/each}
			</ul>
		{/if}

		{#if collapsed}
			<div class="collapsed-icons">
				{#each groupedItems as entry}
					{#if entry.type === 'category'}
						<div class="collapsed-divider" title={entry.name}></div>
					{:else}
						<button
							class="nav-icon-btn"
							class:active={activeId === entry.id}
							onclick={() => onSelect(entry.id)}
							title={entry.label}
						>
							{entry.label.charAt(0)}
						</button>
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	<div class="sidebar-bottom">
		<button class="nav-item settings-btn" onclick={onOpenSettings}>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="3"/>
				<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
			</svg>
			{#if !collapsed}<span>Settings</span>{/if}
		</button>
	</div>
</aside>

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		width: 220px;
		height: 100%;
		background: rgba(15, 15, 30, 0.95);
		border-right: 1px solid rgba(255, 255, 255, 0.08);
		transition: width 0.2s ease;
		flex-shrink: 0;
		overflow: hidden;
	}

	.sidebar.collapsed {
		width: 56px;
	}

	.sidebar-top {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.sidebar-bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		padding: 0.5rem;
	}

	.collapse-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 0.75rem;
		background: transparent;
		border: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		color: #888;
		cursor: pointer;
		transition: color 0.15s;
	}

	.collapse-btn:hover {
		color: #ddd;
	}

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.category-header {
		padding: 0.6rem 0.75rem 0.25rem;
		list-style: none;
	}

	.category-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #555;
	}

	.nav-drop-zone {
		transition: background 0.1s;
		border-radius: 8px;
	}

	.nav-drop-zone.drag-over {
		background: rgba(99, 102, 241, 0.1);
		box-shadow: inset 0 -2px 0 rgba(99, 102, 241, 0.5);
	}

	.nav-row {
		display: flex;
		align-items: center;
		gap: 0;
	}

	.drag-handle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 100%;
		min-height: 34px;
		color: #444;
		cursor: grab;
		border-radius: 4px;
		flex-shrink: 0;
		transition: color 0.15s, background 0.15s;
	}

	.drag-handle:hover {
		color: #aaa;
		background: rgba(255, 255, 255, 0.06);
	}

	.drag-handle:active {
		cursor: grabbing;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex: 1;
		min-width: 0;
		padding: 0.6rem 0.75rem;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 8px;
		color: #999;
		font-size: 0.82rem;
		font-weight: 500;
		cursor: pointer;
		text-align: left;
		transition: all 0.15s;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.06);
		color: #ddd;
	}

	.nav-item.active {
		background: rgba(99, 102, 241, 0.15);
		border-color: rgba(99, 102, 241, 0.3);
		color: #818cf8;
	}

	.nav-item.dragging {
		opacity: 0.4;
	}

	.collapsed-icons {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 0.5rem 0;
	}

	.collapsed-divider {
		width: 20px;
		height: 1px;
		background: rgba(255, 255, 255, 0.12);
		margin: 0.35rem 0;
		flex-shrink: 0;
	}

	.collapsed-divider:first-child {
		display: none;
	}

	.nav-icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 8px;
		color: #888;
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s;
	}

	.nav-icon-btn:hover {
		background: rgba(255, 255, 255, 0.06);
		color: #ddd;
	}

	.nav-icon-btn.active {
		background: rgba(99, 102, 241, 0.15);
		border-color: rgba(99, 102, 241, 0.3);
		color: #818cf8;
	}

	.settings-btn {
		color: #666;
	}

	.settings-btn:hover {
		color: #bbb;
	}
</style>
