import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store.types';
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
import { NotificationSettingsPanel, notificationService } from '../notifications';
import { CurrencyDisplay, CurrencySettings } from '../currency';
import { AccountSettings } from '../settings';
import { PageWrapper, StatCard } from '../layout';
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
  Plus,
} from 'lucide-react';
import { TransactionTracker } from '../home/transaction-tracker';
import { KeyboardShortcutsHelp } from '../ui/keyboard-shortcuts-help';
import { Button } from '../action/button';
import { PhonePeImporter } from '../import';

export const FinanceDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'home'
    | 'budget'
    | 'accounts'
    | 'recurring'
    | 'goals'
    | 'investments'
    | 'export'
    | 'import'
    | 'settings'
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
  const OverviewContent = () => {
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
        showNotifications
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
              onClick={() => setActiveTab('home')}
              className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
            >
              <TrendingUp className="h-8 w-8 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-white">Add</span>
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
            >
              <PiggyBank className="h-8 w-8 text-green-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-white">Budget</span>
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
            >
              <Target className="h-8 w-8 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-white">Goals</span>
            </button>
            <button
              onClick={() => setActiveTab('export')}
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
  // Placeholder components for new features
  const GoalsContent = () => (
    <PageWrapper
      title="Financial Goals"
      headerActions={
        <div className="flex items-center space-x-2">
          <KeyboardShortcutsHelp />
          <Button leftIcon={<Plus className="h-4 w-4 mr-2" />}>
            <span className="hidden sm:inline">New Goal</span>
          </Button>
        </div>
      }
    >
      <div className="glass-card rounded-xl p-8 text-center">
        <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Set Your Financial Goals</h3>
        <p className="text-slate-400 mb-6">Track progress towards emergency fund, vacation, or retirement savings</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create Your First Goal
        </button>
      </div>
    </PageWrapper>
  );

  const InvestmentsContent = () => (
    <PageWrapper
      title="Investment Portfolio"
      headerActions={
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          + Add Investment
        </button>
      }
    >
      <div className="glass-card rounded-xl p-8 text-center">
        <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Track Your Investments</h3>
        <p className="text-slate-400 mb-6">Monitor stocks, mutual funds, and other investment performance</p>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Connect Your Portfolio
        </button>
      </div>
    </PageWrapper>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Sidebar */}
      <LeftSidebar
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as typeof activeTab)}
        summary={summary}
        year={year}
        month={month}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 transition-all duration-300 ease-in-out">
        <div className="p-4 pt-20 lg:pt-4">
          {activeTab === 'overview' && <OverviewContent />}
          {activeTab === 'home' && <TransactionTracker />}
          {activeTab === 'budget' && <BudgetTracker />}
          {activeTab === 'accounts' && <AccountSettings />}
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
