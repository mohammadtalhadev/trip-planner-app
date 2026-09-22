# 🌍 TripPlanner — Smart Travel Planning Web Application

> A production-grade, client-side travel planning React application engineered with modern architectural best practices, state management with Zustand, resilient multi-API integration (`Promise.allSettled`), debounced race-condition cancellation (`AbortController`), multi-day itinerary building with reordering & drag-and-drop, comprehensive budget analytics, and persistent local storage.

---

## 📋 Table of Contents
- [1. Project Overview](#1-project-overview)
- [2. Key Features](#2-key-features)
- [3. Technology Stack](#3-technology-stack)
- [4. Public APIs Used](#4-public-apis-used)
- [5. Installation & Setup](#5-installation--setup)
- [6. Environment Variables](#6-environment-variables)
- [7. Project Structure](#7-project-structure)
- [8. State Management Architecture](#8-state-management-architecture)
- [9. Demo Preparation & Technical Discussion Guide](#9-demo-preparation--technical-discussion-guide)
- [10. Bonus Features Implemented](#10-bonus-features-implemented)

---

## 1. Project Overview
TripPlanner is a real-world frontend web application that goes beyond a simple CRUD app to demonstrate deep mastery of:
- **React Fundamentals & Component Composition**
- **State Management & State Placement**
- **Asynchronous Operations & Cancellation (`AbortController`)**
- **Partial Failure Handling (`Promise.allSettled`)**
- **Performance Optimization (`React.memo`, `useMemo`, `useCallback`)**
- **URL Synchronization for Filter & Search State**
- **Code Splitting & Lazy Loading (`React.lazy`, `Suspense`)**
- **Data Persistence (`localStorage` with Zustand `persist`)**

---

## 2. Key Features

### 🔍 Debounced Search with Race Condition Protection
- Real-time destination lookup that waits 300ms after user pauses typing.
- Built-in `AbortController` automatically aborts obsolete in-flight requests.
- Timestamp sequence guard ensures older network responses never overwrite newer search queries.

### 🏙️ Resilient Destination Details Dashboard (`/destinations/:destinationId`)
- Concurrently queries 5 endpoints with `Promise.allSettled()`.
- **Partial Failure Tolerance**: If OpenTripMap or Pexels times out or reaches rate limits, the live Open-Meteo weather and Wikipedia summary still render cleanly with section-specific `[Retry]` buttons.
- Pre-populates the trip creation wizard directly from the destination page.

### 📅 Multi-Day Itinerary Builder (`/trips/:tripId/itinerary`)
- Interactive day tabs with dates and activity completion counters.
- Add, edit, and delete activities with category, time, estimated cost, and notes.
- **Reordering**: Move Up/Down buttons and native HTML5 Drag-and-Drop.
- **Cross-Day Mobility**: Transfer activities between days via the `MoveActivityModal`.
- Mark activities as completed with real-time progress calculations.

### 💰 Budget & Expense Management (`/trips/:tripId/budget`)
- Real-time budget progress bar showing percentage of budget consumed.
- Visual category spending breakdown (Accommodation, Food, Transportation, Activities, Shopping, Miscellaneous).
- Filter expenses by category or day; sort by date or amount.
- Dynamic calculation of total spending and remaining allowance.

### 📌 Bookmarks & Saved Places (`/saved`)
- Save destinations, attractions, dining spots, and hotels with **optimistic UI updates**.
- Filter bookmarks by category and persist across browser sessions.

### ⚙️ User Preferences (`/settings`)
- Currency selector (`USD $`, `EUR €`, `GBP £`, `JPY ¥`, `CAD CA$`, `AUD AU$`, `INR ₹`).
- Temperature unit toggle (`Celsius °C` / `Fahrenheit °F`).
- Complete Dark / Light / System theme support with Tailwind.
- Default travelers count and travel style selection.

---

## 3. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | React 18 + TypeScript | Type safety, maintainability, modern hooks |
| **Bundler** | Vite 6 | Sub-second HMR, optimized production rollups |
| **Styling** | Tailwind CSS + Lucide Icons | Utility-first responsive design, dark mode |
| **Routing** | React Router v6 | Dynamic routing, URL search params, lazy routes |
| **State** | Zustand 5 (`persist`) | Predictable, boilerplate-free state with localStorage |
| **Class Helpers** | `clsx` + `tailwind-merge` | Conflict-free conditional styling |

---

## 4. Public APIs Used

1. **Geoapify Geocoding API**
   - *Purpose*: City geocoding and autocomplete search suggestions.
   - *Endpoint*: `https://api.geoapify.com/v1/geocode/autocomplete?text={query}&type=city&apiKey={VITE_GEOAPIFY_KEY}`
   - *Resilience*: Automatically falls back to OpenStreetMap Nominatim and curated city index if key is not configured.
2. **Open-Meteo Weather API**
   - *Purpose*: Live weather condition, temperature, humidity, wind, and 4-day forecast.
   - *Endpoint*: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
   - *Key Requirement*: Free public access, no API key needed.
3. **Wikipedia REST API**
   - *Purpose*: Destination overview, historical summary, and canonical link.
   - *Endpoint*: `https://en.wikipedia.org/api/rest_v1/page/summary/{cityName}`
   - *Key Requirement*: Free public access, no API key needed.
4. **OpenTripMap API**
   - *Purpose*: Cultural attractions, museums, landmarks, and restaurants within a 10km radius.
   - *Endpoint*: `https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon={lon}&lat={lat}&rate=3&format=json&apikey={VITE_OPENTRIPMAP_KEY}`
5. **Pexels Photography API**
   - *Purpose*: High-resolution landscape photos for destination hero and galleries.
   - *Endpoint*: `https://api.pexels.com/v1/search?query={cityName}&orientation=landscape`
   - *Headers*: `Authorization: {VITE_PEXELS_KEY}`
6. **REST Countries API**
   - *Purpose*: Capital, population, currency symbol, region, and flag for destination countries.
   - *Endpoint*: `https://restcountries.com/v3.1/name/{country}?fullText=false`

---

## 5. Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (tested on Node v24)
- **npm** or **pnpm** or **yarn**

### Quick Start Commands
```bash
# 1. Clone repository
git clone https://github.com/your-username/trip-planner.git
cd trip-planner

# 2. Install dependencies
npm install

# 3. Setup environment variables (optional, app works with built-in fallbacks)
cp .env.example .env

# 4. Start local development server
npm run dev

# 5. Build for production and type check
npm run build

# 6. Preview production build
npm run preview
```

---

## 6. Environment Variables

Create a `.env` or `.env.local` in the project root:

```env
# Geoapify (City autocomplete search)
VITE_GEOAPIFY_KEY=your_geoapify_key_here

# OpenTripMap (Places & attractions)
VITE_OPENTRIPMAP_KEY=your_opentripmap_key_here

# Pexels (Destination photography)
VITE_PEXELS_KEY=your_pexels_key_here
```

> **Note**: Open-Meteo, Wikipedia REST, and REST Countries require **no API keys**. If any optional key is omitted, TripPlanner automatically uses graceful mock and public fallbacks so the application runs completely out-of-the-box.

---

## 7. Project Structure

```
src/
├── types/                 # Pure TypeScript definitions
│   ├── trip.ts            # Trip, ItineraryDay, Activity, Expense, Traveler
│   ├── api.ts             # API response contracts & AsyncSection<T>
│   └── settings.ts        # Currency, TempUnit, Theme, Preferences
├── services/              # API Client Layer (Modular & cancellable)
│   ├── api.ts             # Promise.allSettled master aggregator
│   ├── geoapify.ts        # Geocoding & autocomplete with AbortSignal
│   ├── weather.ts         # Open-Meteo forecast client
│   ├── wikipedia.ts       # Wikipedia REST summary client
│   ├── openTripMap.ts     # OpenTripMap attractions client
│   ├── pexels.ts          # Curated photo fetcher
│   └── countries.ts       # REST Countries client
├── store/                 # Zustand Persistent State Management
│   ├── useTripStore.ts    # Trips, days, activities, expenses CRUD
│   ├── useSavedPlacesStore.ts # Bookmarking with optimistic updates
│   └── usePreferencesStore.ts # Currency, theme, temperature units
├── hooks/                 # Reusable Custom Hooks
│   ├── useDebounce.ts     # Generic value debouncing
│   ├── useCitySearch.ts   # Debounced autocomplete with AbortController
│   ├── useDestinationDetails.ts # Concurrent fetcher with section retries
│   └── usePagination.ts   # Client/server pagination logic
├── components/            # Focused, Reusable UI Components
│   ├── layout/            # Navbar, Footer, App Layout
│   ├── common/            # ErrorBoundary, Skeleton, EmptyState, Modal, Badge
│   ├── search/            # CitySearchInput, SearchSuggestions
│   ├── destination/       # DestinationHero, WeatherCard, WikiCard, PlacesList
│   ├── trip/              # CreateTripModal, TripCard, TripSummaryCards
│   ├── itinerary/         # ItineraryBuilder, ActivityCard, ActivityModal
│   └── budget/            # BudgetOverview, CategoryBreakdown, ExpenseList
├── pages/                 # Route Views (Lazy-Loaded)
│   ├── HomePage.tsx
│   ├── DestinationsPage.tsx
│   ├── DestinationDetailPage.tsx
│   ├── TripsPage.tsx
│   ├── NewTripPage.tsx
│   ├── TripDashboardPage.tsx
│   ├── ItineraryPage.tsx
│   ├── BudgetPage.tsx
│   ├── SavedPlacesPage.tsx
│   ├── SettingsPage.tsx
│   └── NotFoundPage.tsx
└── utils/                 # Pure Utilities
    ├── currency.ts        # Currency formatting & symbols
    ├── date.ts            # Date formatting & days calculations
    ├── weatherCodes.ts    # WMO weather code mapping to icons & labels
    └── cn.ts              # Tailwind clsx merge utility
```

---

## 8. State Management Architecture

The application state is structured hierarchically rather than dumped into a single monolithic component:

```
Trip Store (Zustand + localStorage)
├── Trip
│   ├── Basic Information (id, name, destination, startDate, endDate, coverImage)
│   ├── Travelers (id, name, role)
│   ├── Budget (totalBudget, currency)
│   └── Days[]
│       ├── Day 1
│       │   ├── Activities[] (id, time, category, title, cost, completed, orderIndex)
│       │   └── Expenses[] (id, description, amount, category, date, notes)
│       ├── Day 2
│       │   ├── Activities[]
│       │   └── Expenses[]
│       └── Day N...
├── Saved Places Store (Zustand + localStorage)
└── Preferences Store (Zustand + localStorage)
```

### Why Zustand?
- **Zero Boilerplate**: Avoids Redux actions/reducers overhead while maintaining strict state isolation.
- **Granular Selectors**: Components subscribe only to the specific slices they need (e.g. `useTripStore(state => state.trips)`), avoiding unnecessary re-renders when other slices mutate.
- **Native Persistence**: Uses Zustand's `persist` middleware with `localStorage` for transparent automatic syncing without manual `useEffect` watchers.

---

## 9. Demo Preparation & Technical Discussion Guide

### 🧑‍💻 React & Rendering Behavior

#### 1. Why does a component re-render?
A React component re-renders when:
- Its own local state (`useState`, `useReducer`) changes.
- Its parent component re-renders (unless wrapped in `React.memo`).
- A prop value changes by reference or value.
- A subscribed external store slice (Zustand) emits a new state reference.

#### 2. Where did you use memoization and why?
- `React.memo` on `ActivityCard`, `PlaceCard`, and `ExpenseRow`:
  - *Why*: In a list of 20 activities, clicking "completed" on Activity #2 should not re-render the other 19 items. Memoizing `ActivityCard` with stable handler references (`useCallback`) ensures only the mutated card re-renders.
- `useMemo` on budget calculations, category totals, and filtered activities:
  - *Why*: Prevents re-running aggregate loops over all days and expenses on every minor UI re-render.
- `useCallback` on handlers passed to child components:
  - *Why*: Preserves referential equality of callback functions so `React.memo` props comparisons pass.

#### 3. Where should state live?
- **Local Form State** (`useState`): In modal inputs (`ActivityModal`, `CitySearchInput`) where state is temporary and ephemeral.
- **URL Search Parameters** (`useSearchParams`): Filter, sort, and pagination state on `/destinations` so pages can be refreshed and shared.
- **Global Business State** (Zustand): Trips, multi-day itineraries, expenses, bookmarks, and user preferences that must be accessible across multiple routes and survive page reloads.

---

### 🌐 APIs & Asynchronous Operations

#### 4. How are API errors handled?
- Every API endpoint is isolated.
- In `fetchDestinationDetails`, `Promise.allSettled()` collects results from Weather, Wikipedia, Places, Photos, and Country APIs.
- Each section independently tracks its own `AsyncSection<T>` status (`idle`, `loading`, `success`, `error`).
- An error in OpenTripMap produces an `ErrorCard` with a `[Retry]` button for that specific card without crashing the weather forecast or hero image.

#### 5. How did you implement debouncing and handle race conditions?
- `useDebounce`: A custom hook delays the search query value by 300ms.
- `AbortController`: In `useCitySearch`, whenever a new search query fires, `abortControllerRef.current.abort()` is immediately invoked to cancel the in-flight HTTP request.
- `latestRequestIdRef`: A request sequence counter ensures that even if an aborted request's response settles, it is ignored because its sequence number is outdated.

---

### 🔀 Routing & Code Splitting

#### 6. Why is search & filter state stored in the URL?
On `/destinations?country=turkey&sort=rating&page=2`:
- Storing query state in `useSearchParams` ensures that refreshing the browser, bookmarking the page, or clicking the browser's Back/Forward buttons preserves the exact search and filter state.

#### 7. How does lazy loading work?
- `React.lazy()` dynamically imports each page component (`() => import('./pages/ItineraryPage')`).
- Vite splits each page into its own JS chunk (see build output).
- `<Suspense fallback={<PageLoader />}>` displays an accessible loading spinner while the browser fetches the specific page chunk on demand.

---

## 10. Bonus Features Implemented
- ✅ **Bonus 1 — Drag & Drop**: Full HTML5 drag-and-drop reordering for itinerary activities with smooth drag indicators.
- ✅ **Bonus 2 — Offline Support**: Offline read and write capability with complete `localStorage` persistence.
- ✅ **Bonus 3 — Optimistic Updates**: Instant UI bookmark toggle with immediate local state update and rollback resilience.
- ✅ **Bonus 4 — Complete Dark Theme**: Tailored dark mode styling using Tailwind CSS with persistent theme toggle.
- ✅ **Bonus 5 — Accessibility**: Semantic ARIA tags, keyboard navigation in search suggestions (Arrow Up/Down, Enter, Esc), and focus states.
