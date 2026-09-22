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
        'flex flex-col items-center justify-center p-10 md:p-14 text-center bg-white/70 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl shadow-frost',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4 shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-base font-serif font-bold text-slate-800 dark:text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed font-sans">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
