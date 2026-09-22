import { AlertTriangle, CheckCircle2 } from 'lucide-react';
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
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-frost space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Accounting Ledger
          </span>
          <h3 className="text-xl font-serif font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
            Budget Balance & Allocation
          </h3>
        </div>

        {/* Status Indicator */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium font-mono ${
            isOverBudget
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
          }`}
        >
          {isOverBudget ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Over Budget by {formatCurrency(Math.abs(remaining), currency)}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Balanced Allocation</span>
            </>
          )}
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Budget */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            Total Cap
          </span>
          <span className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(totalBudget, currency)}
          </span>
        </div>

        {/* Total Spent */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            Total Disbursed
          </span>
          <span className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(totalSpent, currency)}
          </span>
        </div>

        {/* Remaining */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            Remaining Available
          </span>
          <span
            className={`text-2xl font-mono font-bold ${
              isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-[#c2410c] dark:text-[#fb923c]'
            }`}
          >
            {formatCurrency(remaining, currency)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400">
            Utilization: {percentUsed}%
          </span>
          <span className="text-slate-400">
            {formatCurrency(totalSpent, currency)} / {formatCurrency(totalBudget, currency)}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget
                ? 'bg-rose-500'
                : percentUsed > 85
                ? 'bg-amber-600'
                : 'bg-[#c2410c]'
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
