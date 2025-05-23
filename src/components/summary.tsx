import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store.types';
import { fetchTransactionsSummary } from '../slices/daily-expenses-slice';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function Summary() {
  const dispatch = useDispatch<AppDispatch>();
  const { summary } = useSelector((state: RootState) => state.dailyExpenses);

  useEffect(() => {
    dispatch(fetchTransactionsSummary());
  }, [dispatch]);

  const balanceColor = summary.balance >= 0 ? 'text-emerald-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-white/80">Total Balance</h2>
            <Wallet className="w-5 h-5 text-white/60" />
          </div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-white mb-1">₹ {summary.balance?.toLocaleString()}</h1>
            <p className="text-xs text-white/70">Available balance</p>
          </div>
        </div>
      </div>

      {/* Income & Expense Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Income Card */}
        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-300 font-medium">+12%</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Income</p>
            <p className="text-lg font-bold text-emerald-400">₹ {summary.income?.toLocaleString()}</p>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-300 font-medium">-8%</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Expenses</p>
            <p className="text-lg font-bold text-red-400">₹ {summary.expense?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">This Month</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Savings Rate</span>
            <span className="text-blue-400 font-medium">
              {summary.income > 0 ? Math.round(((summary.income - summary.expense) / summary.income) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Net Change</span>
            <span className={`font-medium ${balanceColor}`}>
              ₹ {(summary.income - summary.expense)?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
