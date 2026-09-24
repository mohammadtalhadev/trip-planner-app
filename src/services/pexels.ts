import { PexelsPhoto } from '../types/api';

const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY;

// Fallback high-resolution photos categorized by destination
const CITY_FALLBACK_PHOTOS: Record<string, string[]> = {
  paris: [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?auto=format&fit=crop&w=1200&q=80',
  ],
  tokyo: [
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  ],
  istanbul: [
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
  ],
  'new york': [
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1200&q=80',
  ],
  london: [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=1200&q=80',
  ],
  dubai: [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=1200&q=80',
  ],
  lahore: [
    'https://images.unsplash.com/photo-1598887142487-3c854d51d2c2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80',
  ],
  rome: [
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80',
  ],
};

const GENERIC_TRAVEL_PHOTOS = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
];

const PHOTOS_CACHE = new Map<string, PexelsPhoto[]>();

export async function fetchDestinationPhotos(
  cityName: string,
  signal?: AbortSignal
): Promise<PexelsPhoto[]> {
  const trimmed = cityName.trim();
  const cityKey = trimmed.toLowerCase();

  // Instant cache lookup (0ms)
  if (PHOTOS_CACHE.has(cityKey)) {
    return PHOTOS_CACHE.get(cityKey)!;
  }
  try {
    const local = localStorage.getItem(`tp_photos_${cityKey}`);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        PHOTOS_CACHE.set(cityKey, parsed);
        return parsed;
      }
    }
  } catch {}

  const cacheAndReturn = (photos: PexelsPhoto[]) => {
    if (photos && photos.length > 0) {
      PHOTOS_CACHE.set(cityKey, photos);
      try {
        localStorage.setItem(`tp_photos_${cityKey}`, JSON.stringify(photos));
      } catch {}
    }
    return photos;
  };

  // 1. Try Pexels API if key is available
  if (PEXELS_KEY && PEXELS_KEY.trim() !== '' && PEXELS_KEY !== 'your_pexels_key_here') {
    try {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        `${trimmed} city travel landmark`
      )}&orientation=landscape&per_page=8`;

      const response = await fetch(url, {
        signal,
        headers: {
          Authorization: PEXELS_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
        const list = data.photos.map((p: any) => ({
          id: p.id,
          url: p.url,
          src: {
            original: p.src.original,
            large2x: p.src.large2x,
            large: p.src.large,
            medium: p.src.medium,
            small: p.src.small,
          },
          alt: p.alt || `${trimmed} photography`,
          photographer: p.photographer || 'Pexels Contributor',
        }));
        return cacheAndReturn(list);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }
      console.warn('Pexels photo request failed, falling back to curated photos', err);
    }
  }

  // 2. Fallback to curated city photos
  const photoUrls = CITY_FALLBACK_PHOTOS[cityKey] || GENERIC_TRAVEL_PHOTOS;

  const fallbackList = photoUrls.map((url, idx) => ({
    id: 900000 + idx,
    url,
    src: {
      original: url,
      large2x: url,
      large: url,
      medium: url,
      small: url,
    },
    alt: `${trimmed} travel scenery`,
    photographer: 'Unsplash Community',
  }));

  return cacheAndReturn(fallbackList);
}
