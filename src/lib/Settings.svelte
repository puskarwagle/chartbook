<script lang="ts">
	// Settings — global modal. New Page lives INSIDE here (not the sidebar).
	// Also manages hide/show (all pages) + delete (custom pages only).
	interface Item {
		id: string;
		label: string;
		isCustom: boolean;
		hidden: boolean;
	}

	interface CollectionOption {
		id: string;
		title: string;
		blurb: string;
	}

	let {
		open,
		items,
		collections,
		activeCollectionId,
		onSelectCollection,
		onClose,
		onNewPage,
		onToggleHide,
		onDelete,
		onShowAll,
		onSelect
	}: {
		open: boolean;
		items: Item[];
		collections: CollectionOption[];
		activeCollectionId: string;
		onSelectCollection: (id: string) => void;
		onClose: () => void;
		onNewPage: () => void;
		onToggleHide: (id: string) => void;
		onDelete: (id: string) => void;
		onShowAll: () => void;
		onSelect: (id: string) => void;
	} = $props();

	let newTitle = $state('');
	let confirmDelete = $state<string | null>(null);

	function create() {
		onNewPageWithTitle();
	}

	function onNewPageWithTitle() {
		// Pass title via custom event detail hack: parent reads input through callback.
		// Simplest: dispatch with title by temporarily storing on window.
		(window as any).__newPageTitle = newTitle.trim();
		onNewPage();
		newTitle = '';
	}
</script>

{#if open}
	<div
		class="overlay"
		onclick={onClose}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') onClose();
		}}
		role="button"
		tabindex="-1"
		aria-label="Close settings"
	>
		<div
			class="modal"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			aria-label="Settings"
			tabindex="-1"
		>
			<div class="modal-head">
				<h2>Settings</h2>
				<button class="x" onclick={onClose} aria-label="Close">✕</button>
			</div>

			<section class="block">
				<h3>Collection</h3>
				<div class="collection-list">
					{#each collections as col (col.id)}
						<button
							class="btn collection-btn"
							class:active={col.id === activeCollectionId}
							onclick={() => onSelectCollection(col.id)}
							title={col.blurb}
						>
							{col.title}
						</button>
					{/each}
				</div>
				<p class="muted">{collections.find((c) => c.id === activeCollectionId)?.blurb ?? ''} Your custom pages show in every collection.</p>
			</section>

			<section class="block">
				<h3>New page</h3>
				<div class="row">
					<input
						class="text-input"
						placeholder="Page title… (optional)"
						bind:value={newTitle}
						onkeydown={(e) => {
							if (e.key === 'Enter') create();
						}}
					/>
					<button class="btn primary" onclick={create}>+ Create + open</button>
				</div>
				<p class="muted">Creates a JSON entry (no new .svelte file). Auto-navigates to it. Rename anytime by clicking its title.</p>
			</section>

			<section class="block">
				<div class="block-head">
					<h3>Pages in sidebar</h3>
					<button class="btn ghost sm" onclick={onShowAll}>Show all</button>
				</div>
				<ul class="page-list">
					{#each items as it (it.id)}
						<li class:hidden={it.hidden}>
							<button class="name" onclick={() => { onSelect(it.id); onClose(); }} title="Go to page">
								{it.label}
								{#if it.isCustom}<span class="tag">custom</span>{/if}
								{#if it.hidden}<span class="tag dim">hidden</span>{/if}
							</button>
							<div class="actions">
								<button
									class="btn ghost sm"
									onclick={() => onToggleHide(it.id)}
									title={it.hidden ? 'Show in sidebar' : 'Hide from sidebar'}
								>
									{it.hidden ? '👁 Show' : '👁‍🗨 Hide'}
								</button>
								{#if it.isCustom}
									{#if confirmDelete === it.id}
										<button class="btn danger sm" onclick={() => { onDelete(it.id); confirmDelete = null; }}>Confirm?</button>
										<button class="btn ghost sm" onclick={() => (confirmDelete = null)}>Keep</button>
									{:else}
										<button class="btn ghost sm danger-text" onclick={() => (confirmDelete = it.id)}>Delete</button>
									{/if}
								{/if}
							</div>
						</li>
					{/each}
				</ul>
				<p class="muted">Hide works for every view (built-ins too). Delete only exists for your custom pages — built-ins can't be deleted, only hidden.</p>
			</section>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 200;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 4rem 1rem 2rem;
	}
	.modal {
		width: min(620px, 100%);
		max-height: 85vh;
		overflow-y: auto;
		background: #141428;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 14px;
		padding: 1.25rem 1.4rem;
		box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
	}
	.modal-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}
	.modal-head h2 {
		margin: 0;
		font-size: 1.1rem;
	}
	.x {
		background: transparent;
		border: none;
		color: #888;
		font-size: 1rem;
		cursor: pointer;
	}
	.x:hover {
		color: #fff;
	}
	.block {
		margin: 1rem 0;
		padding-top: 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
	}
	.block h3 {
		margin: 0 0 0.6rem;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #888;
	}
	.block-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.row {
		display: flex;
		gap: 0.5rem;
	}
	.collection-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0.5rem 0;
	}
	.collection-btn.active {
		background: rgba(99, 102, 241, 0.35);
		color: #fff;
		border-color: rgba(99, 102, 241, 0.6);
	}
	.text-input {
		flex: 1;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: #ddd;
		padding: 0.5rem 0.75rem;
		font-size: 0.85rem;
		outline: none;
		min-width: 0;
	}
	.btn {
		background: rgba(99, 102, 241, 0.15);
		border: 1px solid rgba(99, 102, 241, 0.3);
		color: #a5b4fc;
		border-radius: 8px;
		padding: 0.5rem 0.9rem;
		font-size: 0.8rem;
		cursor: pointer;
		white-space: nowrap;
	}
	.btn.primary {
		background: rgba(99, 102, 241, 0.25);
		color: #fff;
	}
	.btn.ghost {
		background: transparent;
		border-color: rgba(255, 255, 255, 0.12);
		color: #999;
	}
	.btn.sm {
		padding: 0.3rem 0.6rem;
		font-size: 0.75rem;
	}
	.btn.danger {
		background: rgba(220, 38, 38, 0.2);
		border-color: rgba(220, 38, 38, 0.4);
		color: #fca5a5;
	}
	.danger-text:hover {
		color: #fca5a5;
		border-color: rgba(220, 38, 38, 0.4);
	}
	.muted {
		color: #666;
		font-size: 0.78rem;
		line-height: 1.5;
	}
	.page-list {
		list-style: none;
		margin: 0.5rem 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
		max-height: 320px;
		overflow-y: auto;
	}
	.page-list li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.4rem 0.6rem;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.03);
	}
	.page-list li.hidden {
		opacity: 0.55;
	}
	.name {
		background: none;
		border: none;
		color: #ccc;
		cursor: pointer;
		font-size: 0.83rem;
		text-align: left;
	}
	.name:hover {
		color: #fff;
	}
	.tag {
		font-size: 0.65rem;
		background: rgba(99, 102, 241, 0.2);
		color: #a5b4fc;
		border-radius: 4px;
		padding: 0.05rem 0.3rem;
		margin-left: 0.4rem;
	}
	.tag.dim {
		background: rgba(255, 255, 255, 0.08);
		color: #888;
	}
	.actions {
		display: flex;
		gap: 0.3rem;
		flex-shrink: 0;
	}
</style>
