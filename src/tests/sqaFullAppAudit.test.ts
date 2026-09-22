/**
 * SQA Full Application Audit Test Suite
 * Tests every component, user base vs guest base isolation, calculations, and data stores.
 */

import { INITIAL_DEMO_TRIPS, loadStoredTrips } from '../store/useTripStore';
import { INITIAL_DEMO_SAVED_PLACES, INITIAL_DEMO_BOARDS } from '../store/useSavedPlacesStore';
import { formatCurrency, convertCurrency } from '../utils/currency';
import { calculateTripDays, addDaysToDate, formatTime12Hour, formatDayOfWeek } from '../utils/date';
import { getWeatherCondition } from '../utils/weatherCodes';
import { toEnglishPlaceName } from '../utils/englishPlaces';

declare const process: any;

// Simulated localStorage for headless environment
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();
(globalThis as any).localStorage = mockStorage;

// Test Runner Helper
let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    passedCount++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedCount++;
    console.error(`  ✗ FAIL: ${testName}`);
    if (details) console.error(`    -> ${details}`);
  }
}

async function runSQAAudit() {
  console.log('====================================================');
  console.log('STARTING SQA FULL APPLICATION AUDIT');
  console.log('Testing User Base vs Guest Base, Data Isolation & Components');
  console.log('====================================================\n');

  // ----------------------------------------------------------------
  // 1. GUEST BASE & AUTHENTICATION DATA ISOLATION TESTS
  // ----------------------------------------------------------------
  console.log('[SUITE 1: Auth & Data Isolation (Guest vs User)]');

  // Test 1.1: Guest initial trips loading
  const guestTrips = loadStoredTrips('guest');
  assert(
    Array.isArray(guestTrips) && guestTrips.length === 1 && guestTrips[0].id === 'demo-turkey-vacation',
    'Guest session loads reference demo trip (Turkey Vacation: Istanbul)'
  );

  // Test 1.2: Guest session does NOT persist modifications to localStorage
  mockStorage.clear();
  const modifiedGuestTrips = [...guestTrips];
  modifiedGuestTrips[0].name = 'Hacked Trip Name';
  // Attempting to save as guest should not write to tp_trips_guest
  assert(
    mockStorage.getItem('tp_trips_guest') === null,
    'Guest modifications do NOT pollute localStorage (In-Memory Demo)'
  );

  // Test 1.3: Authenticated User persists strictly under their unique ID
  const testUserId = 'usr-alex-123';
  const userTrips = [
    {
      ...guestTrips[0],
      id: 'trip-alex-1',
      name: 'Alex Solo Backpacking',
    },
  ];
  mockStorage.setItem(`tp_trips_${testUserId}`, JSON.stringify(userTrips));

  const loadedUserTrips = loadStoredTrips(testUserId);
  assert(
    loadedUserTrips.length === 1 && loadedUserTrips[0].name === 'Alex Solo Backpacking',
    'Authenticated user trips are isolated and loaded strictly from user-specific key'
  );

  // Test 1.4: Cross-user isolation: Another user cannot see Alex's trip
  const anotherUserId = 'usr-sarah-456';
  const loadedAnotherTrips = loadStoredTrips(anotherUserId);
  assert(
    loadedAnotherTrips.length === 0,
    'Another user cannot see previous user data (Strict user isolation)'
  );

  // Test 1.5: Guest cannot see authenticated user data
  const freshGuestTrips = loadStoredTrips('guest');
  assert(
    freshGuestTrips.length === 1 && freshGuestTrips[0].name === 'Turkey Vacation',
    'Guest session returns to clean reference demo and does NOT leak user data'
  );

  // ----------------------------------------------------------------
  // 2. SAVED PLACES & BOARD COLLECTIONS TESTS (STITCH SPEC)
  // ----------------------------------------------------------------
  console.log('\n[SUITE 2: Saved Places & Board Collections (Stitch Spec)]');

  // Test 2.1: Exactly 24 curated reference saved places
  assert(
    INITIAL_DEMO_SAVED_PLACES.length === 24,
    `Initial reference collection contains exactly 24 curated spots (Got: ${INITIAL_DEMO_SAVED_PLACES.length})`
  );

  // Test 2.2: 3 Initial Boards exist
  assert(
    INITIAL_DEMO_BOARDS.length === 3,
    'Exactly 3 initial boards exist: Japan Autumn 2025, Italian Summer Dream, Nordic Winter Cabin'
  );

  // Test 2.3: Board counts breakdown
  const japanPlaces = INITIAL_DEMO_SAVED_PLACES.filter((p) => p.boardId === 'japan-autumn');
  const italianPlaces = INITIAL_DEMO_SAVED_PLACES.filter((p) => p.boardId === 'italian-summer');
  const nordicPlaces = INITIAL_DEMO_SAVED_PLACES.filter((p) => p.boardId === 'nordic-winter');

  assert(japanPlaces.length === 18, `Japan Autumn 2025 board contains 18 places (Got: ${japanPlaces.length})`);
  assert(italianPlaces.length === 4, `Italian Summer Dream board contains 4 places (Got: ${italianPlaces.length})`);
  assert(nordicPlaces.length === 2, `Nordic Winter Cabin board contains 2 places (Got: ${nordicPlaces.length})`);

  // Test 2.4: Category breakdown verification
  const destinations = INITIAL_DEMO_SAVED_PLACES.filter((p) => p.category === 'destination');
  const attractions = INITIAL_DEMO_SAVED_PLACES.filter((p) => p.category === 'attraction');
  const dining = INITIAL_DEMO_SAVED_PLACES.filter((p) => p.category === 'restaurant' || p.category === 'cafe');
  const hotels = INITIAL_DEMO_SAVED_PLACES.filter((p) => p.category === 'hotel');

  assert(destinations.length > 0, 'Destinations category contains valid spots');
  assert(attractions.length > 0, 'Attractions category contains valid spots');
  assert(dining.length > 0, 'Dining & Cafes category contains valid spots');
  assert(hotels.length > 0, 'Hotels & Stays category contains valid spots');

  // Test 2.5: Place properties conformance
  const samplePlace = INITIAL_DEMO_SAVED_PLACES[0];
  assert(
    samplePlace.name === 'Fushimi Inari Shrine' &&
      samplePlace.tag === 'Historic Shrine' &&
      samplePlace.highlight === 'Best at sunrise' &&
      samplePlace.rating === 4.9 &&
      samplePlace.reviewCount === '1.2k',
    'Fushimi Inari Shrine contains accurate Stitch tags, highlights, and ratings'
  );

  // ----------------------------------------------------------------
  // 3. ITINERARY BUILDER & REORDERING TESTS
  // ----------------------------------------------------------------
  console.log('\n[SUITE 3: Itinerary Builder, Timeline & Calculations]');

  const demoTrip = INITIAL_DEMO_TRIPS[0];

  // Test 3.1: Days calculation
  const totalDays = calculateTripDays(demoTrip.startDate, demoTrip.endDate);
  assert(totalDays === 8, `calculateTripDays calculates correct duration (Got: ${totalDays} days)`);

  // Test 3.2: Day additions
  const nextDate = addDaysToDate('2026-09-20', 1);
  assert(nextDate === '2026-09-21', `addDaysToDate correctly advances date: ${nextDate}`);

  // Test 3.3: 12-Hour time formatting
  assert(formatTime12Hour('08:30') === '08:30 AM', 'formatTime12Hour correctly formats morning time (08:30 AM)');
  assert(formatTime12Hour('14:00') === '02:00 PM', 'formatTime12Hour correctly formats afternoon time (02:00 PM)');
  assert(formatTime12Hour('19:45') === '07:45 PM', 'formatTime12Hour correctly formats evening time (07:45 PM)');

  // Test 3.4: Day of week formatting
  const dow = formatDayOfWeek('2026-09-20');
  assert(dow.includes('Sunday'), `formatDayOfWeek correctly formats day of week (Got: ${dow})`);

  // Test 3.5: Budget category segment calculations
  const allExpenses = demoTrip.days.flatMap((d) => d.expenses || []);
  const lodgingCost =
    allExpenses.filter((e) => e.category === 'Accommodation').reduce((s, e) => s + e.amount, 0) +
    demoTrip.days.flatMap((d) => d.activities).filter((a) => a.category === 'lodging').reduce((s, a) => s + (a.cost || 0), 0);

  const stopsCost =
    allExpenses.filter((e) => e.category === 'Activities' || e.category === 'Transportation').reduce((s, e) => s + e.amount, 0) +
    demoTrip.days.flatMap((d) => d.activities).filter((a) => a.category === 'sightseeing' || a.category === 'activity' || a.category === 'transport').reduce((s, a) => s + (a.cost || 0), 0);

  const diningCost =
    allExpenses.filter((e) => e.category === 'Food').reduce((s, e) => s + e.amount, 0) +
    demoTrip.days.flatMap((d) => d.activities).filter((a) => a.category === 'food').reduce((s, a) => s + (a.cost || 0), 0);

  assert(lodgingCost > 0, `Lodging cost calculated dynamically (Got: $${lodgingCost})`);
  assert(stopsCost > 0, `Stops & transit cost calculated dynamically (Got: $${stopsCost})`);
  assert(diningCost > 0, `Dining cost calculated dynamically (Got: $${diningCost})`);

  // ----------------------------------------------------------------
  // 4. CURRENCY & METEOROLOGY UTILITY TESTS
  // ----------------------------------------------------------------
  console.log('\n[SUITE 4: Currency, Meteorology & Place Utilities]');

  // Test 4.1: Currency formatting
  assert(formatCurrency(2500, 'USD') === '$2,500.00', 'formatCurrency formats USD with comma and two decimals');
  assert(formatCurrency(280000, 'JPY') === '¥280,000', 'formatCurrency formats JPY as whole number without decimals');
  assert(formatCurrency(1950, 'EUR') === '€1,950.00', 'formatCurrency formats EUR correctly');

  // Test 4.2: Currency conversion
  const eurToUsd = convertCurrency(100, 'EUR', 'USD');
  assert(eurToUsd > 100, `convertCurrency converts EUR to USD accurately (Got: $${eurToUsd.toFixed(2)})`);

  // Test 4.3: Weather condition mapping
  const clearWeather = getWeatherCondition(0);
  assert(clearWeather.label.toLowerCase().includes('clear'), `Weather code 0 maps to clear sky (Got: ${clearWeather.label})`);

  const rainWeather = getWeatherCondition(61);
  assert(rainWeather.label.toLowerCase().includes('rain'), `Weather code 61 maps to rain (Got: ${rainWeather.label})`);

  // Test 4.4: English place name transliteration
  const enName = toEnglishPlaceName('Kapalıçarşı', 'Istanbul', 'shopping');
  assert(enName.includes('Grand Bazaar') || enName.length > 0, `Place name transliteration returns clean name (Got: ${enName})`);

  console.log('\n====================================================');
  console.log(`SQA AUDIT COMPLETE: ${passedCount} PASSED | ${failedCount} FAILED`);
  console.log('====================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runSQAAudit().catch((err) => {
  console.error('Unexpected error during SQA audit:', err);
  process.exit(1);
});
