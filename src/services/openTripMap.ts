import { AttractionPlace } from '../types/api';

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
const OPENTRIPMAP_KEY = import.meta.env.VITE_OPENTRIPMAP_KEY;

// Fallback curated attractions for popular destinations
const CITY_FALLBACK_ATTRACTIONS: Record<string, AttractionPlace[]> = {
  paris: [
    {
      xid: 'paris-eiffel',
      name: 'Eiffel Tower',
      kinds: 'historic,architecture,towers',
      point: { lon: 2.2945, lat: 48.8584 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80' },
      wikipedia: 'https://en.wikipedia.org/wiki/Eiffel_Tower',
      category: 'attraction',
    },
    {
      xid: 'paris-louvre',
      name: 'Louvre Museum',
      kinds: 'museums,art_galleries,historic',
      point: { lon: 2.3376, lat: 48.8606 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80' },
      wikipedia: 'https://en.wikipedia.org/wiki/Louvre',
      category: 'attraction',
    },
    {
      xid: 'paris-notredame',
      name: 'Notre-Dame Cathedral',
      kinds: 'religion,cathedrals,historic',
      point: { lon: 2.3499, lat: 48.853 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80' },
      wikipedia: 'https://en.wikipedia.org/wiki/Notre-Dame_de_Paris',
      category: 'attraction',
    },
    {
      xid: 'paris-bistrot',
      name: 'Le Comptoir du Relais',
      kinds: 'foods,restaurants',
      point: { lon: 2.3387, lat: 48.8519 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
      category: 'restaurant',
    },
  ],
  tokyo: [
    {
      xid: 'tokyo-sensoji',
      name: 'Senso-ji Temple',
      kinds: 'religion,temples,historic',
      point: { lon: 139.7967, lat: 35.7148 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
      wikipedia: 'https://en.wikipedia.org/wiki/Sens%C5%8D-ji',
      category: 'attraction',
    },
    {
      xid: 'tokyo-shibuya',
      name: 'Shibuya Crossing & Hachiko',
      kinds: 'urban,architecture,landmarks',
      point: { lon: 139.7006, lat: 35.6595 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80' },
      category: 'attraction',
    },
    {
      xid: 'tokyo-skytree',
      name: 'Tokyo Skytree',
      kinds: 'towers,viewpoints,architecture',
      point: { lon: 139.8107, lat: 35.7101 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80' },
      category: 'attraction',
    },
    {
      xid: 'tokyo-ramen',
      name: 'Ichiran Shibuya',
      kinds: 'foods,restaurants',
      point: { lon: 139.7013, lat: 35.6601 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
      category: 'restaurant',
    },
  ],
  istanbul: [
    {
      xid: 'ist-hagiasophia',
      name: 'Hagia Sophia',
      kinds: 'historic,religion,mosques,museums',
      point: { lon: 28.9802, lat: 41.0086 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80' },
      wikipedia: 'https://en.wikipedia.org/wiki/Hagia_Sophia',
      category: 'attraction',
    },
    {
      xid: 'ist-bluemosque',
      name: 'Sultan Ahmed (Blue) Mosque',
      kinds: 'historic,religion,mosques',
      point: { lon: 28.9768, lat: 41.0054 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80' },
      category: 'attraction',
    },
    {
      xid: 'ist-grandbazaar',
      name: 'Grand Bazaar (Kapalıçarşı)',
      kinds: 'markets,shopping,historic',
      point: { lon: 28.968, lat: 41.0107 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80' },
      category: 'attraction',
    },
    {
      xid: 'ist-galata',
      name: 'Galata Tower',
      kinds: 'towers,viewpoints,historic',
      point: { lon: 28.9741, lat: 41.0256 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80' },
      category: 'attraction',
    },
  ],
};

const CATEGORY_SAMPLE_IMAGES: Record<string, string> = {
  attraction: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  culture: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80',
};

export async function fetchAttractions(
  lat: number,
  lon: number,
  cityName?: string,
  signal?: AbortSignal
): Promise<AttractionPlace[]> {
  const cityKey = cityName ? cityName.trim().toLowerCase() : '';

  // 1. Primary Alternative: Geoapify Places API v2 (powers attractions with user's Geoapify key!)
  if (GEOAPIFY_KEY && GEOAPIFY_KEY.trim() !== '' && GEOAPIFY_KEY !== 'your_geoapify_key_here') {
    try {
      const categories = 'tourism.sights,tourism.attraction,entertainment.museum,catering.restaurant,accommodation.hotel';
      const geoapifyPlacesUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},15000&bias=proximity:${lon},${lat}&limit=20&apiKey=${GEOAPIFY_KEY}`;

      const response = await fetch(geoapifyPlacesUrl, { signal });
      if (response.ok) {
        const data = await response.json();
        if (data.features && Array.isArray(data.features) && data.features.length > 0) {
          const validPlaces = data.features
            .filter((f: any) => f.properties?.name && f.properties.name.trim().length > 1)
            .map((f: any) => {
              const p = f.properties;
              const cats = Array.isArray(p.categories) ? p.categories.join(' ') : (p.categories || '');

              let cat: 'attraction' | 'restaurant' | 'hotel' | 'culture' = 'attraction';
              if (cats.includes('catering') || cats.includes('restaurant') || cats.includes('cafe')) {
                cat = 'restaurant';
              } else if (cats.includes('accommodation') || cats.includes('hotel')) {
                cat = 'hotel';
              } else if (cats.includes('museum') || cats.includes('entertainment') || cats.includes('historic')) {
                cat = 'culture';
              }

              // Check if Wikimedia Commons photo is available
              const wikiMediaFile = p.wiki_and_media?.wikimedia_commons || p.datasource?.raw?.wikimedia_commons;
              const previewImg = wikiMediaFile
                ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(wikiMediaFile.replace('File:', ''))}?width=600`
                : CATEGORY_SAMPLE_IMAGES[cat];

              return {
                xid: p.place_id || `geo-place-${p.lat}-${p.lon}`,
                name: p.name,
                kinds: cats,
                point: {
                  lon: p.lon ?? lon,
                  lat: p.lat ?? lat,
                },
                rate: 3,
                preview: { source: previewImg },
                category: cat,
                wikipedia: p.wiki_and_media?.wikipedia,
              };
            });

          if (validPlaces.length > 0) {
            return validPlaces.slice(0, 18);
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      console.warn('Geoapify Places API query failed, trying alternatives', err);
    }
  }

  // 2. Secondary Alternative: Free Wikipedia Geosearch (No API Key Required!)
  try {
    const wikiGeoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=10000&gslimit=12&format=json&origin=*`;
    const wikiResponse = await fetch(wikiGeoUrl, { signal });
    if (wikiResponse.ok) {
      const wikiData = await wikiResponse.json();
      if (wikiData.query?.geosearch && Array.isArray(wikiData.query.geosearch) && wikiData.query.geosearch.length > 0) {
        return wikiData.query.geosearch.map((item: any) => ({
          xid: `wiki-geo-${item.pageid}`,
          name: item.title,
          kinds: 'historic,sightseeing,wikipedia',
          point: { lon: item.lon, lat: item.lat },
          rate: 3,
          preview: { source: CATEGORY_SAMPLE_IMAGES.attraction },
          wikipedia: `https://en.wikipedia.org/?curid=${item.pageid}`,
          category: 'attraction',
        }));
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    console.warn('Wikipedia Geosearch failed, checking OpenTripMap', err);
  }

  // 3. OpenTripMap (if key provided)
  if (OPENTRIPMAP_KEY && OPENTRIPMAP_KEY.trim() !== '' && OPENTRIPMAP_KEY !== 'your_opentripmap_key_here') {
    try {
      const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=12000&lon=${lon}&lat=${lat}&rate=2&format=json&apikey=${OPENTRIPMAP_KEY}`;
      const response = await fetch(url, { signal });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const filtered = data
            .filter((p: any) => p.name && p.name.trim().length > 0)
            .slice(0, 15)
            .map((item: any) => ({
              xid: item.xid || `${item.point?.lat}-${item.point?.lon}`,
              name: item.name,
              kinds: item.kinds || 'historic,interesting_places',
              point: { lon: item.point?.lon ?? lon, lat: item.point?.lat ?? lat },
              rate: item.rate ?? 3,
              preview: item.preview?.source ? { source: item.preview.source } : undefined,
              wikipedia: item.wikipedia,
              category: (item.kinds?.includes('food') ? 'restaurant' : 'attraction') as any,
            }));
          if (filtered.length > 0) return filtered;
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
    }
  }

  // 4. Curated city highlights fallback
  if (cityKey && CITY_FALLBACK_ATTRACTIONS[cityKey]) {
    return CITY_FALLBACK_ATTRACTIONS[cityKey];
  }

  // 5. High-quality generic landmarks near coordinates
  return [
    {
      xid: `attr-${lat.toFixed(2)}-1`,
      name: `${cityName || 'City'} Historic Center`,
      kinds: 'historic,architecture,cultural',
      point: { lon: lon + 0.005, lat: lat + 0.003 },
      rate: 3,
      preview: { source: CATEGORY_SAMPLE_IMAGES.attraction },
      category: 'attraction',
    },
    {
      xid: `attr-${lat.toFixed(2)}-2`,
      name: `${cityName || 'City'} Central Square & Markets`,
      kinds: 'markets,shopping,culture',
      point: { lon: lon - 0.004, lat: lat + 0.002 },
      rate: 3,
      preview: { source: CATEGORY_SAMPLE_IMAGES.attraction },
      category: 'attraction',
    },
    {
      xid: `attr-${lat.toFixed(2)}-3`,
      name: `Grand Viewpoint & Waterfront`,
      kinds: 'viewpoints,natural,landmarks',
      point: { lon: lon + 0.008, lat: lat - 0.005 },
      rate: 3,
      preview: { source: CATEGORY_SAMPLE_IMAGES.culture },
      category: 'culture',
    },
    {
      xid: `attr-${lat.toFixed(2)}-4`,
      name: `Local Traditional Dining Bistro`,
      kinds: 'foods,restaurants,cafes',
      point: { lon: lon - 0.002, lat: lat - 0.004 },
      rate: 3,
      preview: { source: CATEGORY_SAMPLE_IMAGES.restaurant },
      category: 'restaurant',
    },
  ];
}
