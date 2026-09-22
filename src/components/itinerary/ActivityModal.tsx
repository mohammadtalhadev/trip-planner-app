import React, { useState, useEffect } from 'react';
import { Clock, MapPin, DollarSign, Tag } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Activity, ActivityCategory } from '../../types/trip';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  activityToEdit?: Activity | null;
  onSave: (data: Omit<Activity, 'id' | 'dayId' | 'orderIndex'>) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  activityToEdit,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00');
  const [category, setCategory] = useState<ActivityCategory>('sightseeing');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title);
      setTime(activityToEdit.time || '10:00');
      setCategory(activityToEdit.category || 'sightseeing');
      setLocation(activityToEdit.location || '');
      setCost(activityToEdit.cost !== undefined ? String(activityToEdit.cost) : '');
      setNotes(activityToEdit.notes || '');
    } else {
      setTitle('');
      setTime('10:00');
      setCategory('sightseeing');
      setLocation('');
      setCost('');
      setNotes('');
    }
    setError(null);
  }, [activityToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter an activity title.');
      return;
    }

    const costNum = cost.trim() !== '' ? parseFloat(cost) : 0;

    onSave({
      title: title.trim(),
      time,
      category,
      location: location.trim() || undefined,
      cost: costNum,
      notes: notes.trim() || undefined,
      completed: activityToEdit ? activityToEdit.completed : false,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activityToEdit ? 'Edit Activity' : `Add Activity to Day ${dayNumber}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Activity Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Hagia Sophia, Lunch at Cafe, Boat Tour..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Time & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Time
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sightseeing">Sightseeing</option>
                <option value="food">Food & Dining</option>
                <option value="activity">Tour / Activity</option>
                <option value="transport">Transportation</option>
                <option value="lodging">Lodging</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location & Estimated Cost */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="e.g. Sultanahmet Square"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Estimated Cost
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="number"
                min="0"
                step="5"
                placeholder="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Notes & Tips
          </label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="e.g. Bring camera, booking reference #4829, buy tickets in advance..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            {activityToEdit ? 'Save Changes' : 'Add to Day'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
