import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, MapPin, Users, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useTripStore } from '../../store/useTripStore';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { CURRENCY_SYMBOLS } from '../../utils/currency';
import { CurrencyCode } from '../../types/settings';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDestination?: {
    city: string;
    country: string;
    lat?: number;
    lon?: number;
    coverImage?: string;
  };
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  initialDestination,
}) => {
  const navigate = useNavigate();
  const createTrip = useTripStore((state) => state.createTrip);
  const preferences = usePreferencesStore((state) => state.preferences);

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);
  const nextWeekStr = nextWeekDate.toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [destination, setDestination] = useState(initialDestination?.city || '');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(nextWeekStr);
  const [travelersCount, setTravelersCount] = useState(preferences.defaultTravelers || 2);
  const [budget, setBudget] = useState('2000');
  const [currency, setCurrency] = useState<CurrencyCode>(preferences.currency || 'USD');
  const [coverImage, setCoverImage] = useState(
    initialDestination?.coverImage ||
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a trip name.');
      return;
    }
    if (!destination.trim()) {
      setError('Please provide a destination city.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('End date must be on or after start date.');
      return;
    }

    const budgetNum = parseFloat(budget) || 0;

    const newTrip = createTrip({
      name: name.trim(),
      destination: destination.trim(),
      coordinates: initialDestination?.lat && initialDestination?.lon ? {
        lat: initialDestination.lat,
        lon: initialDestination.lon,
      } : undefined,
      startDate,
      endDate,
      budget: budgetNum,
      currency,
      coverImage,
      travelers: Array.from({ length: travelersCount }).map((_, idx) => ({
        id: `traveler-${Date.now()}-${idx}`,
        name: idx === 0 ? 'Organizer (You)' : `Traveler ${idx + 1}`,
        role: idx === 0 ? 'organizer' : 'traveler',
      })),
    });

    onClose();
    navigate(`/trips/${newTrip.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Inaugurate a New Journey" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Trip Name */}
        <div>
          <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-1.5">
            Journey Title *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Aegean Coastal Voyage, Autumn in Kyoto..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-1.5">
            Primary Destination City *
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Istanbul, Paris, Tokyo, Florence..."
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setError(null);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Commence Date
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Conclusion Date
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>
        </div>

        {/* Travelers & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Party Size
            </label>
            <div className="relative">
              <Users className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="number"
                min="1"
                max="20"
                value={travelersCount}
                onChange={(e) => setTravelersCount(parseInt(e.target.value) || 1)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Target Budget ({CURRENCY_SYMBOLS[currency]})
            </label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="number"
                min="0"
                step="50"
                placeholder="2500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>
        </div>

        {/* Currency & Cover Photo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Financial Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD (CA$)</option>
              <option value="AUD">AUD (AU$)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Cover Image URL
            </label>
            <div className="relative">
              <ImageIcon className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Inaugurate Journey
          </button>
        </div>
      </form>
    </Modal>
  );
};
