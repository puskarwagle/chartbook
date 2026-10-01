/**
 * colors.ts — Tier color palette and label definitions
 *
 * Re-exports the color hex codes and tier label text from countryStatus.json's
 * _meta section. This keeps the JSON as the single source of truth for tier
 * metadata while providing a typed import path for components.
 *
 * Usage:
 *   import { COLORS, TIERS } from '$lib/colors';
 *   COLORS['1']   → "#2ecc71" (green — amphetamine available)
 *   TIERS['2']    → "Methylphenidate only"
 */
import statusData from '../../data/countryStatus.json';

/** Hex color for each tier key ('1'–'4' and 'unknown'). Sourced from countryStatus.json _meta.color_suggestion. */
export const COLORS = statusData._meta.color_suggestion;

/** Human-readable tier labels. Sourced from countryStatus.json _meta.tiers. */
export const TIERS = statusData._meta.tiers;
