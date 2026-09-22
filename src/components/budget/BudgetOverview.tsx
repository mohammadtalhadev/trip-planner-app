import React from 'react';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

interface BudgetOverviewProps {
  totalBudget: number;
  totalSpent: number;
  currency: string;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  totalBudget,
  totalSpent,
  currency,
}) => {
  const remaining = totalBudget - totalSpent;
  const isOverBudget = remaining < 0;
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Financial Summary
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Trip Budget Tracker
          </h3>
        </div>

        {/* Status Indicator */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            isOverBudget
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
          }`}
        >
          {isOverBudget ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Over Budget by {formatCurrency(Math.abs(remaining), currency)}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Within Allocated Budget</span>
            </>
          )}
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Budget */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Total Budget
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(totalBudget, currency)}
          </span>
        </div>

        {/* Total Spent */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Total Spent
          </span>
          <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {formatCurrency(totalSpent, currency)}
          </span>
        </div>

        {/* Remaining */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Remaining Budget
          </span>
          <span
            className={`text-2xl font-extrabold ${
              isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {formatCurrency(remaining, currency)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600 dark:text-slate-400">
            Budget Consumption: {percentUsed}%
          </span>
          <span className="text-slate-500">
            {formatCurrency(totalSpent, currency)} / {formatCurrency(totalBudget, currency)}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget
                ? 'bg-rose-500'
                : percentUsed > 85
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
