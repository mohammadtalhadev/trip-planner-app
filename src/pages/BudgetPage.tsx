import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  MapPin,
  Lock,
  LogIn,
  Sparkles,
  Shield,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { useTripStore, INITIAL_DEMO_TRIPS } from '../store/useTripStore';
import { useUserStore } from '../store/useUserStore';
import { BudgetOverview } from '../components/budget/BudgetOverview';
import { CategoryBreakdown } from '../components/budget/CategoryBreakdown';
import { ExpenseList } from '../components/budget/ExpenseList';
import { ExpenseFormModal } from '../components/budget/ExpenseFormModal';
import { Expense } from '../types/trip';

export const BudgetPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const user = useUserStore((state) => state.user);
  const trips = useTripStore((state) => state.trips);
  const currentTripId = useTripStore((state) => state.currentTripId);

  const addExpense = useTripStore((state) => state.addExpense);
  const updateExpense = useTripStore((state) => state.updateExpense);
  const deleteExpense = useTripStore((state) => state.deleteExpense);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  // 1. Signed-out gate: Budget must NOT show when user is signed out; show "Login to manage budget"
  if (!user.isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-10 px-4 animate-in fade-in duration-200">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-8 sm:p-12 text-center space-y-7">
          {/* Header Icon */}
          <div className="mx-auto w-16 h-16 rounded-3xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/50 flex items-center justify-center text-[#ff5a36] shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          {/* Title & Tag */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-950/60 text-[#ff5a36] border border-orange-100 dark:border-orange-900/40">
              <Wallet className="w-3 h-3" />
              Member Feature • Financial Ledger
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
              Login to Manage Budget
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Please sign in or create an account to view, itemize, and manage your travel budget. Every user has their own independent budget ledger with custom expenses, category breakdowns, and currency tracking.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Shield className="w-3.5 h-3.5 text-[#ff5a36]" />
                <span>Isolated Ledgers</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Every user maintains their own private ledger with custom currency settings.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Smart Categorization</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Itemize costs across flights, stays, food, activities, and transit.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#ff5a36] to-[#f97316] hover:from-[#e04825] hover:to-[#ea580c] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Continue</span>
            </Link>

            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Signed-in state: Resolve target trip
  const targetTripId = tripId || currentTripId || (trips.length > 0 ? trips[0].id : 'demo-turkey-vacation');
  const trip = trips.find((t) => t.id === targetTripId) || INITIAL_DEMO_TRIPS.find((t) => t.id === targetTripId);

  // Aggregate all expenses across all days + standalone
  const allExpenses: Expense[] = useMemo(() => {
    if (!trip) return [];
    const list: Expense[] = [];
    trip.days.forEach((day) => {
      day.expenses.forEach((e) => list.push(e));
    });
    return list;
  }, [trip]);

  const totalSpent = useMemo(() => {
    return allExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [allExpenses]);

  if (!trip) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Not Found</h2>
        <p className="text-sm text-slate-500">The requested trip does not exist.</p>
        <Link
          to="/trips"
          className="inline-flex px-5 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20"
        >
          Return to Trips
        </Link>
      </div>
    );
  }

  const handleSaveExpense = (expenseData: Omit<Expense, 'id'>) => {
    if (expenseToEdit) {
      updateExpense(trip.id, expenseToEdit.id, expenseData);
    } else {
      addExpense(trip.id, expenseData);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header & Subnav */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div className="flex items-center gap-3.5">
          <Link
            to={`/trips/${trip.id}`}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
              <span>{trip.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-stone-500">
                <MapPin className="w-3 h-3 text-brand-600" />
                {trip.destination}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-0.5">
              Budget & Expense Ledger
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            to={`/trips/${trip.id}`}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to={`/trips/${trip.id}/itinerary`}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Itinerary
          </Link>
          <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#c2410c] text-white shadow-sm">
            Budget
          </span>
          <button
            onClick={() => {
              setExpenseToEdit(null);
              setIsExpenseModalOpen(true);
            }}
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Progress */}
      <BudgetOverview
        totalBudget={trip.budget}
        totalSpent={totalSpent}
        currency={trip.currency}
      />

      {/* Spending by Category Analytics */}
      <CategoryBreakdown expenses={allExpenses} currency={trip.currency} />

      {/* Expense Ledger with Filter & Sort */}
      <ExpenseList
        expenses={allExpenses}
        days={trip.days}
        currency={trip.currency}
        onEditExpense={(expense) => {
          setExpenseToEdit(expense);
          setIsExpenseModalOpen(true);
        }}
        onDeleteExpense={(id) => deleteExpense(trip.id, id)}
      />

      {/* Expense Modal */}
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setExpenseToEdit(null);
        }}
        days={trip.days}
        tripCurrency={trip.currency}
        expenseToEdit={expenseToEdit}
        onSave={handleSaveExpense}
      />
    </div>
  );
};
