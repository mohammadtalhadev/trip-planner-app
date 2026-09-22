import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    primary: 'bg-orange-50 text-[#c2410c] dark:bg-orange-950/50 dark:text-[#fb923c] border-orange-200/80 dark:border-orange-900',
    success: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-900',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-900',
    info: 'bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200/80 dark:border-sky-900',
    purple: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-900',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/80 dark:border-slate-800',
  }[variant];

  const sizeStyles = {
    sm: 'text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md',
    md: 'text-xs font-mono font-medium px-2.5 py-0.5 rounded-lg',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border font-medium',
        variantStyles,
        sizeStyles,
        className
      )}
    >
      {children}
    </span>
  );
};
