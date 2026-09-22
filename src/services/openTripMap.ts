import { AttractionPlace } from '../types/api';

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

export async function fetchAttractions(
  lat: number,
  lon: number,
  cityName?: string,
  signal?: AbortSignal
): Promise<AttractionPlace[]> {
  const cityKey = cityName ? cityName.trim().toLowerCase() : '';

  // 1. If OpenTripMap API key is provided, query OpenTripMap
  if (OPENTRIPMAP_KEY && OPENTRIPMAP_KEY.trim() !== '' && OPENTRIPMAP_KEY !== 'your_opentripmap_key_here') {
    try {
      const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=12000&lon=${lon}&lat=${lat}&rate=2&format=json&apikey=${OPENTRIPMAP_KEY}`;

      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`OpenTripMap API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        const filtered = data
          .filter((p: any) => p.name && p.name.trim().length > 0)
          .slice(0, 15)
          .map((item: any) => {
            let cat: 'attraction' | 'restaurant' | 'hotel' | 'culture' = 'attraction';
            const kinds = (item.kinds || '').toLowerCase();
            if (kinds.includes('food') || kinds.includes('restaurant') || kinds.includes('cafe')) {
              cat = 'restaurant';
            } else if (kinds.includes('hotel') || kinds.includes('hostel') || kinds.includes('accommodation')) {
              cat = 'hotel';
            } else if (kinds.includes('museum') || kinds.includes('theatre') || kinds.includes('art')) {
              cat = 'culture';
            }

            return {
              xid: item.xid || `${item.point?.lat}-${item.point?.lon}`,
              name: item.name,
              kinds: item.kinds || 'historic,interesting_places',
              point: {
                lon: item.point?.lon ?? lon,
                lat: item.point?.lat ?? lat,
              },
              rate: item.rate ?? 3,
              preview: item.preview?.source ? { source: item.preview.source } : undefined,
              wikipedia: item.wikipedia,
              category: cat,
            };
          });

        if (filtered.length > 0) {
          return filtered;
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }
      console.warn('OpenTripMap request failed, using city fallback attractions', err);
    }
  }

  // 2. Fallback to curated city highlights if matched
  if (cityKey && CITY_FALLBACK_ATTRACTIONS[cityKey]) {
    return CITY_FALLBACK_ATTRACTIONS[cityKey];
  }

  // 3. Fallback: generate high quality generic place points around coordinates
  const genericHighlights: AttractionPlace[] = [
    {
      xid: `attr-${lat.toFixed(2)}-1`,
      name: `${cityName || 'City'} Historic Center`,
      kinds: 'historic,architecture,cultural',
      point: { lon: lon + 0.005, lat: lat + 0.003 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80' },
      category: 'attraction',
    },
    {
      xid: `attr-${lat.toFixed(2)}-2`,
      name: `${cityName || 'City'} Central Square & Markets`,
      kinds: 'markets,shopping,culture',
      point: { lon: lon - 0.004, lat: lat + 0.002 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80' },
      category: 'attraction',
    },
    {
      xid: `attr-${lat.toFixed(2)}-3`,
      name: `Grand Viewpoint & Waterfront`,
      kinds: 'viewpoints,natural,landmarks',
      point: { lon: lon + 0.008, lat: lat - 0.005 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=800&q=80' },
      category: 'attraction',
    },
    {
      xid: `attr-${lat.toFixed(2)}-4`,
      name: `Local Traditional Dining Bistro`,
      kinds: 'foods,restaurants,cafes',
      point: { lon: lon - 0.002, lat: lat - 0.004 },
      rate: 3,
      preview: { source: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
      category: 'restaurant',
    },
  ];

  return genericHighlights;
}
