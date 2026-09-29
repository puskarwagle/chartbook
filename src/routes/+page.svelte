<script lang="ts">
	import Sidebar from '$lib/Sidebar.svelte';
	import WorldMap from '$lib/components/WorldMap.svelte';
	import StatsView from '$lib/components/StatsView.svelte';
	import TimelineView from '$lib/components/TimelineView.svelte';
	import AgePyramid from '$lib/components/AgePyramid.svelte';
	import SexComparison from '$lib/components/SexComparison.svelte';
	import RegionalRanking from '$lib/components/RegionalRanking.svelte';
	import TrendLine from '$lib/components/TrendLine.svelte';
	import SDIScatter from '$lib/components/SDIScatter.svelte';
	import PrisonPrevalence from '$lib/components/PrisonPrevalence.svelte';
	import ComorbidityBreakdown from '$lib/components/ComorbidityBreakdown.svelte';
	import SUDbySubstance from '$lib/components/SUDbySubstance.svelte';
	import SuicideRisk from '$lib/components/SuicideRisk.svelte';
	import SexDiffSUD from '$lib/components/SexDiffSUD.svelte';
	import MentalHealthWorldMap from '$lib/components/MentalHealthWorldMap.svelte';
	import WealthVsWellbeing from '$lib/components/WealthVsWellbeing.svelte';
	import TreatmentAccessIndex from '$lib/components/TreatmentAccessIndex.svelte';
	import EducationPressure from '$lib/components/EducationPressure.svelte';
	import PrisonMentalHealthLink from '$lib/components/PrisonMentalHealthLink.svelte';
	import HappinessRankings from '$lib/components/HappinessRankings.svelte';
	import HDIExplorer from '$lib/components/HDIExplorer.svelte';
	import GovernanceRadar from '$lib/components/GovernanceRadar.svelte';
	import GlobalHealthTrends from '$lib/components/GlobalHealthTrends.svelte';
	import EconomicSnapshot from '$lib/components/EconomicSnapshot.svelte';
	import DataExplorer from '$lib/components/DataExplorer.svelte';
	import CustomPage from '$lib/components/CustomPage.svelte';
	import Settings from '$lib/Settings.svelte';
	import PageInspector from '$lib/PageInspector.svelte';
	import LanguageSwitcher from '$lib/i18n/LanguageSwitcher.svelte';
	import { t } from '$lib/i18n/store.svelte';
	import { interpolate } from '$lib/i18n/format';
	import { VIEW_INFO } from '$lib/viewInfo';
	import { COLLECTIONS, DEFAULT_COLLECTION_ID } from '$lib/collections';
	import customDefaults from '$lib/customPages.json';

	interface ComponentEntry {
		id: string;
		label: string;
		component: any;
	}

	interface Category {
		name: string;
		ids: string[];
	}

	interface CustomEntry {
		id: string;
		title: string;
	}

	// Labels resolve via the i18n dictionary (locales/en.json canonical,
	// locales/ne.json + hi.json overlays). $derived so the sidebar
	// re-renders on locale change; untranslated keys fall back to English.
	const COMPONENTS = $derived<ComponentEntry[]>([
		{ id: 'worldmap', label: t('nav.worldmap'), component: WorldMap },
		{ id: 'mhmap', label: t('nav.mhmap'), component: MentalHealthWorldMap },
		{ id: 'stats', label: t('nav.stats'), component: StatsView },
		{ id: 'timeline', label: t('nav.timeline'), component: TimelineView },
		{ id: 'age', label: t('nav.age'), component: AgePyramid },
		{ id: 'sex', label: t('nav.sex'), component: SexComparison },
		{ id: 'region', label: t('nav.region'), component: RegionalRanking },
		{ id: 'trends', label: t('nav.trends'), component: TrendLine },
		{ id: 'sdi', label: t('nav.sdi'), component: SDIScatter },
		{ id: 'prison', label: t('nav.prison'), component: PrisonPrevalence },
		{ id: 'comorbid', label: t('nav.comorbid'), component: ComorbidityBreakdown },
		{ id: 'sud', label: t('nav.sud'), component: SUDbySubstance },
		{ id: 'sudsex', label: t('nav.sudsex'), component: SexDiffSUD },
		{ id: 'suicide', label: t('nav.suicide'), component: SuicideRisk },
		{ id: 'prisonmh', label: t('nav.prisonmh'), component: PrisonMentalHealthLink },
		{ id: 'wealth', label: t('nav.wealth'), component: WealthVsWellbeing },
		{ id: 'happiness', label: t('nav.happiness'), component: HappinessRankings },
		{ id: 'hdi', label: t('nav.hdi'), component: HDIExplorer },
		{ id: 'economy', label: t('nav.economy'), component: EconomicSnapshot },
		{ id: 'education', label: t('nav.education'), component: EducationPressure },
		{ id: 'governance', label: t('nav.governance'), component: GovernanceRadar },
		{ id: 'healthtrends', label: t('nav.healthtrends'), component: GlobalHealthTrends },
		{ id: 'treatment', label: t('nav.treatment'), component: TreatmentAccessIndex },
		{ id: 'dataexplorer', label: t('nav.dataexplorer'), component: DataExplorer }
	]);

	const CATEGORIES = $derived<Category[]>([
		{ name: t('categories.overview'), ids: ['worldmap', 'mhmap', 'stats', 'timeline'] },
		{ name: t('categories.demographics'), ids: ['age', 'sex', 'region', 'trends', 'sdi'] },
		{ name: t('categories.adhd'), ids: ['prison', 'comorbid', 'sud', 'sudsex', 'suicide', 'prisonmh'] },
		{ name: t('categories.socioeconomic'), ids: ['wealth', 'happiness', 'hdi', 'economy', 'education', 'governance', 'healthtrends', 'treatment'] },
		{ name: t('categories.reference'), ids: ['dataexplorer'] }
	]);

	const CUSTOM_LIST_KEY = 'custom-pages-list';
	const STORAGE_KEY = 'sidebar-component-order';
	const HIDDEN_KEY = 'sidebar-hidden-ids';
	const COLLECTION_KEY = 'chartbook-collection';

	function loadCustomPages(): CustomEntry[] {
		const fromDisk: CustomEntry[] = Array.isArray(customDefaults)
			? (customDefaults as any[]).map((p) => ({ id: String(p.id), title: String(p.title ?? 'Untitled') }))
			: [];
		try {
			const raw = localStorage.getItem(CUSTOM_LIST_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) {
					const byId = new Map<string, string>();
					for (const p of fromDisk) byId.set(p.id, p.title);
					for (const p of parsed) {
						if (p && typeof p.id === 'string') byId.set(p.id, String(p.title ?? 'Untitled'));
					}
					return [...byId.entries()].map(([id, title]) => ({ id, title }));
				}
			}
		} catch {}
		return fromDisk;
	}

	function saveCustomPages(pages: CustomEntry[]) {
		try {
			localStorage.setItem(CUSTOM_LIST_KEY, JSON.stringify(pages));
		} catch {}
	}

	let customPages = $state<CustomEntry[]>(loadCustomPages());

	function loadHidden(): string[] {
		try {
			const raw = localStorage.getItem(HIDDEN_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === 'string');
			}
		} catch {}
		return [];
	}

	let hiddenIds = $state<string[]>(loadHidden());

	function saveHidden(ids: string[]) {
		try {
			localStorage.setItem(HIDDEN_KEY, JSON.stringify(ids));
		} catch {}
	}

	function loadCollection(): string {
		try {
			const raw = localStorage.getItem(COLLECTION_KEY);
			if (raw && COLLECTIONS.some((c) => c.id === raw)) return raw;
		} catch {}
		return DEFAULT_COLLECTION_ID;
	}

	function saveCollection(id: string) {
		try {
			localStorage.setItem(COLLECTION_KEY, id);
		} catch {}
	}

	let activeCollectionId = $state<string>(loadCollection());

	const ALL_COMPONENTS = $derived<ComponentEntry[]>([
		...COMPONENTS,
		...customPages.map((p) => ({ id: p.id, label: p.title, component: CustomPage }))
	]);

	const VISIBLE_IDS = $derived(
		new Set(ALL_COMPONENTS.map((c) => c.id).filter((id) => !hiddenIds.includes(id)))
	);

	const activeCollection = $derived(
		COLLECTIONS.find((c) => c.id === activeCollectionId) ?? COLLECTIONS[0]
	);

	// Custom pages are global — they show in every collection.
	const inActiveCollection = (id: string) =>
		id.startsWith('custom-') || activeCollection.viewIds.includes(id);

	const ALL_CATEGORIES = $derived<Category[]>(
		customPages.length > 0
			? [...CATEGORIES, { name: t('categories.myPages'), ids: customPages.map((p) => p.id).filter((id) => VISIBLE_IDS.has(id)) }]
			: CATEGORIES
	);

	function loadOrder(): string[] {
		const validIds = [...COMPONENTS.map((c) => c.id), ...customPages.map((p) => p.id)];
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed)) {
					const valid = parsed.filter((id: any) => validIds.includes(id));
					const missing = validIds.filter((id) => !valid.includes(id));
					return [...valid, ...missing];
				}
			}
		} catch {}
		return validIds;
	}

	function saveOrder(order: string[]) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
	}

	let componentOrder = $state<string[]>(loadOrder());

	const orderedComponents = $derived(
		componentOrder
			.map((id) => ALL_COMPONENTS.find((c) => c.id === id))
			.filter(Boolean)
			.filter((c) => VISIBLE_IDS.has((c as ComponentEntry).id))
			.filter((c) => inActiveCollection((c as ComponentEntry).id)) as ComponentEntry[]
	);

	// Static default — ids never change across locales, so this stays a const.
	const defaultId = 'worldmap';
	let activeId = $state(defaultId);
	let sidebarCollapsed = $state(false);
	let settingsOpen = $state(false);
	let inspectorOpen = $state(false);

	const activeCustom = $derived(customPages.find((p) => p.id === activeId) ?? null);

	const activeIndex = $derived(orderedComponents.findIndex((c) => c.id === activeId));

	function handleReorder(fromIndex: number, toIndex: number) {
		const newOrder = [...componentOrder];
		const [moved] = newOrder.splice(fromIndex, 1);
		newOrder.splice(toIndex, 0, moved);
		componentOrder = newOrder;
		saveOrder(newOrder);
	}

	async function handleAddPage() {
		const rawTitle = (window as any).__newPageTitle as string | undefined;
		(window as any).__newPageTitle = undefined;
		const title = (rawTitle?.trim() || interpolate(t('common.untitled'), { n: customPages.length + 1 })).slice(0, 80);
		// Optimistic local id (stable; UI title is renameable separately)
		const id = `custom-${Date.now().toString(36)}`;
		customPages = [...customPages, { id, title }];
		saveCustomPages(customPages);
		componentOrder = [...componentOrder, id];
		saveOrder(componentOrder);
		// Auto-navigate to the new page, close settings
		activeId = id;
		inspectorOpen = false;
		settingsOpen = false;
		// Best-effort disk persistence via node API (so it shows "forever")
		try {
			const res = await fetch('/api/custom-pages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title })
			});
			if (res.ok) {
				const saved = await res.json();
				if (saved?.id && saved.id !== id) {
					// Swap temp id for disk id, stay on the new page
					customPages = customPages.map((p) => (p.id === id ? { id: saved.id, title: saved.title } : p));
					saveCustomPages(customPages);
					componentOrder = componentOrder.map((cid) => (cid === id ? saved.id : cid));
					saveOrder(componentOrder);
					activeId = saved.id;
				}
			}
		} catch {}
	}

	async function handleRenamePage(id: string, newTitle: string) {
		customPages = customPages.map((p) => (p.id === id ? { ...p, title: newTitle } : p));
		saveCustomPages(customPages);
		try {
			await fetch('/api/custom-pages', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, title: newTitle })
			});
		} catch {}
	}

	function handleToggleHide(id: string) {
		hiddenIds = hiddenIds.includes(id) ? hiddenIds.filter((x) => x !== id) : [...hiddenIds, id];
		saveHidden(hiddenIds);
		// If we hid the active page, move to first visible
		if (hiddenIds.includes(activeId)) {
			const first = orderedComponents.find((c) => c.id !== activeId);
			if (first) activeId = first.id;
		}
	}

	function handleShowAll() {
		hiddenIds = [];
		saveHidden(hiddenIds);
	}

	function handleSelectCollection(id: string) {
		if (id === activeCollectionId) return;
		activeCollectionId = id;
		saveCollection(id);
		inspectorOpen = false;
	}

	// Keep the active page visible across collection switches, hides, and reloads.
	$effect(() => {
		if (!orderedComponents.some((c) => c.id === activeId)) {
			const first = orderedComponents[0];
			activeId = first ? first.id : defaultId;
		}
	});

	async function handleDeletePage(id: string) {
		customPages = customPages.filter((p) => p.id !== id);
		saveCustomPages(customPages);
		componentOrder = componentOrder.filter((cid) => cid !== id);
		saveOrder(componentOrder);
		hiddenIds = hiddenIds.filter((x) => x !== id);
		saveHidden(hiddenIds);
		try {
			localStorage.removeItem(`custom-page-${id}`);
		} catch {}
		try {
			await fetch('/api/custom-pages', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
		} catch {}
		if (activeId === id) {
			const first = orderedComponents.find((c) => c.id !== id);
			activeId = first ? first.id : defaultId;
			inspectorOpen = false;
		}
	}

	// ---- Inspector (top gear): about-this-view info for current page ----
	const activeEntry = $derived(ALL_COMPONENTS.find((c) => c.id === activeId) ?? null);
	const inspectorInfo = $derived(activeCustom ? null : (VIEW_INFO[activeId] ?? null));

	const settingsItems = $derived(
		ALL_COMPONENTS.map((c) => ({
			id: c.id,
			label: c.label,
			isCustom: c.id.startsWith('custom-'),
			hidden: hiddenIds.includes(c.id)
		}))
	);

	function handleKeydown(e: KeyboardEvent) {
		const tag = (e.target as HTMLElement)?.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			if (activeIndex === -1) return;
			const next = (activeIndex + 1) % orderedComponents.length;
			activeId = orderedComponents[next].id;
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			if (activeIndex === -1) return;
			const prev = (activeIndex - 1 + orderedComponents.length) % orderedComponents.length;
			activeId = orderedComponents[prev].id;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="app-shell">
	<Sidebar
		items={orderedComponents.map((c) => ({ id: c.id, label: c.label }))}
		categories={ALL_CATEGORIES}
		{activeId}
		onSelect={(id) => { activeId = id; inspectorOpen = false; }}
		onReorder={handleReorder}
		onOpenSettings={() => (settingsOpen = true)}
		bind:collapsed={sidebarCollapsed}
	/>

	<main class="content">
		<div class="top-right">
			<LanguageSwitcher />
			<button
				class="page-gear"
				onclick={() => (inspectorOpen = !inspectorOpen)}
				title={t('common.aboutThisView')}
				aria-label={t('common.aboutThisView')}
			>
				ⓘ
			</button>
		</div>
		<PageInspector
			open={inspectorOpen}
			title={activeEntry?.label ?? activeId}
			sub={activeCustom ? t('common.customPageSub') : t('common.builtInView')}
			info={inspectorInfo}
			isCustom={activeCustom !== null}
			onClose={() => (inspectorOpen = false)}
		/>
		{#key activeId}
			<div class="component-wrapper">
			{#if activeCustom}
				<CustomPage pageId={activeCustom.id} title={activeCustom.title} onRename={handleRenamePage} />
			{:else if activeId === 'worldmap'}
				<WorldMap />
			{:else if activeId === 'stats'}
				<StatsView />
			{:else if activeId === 'timeline'}
				<TimelineView />
			{:else if activeId === 'age'}
				<AgePyramid />
			{:else if activeId === 'sex'}
				<SexComparison />
			{:else if activeId === 'region'}
				<RegionalRanking />
			{:else if activeId === 'trends'}
				<TrendLine />
			{:else if activeId === 'sdi'}
				<SDIScatter />
			{:else if activeId === 'prison'}
				<PrisonPrevalence />
			{:else if activeId === 'comorbid'}
				<ComorbidityBreakdown />
			{:else if activeId === 'sud'}
				<SUDbySubstance />
			{:else if activeId === 'suicide'}
				<SuicideRisk />
			{:else if activeId === 'sudsex'}
				<SexDiffSUD />
			{:else if activeId === 'mhmap'}
				<MentalHealthWorldMap />
			{:else if activeId === 'wealth'}
				<WealthVsWellbeing />
			{:else if activeId === 'treatment'}
				<TreatmentAccessIndex />
			{:else if activeId === 'education'}
				<EducationPressure />
			{:else if activeId === 'prisonmh'}
				<PrisonMentalHealthLink />
			{:else if activeId === 'happiness'}
				<HappinessRankings />
			{:else if activeId === 'hdi'}
				<HDIExplorer />
			{:else if activeId === 'governance'}
				<GovernanceRadar />
			{:else if activeId === 'healthtrends'}
				<GlobalHealthTrends />
			{:else if activeId === 'economy'}
				<EconomicSnapshot />
			{:else if activeId === 'dataexplorer'}
				<DataExplorer />
			{/if}
			</div>
		{/key}
	</main>

	<Settings
		open={settingsOpen}
		items={settingsItems}
		collections={COLLECTIONS}
		activeCollectionId={activeCollectionId}
		onSelectCollection={handleSelectCollection}
		onClose={() => (settingsOpen = false)}
		onNewPage={handleAddPage}
		onToggleHide={handleToggleHide}
		onDelete={handleDeletePage}
		onShowAll={handleShowAll}
		onSelect={(id) => (activeId = id)}
	/>
</div>

<style>
	:global(body) {
		margin: 0;
		background: #1a1a2e;
		color: #e0e0e0;
		font-family: 'Inter', 'Noto Sans Devanagari', system-ui, -apple-system, sans-serif;
		overflow: hidden;
	}

	.app-shell {
		display: flex;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	.content {
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	.component-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.page-gear {
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(15, 15, 30, 0.85);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: #888;
		font-size: 1rem;
		cursor: pointer;
	}
	.top-right {
		position: absolute;
		top: 0.75rem;
		right: 0.9rem;
		z-index: 110;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.page-gear:hover {
		color: #fff;
		border-color: rgba(99, 102, 241, 0.4);
	}
</style>
