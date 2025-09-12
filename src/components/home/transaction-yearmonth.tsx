import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { setYearMonth } from '../../slices/transactions-slice';
import { MONTHS } from '../../utils/datetime';
import { AppDispatch, RootState } from '../../store/index.types';

{
  /* Header with Month Navigation */
}
export const TransactionYearMonth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { yearmonth } = useSelector((state: RootState) => state.transactions);
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
    <div className="flex items-center justify-between p-2 bg-white dark:bg-zinc-900 rounded-xl">
      <button
        onClick={prevMonth}
        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-slate-400" />
        <select
          value={yearmonth[1]}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="text-sm px-3 py-1 dark:bg-slate-700/50 border border-slate-600/50 rounded-lg text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="text-sm px-3 py-1 dark:bg-slate-700/50 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {yearrange(yearmonth[0], 10).map((y) => (
            <option key={y} value={y} className="bg-slate-800">
              {y}
            </option>
          ))}
        </select>
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
