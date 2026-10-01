/**
 * brainRegions.ts — Typed wrapper over data/brain_regions.json.
 *
 * The raw dataset lives in data/brain_regions.json so it also shows up in the
 * Data Files section (DataExplorer globs data/*.json). Source of the content:
 * brain-region-info.md (repo root, kept as the reference doc).
 *
 * Each region has function *groups* (with a shared explanation and an ADHD
 * note), plus a flat list of every individual function pointing at its group.
 * The view lists every function in the center pane; the detail pane shows the
 * function's group explanation alongside the ADHD note.
 */

import raw from '../../data/brain_regions.json';

export interface BrainFunctionGroup {
	/** e.g. 'Cognitive / Executive Functions' */
	name: string;
	/** What the group does and how it relates to ADHD (from the source doc). */
	explanation: string;
	/** Short bridge line: how disruption of this group maps to ADHD symptoms. */
	adhd: string;
}

export interface BrainFunctionItem {
	title: string;
	/** Name of the owning group (matches a BrainFunctionGroup.name). */
	group: string;
}

export interface BrainRegion {
	id: string;
	name: string;
	nickname: string;
	color: string;
	summary: string;
	groups: BrainFunctionGroup[];
	functions: BrainFunctionItem[];
}

export interface BrainNetworkNote {
	functions: string[];
	explanation: string;
}

interface BrainRegionsFile {
	regions: BrainRegion[];
	networkNote: BrainNetworkNote;
}

const data = raw as BrainRegionsFile;

export const BRAIN_REGIONS: BrainRegion[] = data.regions;
export const BRAIN_NETWORK_NOTE: BrainNetworkNote = data.networkNote;
