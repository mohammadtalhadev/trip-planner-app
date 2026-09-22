import { WikipediaSummary } from '../types/api';

export async function fetchWikiSummary(
  cityName: string,
  signal?: AbortSignal
): Promise<WikipediaSummary> {
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

  return {
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
}
