import React from 'react';
import { Expense, ExpenseCategory } from '../../types/trip';
import { formatCurrency } from '../../utils/currency';
import { Home, Utensils, Car, Compass, ShoppingBag, MoreHorizontal } from 'lucide-react';

interface CategoryBreakdownProps {
  expenses: Expense[];
  currency: string;
}

interface CategoryInfo {
  name: ExpenseCategory;
  amount: number;
  percentage: number;
  icon: any;
  color: string;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  expenses,
  currency,
}) => {
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);

  const categoryConfigs: { name: ExpenseCategory; icon: any; color: string }[] = [
    { name: 'Accommodation', icon: Home, color: 'bg-indigo-500' },
    { name: 'Food', icon: Utensils, color: 'bg-amber-500' },
    { name: 'Transportation', icon: Car, color: 'bg-blue-500' },
    { name: 'Activities', icon: Compass, color: 'bg-emerald-500' },
    { name: 'Shopping', icon: ShoppingBag, color: 'bg-purple-500' },
    { name: 'Miscellaneous', icon: MoreHorizontal, color: 'bg-slate-500' },
  ];

  const breakdown: CategoryInfo[] = categoryConfigs.map((cat) => {
    const amount = expenses
      .filter((e) => e.category === cat.name)
      .reduce((sum, e) => sum + e.amount, 0);
    const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
    return {
      ...cat,
      amount,
      percentage,
    };
  });

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-5">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Analytics
        </span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Spending by Category
        </h3>
      </div>

      {/* Visual Multi-Segment Bar */}
      {totalSpent > 0 && (
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
          {breakdown.map(
            (cat) =>
              cat.percentage > 0 && (
                <div
                  key={cat.name}
                  className={`h-full ${cat.color} transition-all`}
                  style={{ width: `${cat.percentage}%` }}
                  title={`${cat.name}: ${cat.percentage}%`}
                />
              )
          )}
        </div>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {breakdown.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3"
            >
              <div
                className={`w-9 h-9 rounded-xl ${cat.color} text-white flex items-center justify-center shrink-0 shadow-sm`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {cat.name}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {cat.percentage}%
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(cat.amount, currency)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
