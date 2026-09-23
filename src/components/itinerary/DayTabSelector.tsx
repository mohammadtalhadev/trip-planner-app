import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { ItineraryDay } from '../../types/trip';
import { formatDateShort } from '../../utils/date';

interface DayTabSelectorProps {
  days: ItineraryDay[];
  activeDayId: string;
  onSelectDay: (dayId: string) => void;
  onAddDay: () => void;
}

export const DayTabSelector: React.FC<DayTabSelectorProps> = ({
  days,
  activeDayId,
  onSelectDay,
  onAddDay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeDayRef = useRef<HTMLButtonElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mouse drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, days.length]);

  // Convert vertical mouse wheel into horizontal scroll over the day tabs
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          el.scrollBy({
            left: e.deltaY * 1.3,
            behavior: 'auto',
          });
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Smooth scroll active day into view when activeDayId changes
  useEffect(() => {
    if (activeDayRef.current) {
      activeDayRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeDayId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 260;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleDayClick = (dayId: string) => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    onSelectDay(dayId);
  };

  return (
    <div className="relative group/daycarousel">
      {/* Left Chevron Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll('left')}
          aria-label="Scroll days left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-md border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}

      {/* Edge gradient fade left */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-3 w-10 bg-gradient-to-r from-slate-50/90 dark:from-slate-950/90 to-transparent pointer-events-none z-10" />
      )}

      {/* Main scrollable list */}
      <div
        ref={containerRef}
        data-lenis-prevent
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar cursor-grab active:cursor-grabbing select-none"
      >
        {days.map((day) => {
          const isActive = day.id === activeDayId;
          const totalActs = day.activities.length;
          const isPastOrDone =
            !isActive &&
            totalActs > 0 &&
            day.activities.every((a) => a.completed);

          if (isActive) {
            return (
              <button
                key={day.id}
                ref={activeDayRef}
                type="button"
                onClick={() => handleDayClick(day.id)}
                className="flex-shrink-0 px-4 py-2.5 rounded-2xl border-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-slate-900 shadow-md ring-4 ring-indigo-500/10 text-left transition-all duration-200 cursor-pointer min-w-[210px]"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                  <span>ACTIVE DAY</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                  Day {day.dayNumber} • {formatDateShort(day.date)} {day.title ? `(${day.title})` : ''}
                </h4>
              </button>
            );
          }

          if (isPastOrDone) {
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => handleDayClick(day.id)}
                className="flex-shrink-0 px-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-left transition-all duration-200 cursor-pointer flex items-center gap-3 min-w-[190px]"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
                    Day {day.dayNumber} • {formatDateShort(day.date)}
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {day.title || `Day ${day.dayNumber}`}
                  </h4>
                </div>
              </button>
            );
          }

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => handleDayClick(day.id)}
              className="flex-shrink-0 px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left transition-all duration-200 cursor-pointer flex items-center gap-3 min-w-[190px]"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
                  Day {day.dayNumber} • {formatDateShort(day.date)}
                </span>
                <h4 className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                  {day.title || `Day ${day.dayNumber} Plan`}
                </h4>
              </div>
            </button>
          );
        })}

        {/* Add Day Button */}
        <button
          type="button"
          onClick={onAddDay}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#c2410c] hover:text-[#c2410c] hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-all text-xs font-semibold cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Day</span>
        </button>
      </div>

      {/* Edge gradient fade right */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-3 w-10 bg-gradient-to-l from-slate-50/90 dark:from-slate-950/90 to-transparent pointer-events-none z-10" />
      )}

      {/* Right Chevron Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll('right')}
          aria-label="Scroll days right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-md border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};



