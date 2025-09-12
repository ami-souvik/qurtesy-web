import { useSelector } from 'react-redux';
import { Calendar } from 'lucide-react';
import {
  SpendingTrendsChart,
  CategoryBreakdownChart,
  CurrentBalanceCard,
  ProgressCard,
  PendingCard,
} from '../components/analytics';
import { RootState } from '../store/index.types';
import { BalanceGraphChart } from '../components/analytics/balance-graph';

// Enhanced overview component with optimized layout
export const OverviewContent = () => {
  const recurringDueToday = useSelector((state: RootState) => state.transactions.recurringDueToday);
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-13 md:grid-rows-7 gap-4">
        <div className="col-span-2 md:col-span-7 row-span-8 md:row-span-4">
          <CategoryBreakdownChart />
        </div>
        <div className="col-span-1 md:col-span-3 row-span-2">
          <CurrentBalanceCard />
        </div>
        <div className="col-span-1 md:col-span-3 row-span-2">
          <PendingCard />
        </div>
        <div className="col-span-1 md:col-span-3 row-span-2">
          <ProgressCard />
        </div>
        <div className="col-span-1 md:col-span-3 row-span-2">
          <ProgressCard />
        </div>
        <div className="col-span-2 md:col-span-7 row-span-3">
          <SpendingTrendsChart />
        </div>
        <div className="col-span-2 md:col-span-6 row-span-3">
          <BalanceGraphChart />
        </div>
      </div>
      {/* Compact Alerts */}
      {recurringDueToday.length > 0 && (
        <div className="glass-card rounded-lg p-4 border border-orange-500/30 bg-orange-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">
                  {recurringDueToday.length} Transaction{recurringDueToday.length > 1 ? 's' : ''} Due
                </h3>
                <p className="text-xs text-slate-400">Recurring payments need attention</p>
              </div>
            </div>
            <button className="text-xs text-orange-400 hover:text-orange-300 font-medium px-2 py-1 rounded hover:bg-orange-500/10 transition-colors">
              Review →
            </button>
          </div>
        </div>
      )}
    </>
  );
};
