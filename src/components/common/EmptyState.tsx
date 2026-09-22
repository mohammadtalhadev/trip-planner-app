import React from 'react';
import { LucideIcon, Compass } from 'lucide-react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Compass,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-10 md:p-14 text-center bg-white/70 dark:bg-stone-900/40 border border-dashed border-stone-300 dark:border-stone-800 rounded-2xl shadow-subtle',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 mb-4 shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-base font-serif font-bold text-stone-800 dark:text-stone-200 mb-1">
        {title}
      </h3>
      <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mb-6 leading-relaxed font-sans">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-50 dark:text-stone-900 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all hover:scale-[1.01]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
