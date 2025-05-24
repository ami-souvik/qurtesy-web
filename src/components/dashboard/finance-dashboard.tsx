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
import {
  BarChart3,
  PiggyBank,
  Repeat,
  Download,
  Upload,
  Settings,
  TrendingUp,
  DollarSign,
  Calendar,
} from 'lucide-react';

export const FinanceDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'recurring' | 'export' | 'import' | 'settings'>(
    'overview'
  );

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

  const tabConfig = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'budget', label: 'Budget', icon: PiggyBank },
    { key: 'recurring', label: 'Recurring', icon: Repeat },
    { key: 'export', label: 'Export', icon: Download },
    { key: 'import', label: 'Import', icon: Upload },
    { key: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="glass-card border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400">
              {new Date(year, month).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationPanel />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap space-x-1 mt-4">
          {tabConfig.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === key ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </header>
      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-slate-400">Income</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  <CurrencyDisplay amount={summary.income} />
                </p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5 text-red-400" />
                  <span className="text-sm text-slate-400">Expenses</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  <CurrencyDisplay amount={summary.expense} />
                </p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <PiggyBank className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Balance</span>
                </div>
                <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <CurrencyDisplay amount={summary.balance} />
                </p>
              </div>
            </div>

            {/* Alerts */}
            {recurringDueToday.length > 0 && (
              <div className="glass-card rounded-xl p-4 border-orange-500/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-orange-400" />
                  <span className="font-medium text-white">Recurring Transactions Due</span>
                </div>
                <p className="text-sm text-slate-400">
                  {recurringDueToday.length} recurring transaction{recurringDueToday.length > 1 ? 's' : ''} need
                  {recurringDueToday.length === 1 ? 's' : ''} attention
                </p>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingTrendsChart />
              <CategoryBreakdownChart />
            </div>
          </div>
        )}
        {activeTab === 'budget' && <BudgetTracker />}
        {activeTab === 'recurring' && <RecurringTransactionManager />}
        {activeTab === 'export' && <ExportManager />}
        {activeTab === 'import' && <PhonePeImporter />}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <CurrencySettings />
            <NotificationSettingsPanel />
          </div>
        )}
      </main>
    </div>
  );
};
