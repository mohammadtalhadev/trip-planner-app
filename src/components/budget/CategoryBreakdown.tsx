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
    { name: 'Accommodation', icon: Home, color: 'bg-stone-700 dark:bg-stone-600' },
    { name: 'Food', icon: Utensils, color: 'bg-amber-700 dark:bg-amber-600' },
    { name: 'Transportation', icon: Car, color: 'bg-teal-700 dark:bg-teal-600' },
    { name: 'Activities', icon: Compass, color: 'bg-emerald-700 dark:bg-emerald-600' },
    { name: 'Shopping', icon: ShoppingBag, color: 'bg-rose-700 dark:bg-rose-600' },
    { name: 'Miscellaneous', icon: MoreHorizontal, color: 'bg-stone-500 dark:bg-stone-400' },
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
    <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-subtle space-y-5">
      <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Distribution
        </span>
        <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
          Spending by Category
        </h3>
      </div>

      {/* Visual Multi-Segment Bar */}
      {totalSpent > 0 && (
        <div className="w-full h-2 rounded-full overflow-hidden flex bg-stone-100 dark:bg-stone-800">
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
              className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-center gap-3"
            >
              <div
                className={`w-8 h-8 rounded-lg ${cat.color} text-white flex items-center justify-center shrink-0 shadow-sm`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-700 dark:text-stone-300 truncate">
                    {cat.name}
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">
                    {cat.percentage}%
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100 mt-0.5">
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
