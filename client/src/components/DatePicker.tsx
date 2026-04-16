import React, { useRef } from 'react';
import { getDayName, isWeekend } from '../utils/helpers';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface DatePickerProps {
  dates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ dates, selectedDate, onSelectDate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group">
      {/* Navigation arrows (visible on hover) */}
      <button 
        onClick={() => scroll('left')}
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-900 border border-white/10 text-white flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-black/50"
      >
        <MdChevronLeft size={20} />
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-900 border border-white/10 text-white flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-black/50"
      >
        <MdChevronRight size={20} />
      </button>

      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {dates.map((date) => {
          const isSelected = date === selectedDate;
          const weekend = isWeekend(date);
          const d = new Date(date + 'T00:00:00');
          const dayNum = d.getDate();
          const monthStr = d.toLocaleDateString('en-IN', { month: 'short' });
          const dayStr = getDayName(date).slice(0, 3);

          return (
            <button
              key={date}
              onClick={() => onSelectDate(date)}
              className={`flex-shrink-0 flex flex-col items-center justify-between py-2.5 sm:py-4 rounded-xl sm:rounded-2xl
                border transition-colors duration-150 min-w-[60px] sm:min-w-[80px] snap-start
                ${
                  isSelected
                    ? 'bg-primary-600 border-primary-500 text-white shadow-[0_5px_15px_rgba(59,130,246,0.3)] z-10'
                    : weekend
                      ? 'bg-amber-500/5 border-white/5 text-surface-300 hover:bg-amber-500/10 hover:border-amber-500/20'
                      : 'bg-white/5 border-white/5 text-surface-400 hover:bg-white/10 hover:border-white/20'
                }`}
            >
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-0.5 sm:mb-1 ${isSelected ? 'text-white/80' : 'text-surface-500'}`}>
                {dayStr}
              </span>
              
              <div className="flex flex-col items-center">
                <span className={`text-xl sm:text-2xl font-black leading-none ${isSelected ? 'text-white' : 'text-surface-200'}`}>
                  {dayNum}
                </span>
                <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider sm:tracking-widest mt-1 ${isSelected ? 'text-white/70' : 'text-surface-500'}`}>
                  {monthStr}
                </span>
              </div>

              {weekend && !isSelected && (
                <div className="mt-1.5 sm:mt-2 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-amber-500 animate-pulse" />
              )}
              
              {isSelected && (
                <div className="mt-1.5 sm:mt-2 w-4 sm:w-6 h-1 rounded-full bg-white/40" />
              )}
              
              {!weekend && !isSelected && (
                <div className="mt-1.5 sm:mt-2 w-1 h-1 rounded-full bg-surface-700" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Gradient fades for scrollable area */}
      <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-surface-950 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-surface-950 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default DatePicker;
