import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  MessageSquare,
  Code2,
  Camera,
  X,
  ShieldCheck,
  FileText,
  Lock,
  Cookie,
} from 'lucide-react';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { CURRENCY_SYMBOLS } from '../../utils/currency';

interface LegalModalContent {
  title: string;
  icon: React.ElementType;
  body: React.ReactNode;
}

export const Footer: React.FC = () => {
  const { preferences } = usePreferencesStore();
  const [activeModal, setActiveModal] = useState<LegalModalContent | null>(null);

  const currencySymbol = CURRENCY_SYMBOLS[preferences.currency] || '$';

  const legalModals: Record<string, LegalModalContent> = {
    privacy: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      body: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            At <strong>TripPlanner</strong>, your privacy is fundamental to our philosophy.
            All personal itineraries, expense ledgers, and saved places are stored strictly within your browser&apos;s
            secure local storage (client-side persistence).
          </p>
          <p>
            We do not sell, rent, or monetize your location history or travel routes. When fetching meteorological data,
            photos, or geographical coordinates, queries are processed anonymously through verified API gateways.
          </p>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            Last updated: September 2025
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      icon: FileText,
      body: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            By accessing TripPlanner, you agree to utilize our routing tools, multi-currency budget tracker,
            and itinerary builder for personal, non-commercial travel planning purposes.
          </p>
          <p>
            Real-time weather projections, maps, and geographical recommendations are aggregated from
            open public data sources including Geoapify, Open-Meteo, and Wikipedia REST. Users are encouraged to verify
            operational hours and passport entry requirements directly with official consulates.
          </p>
        </div>
      ),
    },
    security: {
      title: 'Security Architecture',
      icon: Lock,
      body: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            TripPlanner is engineered with client-side security in mind. API keys and personal data are never exposed
            to third-party tracking scripts. All outbound network requests use HTTPS TLS 1.3 encryption.
          </p>
          <p>
            Local storage caching utilizes browser storage instances that exist solely on your physical device.
          </p>
        </div>
      ),
    },
    cookies: {
      title: 'Cookie Settings & Storage',
      icon: Cookie,
      body: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            We use zero invasive marketing tracking cookies. Local storage is strictly utilized for functional preferences:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-stone-500 dark:text-stone-400">
            <li>Display theme mode (Light Frost / Charcoal Dark)</li>
            <li>Selected financial currency ({preferences.currency})</li>
            <li>Default traveler party size and saved bookmark archives</li>
          </ul>
        </div>
      ),
    },
  };

  return (
    <>
      <footer className="w-full mt-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#0c0e14]/80 backdrop-blur-md pt-16 pb-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section: Brand + 4 Navigation Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-14 border-b border-slate-200/70 dark:border-slate-800/70">
            {/* Left Brand Column (Spans 2 cols) */}
            <div className="lg:col-span-2 space-y-5">
              {/* Brand Logo & Subtitle */}
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm transition-transform duration-200 group-hover:scale-105 shrink-0">
                  <img
                    src="/logo.png"
                    alt="TripPlanner Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                    TripPlanner
                  </span>
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-[#c2410c] dark:text-[#ea580c] font-sans mt-1">
                    Smart Travel • Fluid Journeys
                  </span>
                </div>
              </Link>

              {/* Mission Statement */}
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-sans">
                Your modern travel companion for mindful, effortless exploration. Plan detailed multi-day
                itineraries, track expenses across currencies, and discover points of interest around the globe.
              </p>



              {/* Social / Utility Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <Link
                  to="/destinations"
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-[#c2410c] hover:text-white text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center transition-all duration-200"
                  title="Global Destination Explorer"
                >
                  <Globe className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/trips"
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-[#c2410c] hover:text-white text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center transition-all duration-200"
                  title="Travel Community & Journals"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/settings"
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-[#c2410c] hover:text-white text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center transition-all duration-200"
                  title="Settings & Preferences"
                >
                  <Code2 className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/saved"
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-[#c2410c] hover:text-white text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center transition-all duration-200"
                  title="Curated Photo Gallery & Bookmarks"
                >
                  <Camera className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Column 1: PRODUCT */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white font-sans">
                Product
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-sans">
                <li>
                  <Link to="/" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/trips" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Trip Planner
                  </Link>
                </li>
                <li>
                  <Link to="/trips" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Split Ledger
                  </Link>
                </li>
                <li>
                  <Link to="/saved" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Offline Vault
                  </Link>
                </li>
                <li>
                  <Link to="/destinations" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Destination Guides
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: RESOURCES */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white font-sans">
                Resources
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-sans">
                <li>
                  <Link to="/trips" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Community Itineraries
                  </Link>
                </li>
                <li>
                  <Link to="/trips" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Travel Journal
                  </Link>
                </li>
                <li>
                  <Link to="/destinations" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Developer API & Guides
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Currency Matrix ({preferences.currency})
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: COMPANY */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white font-sans">
                Company
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-sans">
                <li>
                  <Link to="/destinations" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/destinations" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Press & Media
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Manifest
                  </Link>
                </li>
                <li>
                  <Link to="/destinations" className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors">
                    Sustainability
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: LEGAL & PRIVACY */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white font-sans">
                Legal & Privacy
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-sans">
                <li>
                  <button
                    onClick={() => setActiveModal(legalModals.privacy)}
                    className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal(legalModals.terms)}
                    className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal(legalModals.security)}
                    className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors text-left"
                  >
                    Security Architecture
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal(legalModals.cookies)}
                    className="hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors text-left"
                  >
                    Cookie Settings
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Row: Copyright + Language & Currency Pills */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
            <div>
              © 2025 TripPlanner Technologies Inc. All rights reserved.
            </div>

            <div className="flex items-center gap-3">
              {/* Language Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 font-medium">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>English (US)</span>
              </div>

              {/* Dynamic Currency Switcher Pill */}
              <Link
                to="/settings"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 font-medium transition-colors"
                title="Change active currency in Settings"
              >
                <span>💵</span>
                <span>Currency: {preferences.currency} ({currencySymbol})</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Legal Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-[#c2410c] dark:text-[#ea580c]">
                  <activeModal.icon className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                  {activeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2">{activeModal.body}</div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
