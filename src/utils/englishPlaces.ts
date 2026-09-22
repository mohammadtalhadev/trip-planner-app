/**
 * English Place Name Normalizer & Translator
 * Converts foreign language landmark and attraction names into clear English.
 */

// Landmark translation dictionary across major tourist regions
const LANDMARK_DICTIONARY: Record<string, string> = {
  // Turkish (Istanbul, Turkey)
  'ayasofya': 'Hagia Sophia',
  'ayasofya camii': 'Hagia Sophia Grand Mosque',
  'ayasofya-i kebir cami-i şerifi': 'Hagia Sophia Grand Mosque',
  'ayasofya meydanı': 'Hagia Sophia Square',
  'sultanahmet camii': 'Blue Mosque (Sultan Ahmed)',
  'sultanahmet meydanı': 'Sultanahmet Square (Hippodrome)',
  'sultan ahmed camii': 'Blue Mosque (Sultan Ahmed)',
  'kapalıçarşı': 'Grand Bazaar',
  'kapalı çarşı': 'Grand Bazaar',
  'mısır çarşısı': 'Spice Bazaar (Egyptian Bazaar)',
  'topkapı sarayı': 'Topkapi Palace',
  'topkapı sarayı müzesi': 'Topkapi Palace Museum',
  'yerebatan sarnıcı': 'Basilica Cistern',
  'galata kulesi': 'Galata Tower',
  'galata köprüsü': 'Galata Bridge',
  'dolmabahçe sarayı': 'Dolmabahce Palace',
  'süleymaniye camii': 'Suleymaniye Mosque',
  'istiklal caddesi': 'Istiklal Avenue',
  'taksim meydanı': 'Taksim Square',
  'gülhane parkı': 'Gulhane Park',
  'ortaköy camii': 'Ortakoy Mosque',
  'kız kulesi': 'Maiden\'s Tower',
  'rumeli hisarı': 'Rumeli Fortress',
  'chora müzesi': 'Chora Church Museum',
  'kariye camii': 'Chora Church (Kariye)',
  'karaköy': 'Karakoy Historic Harbor',
  'balat sokakları': 'Balat Historic District',

  // Japanese (Tokyo, Kyoto, Osaka)
  '浅草寺': 'Senso-ji Temple',
  'senso-ji': 'Senso-ji Temple',
  'sensō-ji': 'Senso-ji Temple',
  '東京スカイツリー': 'Tokyo Skytree',
  'tokyo skytree': 'Tokyo Skytree',
  '東京タワー': 'Tokyo Tower',
  'tokyo tower': 'Tokyo Tower',
  '明治神宮': 'Meiji Shrine',
  'meiji jingu': 'Meiji Shrine',
  '渋谷スクランブル交差点': 'Shibuya Crossing',
  'shibuya crossing': 'Shibuya Crossing',
  '皇居': 'Tokyo Imperial Palace',
  '上野恩賜公園': 'Ueno Park',
  '上野公園': 'Ueno Park',
  'ueno park': 'Ueno Park',
  '六本木ヒルズ': 'Roppongi Hills Observation Deck',
  '清水寺': 'Kiyomizu-dera Temple',
  'kiyomizu-dera': 'Kiyomizu-dera Temple',
  '金閣寺': 'Kinkaku-ji (Golden Pavilion)',
  'kinkaku-ji': 'Kinkaku-ji (Golden Pavilion)',
  '銀閣寺': 'Ginkaku-ji (Silver Pavilion)',
  '伏見稲荷大社': 'Fushimi Inari Shrine',
  'fushimi inari taisha': 'Fushimi Inari Shrine',
  '築地場外市場': 'Tsukiji Outer Fish Market',
  '秋葉原udx': 'Akihabara Tech & Anime Quarter',
  '新宿御苑': 'Shinjuku Gyoen National Garden',
  'お台場海浜公園': 'Odaiba Seaside Marine Park',
  '伏見稲荷': 'Fushimi Inari Shrine',
  '道頓堀': 'Dotonbori Canal & Gastronomy',

  // Italian (Rome, Florence, Venice, Milan)
  'colosseo': 'Colosseum',
  'fontana di trevi': 'Trevi Fountain',
  'pantheon': 'Pantheon',
  'foro romano': 'Roman Forum',
  'basilica di san pietro': 'St. Peter\'s Basilica',
  'musei vaticani': 'Vatican Museums',
  'cappella sistina': 'Sistine Chapel',
  'piazza di spagna': 'Spanish Steps & Piazza di Spagna',
  'piazza navona': 'Navona Square',
  'castel sant\'angelo': 'Castle of the Holy Angel',
  'galleria degli uffizi': 'Uffizi Gallery',
  'ponte vecchio': 'Ponte Vecchio Bridge',
  'duomo di milano': 'Milan Cathedral (Duomo)',
  'piazza san marco': 'St. Mark\'s Square',
  'basilica di san marco': 'St. Mark\'s Basilica',
  'palazzo ducale': 'Doge\'s Palace',

  // French (Paris)
  'tour eiffel': 'Eiffel Tower',
  'musée du louvre': 'Louvre Museum',
  'cathédrale notre-dame de paris': 'Notre-Dame Cathedral',
  'notre-dame': 'Notre-Dame Cathedral',
  'arc de triomphe': 'Arc de Triomphe',
  'basilique du sacré-cœur': 'Sacred Heart Basilica (Sacré-Cœur)',
  'château de versailles': 'Palace of Versailles',
  'musée d\'orsay': 'Orsay Museum',
  'sainte-chapelle': 'Sainte-Chapelle Royal Chapel',
  'jardin du luxembourg': 'Luxembourg Gardens',
  'panthéon': 'Pantheon of Paris',
  'centre pompidou': 'Centre Pompidou Modern Art',
  'opéra garnier': 'Palais Garnier Opera House',

  // Spanish (Barcelona, Madrid)
  'basílica de la sagrada família': 'Sagrada Familia Basilica',
  'sagrada família': 'Sagrada Familia Basilica',
  'parque güell': 'Park Guell',
  'park güell': 'Park Guell',
  'casa batlló': 'Casa Batllo',
  'casa milà': 'Casa Mila (La Pedrera)',
  'la rambla': 'La Rambla Boulevard',
  'barri gòtic': 'Gothic Quarter',
  'museo del prado': 'Prado Museum',
  'palacio real': 'Royal Palace of Madrid',

  // Arabic (Dubai, Abu Dhabi)
  'برج خليفة': 'Burj Khalifa',
  'برج العرب': 'Burj Al Arab',
  'جامع الشيخ زايد الكبير': 'Sheikh Zayed Grand Mosque',
  'دبي مول': 'Dubai Mall',
  'نافورة دبي': 'Dubai Fountain',
  'متحف اللوفر أبوظبي': 'Louvre Abu Dhabi',
  'نخلة جميرا': 'Palm Jumeirah',
  'برواز دبي': 'Dubai Frame',
  'عين دبي': 'Ain Dubai Observation Wheel',

  // Pakistani (Lahore)
  'بادشاہی مسجد': 'Badshahi Mosque',
  'badshahi masjid': 'Badshahi Mosque',
  'لاہور قلعہ': 'Lahore Fort (Shahi Qila)',
  'shahi qila': 'Lahore Fort (Shahi Qila)',
  'شالامار باغ': 'Shalimar Mughal Gardens',
  'shalimar bagh': 'Shalimar Mughal Gardens',
  'وزیر خان مسجد': 'Wazir Khan Mosque',
  'wazir khan masjid': 'Wazir Khan Mosque',
  'مینار پاکستان': 'Minar-e-Pakistan',
  'انارکلی بازار': 'Anarkali Grand Bazaar',
  'دہلی دروازہ': 'Delhi Gate Lahore',
};

// Common foreign architectural terms to translate
const TERM_REPLACEMENTS: [RegExp, string][] = [
  // Turkish terms
  [/\bcamii\b/gi, 'Mosque'],
  [/\bcami-i\b/gi, 'Mosque'],
  [/\bcami\b/gi, 'Mosque'],
  [/\bsarayı\b/gi, 'Palace'],
  [/\bsaray\b/gi, 'Palace'],
  [/\bkulesi\b/gi, 'Tower'],
  [/\bköprüsü\b/gi, 'Bridge'],
  [/\bçarşısı\b/gi, 'Bazaar'],
  [/\bmüzesi\b/gi, 'Museum'],
  [/\bkapısı\b/gi, 'Gate'],
  [/\bmeydanı\b/gi, 'Square'],
  [/\bparkı\b/gi, 'Park'],
  [/\bsarnıcı\b/gi, 'Cistern'],
  [/\bkilisesi\b/gi, 'Church'],

  // Italian terms
  [/\bbasilica di\b/gi, 'Basilica of'],
  [/\bchiesa di\b/gi, 'Church of'],
  [/\bpiazza\b/gi, 'Square'],
  [/\bpalazzo\b/gi, 'Palace'],
  [/\bmuseo di\b/gi, 'Museum of'],
  [/\bmuseo\b/gi, 'Museum'],
  [/\bponte\b/gi, 'Bridge'],
  [/\bfontana\b/gi, 'Fountain'],

  // French terms
  [/\bmusée du\b/gi, 'Museum of'],
  [/\bmusée de la\b/gi, 'Museum of'],
  [/\bmusée d'\b/gi, 'Museum of '],
  [/\bmusée\b/gi, 'Museum'],
  [/\bchâteau de\b/gi, 'Palace of'],
  [/\bchâteau\b/gi, 'Castle'],
  [/\bcathédrale\b/gi, 'Cathedral'],
  [/\bbasilique\b/gi, 'Basilica'],
  [/\bpont\b/gi, 'Bridge'],
  [/\bjardin des\b/gi, 'Gardens of'],
  [/\bjardin du\b/gi, 'Gardens of'],

  // Spanish terms
  [/\bmuseo de\b/gi, 'Museum of'],
  [/\bcatedral de\b/gi, 'Cathedral of'],
  [/\bpalacio\b/gi, 'Palace'],
  [/\bparque\b/gi, 'Park'],
];

// Non-Latin character detector (CJK, Arabic, Cyrillic, Thai, Hebrew, Greek)
const NON_LATIN_REGEX = /[\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0E00-\u0E7F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF\u0370-\u03FF]/;

/**
 * Converts any place name into readable English.
 */
export function toEnglishPlaceName(
  rawName: string | undefined | null,
  cityName?: string,
  category?: string
): string {
  if (!rawName || typeof rawName !== 'string') {
    return category ? `Scenic ${category}` : 'Historic Landmark';
  }

  const trimmed = rawName.trim();
  const lower = trimmed.toLowerCase();

  // 1. Direct dictionary match
  if (LANDMARK_DICTIONARY[lower]) {
    return LANDMARK_DICTIONARY[lower];
  }

  // 2. Check if dictionary entry is contained inside the name
  for (const [key, value] of Object.entries(LANDMARK_DICTIONARY)) {
    if (lower === key) return value;
    if (lower.startsWith(key + ' ') || lower.endsWith(' ' + key)) {
      return value;
    }
  }

  // 3. Extract English part from dual/parenthetical names
  // e.g., "Sultanahmet Camii (Blue Mosque)" -> "Blue Mosque"
  const parensMatch = trimmed.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (parensMatch) {
    const part1 = parensMatch[1].trim();
    const part2 = parensMatch[2].trim();

    // If part 2 is in Latin and doesn't look like foreign script, prefer it if part 1 is non-Latin
    if (NON_LATIN_REGEX.test(part1) && !NON_LATIN_REGEX.test(part2)) {
      return toEnglishPlaceName(part2, cityName, category);
    }
    // If part 2 contains known English terms (Mosque, Temple, Museum, Tower, Bazaar, Palace)
    if (/mosque|temple|museum|tower|bazaar|palace|bridge|church|cathedral|park|square/i.test(part2)) {
      return part2;
    }
    // If part 1 contains known English terms
    if (/mosque|temple|museum|tower|bazaar|palace|bridge|church|cathedral|park|square/i.test(part1)) {
      return part1;
    }
  }

  // 4. Translate known foreign architectural terms
  let translated = trimmed;
  for (const [regex, replacement] of TERM_REPLACEMENTS) {
    translated = translated.replace(regex, replacement);
  }

  // 5. If the string is purely non-Latin (e.g. Japanese or Arabic without translation)
  if (NON_LATIN_REGEX.test(translated)) {
    // Strip non-Latin characters if any Latin characters exist
    const latinOnly = translated.replace(NON_LATIN_REGEX, '').trim();
    if (latinOnly.length > 2) {
      return latinOnly;
    }

    // Otherwise, generate a clear English title using city & category
    const placeType = category === 'restaurant'
      ? 'Gourmet Dining'
      : category === 'hotel'
      ? 'Boutique Hotel'
      : category === 'culture'
      ? 'Cultural Heritage Landmark'
      : 'Scenic Sight';

    return cityName ? `${placeType} in ${cityName}` : placeType;
  }

  return translated;
}
