import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, DollarSign } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/trips/${trip.id}`}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{trip.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-500" />
                {trip.destination}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Budget & Expenses
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/trips/${trip.id}`}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to={`/trips/${trip.id}/itinerary`}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Itinerary
          </Link>
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm">
            Budget
          </span>
          <button
            onClick={() => {
              setExpenseToEdit(null);
              setIsExpenseModalOpen(true);
            }}
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
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
