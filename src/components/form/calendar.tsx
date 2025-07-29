import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { cn } from '../../utils/tailwind';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'september',
  'October',
  'November',
  'December',
];

export function Calendar({ value, setValue }: { value: Date; setValue: (v: Date) => void }) {
  const [show, setShow] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10); // Small delay for smooth animation
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 200); // Wait for animation to complete
    }
  }, [show]);

  // Get the first day of the current month
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Get the last day of the current month
  const getLastDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // Get number of days in the month
  const getDaysInMonth = (date: Date) => {
    return getLastDayOfMonth(date).getDate();
  };

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfWeek = (date: Date) => {
    return getFirstDayOfMonth(date).getDay();
  };

  // Get month name
  const getMonthName = (date: Date) => {
    return MONTHS[date.getMonth()];
  };

  // Check if a date is today
  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  // Check if a date is selected
  const isSelected = (day: number, month: number, year: number) => {
    if (!value) return false;
    return day === value.getDate() && month === value.getMonth() && year === value.getFullYear();
  };

  // Handle date selection
  const handleDateClick = (day: number | null) => {
    if (day) {
      const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setValue(newSelectedDate);
      setShow(false);
    }
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar days
  const generateCalendarDays = (): Array<number | null> => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfWeek = getFirstDayOfWeek(currentDate);
    const days: Array<number | null> = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthName = getMonthName(currentDate);
  const year = currentDate.getFullYear();
  return (
    <>
      <button
        type="button"
        className="w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent border-slate-600/50"
        onClick={() => setShow(true)}
      >
        {DAYS[value.getDay()].substring(0, 3)}, {MONTHS[value.getMonth()].substring(0, 3)} {value.getDate()}
      </button>
      {isVisible && (
        <div
          className={`h-screen fixed overflow-hidden inset-0 flex items-center justify-center z-50 sm:p-4 transition-all duration-200 ${
            isAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
          }`}
          onClick={() => setShow(false)}
        >
          <div
            className={`w-84 z-1 rounded-2xl bg-cyan-950/95 transition-all duration-200 transform ${
              isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-700">
              <div className="text-xs px-6 pt-4">
                <p>Select date</p>
              </div>
              <div className="flex">
                <p className="w-full text-xl font-bold px-6 py-4">
                  {DAYS[value.getDay()].substring(0, 3)}, {MONTHS[value.getMonth()].substring(0, 3)} {value.getDate()}
                </p>
                <div className="px-6 py-4">
                  <Pencil className="w-5" />
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="px-4 py-2" onClick={goToPreviousMonth}>
                <ChevronLeft className="w-5" />
              </div>
              <div className="w-full flex items-center justify-center text-xs">
                <p>
                  {monthName} {year}
                </p>
              </div>
              <div className="px-4 py-2" onClick={goToNextMonth}>
                <ChevronRight className="w-5" />
              </div>
            </div>

            {/* Days of the week header */}
            <div className="p-4">
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map((d) => (
                  <div className="text-xs text-center">{d.substring(0, 1)}</div>
                ))}
              </div>
            </div>

            {/* Calendar grid */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-7 grid-rows-6 gap-2 text-xs">
                {calendarDays.map((day: number | null, index) => {
                  const isTodayDate = day && isToday(day, currentDate.getMonth(), currentDate.getFullYear());
                  const isSelectedDate = day && isSelected(day, currentDate.getMonth(), currentDate.getFullYear());
                  return (
                    <div
                      key={index}
                      onClick={() => handleDateClick(day)}
                      className={cn(
                        'h-9 relative flex justify-center items-center cursor-pointer rounded-md',
                        isTodayDate ? 'border border-cyan-600/70' : '',
                        isSelectedDate ? 'border border-white/70 bg-sky-700/20' : 'hover:bg-sky-700/30'
                      )}
                    >
                      {day}
                      {/* Small indicator if both today and selected */}
                      {isTodayDate && isSelectedDate && (
                        <div className="absolute top-1 right-1 w-[5px] h-[5px] bg-cyan-600/70 rounded-xl" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
