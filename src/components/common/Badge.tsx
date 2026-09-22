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
    primary: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700',
    success: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-900',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-900',
    info: 'bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200/80 dark:border-teal-900',
    purple: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    neutral: 'bg-stone-100/80 text-stone-700 dark:bg-stone-800/80 dark:text-stone-300 border-stone-200/80 dark:border-stone-800',
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
