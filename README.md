# 🌍 TripPlanner

A responsive travel planning and itinerary management web application built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Zustand**.

TripPlanner helps travelers discover destinations worldwide, build detailed multi-day itineraries, track expenses across multiple currencies, and curate saved places with offline persistence.

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Public APIs Used](#-public-apis-used)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [State Management](#-state-management)
- [Performance & Resilience](#-performance--resilience)

---

## ✨ Features

### 🔍 Destination Search & Discovery
- **Debounced Autocomplete**: Real-time city search powered by Geoapify and OpenStreetMap Nominatim with a 300ms debounce.
- **Request Cancellation**: In-flight requests are automatically aborted via `AbortController` when new keystrokes occur, preventing race conditions.

### 🏙️ Destination Explorer (`/destinations/:destinationId`)
- **Live Weather**: 4-day forecast, temperature, humidity, and wind telemetry from Open-Meteo.
- **Encyclopedia Summaries**: Real-time historical and geographical overviews from Wikipedia REST API.
- **Curated Places**: Verified points of interest, landmarks, dining, and accommodations with real-time rating metrics, English translation, and zero duplicates.
- **Photo Gallery**: High-resolution destination photography with full-screen lightbox preview.

### 📅 Multi-Day Itinerary Builder (`/trips/:tripId/itinerary`)
- **Interactive Day Navigation**: Organize trip activities by date with progress indicators.
- **Activity Management**: Add, edit, remove, and reorder activities by time, category, and cost.
- **Drag-and-Drop Reordering**: Native HTML5 drag-and-drop for intuitive activity rescheduling.
- **Cross-Day Movement**: Easily transfer activities between days with the day transfer modal.

### 💰 Budget & Expense Tracking (`/trips/:tripId/budget`)
- **Real-Time Analytics**: Visual budget progress bar and remaining balance calculations.
- **Category Breakdown**: Spending distribution across lodging, dining, transit, activities, and shopping.
- **Filtering & Sorting**: Filter expenses by category or day; sort by date or amount.
- **Multi-Currency Support**: Switch between USD ($), EUR (€), GBP (£), JPY (¥), CAD (CA$), AUD (AU$), and INR (₹).

### 📌 Bookmarks & Saved Places (`/saved`)
- Save destinations and attractions with instant optimistic UI updates.
- Filter bookmarks by category with persistent browser storage.

### ⚙️ User Preferences & Accessibility (`/settings`)
- Light, dark, and system theme modes with seamless Tailwind transitions.
- Configurable default currency, temperature units (°C / °F), and default traveler counts.
- Full keyboard navigation and accessible focus rings throughout the app.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | React 18 + TypeScript | Component-based UI with strict type safety |
| **Build Tool** | Vite 6 | Fast HMR and optimized production bundling |
| **Styling** | Tailwind CSS | Responsive utility-first design with dark mode |
| **Icons** | Lucide React | Modern, consistent SVG iconography |
| **Routing** | React Router v6 | Client-side routing with URL search params syncing |
| **State** | Zustand 5 | Modular state stores with localStorage persistence |

---

## 🌐 Public APIs Used

1. **Geoapify Geocoding API**
   - City search and autocomplete suggestions (`https://api.geoapify.com/v1/geocode/autocomplete`).
   - Automatically falls back to OpenStreetMap Nominatim if no API key is provided.

2. **Open-Meteo Weather API**
   - Current weather conditions and 4-day forecast (`https://api.open-meteo.com/v1/forecast`).
   - Completely free, no API key required.

3. **Wikipedia REST API**
   - Destination summaries, extracts, and thumbnail imagery (`https://en.wikipedia.org/api/rest_v1/page/summary`).
   - Completely free, no API key required.

4. **Wikimedia Live Metrics API**
   - Real-time pageview and popularity metrics for dynamic place ratings.

5. **Pexels API**
   - High-quality destination photos (`https://api.pexels.com/v1/search`).
   - Falls back gracefully to curated Unsplash photography.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/trip-planner.git
cd trip-planner

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
```

The optimized production output will be generated in the `dist/` directory.

---

## 🔑 Environment Variables

To enable optional third-party integrations, create a `.env` file in the root directory:

```env
# Optional: Geoapify for enhanced autocomplete
VITE_GEOAPIFY_KEY=your_geoapify_key_here

# Optional: OpenTripMap for additional attractions
VITE_OPENTRIPMAP_KEY=your_opentripmap_key_here

# Optional: Pexels for expanded destination galleries
VITE_PEXELS_KEY=your_pexels_key_here

# Optional: Google Places API for real-time ratings
VITE_GOOGLE_PLACES_KEY=your_google_places_key_here
```

> **Note**: All features function smoothly with built-in open fallbacks even if no API keys are provided.

---

## 📁 Project Structure

```
src/
├── assets/                # Static assets & brand icons
├── components/            # Reusable UI components
│   ├── budget/            # Budget overview, charts, and expense lists
│   ├── common/            # Modals, skeletons, error boundaries, scroll-to-top
│   ├── destination/       # Weather cards, places list, wiki summaries, hero
│   ├── itinerary/         # Activity cards, day selectors, reordering modals
│   ├── layout/            # Navbar, footer, main container layout
│   ├── search/            # Autocomplete search input & suggestions dropdown
│   └── trip/              # Trip creation wizard, trip summary cards
├── hooks/                 # Custom React hooks (debouncing, city search, details)
├── pages/                 # Top-level route pages (lazy loaded)
├── services/              # API clients (weather, geoapify, wikipedia, ratings)
├── store/                 # Zustand state stores (trips, saved places, preferences)
├── types/                 # TypeScript interfaces and shared types
└── utils/                 # Pure helper functions (currency, dates, translations)
```

---

## 💾 State Management

The application uses **Zustand** stores with localStorage persistence:

- **`useTripStore`**: Manages all user trips, day-by-day itineraries, activities, reordering, and expenses.
- **`useSavedPlacesStore`**: Handles bookmarked destinations and curated attractions.
- **`usePreferencesStore`**: Stores user settings (currency, temperature unit, theme, default travelers).
- **`useUserStore`**: Holds local user profile information.

---

## ⚡ Performance & Resilience

- **Code Splitting**: Route components are lazy-loaded with `React.lazy` and `Suspense`, keeping initial bundle size minimal.
- **Component Memoization**: Heavy list items (`ActivityCard`, `PlaceCard`, `ExpenseRow`) use `React.memo` and stable callbacks to avoid unnecessary re-renders.
- **Partial Failure Resilience**: Multi-endpoint data fetching uses `Promise.allSettled`, ensuring that a failure in one external API never crashes other dashboard sections.
- **Smooth Navigation**: Global CSS smooth scrolling and custom `ScrollToTop` restoration provide a fluid user experience across all devices.

---

## 📄 License

MIT License. Feel free to use and modify for personal or commercial projects.
