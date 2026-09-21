import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Tag } from 'lucide-react';
import { Modal } from '../common/Modal';
import { CustomSelect } from '../common/CustomSelect';
import { Expense, ExpenseCategory, ItineraryDay } from '../../types/trip';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: ItineraryDay[];
  tripCurrency: string;
  expenseToEdit?: Expense | null;
  onSave: (expenseData: Omit<Expense, 'id'>) => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  days,
  tripCurrency,
  expenseToEdit,
  onSave,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayId, setDayId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expenseToEdit) {
      setDescription(expenseToEdit.description);
      setAmount(String(expenseToEdit.amount));
      setCategory(expenseToEdit.category);
      setDate(expenseToEdit.date || new Date().toISOString().split('T')[0]);
      setDayId(expenseToEdit.dayId || '');
      setNotes(expenseToEdit.notes || '');
    } else {
      setDescription('');
      setAmount('');
      setCategory('Food');
      setDate(days[0]?.date || new Date().toISOString().split('T')[0]);
      setDayId(days[0]?.id || '');
      setNotes('');
    }
    setError(null);
  }, [expenseToEdit, isOpen, days]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please enter an expense description.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid expense amount.');
      return;
    }

    onSave({
      description: description.trim(),
      amount: parsedAmount,
      currency: tripCurrency,
      category,
      date,
      dayId: dayId || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Description *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Hotel Reservation, Group Dinner, Train tickets..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError(null);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Amount ({tripCurrency}) *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="45.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <CustomSelect
              options={[
                { value: 'Accommodation', label: 'Accommodation' },
                { value: 'Food', label: 'Food & Dining' },
                { value: 'Transportation', label: 'Transportation' },
                { value: 'Activities', label: 'Activities' },
                { value: 'Shopping', label: 'Shopping' },
                { value: 'Miscellaneous', label: 'Miscellaneous' },
              ]}
              value={category}
              onChange={(val) => setCategory(val as ExpenseCategory)}
              triggerIcon={<Tag className="w-3.5 h-3.5 text-slate-400" />}
              className="w-full"
              size="md"
            />
          </div>
        </div>

        {/* Date & Associated Day */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Date
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Linked Day
            </label>
            <CustomSelect
              options={[
                { value: '', label: 'General Trip Expense' },
                ...days.map((day) => ({
                  value: day.id,
                  label: `Day ${day.dayNumber} (${day.date})`,
                })),
              ]}
              value={dayId}
              onChange={(val) => setDayId(val)}
              className="w-full"
              size="md"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            Notes (Optional)
          </label>
          <div className="relative">
            <textarea
              rows={2}
              placeholder="e.g. Paid in cash, split with companions, receipt filed..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-sans"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01]"
          >
            {expenseToEdit ? 'Update Transaction' : 'Record Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
