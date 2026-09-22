import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CreateJourneyForm } from '../components/trip/CreateJourneyForm';

export const NewTripPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 sm:py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journeys</span>
        </Link>
      </div>

      <CreateJourneyForm onClose={() => navigate('/trips')} />
    </div>
  );
};
