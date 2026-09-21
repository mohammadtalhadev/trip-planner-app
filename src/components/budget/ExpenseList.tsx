import React, { useState, useMemo, memo } from 'react';
import {
  Edit2,
  Trash2,
  Receipt,
} from 'lucide-react';
import { Expense, ExpenseCategory, ItineraryDay } from '../../types/trip';
import { formatCurrency } from '../../utils/currency';
import { formatDateShort } from '../../utils/date';
import { Badge } from '../common/Badge';
import { CustomSelect } from '../common/CustomSelect';

interface ExpenseRowProps {
  expense: Expense;
  currency: string;
  dayNumber?: number;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseRow: React.FC<ExpenseRowProps> = memo(
  ({ expense, currency, dayNumber, onEdit, onDelete }) => {
    const categoryVariants: Record<ExpenseCategory, any> = {
      Accommodation: 'purple',
      Food: 'warning',
      Transportation: 'info',
      Activities: 'success',
      Shopping: 'neutral',
      Miscellaneous: 'neutral',
    };

    return (
      <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
        <td className="py-3.5 px-4 text-sm font-semibold text-slate-900 dark:text-white">
          <div>
            <p>{expense.description}</p>
            {expense.notes && (
              <p className="text-xs text-slate-400 font-normal mt-0.5">{expense.notes}</p>
            )}
          </div>
        </td>
        <td className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Badge variant={categoryVariants[expense.category] || 'neutral'} size="sm">
            {expense.category}
          </Badge>
        </td>
        <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
          {formatDateShort(expense.date)}
        </td>
        <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
          {dayNumber ? `Day ${dayNumber}` : 'General'}
        </td>
        <td className="py-3.5 px-4 text-sm font-bold text-slate-900 dark:text-white text-right">
          {formatCurrency(expense.amount, currency)}
        </td>
        <td className="py-3.5 px-4 text-right">
          <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(expense)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#c2410c] dark:hover:text-[#fb923c] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit expense"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete expense "${expense.description}"?`)) {
                  onDelete(expense.id);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Delete expense"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

ExpenseRow.displayName = 'ExpenseRow';

interface ExpenseListProps {
  expenses: Expense[];
  days: ItineraryDay[];
  currency: string;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  days,
  currency,
  onEditExpense,
  onDeleteExpense,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDay, setFilterDay] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Map of dayId to dayNumber
  const dayNumberMap = useMemo(() => {
    const map = new Map<string, number>();
    days.forEach((d) => map.set(d.id, d.dayNumber));
    return map;
  }, [days]);

  // Filtered & Sorted expenses
  const filteredAndSorted = useMemo(() => {
    let list = [...expenses];

    // Category filter
    if (filterCategory !== 'all') {
      list = list.filter((e) => e.category === filterCategory);
    }

    // Day filter
    if (filterDay !== 'all') {
      if (filterDay === 'general') {
        list = list.filter((e) => !e.dayId);
      } else {
        list = list.filter((e) => e.dayId === filterDay);
      }
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return list;
  }, [expenses, filterCategory, filterDay, sortBy]);

  const filteredTotal = useMemo(() => {
    return filteredAndSorted.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredAndSorted]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Accommodation', label: 'Accommodation' },
    { value: 'Food', label: 'Food & Dining' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Activities', label: 'Activities' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Miscellaneous', label: 'Miscellaneous' },
  ];

  const dayOptions = useMemo(
    () => [
      { value: 'all', label: 'All Days' },
      { value: 'general', label: 'General (No day)' },
      ...days.map((d) => ({ value: d.id, label: `Day ${d.dayNumber}` })),
    ],
    [days]
  );

  const sortOptions = [
    { value: 'date-desc', label: 'Newest Date' },
    { value: 'date-asc', label: 'Oldest Date' },
    { value: 'amount-desc', label: 'Highest Amount' },
    { value: 'amount-asc', label: 'Lowest Amount' },
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-frost space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Ledger
          </span>
          <h3 className="text-base font-serif font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            Expense Records ({filteredAndSorted.length})
          </h3>
        </div>

        {/* Filter / Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <CustomSelect
            options={categoryOptions}
            value={filterCategory}
            onChange={(val) => setFilterCategory(val)}
            className="w-36 sm:w-40"
            size="sm"
          />

          {/* Day Filter */}
          <CustomSelect
            options={dayOptions}
            value={filterDay}
            onChange={(val) => setFilterDay(val)}
            className="w-32 sm:w-36"
            size="sm"
          />

          {/* Sort Selector */}
          <CustomSelect
            options={sortOptions}
            value={sortBy}
            onChange={(val) => setSortBy(val as any)}
            className="w-36 sm:w-40"
            size="sm"
          />
        </div>
      </div>

      {/* Expenses Table */}
      {filteredAndSorted.length === 0 ? (
        <div className="py-14 text-center text-stone-400 text-xs">
          <Receipt className="w-8 h-8 mx-auto mb-2 text-stone-300 dark:text-stone-600" />
          <p className="font-serif font-bold text-sm text-stone-700 dark:text-stone-300">No matching transactions logged</p>
          <p className="mt-1 text-stone-400">Adjust the filters or record an expense above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Day</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-sans">
              {filteredAndSorted.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  currency={currency}
                  dayNumber={expense.dayId ? dayNumberMap.get(expense.dayId) : undefined}
                  onEdit={onEditExpense}
                  onDelete={onDeleteExpense}
                />
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-stone-200 dark:border-stone-700 font-mono font-bold text-xs">
                <td colSpan={4} className="py-3 px-4 text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                  Filtered Ledger Total
                </td>
                <td className="py-3 px-4 text-right text-stone-900 dark:text-stone-100">
                  {formatCurrency(filteredTotal, currency)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
