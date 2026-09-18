import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/common/ScrollToTop';
import { usePreferencesStore } from './store/usePreferencesStore';
import { Compass } from 'lucide-react';

// Lazy-loaded pages for optimal bundle size & code-splitting
const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const DestinationsPage = lazy(() =>
  import('./pages/DestinationsPage').then((m) => ({ default: m.DestinationsPage }))
);
const DestinationDetailPage = lazy(() =>
  import('./pages/DestinationDetailPage').then((m) => ({
    default: m.DestinationDetailPage,
  }))
);
const TripsPage = lazy(() =>
  import('./pages/TripsPage').then((m) => ({ default: m.TripsPage }))
);
const NewTripPage = lazy(() =>
  import('./pages/NewTripPage').then((m) => ({ default: m.NewTripPage }))
);
const TripDashboardPage = lazy(() =>
  import('./pages/TripDashboardPage').then((m) => ({ default: m.TripDashboardPage }))
);
const ItineraryPage = lazy(() =>
  import('./pages/ItineraryPage').then((m) => ({ default: m.ItineraryPage }))
);
const BudgetPage = lazy(() =>
  import('./pages/BudgetPage').then((m) => ({ default: m.BudgetPage }))
);
const SavedPlacesPage = lazy(() =>
  import('./pages/SavedPlacesPage').then((m) => ({ default: m.SavedPlacesPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const SignUpPage = lazy(() =>
  import('./pages/SignUpPage').then((m) => ({ default: m.SignUpPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
      <Compass className="w-6 h-6 animate-spin" />
    </div>
    <span className="text-xs font-semibold text-slate-400 animate-pulse">
      Loading TripPlanner...
    </span>
  </div>
);

export const App: React.FC = () => {
  const applyTheme = usePreferencesStore((state) => state.applyTheme);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="destinations" element={<DestinationsPage />} />
            <Route
              path="destinations/:destinationId"
              element={<DestinationDetailPage />}
            />
            <Route path="trips" element={<TripsPage />} />
            <Route path="trips/new" element={<NewTripPage />} />
            <Route path="trips/:tripId" element={<TripDashboardPage />} />
            <Route path="trips/:tripId/itinerary" element={<ItineraryPage />} />
            <Route path="trips/:tripId/budget" element={<BudgetPage />} />
            <Route path="itinerary" element={<Navigate to="/trips/demo-turkey-vacation/itinerary" replace />} />
            <Route path="budget" element={<Navigate to="/trips/demo-turkey-vacation/budget" replace />} />
            <Route path="saved" element={<SavedPlacesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
