import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { setYearMonth } from '../../slices/daily-expenses-slice';
import { MONTHS } from '../../utils/datetime';
import { AppDispatch, RootState } from '../../store.types';

{
  /* Header with Month Navigation */
}
export const TransactionYearMonth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { yearmonth } = useSelector((state: RootState) => state.dailyExpenses);
  const setMonth = (m: number) => dispatch(setYearMonth([yearmonth[0], m]));
  const setYear = (y: number) => dispatch(setYearMonth([y, yearmonth[1]]));

  const yearrange = (year: number, range: number) => {
    let state = year - range;
    const years = [state];
    while (state < year + range) {
      state += 1;
      years.push(state);
    }
    return years;
  };

  const nextMonth = () => {
    if (Number(yearmonth[1]) === 11) dispatch(setYearMonth([yearmonth[0] + 1, 0]));
    else dispatch(setYearMonth([yearmonth[0], yearmonth[1] + 1]));
  };

  const prevMonth = () => {
    if (Number(yearmonth[1]) === 0) dispatch(setYearMonth([yearmonth[0] - 1, 11]));
    else dispatch(setYearMonth([yearmonth[0], yearmonth[1] - 1]));
  };
  return (
    <div className="flex items-center justify-between mb-6 p-2 bg-slate-800/30 border border-slate-700/50 rounded-xl">
      <button
        onClick={prevMonth}
        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center space-x-3">
        <Calendar className="w-5 h-5 text-slate-400" />
        <div className="flex items-center space-x-2">
          <select
            value={yearmonth[1]}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="text-xs px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i} className="bg-slate-800">
                {m}
              </option>
            ))}
          </select>
          <select
            value={yearmonth[0]}
            onChange={(e) => setYear(Number(e.target.value))}
            className="text-xs px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {yearrange(yearmonth[0], 10).map((y) => (
              <option key={y} value={y} className="bg-slate-800">
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={nextMonth}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
