import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store.types';
import {
  fetchTransactions,
  fetchBudgets,
  fetchRecurringTransactions,
  fetchRecurringTransactionsDueToday,
} from '../../slices/daily-expenses-slice';
import { SpendingTrendsChart, CategoryBreakdownChart } from '../analytics';
import { BudgetTracker } from '../budget/budget-tracker';
import { RecurringTransactionManager } from '../recurring';
import { ExportManager } from '../export';
import { PhonePeImporter } from '../import';
import { NotificationPanel, NotificationSettingsPanel, notificationService } from '../notifications';
import { CurrencyDisplay, CurrencySettings } from '../currency';
import { LeftSidebar } from './left-sidebar';
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
import { TransactionTracker } from '../home/transaction-tracker';

export const FinanceDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'home' | 'budget' | 'recurring' | 'goals' | 'investments' | 'export' | 'import' | 'settings'
  >('overview');

  const transactions = useSelector((state: RootState) => state.dailyExpenses.transactions);
  const budgets = useSelector((state: RootState) => state.dailyExpenses.budgets);
  const summary = useSelector((state: RootState) => state.dailyExpenses.summary);
  const recurringDueToday = useSelector((state: RootState) => state.dailyExpenses.recurringDueToday);
  const [year, month] = useSelector((state: RootState) => state.dailyExpenses.yearmonth);
  useEffect(() => {
    // Load initial data
    dispatch(fetchTransactions());
    dispatch(fetchBudgets());
    dispatch(fetchRecurringTransactions());
    dispatch(fetchRecurringTransactionsDueToday());
  }, [dispatch, year, month]);

  // Check for budget warnings when budgets change
  useEffect(() => {
    if (budgets.length > 0) {
      notificationService.checkBudgetWarnings(budgets);
    }
  }, [budgets]);

  // Check for large expenses when transactions change
  useEffect(() => {
    const recentTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date.split('/').reverse().join('-'));
      const today = new Date();
      const diffTime = today.getTime() - transactionDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      return diffDays <= 1 && t.section === 'EXPENSE'; // Check last 24 hours
    });

    recentTransactions.forEach((transaction) => {
      notificationService.checkLargeExpense(transaction.amount, transaction.category?.value || 'Unknown');
    });
  }, [transactions]);

  // Enhanced overview component with optimized layout
  const OverviewContent = () => (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Financial Overview</h1>
          <p className="text-sm text-slate-400">
            {new Date(year, month).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="hidden lg:flex items-center">
          <NotificationPanel />
        </div>
      </div>

      {/* Compact Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-lg p-4 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <ArrowUpCircle className="h-4 w-4 text-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 mb-1">Income</p>
              <p className="text-lg font-bold text-white truncate">
                <CurrencyDisplay amount={summary.income} />
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-lg p-4 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <ArrowDownCircle className="h-4 w-4 text-red-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 mb-1">Expenses</p>
              <p className="text-lg font-bold text-white truncate">
                <CurrencyDisplay amount={summary.expense} />
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-lg p-4 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wallet className="h-4 w-4 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 mb-1">Balance</p>
              <p className={`text-lg font-bold truncate ${summary.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <CurrencyDisplay amount={summary.balance} />
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-lg p-4 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 mb-1">Savings</p>
              <p className="text-lg font-bold text-white">
                {summary.income > 0 ? Math.round((summary.balance / summary.income) * 100) : 0}%
              </p>
            </div>
          </div>
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

      {/* Compact Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-base font-medium text-white mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
            Spending Trends
          </h3>
          <div className="">
            <SpendingTrendsChart />
          </div>
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-base font-medium text-white mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-purple-400" />
            Category Breakdown
          </h3>
          <div className="">
            <CategoryBreakdownChart />
          </div>
        </div>
      </div>

      {/* Streamlined Quick Actions */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-base font-medium text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
          >
            <TrendingUp className="h-4 w-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-white">Add</span>
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
          >
            <PiggyBank className="h-4 w-4 text-green-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-white">Budget</span>
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
          >
            <Target className="h-4 w-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-white">Goals</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
          >
            <Award className="h-4 w-4 text-yellow-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-white">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
  // Placeholder components for new features
  const GoalsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Financial Goals</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + New Goal
        </button>
      </div>
      <div className="glass-card rounded-xl p-8 text-center">
        <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Set Your Financial Goals</h3>
        <p className="text-slate-400 mb-6">Track progress towards emergency fund, vacation, or retirement savings</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create Your First Goal
        </button>
      </div>
    </div>
  );

  const InvestmentsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Investment Portfolio</h1>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          + Add Investment
        </button>
      </div>
      <div className="glass-card rounded-xl p-8 text-center">
        <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Track Your Investments</h3>
        <p className="text-slate-400 mb-6">Monitor stocks, mutual funds, and other investment performance</p>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Connect Your Portfolio
        </button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Sidebar */}
      <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} summary={summary} year={year} month={month} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 transition-all duration-300 ease-in-out">
        <div className="p-4 pt-20 lg:pt-4">
          {activeTab === 'overview' && <OverviewContent />}
          {activeTab === 'home' && <TransactionTracker />}
          {activeTab === 'budget' && <BudgetTracker />}
          {activeTab === 'recurring' && <RecurringTransactionManager />}
          {activeTab === 'goals' && <GoalsContent />}
          {activeTab === 'investments' && <InvestmentsContent />}
          {activeTab === 'export' && <ExportManager />}
          {activeTab === 'import' && <PhonePeImporter />}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
              </div>
              <CurrencySettings />
              <NotificationSettingsPanel />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
