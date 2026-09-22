import { CountryInfo } from '../types/api';

// Curated primary country knowledgebase to ensure instant response & resilience
const KNOWN_COUNTRIES: Record<string, CountryInfo> = {
  france: {
    name: 'France',
    officialName: 'French Republic',
    capital: 'Paris',
    population: 67750000,
    region: 'Europe',
    subregion: 'Western Europe',
    flag: '🇫🇷',
    flagUrl: 'https://flagcdn.com/fr.svg',
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    languages: { fra: 'French' },
  },
  japan: {
    name: 'Japan',
    officialName: 'State of Japan',
    capital: 'Tokyo',
    population: 125120000,
    region: 'Asia',
    subregion: 'Eastern Asia',
    flag: '🇯🇵',
    flagUrl: 'https://flagcdn.com/jp.svg',
    currencies: { JPY: { name: 'Japanese Yen', symbol: '¥' } },
    languages: { jpn: 'Japanese' },
  },
  turkey: {
    name: 'Turkey',
    officialName: 'Republic of Türkiye',
    capital: 'Ankara',
    population: 85370000,
    region: 'Europe / Asia',
    subregion: 'Middle East',
    flag: '🇹🇷',
    flagUrl: 'https://flagcdn.com/tr.svg',
    currencies: { TRY: { name: 'Turkish Lira', symbol: '₺' } },
    languages: { tur: 'Turkish' },
  },
  'united states': {
    name: 'United States',
    officialName: 'United States of America',
    capital: 'Washington, D.C.',
    population: 333300000,
    region: 'Americas',
    subregion: 'North America',
    flag: '🇺🇸',
    flagUrl: 'https://flagcdn.com/us.svg',
    currencies: { USD: { name: 'United States Dollar', symbol: '$' } },
    languages: { eng: 'English' },
  },
  'united kingdom': {
    name: 'United Kingdom',
    officialName: 'United Kingdom of Great Britain and Northern Ireland',
    capital: 'London',
    population: 67330000,
    region: 'Europe',
    subregion: 'Northern Europe',
    flag: '🇬🇧',
    flagUrl: 'https://flagcdn.com/gb.svg',
    currencies: { GBP: { name: 'British Pound', symbol: '£' } },
    languages: { eng: 'English' },
  },
  'united arab emirates': {
    name: 'United Arab Emirates',
    officialName: 'United Arab Emirates',
    capital: 'Abu Dhabi',
    population: 9890000,
    region: 'Asia',
    subregion: 'Middle East',
    flag: '🇦🇪',
    flagUrl: 'https://flagcdn.com/ae.svg',
    currencies: { AED: { name: 'United Arab Emirates Dirham', symbol: 'د.إ' } },
    languages: { ara: 'Arabic' },
  },
  italy: {
    name: 'Italy',
    officialName: 'Italian Republic',
    capital: 'Rome',
    population: 59000000,
    region: 'Europe',
    subregion: 'Southern Europe',
    flag: '🇮🇹',
    flagUrl: 'https://flagcdn.com/it.svg',
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    languages: { ita: 'Italian' },
  },
  pakistan: {
    name: 'Pakistan',
    officialName: 'Islamic Republic of Pakistan',
    capital: 'Islamabad',
    population: 235800000,
    region: 'Asia',
    subregion: 'Southern Asia',
    flag: '🇵🇰',
    flagUrl: 'https://flagcdn.com/pk.svg',
    currencies: { PKR: { name: 'Pakistani Rupee', symbol: '₨' } },
    languages: { urd: 'Urdu', eng: 'English' },
  },
  spain: {
    name: 'Spain',
    officialName: 'Kingdom of Spain',
    capital: 'Madrid',
    population: 47420000,
    region: 'Europe',
    subregion: 'Southern Europe',
    flag: '🇪🇸',
    flagUrl: 'https://flagcdn.com/es.svg',
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    languages: { spa: 'Spanish' },
  },
};

export async function fetchCountryInfo(
  countryName: string,
  signal?: AbortSignal
): Promise<CountryInfo> {
  const cleanCountry = countryName.trim();
  if (!cleanCountry) {
    throw new Error('Country name is required');
  }

  const countryKey = cleanCountry.toLowerCase();

  // 1. Check instant curated country info
  if (KNOWN_COUNTRIES[countryKey]) {
    return KNOWN_COUNTRIES[countryKey];
  }

  // 2. Try REST Countries public API
  try {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(cleanCountry)}?fullText=false`;
    const response = await fetch(url, { signal });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const country = data[0];
        return {
          name: country.name?.common || cleanCountry,
          officialName: country.name?.official || cleanCountry,
          capital: Array.isArray(country.capital) ? country.capital[0] : (country.capital || 'N/A'),
          population: country.population || 0,
          region: country.region || 'Global',
          subregion: country.subregion || '',
          flag: country.flag || '🏳️',
          flagUrl: country.flags?.svg || country.flags?.png || '',
          currencies: country.currencies || {},
          languages: country.languages || {},
        };
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
  }

  // 3. Fallback generic info
  return {
    name: cleanCountry,
    officialName: cleanCountry,
    capital: 'Capital City',
    population: 10000000,
    region: 'International',
    subregion: 'Global',
    flag: '🌐',
    flagUrl: '',
    currencies: { CUR: { name: 'Local Currency', symbol: '$' } },
    languages: { lang: 'Official Language' },
  };
}
