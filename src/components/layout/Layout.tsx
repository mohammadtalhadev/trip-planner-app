import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CreateTripModal } from '../trip/CreateTripModal';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const Layout: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Floating Header Capsule */}
      <header className="sticky top-3.5 z-40 w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Navbar onOpenCreateTrip={() => setIsCreateModalOpen(true)} />
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary
          fallbackTitle="Something went wrong rendering this page"
          fallbackMessage="An unexpected application state occurred. Please click retry or return home."
        >
          <Outlet context={{ openCreateTrip: () => setIsCreateModalOpen(true) }} />
        </ErrorBoundary>
      </main>

      <Footer />

      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
