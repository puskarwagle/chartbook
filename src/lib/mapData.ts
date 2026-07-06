import { geoNaturalEarth1, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import countriesTopo from 'world-atlas/countries-110m.json';

export interface CountryFeature {
	id: string;
	iso2: string;
	name: string;
	path: string;
}

const world = countriesTopo as any;
const countries = topojson.feature(world, world.objects.countries) as any;
const borders = topojson.mesh(world, world.objects.countries, (a: any, b: any) => a !== b) as any;

const projection = geoNaturalEarth1().fitSize([960, 500], countries);
const pathGen = geoPath(projection);

const NUMERIC_TO_ISO2: Record<string, string> = {
	'004': 'AF', '008': 'AL', '012': 'DZ', '024': 'AO', '010': 'AQ',
	'032': 'AR', '051': 'AM', '036': 'AU', '040': 'AT', '031': 'AZ',
	'044': 'BS', '050': 'BD', '112': 'BY', '056': 'BE', '084': 'BZ',
	'204': 'BJ', '064': 'BT', '068': 'BO', '070': 'BA', '072': 'BW',
	'076': 'BR', '096': 'BN', '100': 'BG', '854': 'BF', '108': 'BI',
	'116': 'KH', '120': 'CM', '124': 'CA', '140': 'CF', '148': 'TD',
	'152': 'CL', '156': 'CN', '170': 'CO', '178': 'CG', '188': 'CR',
	'384': 'CI', '191': 'HR', '192': 'CU', '196': 'CY', '203': 'CZ',
	'180': 'CD', '208': 'DK', '262': 'DJ', '214': 'DO', '218': 'EC',
	'818': 'EG', '222': 'SV', '226': 'GQ', '232': 'ER', '233': 'EE',
	'748': 'SZ', '231': 'ET', '238': 'FK', '242': 'FJ', '260': 'TF',
	'250': 'FR', '266': 'GA', '270': 'GM', '268': 'GE', '276': 'DE',
	'288': 'GH', '300': 'GR', '304': 'GL', '320': 'GT', '324': 'GN',
	'624': 'GW', '328': 'GY', '332': 'HT', '340': 'HN', '348': 'HU',
	'352': 'IS', '356': 'IN', '360': 'ID', '364': 'IR', '368': 'IQ',
	'372': 'IE', '376': 'IL', '380': 'IT', '388': 'JM', '392': 'JP',
	'400': 'JO', '398': 'KZ', '404': 'KE', '414': 'KW', '417': 'KG',
	'418': 'LA', '428': 'LV', '422': 'LB', '426': 'LS', '430': 'LR',
	'434': 'LY', '440': 'LT', '442': 'LU', '807': 'MK', '450': 'MG',
	'454': 'MW', '458': 'MY', '466': 'ML', '478': 'MR', '484': 'MX',
	'498': 'MD', '496': 'MN', '499': 'ME', '504': 'MA', '508': 'MZ',
	'104': 'MM', '516': 'NA', '524': 'NP', '528': 'NL', '540': 'NC',
	'554': 'NZ', '558': 'NI', '562': 'NE', '566': 'NG', '408': 'KP',
	'578': 'NO', '512': 'OM', '586': 'PK', '275': 'PS', '591': 'PA',
	'598': 'PG', '600': 'PY', '604': 'PE', '608': 'PH', '616': 'PL',
	'620': 'PT', '630': 'PR', '634': 'QA', '642': 'RO', '643': 'RU',
	'646': 'RW', '728': 'SS', '682': 'SA', '686': 'SN', '688': 'RS',
	'694': 'SL', '703': 'SK', '705': 'SI', '090': 'SB', '706': 'SO',
	'710': 'ZA', '410': 'KR', '724': 'ES', '144': 'LK', '729': 'SD',
	'740': 'SR', '752': 'SE', '756': 'CH', '760': 'SY', '158': 'TW',
	'762': 'TJ', '834': 'TZ', '764': 'TH', '626': 'TL', '768': 'TG',
	'780': 'TT', '788': 'TN', '792': 'TR', '795': 'TM', '800': 'UG',
	'804': 'UA', '784': 'AE', '826': 'GB', '840': 'US', '858': 'UY',
	'860': 'UZ', '548': 'VU', '862': 'VE', '704': 'VN', '732': 'EH',
	'887': 'YE', '894': 'ZM', '716': 'ZW'
};

export const countryFeatures: CountryFeature[] = countries.features
	.filter((f: any) => f.id && NUMERIC_TO_ISO2[f.id])
	.map((f: any) => ({
		id: f.id,
		iso2: NUMERIC_TO_ISO2[f.id],
		name: f.properties.name,
		path: pathGen(f) ?? ''
	}));

export const bordersPath = pathGen(borders) ?? '';

export function iso2ToName(iso2: string): string {
	return countryFeatures.find(c => c.iso2 === iso2)?.name ?? iso2;
}

export function nameToIso2(name: string): string | undefined {
	return countryFeatures.find(c => c.name.toLowerCase() === name.toLowerCase())?.iso2;
}
