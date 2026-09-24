import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  MapPin,
  Sparkles,
  LogIn,
  DollarSign,
  ArrowRightLeft,
  RefreshCw,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTripStore, INITIAL_DEMO_TRIPS } from '../store/useTripStore';
import { useUserStore } from '../store/useUserStore';
import { useCurrency } from '../hooks/useCurrency';
import { BudgetOverview } from '../components/budget/BudgetOverview';
import { CategoryBreakdown } from '../components/budget/CategoryBreakdown';
import { ExpenseList } from '../components/budget/ExpenseList';
import { ExpenseFormModal } from '../components/budget/ExpenseFormModal';
import { Expense } from '../types/trip';
import { CurrencyCode } from '../types/settings';
import { CURRENCY_SYMBOLS } from '../utils/currency';

export const BudgetPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const user = useUserStore((state) => state.user);
  const trips = useTripStore((state) => state.trips);
  const currentTripId = useTripStore((state) => state.currentTripId);

  const addExpense = useTripStore((state) => state.addExpense);
  const updateExpense = useTripStore((state) => state.updateExpense);
  const deleteExpense = useTripStore((state) => state.deleteExpense);

  const {
    preferredCurrency,
    convert,
    convertBetween,
    formatRaw,
    refreshRates,
  } = useCurrency();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [displayCurrencyMode, setDisplayCurrencyMode] = useState<'preferred' | 'base'>('preferred');
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  // Currency Converter Widget State
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcFrom, setCalcFrom] = useState<CurrencyCode>('USD');
  const [calcTo, setCalcTo] = useState<CurrencyCode>(preferredCurrency);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // If user is logged out, always default to demo trip
  const targetTripId = !user.isLoggedIn
    ? 'demo-turkey-vacation'
    : tripId || currentTripId || (trips.length > 0 ? trips[0].id : 'demo-turkey-vacation');

  const trip = trips.find((t) => t.id === targetTripId) || INITIAL_DEMO_TRIPS.find((t) => t.id === targetTripId);

  // Aggregate all raw expenses across all days
  const allExpenses: Expense[] = useMemo(() => {
    if (!trip) return [];
    const list: Expense[] = [];
    trip.days.forEach((day) => {
      day.expenses?.forEach((e) => list.push(e));
    });
    return list;
  }, [trip]);

  // Active display currency
  const activeCurrency = displayCurrencyMode === 'preferred' ? preferredCurrency : (trip?.currency || 'USD');

  // Convert budget to active currency
  const displayBudget = useMemo(() => {
    if (!trip) return 0;
    return displayCurrencyMode === 'preferred'
      ? convert(trip.budget, trip.currency)
      : trip.budget;
  }, [trip, displayCurrencyMode, convert]);

  // Convert expenses to active currency
  const displayExpenses: Expense[] = useMemo(() => {
    if (!allExpenses || !trip) return [];
    if (displayCurrencyMode === 'base') return allExpenses;
    return allExpenses.map((e) => ({
      ...e,
      amount: convert(e.amount, e.currency || trip.currency),
      currency: preferredCurrency,
    }));
  }, [allExpenses, displayCurrencyMode, convert, preferredCurrency, trip]);

  // Calculate total spent in active display currency
  const displayTotalSpent = useMemo(() => {
    return displayExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [displayExpenses]);

  // Live conversion rate between trip base currency and preferred currency
  const liveRate = useMemo(() => {
    if (!trip) return 1;
    return convertBetween(1, trip.currency, preferredCurrency);
  }, [trip, preferredCurrency, convertBetween]);

  // Calculated converted amount in calculator widget
  const calculatedResult = useMemo(() => {
    return convertBetween(calcAmount || 0, calcFrom, calcTo);
  }, [calcAmount, calcFrom, calcTo, convertBetween]);

  const handleRefreshRates = async () => {
    setIsRefreshing(true);
    await refreshRates();
    setTimeout(() => setIsRefreshing(false), 500);
  };

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

  const currencyOptions: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR'];

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

      {/* LIVE CURRENCY CONVERSION & CONTROL BANNER */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200/80 dark:border-orange-900/40 text-orange-900 dark:text-orange-200">
            <DollarSign className="w-4 h-4 text-[#c2410c]" />
            <span className="font-bold">Active Currency:</span>
            <span className="font-mono font-bold text-[#c2410c]">
              {CURRENCY_SYMBOLS[activeCurrency as CurrencyCode] || activeCurrency} {activeCurrency}
            </span>
          </div>

          {preferredCurrency !== trip.currency && (
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              <span>Live Rate:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                1 {trip.currency} = {liveRate.toFixed(preferredCurrency === 'JPY' ? 0 : 4)} {preferredCurrency}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                Live API
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle between Preferred and Base Currency */}
          {preferredCurrency !== trip.currency && (
            <button
              onClick={() =>
                setDisplayCurrencyMode((prev) => (prev === 'preferred' ? 'base' : 'preferred'))
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
              title="Toggle between converted preferred currency and original trip currency"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#c2410c]" />
              <span>
                {displayCurrencyMode === 'preferred'
                  ? `Show Original (${trip.currency})`
                  : `Show Converted (${preferredCurrency})`}
              </span>
            </button>
          )}

          {/* Currency Calculator Toggle */}
          <button
            onClick={() => setIsConverterOpen(!isConverterOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-blue-500" />
            <span>Converter Tool</span>
            {isConverterOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Refresh Rates */}
          <button
            onClick={handleRefreshRates}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Refresh exchange rates from live API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* EXPANDABLE LIVE CURRENCY CONVERTER CALCULATOR */}
      {isConverterOpen && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-50/70 to-amber-50/50 dark:from-slate-900 dark:to-slate-800/90 border border-orange-200/80 dark:border-orange-900/40 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-orange-200/60 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#c2410c]" />
              <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                Currency Calculator
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                Amount
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={calcAmount || ''}
                onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)}
                placeholder="100"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                From
              </label>
              <select
                value={calcFrom}
                onChange={(e) => setCalcFrom(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:outline-none"
              >
                {currencyOptions.map((c) => (
                  <option key={c} value={c}>
                    {c} ({CURRENCY_SYMBOLS[c]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                To
              </label>
              <select
                value={calcTo}
                onChange={(e) => setCalcTo(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:outline-none"
              >
                {currencyOptions.map((c) => (
                  <option key={c} value={c}>
                    {c} ({CURRENCY_SYMBOLS[c]})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">
                Calculated Conversion
              </span>
              <span className="text-base font-mono font-black text-[#c2410c] dark:text-orange-400 truncate">
                {formatRaw(calculatedResult, calcTo)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Financial Overview Progress */}
      <BudgetOverview
        totalBudget={displayBudget}
        totalSpent={displayTotalSpent}
        currency={activeCurrency}
      />

      {/* Spending by Category Analytics */}
      <CategoryBreakdown expenses={displayExpenses} currency={activeCurrency} />

      {/* Expense Ledger with Filter & Sort */}
      <ExpenseList
        expenses={displayExpenses}
        days={trip.days}
        currency={activeCurrency}
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
