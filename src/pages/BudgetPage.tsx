import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  MapPin,
  Sparkles,
  LogIn,
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

  // If user is logged out, always default to demo trip
  const targetTripId = !user.isLoggedIn
    ? 'demo-turkey-vacation'
    : tripId || currentTripId || (trips.length > 0 ? trips[0].id : 'demo-turkey-vacation');

  const trip = trips.find((t) => t.id === targetTripId) || INITIAL_DEMO_TRIPS.find((t) => t.id === targetTripId);

  // Aggregate all expenses across all days + standalone
  const allExpenses: Expense[] = useMemo(() => {
    if (!trip) return [];
    const list: Expense[] = [];
    trip.days.forEach((day) => {
      day.expenses?.forEach((e) => list.push(e));
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
          to={!user.isLoggedIn ? '/' : '/trips'}
          className="inline-flex px-5 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20"
        >
          Return to {!user.isLoggedIn ? 'Home' : 'Trips'}
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
            to={!user.isLoggedIn ? '/' : `/trips/${trip.id}`}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={!user.isLoggedIn ? 'Back to Home' : 'Back to Dashboard'}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
              <span>{trip.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-stone-500">
                <MapPin className="w-3 h-3 text-[#c2410c]" />
                {trip.destination}
              </span>
              {!user.isLoggedIn && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                  Interactive Demo
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-0.5">
              Budget & Expense Ledger
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {user.isLoggedIn && (
            <Link
              to={`/trips/${trip.id}`}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Dashboard
            </Link>
          )}
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

      {/* Guest Interactive Demo Banner */}
      {!user.isLoggedIn && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Interactive Demo Budget:</strong> You can explore financial metrics and test adding or editing expenses in demo mode (changes are in-memory demo only and not saved). Sign in to create and manage your own permanent travel ledgers.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c2410c] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Save</span>
            </Link>
          </div>
        </div>
      )}

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
