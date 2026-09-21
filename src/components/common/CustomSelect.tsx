import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
}

export interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  triggerIcon?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
  id?: string;
  'aria-label'?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  className = '',
  triggerClassName = '',
  dropdownClassName = '',
  triggerIcon,
  disabled = false,
  size = 'md',
  align = 'left',
  id,
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }

        const currentIndex = options.findIndex((opt) => opt.value === value);
        let nextIndex = currentIndex;

        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        }

        if (options[nextIndex]) {
          onChange(options[nextIndex].value);
        }
      }
    },
    [disabled, isOpen, options, value, onChange]
  );

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-3 py-2 text-xs rounded-xl gap-2',
    lg: 'px-3.5 py-2.5 text-sm rounded-xl gap-2.5',
  }[size];

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block text-left', className)}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || selectedOption?.label || placeholder}
        className={cn(
          'w-full flex items-center justify-between border font-medium transition-all duration-150 cursor-pointer select-none text-left',
          'bg-white dark:bg-stone-900',
          'border-stone-200/90 dark:border-stone-700/80',
          'text-stone-800 dark:text-stone-200',
          'hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50/50 dark:hover:bg-stone-800/50',
          'focus:outline-none focus:ring-2 focus:ring-[#ff5a36]/20 focus:border-[#ff5a36]',
          isOpen && 'ring-2 ring-[#ff5a36]/20 border-[#ff5a36] shadow-xs',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          sizeClasses,
          triggerClassName
        )}
      >
        <div className="flex items-center gap-2 truncate pr-1">
          {triggerIcon && <span className="shrink-0 text-stone-400">{triggerIcon}</span>}
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="shrink-0 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-orange-100 dark:bg-orange-950/60 text-[#ff5a36]">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform duration-200 ml-1.5',
            isOpen && 'rotate-180 text-[#ff5a36]'
          )}
        />
      </button>

      {/* Dropdown Menu Panel with CSS Styling */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className={cn(
            'absolute top-full mt-1.5 min-w-[160px] max-h-64 overflow-y-auto p-1.5 rounded-2xl z-50',
            'bg-white/95 dark:bg-stone-900/95 backdrop-blur-md',
            'border border-stone-200 dark:border-stone-800 shadow-xl',
            'animate-in fade-in zoom-in-95 duration-150',
            align === 'right' ? 'right-0' : 'left-0',
            dropdownClassName
          )}
        >
          <div className="space-y-0.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors select-none group',
                    isSelected
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff5a36] font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {option.icon && (
                      <span className="shrink-0 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200">
                        {option.icon}
                      </span>
                    )}
                    <div>
                      <div className="truncate">{option.label}</div>
                      {option.description && (
                        <div className="text-[10px] text-stone-400 dark:text-stone-500 font-normal truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {option.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400">
                        {option.badge}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#ff5a36] stroke-[2.5]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
