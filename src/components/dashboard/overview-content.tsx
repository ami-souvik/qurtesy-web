import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  PiggyBank,
  Calendar,
  Target,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity,
  Award,
} from 'lucide-react';
import { PageWrapper, StatCard } from '../layout';
import { CurrencyDisplay } from '../currency';
import { SpendingTrendsChart, CategoryBreakdownChart } from '../analytics';
import { RootState } from '../../store.types';

// Enhanced overview component with optimized layout
export const OverviewContent = () => {
  const navigate = useNavigate();
  const summary = useSelector((state: RootState) => state.dailyExpenses.summary);
  const recurringDueToday = useSelector((state: RootState) => state.dailyExpenses.recurringDueToday);
  const [year, month] = useSelector((state: RootState) => state.dailyExpenses.yearmonth);

  const statCards: StatCard[] = [
    {
      label: 'Income',
      value: <CurrencyDisplay amount={summary.income} />,
      icon: ArrowUpCircle,
      iconColor: 'text-green-400',
      iconBgColor: 'bg-green-500/20',
    },
    {
      label: 'Expenses',
      value: <CurrencyDisplay amount={summary.expense} />,
      icon: ArrowDownCircle,
      iconColor: 'text-red-400',
      iconBgColor: 'bg-red-500/20',
    },
    {
      label: 'Balance',
      value: <CurrencyDisplay amount={summary.balance} />,
      icon: Wallet,
      iconColor: 'text-blue-400',
      iconBgColor: 'bg-blue-500/20',
      valueColor: summary.balance >= 0 ? 'text-green-400' : 'text-red-400',
    },
    {
      label: 'Savings',
      value: `${summary.income > 0 ? Math.round((summary.balance / summary.income) * 100) : 0}%`,
      icon: Activity,
      iconColor: 'text-purple-400',
      iconBgColor: 'bg-purple-500/20',
    },
  ];

  return (
    <PageWrapper
      title="Financial Overview"
      subtitle={new Date(year, month).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })}
      statCards={statCards}
    >
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

      {/* Compact Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SpendingTrendsChart />
        <CategoryBreakdownChart />
      </div>

      {/* Streamlined Quick Actions */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-base font-medium text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => navigate('/f/home', { replace: true })}
            className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
          >
            <TrendingUp className="h-8 w-8 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-white">Add</span>
          </button>
          <button
            onClick={() => navigate('/f/budget', { replace: true })}
            className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
          >
            <PiggyBank className="h-8 w-8 text-green-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-white">Budget</span>
          </button>
          <button
            onClick={() => navigate('/f/goals', { replace: true })}
            className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
          >
            <Target className="h-8 w-8 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-white">Goals</span>
          </button>
          <button
            onClick={() => navigate('/f/export', { replace: true })}
            className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
          >
            <Award className="h-8 w-8 text-yellow-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-white">Export</span>
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};
