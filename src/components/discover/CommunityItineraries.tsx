import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  ArrowRight,
  Route,
  X,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

interface ItineraryItem {
  id: string;
  title: string;
  location: string;
  city: string;
  country: string;
  days: number;
  placesCount: number;
  description: string;
  tags: string[];
  estTotal: string;
  image: string;
  highlights: string[];
}

const COMMUNITY_ITINERARIES: ItineraryItem[] = [
  {
    id: 'itinerary-kyoto',
    title: 'Kyoto Autumn Serenity',
    location: 'Kyoto, Japan',
    city: 'Kyoto',
    country: 'Japan',
    days: 7,
    placesCount: 12,
    description:
      'A balanced slow-travel immersion through sunrise bamboo groves, quiet Zen rock gardens, and private tea houses.',
    tags: ['Arashiyama', 'Gion', 'Fushimi Inari', 'Kaiseki'],
    estTotal: '$1,420',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Early morning walk through Sagano bamboo grove',
      'Private matcha ceremony in historic Gion district',
      'Sunset hike along thousands of vermilion torii gates at Fushimi Inari',
      'Seasonal Michelin-starred Kaiseki multicourse dinner',
    ],
  },
  {
    id: 'itinerary-paris',
    title: 'Paris Twilight & Hidden Ateliers',
    location: 'Paris, France',
    city: 'Paris',
    country: 'France',
    days: 5,
    placesCount: 9,
    description:
      'Romantic sunset views, historic Haussmannian terrace dining, artisanal perfumeries, and hidden Marais art studios.',
    tags: ['Le Marais', 'Eiffel Golden Hour', 'Saint-Germain'],
    estTotal: '€1,850',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Golden hour rooftop aperitif with direct Eiffel views',
      'Independent gallery hopping in historic Le Marais alleys',
      'Custom bespoke fragrance crafting at a centuries-old perfumery',
      'Literary cafes and antique book stalls along the Seine riverbank',
    ],
  },
  {
    id: 'itinerary-rome',
    title: 'Rome Eternal Epochs & Trastevere',
    location: 'Rome, Italy',
    city: 'Rome',
    country: 'Italy',
    days: 6,
    placesCount: 15,
    description:
      'Morning walks through ancient Roman forums without crowds, authentic handmade pasta in Trastevere, and baroque plazas.',
    tags: ['Colosseum', 'Trastevere', 'Pantheon'],
    estTotal: '€1,280',
    image:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'VIP sunrise access to the Colosseum arena floor and underground',
      'Handmade cacio e pepe and carbonara tasting tour through Trastevere',
      'Architectural study of the Pantheon oculus at midday sun',
      'Evening stroll across Piazza Navona with pistachio gelato',
    ],
  },
];

export const CommunityItineraries: React.FC = () => {
  const navigate = useNavigate();
  const { createTrip } = useTripStore();
  const [selectedPlan, setSelectedPlan] = useState<ItineraryItem | null>(null);

  const handleCopyItinerary = (plan: ItineraryItem) => {
    // Clone plan to user's personal trips
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + plan.days * 86400000).toISOString().split('T')[0];

    const newTrip = createTrip({
      name: `${plan.title}`,
      destination: `${plan.city}, ${plan.country}`,
      startDate,
      endDate,
      travelers: [{ id: 'usr-1', name: 'Sophia Vance' }],
      budget: parseInt(plan.estTotal.replace(/[^0-9]/g, ''), 10) || 1500,
      currency: plan.estTotal.includes('€') ? 'EUR' : 'USD',
      coverImage: plan.image,
    });

    setSelectedPlan(null);
    navigate(`/trips/${newTrip.id}/itinerary`);
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/70 text-[#ff5a36] flex items-center justify-center shrink-0">
              <Route className="w-3.5 h-3.5" />
            </span>
            <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Trip Plans by Fellow Explorers
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Handcrafted multi-day itineraries crafted by top curators with turn-by-turn notes.
          </p>
        </div>

        <Link
          to="/trips"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs group"
        >
          <span>Browse 450+ Trips</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 3 Itinerary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COMMUNITY_ITINERARIES.map((plan) => (
          <div
            key={plan.id}
            className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Top Photo with Frosted Glassmorphism Duration & Location Overlay */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
              <img
                src={plan.image}
                alt={plan.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/30" />

              {/* Top-Left: Duration & Places Frosted Badge */}
              <div className="absolute top-3.5 left-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/25 text-white shadow-xs">
                  <Clock className="w-3 h-3 text-white/90" />
                  <span>
                    {plan.days} Days • {plan.placesCount} Places
                  </span>
                </span>
              </div>

              {/* Bottom-Left: Location Pill */}
              <div className="absolute bottom-3.5 left-3.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/40 backdrop-blur-md border border-white/20 text-white/90">
                  <MapPin className="w-3 h-3 text-[#ff5a36]" />
                  <span>{plan.location}</span>
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-sans text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#ff5a36] transition-colors leading-snug">
                  {plan.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {plan.description}
                </p>

                {/* Neighborhood & Highlights Chips (Liquid glassmorphism subtle tags) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {plan.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Estimated Total & View Plan Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 block leading-tight">
                    Est. Total
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {plan.estTotal}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all shadow-2xs group/btn"
                >
                  <span>View Plan</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Preview Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff5a36]">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedPlan.days} Days Curated Itinerary
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedPlan.title}
                </h3>
                <span className="text-xs text-slate-400">{selectedPlan.location}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedPlan.description}
            </p>

            {/* Highlights List */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Featured Highlights
              </span>
              <div className="space-y-1.5">
                {selectedPlan.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Estimated Cost</span>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedPlan.estTotal}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyItinerary(selectedPlan)}
                  className="px-5 py-2 rounded-full bg-[#ff5a36] hover:bg-[#e04825] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Clone to My Trips
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
