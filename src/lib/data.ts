import worldbankRaw from '../../data/worldbank_indicators.json';
import whoRaw from '../../data/who_health_indicators.json';
import whrRaw from '../../data/world_happiness_report_2026.json';
import undpRaw from '../../data/undp_hdi.json';
import governanceRaw from '../../data/transparency_cpi_2024.json';
import prisonRaw from '../../data/world_prison_brief.json';
import educationRaw from '../../data/education_indicators.json';
import { nameToIso2 } from './mapData';

const WB = worldbankRaw as Record<string, { country_code: string; country: string; year: string; value: number }[]>;
const WHO = whoRaw as Record<string, { country_code: string; year: number; sex: string | null; value: number; low: number | null; high: number | null }[]>;
const WHR = whrRaw as Record<string, { Year: number; Rank: number; 'Country name': string; 'Life evaluation (3-year average)': number; 'Explained by: Log GDP per capita': number; 'Explained by: Social support': number; 'Explained by: Healthy life expectancy': number; 'Explained by: Freedom to make life choices': number; 'Explained by: Generosity': number; 'Explained by: Perceptions of corruption': number; 'Dystopia + residual': number }[]>;
const GOV = governanceRaw as Record<string, { country_code: string; country: string; year: string; value: number }[]>;
const PRISON = prisonRaw as { rank: number; country: string | null; prison_population_total: number; prison_population_rate_per_100k: number }[];
const EDU = educationRaw as Record<string, { country_code: string; country: string; year: string; value: number }[]>;

const WORLD_BANK_AGGREGATES = new Set([
	'AFE','AFW','ARB','CEB','CSS','EAP','EAR','EAS','ECA','ECS','EMU','EUU',
	'FCS','HPC','IBD','IBT','IDA','IDB','IDX','INX','LAC','LCN','LDC','LIC',
	'LMC','LMY','LTE','MEA','MNA','NAC','OED','OSS','PRE','PSS','PST',
	'SAS','SSA','SSF','SST','TEA','TEC','TLA','TMN','TSA','TSS','UMC','WLD'
]);

function isCountryCode(code: string): boolean {
	return !WORLD_BANK_AGGREGATES.has(code) && code.length === 3;
}

function latestPerCountry<T extends { country_code: string; year: string | number }>(rows: T[]): T[] {
	const map = new Map<string, T>();
	for (const r of rows) {
		if (!isCountryCode(r.country_code)) continue;
		const y = Number(r.year);
		const existing = map.get(r.country_code);
		if (!existing || y > Number(existing.year)) {
			map.set(r.country_code, r);
		}
	}
	return Array.from(map.values());
}

function latestPerCountrySex(rows: { country_code: string; year: number; sex: string | null; value: number; low: number | null; high: number | null }[]) {
	const map = new Map<string, { country_code: string; year: number; sex: string; value: number; low: number; high: number }>();
	for (const r of rows) {
		if (!isCountryCode(r.country_code)) continue;
		if (r.sex !== 'SEX_BTSX') continue;
		const existing = map.get(r.country_code);
		if (!existing || r.year > existing.year) {
			map.set(r.country_code, { country_code: r.country_code, year: r.year, sex: r.sex, value: r.value, low: r.low ?? 0, high: r.high ?? 0 });
		}
	}
	return Array.from(map.values());
}

function percentileRanks(values: Map<string, number>): Map<string, number> {
	const sorted = Array.from(values.entries()).sort((a, b) => a[1] - b[1]);
	const n = sorted.length;
	const result = new Map<string, number>();
	for (let i = 0; i < sorted.length; i++) {
		result.set(sorted[i][0], ((i + 1) / n) * 100);
	}
	return result;
}

function iso3To2(code3: string): string | undefined {
	const row = WB.gdp_per_capita?.find(r => r.country_code === code3);
	if (row) {
		const iso2 = nameToIso2(row.country);
		if (iso2) return iso2;
	}
	return undefined;
}

export const happinessData = (() => {
	const key = Object.keys(WHR)[0];
	const rows = WHR[key] ?? [];
	return rows.map(r => ({
		country: r['Country name'],
		year: r.Year,
		rank: r.Rank,
		score: r['Life evaluation (3-year average)'],
		gdp: r['Explained by: Log GDP per capita'],
		social: r['Explained by: Social support'],
		health: r['Explained by: Healthy life expectancy'],
		freedom: r['Explained by: Freedom to make life choices'],
		generosity: r['Explained by: Generosity'],
		corruption: r['Explained by: Perceptions of corruption'],
		dystopia: r['Dystopia + residual']
	}));
})();

export const happinessLatest = (() => {
	const years = happinessData.map(r => r.year);
	const maxYear = Math.max(...years);
	return happinessData.filter(r => r.year === maxYear).sort((a, b) => a.rank - b.rank);
})();

export const happinessYears = (() => {
	const years = [...new Set(happinessData.map(r => r.year))].sort((a, b) => a - b);
	return years;
})();

export function happinessForYear(year: number) {
	return happinessData.filter(r => r.year === year).sort((a, b) => a.rank - b.rank);
}

export const gdpPerCapita = (() => {
	const rows = latestPerCountry(WB.gdp_per_capita ?? []);
	return new Map(rows.map(r => [r.country_code, r.value]));
})();

export const gdpLatestRows = latestPerCountry(WB.gdp_per_capita ?? []);

export const depressionData = latestPerCountrySex(WHO.mental_health_depression ?? []);
export const anxietyData = latestPerCountrySex(WHO.mental_health_anxiety ?? []);
export const schizophreniaData = latestPerCountrySex(WHO.mental_health_schizophrenia ?? []);
export const eatingDisordersData = latestPerCountrySex(WHO.mental_health_eating_disorders ?? []);
export const alcoholData = latestPerCountrySex(WHO.substance_use_alcohol ?? []);
export const drugsData = latestPerCountrySex(WHO.substance_use_drugs ?? []);

export const mentalHealthByCountry = (() => {
	const map = new Map<string, { depression?: number; anxiety?: number; schizophrenia?: number; eating?: number; alcohol?: number; drugs?: number }>();
	for (const r of depressionData) {
		const existing = map.get(r.country_code) ?? {};
		existing.depression = r.value;
		map.set(r.country_code, existing);
	}
	for (const r of anxietyData) {
		const existing = map.get(r.country_code) ?? {};
		existing.anxiety = r.value;
		map.set(r.country_code, existing);
	}
	for (const r of schizophreniaData) {
		const existing = map.get(r.country_code) ?? {};
		existing.schizophrenia = r.value;
		map.set(r.country_code, existing);
	}
	for (const r of eatingDisordersData) {
		const existing = map.get(r.country_code) ?? {};
		existing.eating = r.value;
		map.set(r.country_code, existing);
	}
	for (const r of alcoholData) {
		const existing = map.get(r.country_code) ?? {};
		existing.alcohol = r.value;
		map.set(r.country_code, existing);
	}
	for (const r of drugsData) {
		const existing = map.get(r.country_code) ?? {};
		existing.drugs = r.value;
		map.set(r.country_code, existing);
	}
	return map;
})();

export const lifeExpectancyWb = (() => {
	const rows = latestPerCountry(WB.life_expectancy ?? []);
	return new Map(rows.map(r => [r.country_code, r.value]));
})();

export const populationData = (() => {
	const rows = latestPerCountry(WB.population ?? []);
	return new Map(rows.map(r => [r.country_code, r.value]));
})();

export const healthExpenditure = (() => {
	const rows = latestPerCountry(WB.health_expenditure_pct_gdp ?? []);
	return new Map(rows.map(r => [r.country_code, r.value]));
})();

export const educationExpenditure = (() => {
	const rows = latestPerCountry(WB.education_expenditure_pct_gdp ?? []);
	return new Map(rows.map(r => [r.country_code, r.value]));
})();

export const giniIndex = (() => {
	const rows = latestPerCountry(WB.gini_index ?? []);
	return new Map(rows.map(r => [r.country_code, r.value]));
})();

export const infantMortality = (() => {
	const rows = latestPerCountry(WB.infant_mortality ?? []);
	return new Map(rows.map(r => [r.country_code, r.value]));
})();

export const maternalMortality = (() => {
	const rows = latestPerCountry(WB.maternal_mortality ?? []);
	return new Map(rows.map(r => [r.country_code, r.value]));
})();

export const literacyRate = (() => {
	const rows = latestPerCountry(WB.literacy_rate ?? []);
	return new Map(rows.map(r => [r.country_code, r.value]));
})();

export const povertyRate = (() => {
	const rows = latestPerCountry(WB.poverty_rate ?? []);
	return new Map(rows.map(r => [r.country_code, r.value]));
})();

export const govIndicators = (() => {
	return {
		controlOfCorruption: new Map((GOV.control_of_corruption ?? []).filter(r => isCountryCode(r.country_code) && r.year === '2023').map(r => [r.country_code, r.value])),
		ruleOfLaw: new Map((GOV.rule_of_law ?? []).filter(r => isCountryCode(r.country_code) && r.year === '2023').map(r => [r.country_code, r.value])),
		govEffectiveness: new Map((GOV.government_effectiveness ?? []).filter(r => isCountryCode(r.country_code) && r.year === '2023').map(r => [r.country_code, r.value])),
		regulatoryQuality: new Map((GOV.regulatory_quality ?? []).filter(r => isCountryCode(r.country_code) && r.year === '2023').map(r => [r.country_code, r.value])),
		politicalStability: new Map((GOV.political_stability ?? []).filter(r => isCountryCode(r.country_code) && r.year === '2023').map(r => [r.country_code, r.value])),
		voiceAccountability: new Map((GOV.voice_accountability ?? []).filter(r => isCountryCode(r.country_code) && r.year === '2023').map(r => [r.country_code, r.value]))
	};
})();

export const govCountryNames = (() => {
	const names = new Map<string, string>();
	for (const r of (GOV.control_of_corruption ?? [])) {
		if (isCountryCode(r.country_code) && r.year === '2023') {
			names.set(r.country_code, r.country);
		}
	}
	return names;
})();

export const hdiData = (() => {
	const table = (undpRaw as any)['Table 1'] ?? [];
	const results: { rank: number; country: string; hdi: number; lifeExp: number; expectedSchooling: number; meanSchooling: number; gni: number }[] = [];
	let currentTier = '';
	for (const row of table) {
		const tierLabel = row['Table 1. Human Development Index and its components'];
		if (tierLabel && typeof tierLabel === 'string' && tierLabel.includes('HUMAN DEVELOPMENT')) {
			currentTier = tierLabel;
			continue;
		}
		if (row.Back !== null && typeof row.Back === 'number' && tierLabel && typeof tierLabel === 'string') {
			results.push({
				rank: row.Back,
				country: tierLabel,
				hdi: row.col2 ?? 0,
				lifeExp: row.col4 ?? 0,
				expectedSchooling: row.col6 ?? 0,
				meanSchooling: row.col8 ?? 0,
				gni: row.col10 ?? 0
			});
		}
	}
	return results;
})();

export const educationData = (() => {
	const ptrPrimary = latestPerCountry(EDU.pupil_teacher_ratio_primary ?? []);
	const ptrSecondary = latestPerCountry(EDU.pupil_teacher_ratio_secondary ?? []);
	const tertiaryEnroll = latestPerCountry(EDU.tertiary_enrollment_rate ?? []);
	const primaryEnroll = latestPerCountry(EDU.primary_net_enrollment ?? []);

	return {
		pupilTeacherPrimary: new Map(ptrPrimary.map(r => [r.country_code, r.value])),
		pupilTeacherSecondary: new Map(ptrSecondary.map(r => [r.country_code, r.value])),
		tertiaryEnrollment: new Map(tertiaryEnroll.map(r => [r.country_code, r.value])),
		primaryEnrollment: new Map(primaryEnroll.map(r => [r.country_code, r.value]))
	};
})();

export const prisonData = PRISON.filter(p => p.prison_population_rate_per_100k > 0);

export function computeTreatmentAccessIndex(): { country_code: string; score: number; healthExp: number; lifeExp: number }[] {
	const healthPct = percentileRanks(healthExpenditure);
	const lifePct = percentileRanks(lifeExpectancyWb);

	const bothCodes = new Set<string>();
	for (const k of healthPct.keys()) {
		if (lifePct.has(k)) bothCodes.add(k);
	}

	const results: { country_code: string; score: number; healthExp: number; lifeExp: number }[] = [];
	for (const code of bothCodes) {
		const h = healthPct.get(code)!;
		const l = lifePct.get(code)!;
		results.push({ country_code: code, score: (h + l) / 2, healthExp: h, lifeExp: l });
	}
	return results.sort((a, b) => b.score - a.score);
}

export function wbTimeSeries(indicatorKey: string, countryCode: string): { year: number; value: number }[] {
	const rows = (WB[indicatorKey] ?? []).filter(r => r.country_code === countryCode && isCountryCode(r.country_code));
	return rows.map(r => ({ year: Number(r.year), value: r.value })).sort((a, b) => a.year - b.year);
}

export function wbGlobalAverage(indicatorKey: string): { year: number; value: number }[] {
	const byYear = new Map<number, number[]>();
	const rows = (WB[indicatorKey] ?? []).filter(r => isCountryCode(r.country_code));
	for (const r of rows) {
		const y = Number(r.year);
		const arr = byYear.get(y) ?? [];
		arr.push(r.value);
		byYear.set(y, arr);
	}
	return Array.from(byYear.entries())
		.map(([y, vals]) => ({ year: y, value: vals.reduce((a, b) => a + b, 0) / vals.length }))
		.sort((a, b) => a.year - b.year);
}

export function countryName(code3: string): string {
	return (WB.gdp_per_capita ?? []).find(r => r.country_code === code3)?.country ?? code3;
}

export function countryNameToCode3(name: string): string | undefined {
	return (WB.gdp_per_capita ?? []).find(r => r.country.toLowerCase() === name.toLowerCase())?.country_code;
}

export const INCOME_GROUPS: Record<string, string[]> = {
	'Low Income': ['AFG','BEN','BFA','BDI','CAF','TCD','COD','ERI','ETH','GMB','GNB','KEN','LBR','MDG','MWI','MLI','MOZ','NER','RWA','SLE','SOM','SSD','SDN','TZA','UGA','ZMB','ZWE'],
	'Lower Middle': ['BGD','BTN','CMR','COG','CIV','DMA','SLV','GHA','GTM','GUY','HND','IND','IDN','IRN','IRQ','JOR','KHM','KOS','KGZ','LAO','LBN','LSO','MAR','MHL','MRT','MNG','MAR','MMR','NPL','NIC','NGA','PAK','PNG','PHL','SEN','SLB','LKA','SUR','SYR','TJK','TLS','TUN','TUV','UKR','UZB','VUT','VNM','YEM','PSE'],
	'Upper Middle': ['ALB','DZA','ARG','ARM','AZE','BLR','BOL','BIH','BRA','CHN','COL','CRI','CUB','DOM','ECU','FJI','GAB','GRD','IDN','IRN','JAM','KAZ','LBY','MYS','MEX','MNE','NAM','PRY','PER','ROU','RUS','SRB','ZAF','LCA','MKD','THA','TON','TUR','TKM','TUR','URY','VEN'],
	'High Income': ['AND','AUS','AUT','BHS','BHR','BRB','BEL','BRN','CAN','CHL','HRV','CYP','CZE','DNK','EST','FIN','FRA','DEU','GRC','HKG','HUN','ISL','IRL','ISR','ITA','JPN','KOR','KWT','LVA','LTU','LUX','MAC','MLT','MRT','MCO','NLD','NZL','NOR','OMN','PLW','POL','PRT','QAT','SAU','SGP','SVK','SVN','ESP','SWE','CHE','TWN','TTO','ARE','GBR','USA','URY'
	]
};

export function getIncomeGroup(code3: string): string {
	for (const [group, codes] of Object.entries(INCOME_GROUPS)) {
		if (codes.includes(code3)) return group;
	}
	return 'Unknown';
}

export function iso3ToIso2(code3: string): string | undefined {
	const row = (WB.gdp_per_capita ?? []).find(r => r.country_code === code3);
	if (row) {
		const iso2 = nameToIso2(row.country);
		if (iso2) return iso2;
	}
	return undefined;
}
