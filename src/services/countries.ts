import { CountryInfo } from '../types/api';

export async function fetchCountryInfo(
  countryName: string,
  signal?: AbortSignal
): Promise<CountryInfo> {
  const cleanCountry = countryName.trim();
  if (!cleanCountry) {
    throw new Error('Country name is required');
  }

  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(cleanCountry)}?fullText=false`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`REST Countries API returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`No country data found for "${countryName}"`);
  }

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
