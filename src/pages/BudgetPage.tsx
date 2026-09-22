import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin } from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { BudgetOverview } from '../components/budget/BudgetOverview';
import { CategoryBreakdown } from '../components/budget/CategoryBreakdown';
import { ExpenseList } from '../components/budget/ExpenseList';
import { ExpenseFormModal } from '../components/budget/ExpenseFormModal';
import { Expense } from '../types/trip';

export const BudgetPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === tripId));
  const addExpense = useTripStore((state) => state.addExpense);
  const updateExpense = useTripStore((state) => state.updateExpense);
  const deleteExpense = useTripStore((state) => state.deleteExpense);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

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
          className="inline-flex px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
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
          <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm">
            Budget
          </span>
          <button
            onClick={() => {
              setExpenseToEdit(null);
              setIsExpenseModalOpen(true);
            }}
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all hover:scale-[1.01]"
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
