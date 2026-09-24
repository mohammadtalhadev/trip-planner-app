import { WikipediaSummary } from '../types/api';

const WIKI_CACHE = new Map<string, WikipediaSummary>();

export async function fetchWikiSummary(
  cityName: string,
  signal?: AbortSignal
): Promise<WikipediaSummary> {
  const cacheKey = cityName.trim().toLowerCase();

  // Instant cache lookup (0ms)
  if (WIKI_CACHE.has(cacheKey)) {
    return WIKI_CACHE.get(cacheKey)!;
  }
  try {
    const local = localStorage.getItem(`tp_wiki_${cacheKey}`);
    if (local) {
      const parsed = JSON.parse(local);
      WIKI_CACHE.set(cacheKey, parsed);
      return parsed;
    }
  } catch {}

  const cleanCity = encodeURIComponent(cityName.trim());
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${cleanCity}`;

  const response = await fetch(url, {
    signal,
    headers: {
      'User-Agent': 'TripPlannerApp/1.0 (travel@tripplanner.local)',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Wikipedia page for "${cityName}" was not found.`);
    }
    throw new Error(`Wikipedia API returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  const result: WikipediaSummary = {
    title: data.title || cityName,
    extract: data.extract || 'No description available for this destination.',
    description: data.description,
    thumbnail: data.thumbnail
      ? {
          source: data.thumbnail.source,
          width: data.thumbnail.width,
          height: data.thumbnail.height,
        }
      : undefined,
    pageUrl: data.content_urls?.desktop?.page,
    coordinates: data.coordinates
      ? {
          lat: data.coordinates.lat,
          lon: data.coordinates.lon,
        }
      : undefined,
  };

  WIKI_CACHE.set(cacheKey, result);
  try {
    localStorage.setItem(`tp_wiki_${cacheKey}`, JSON.stringify(result));
  } catch {}

  return result;
}
