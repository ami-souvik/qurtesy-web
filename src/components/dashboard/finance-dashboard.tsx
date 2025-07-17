import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store.types';
import {
  fetchTransactions,
  fetchBudgets,
  fetchRecurringTransactions,
  fetchRecurringTransactionsDueToday,
} from '../../slices/daily-expenses-slice';
import { notificationService } from '../notifications';
import { LeftSidebar } from './left-sidebar';
import { Outlet } from 'react-router-dom';

export const FinanceDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const transactions = useSelector((state: RootState) => state.dailyExpenses.transactions);
  const budgets = useSelector((state: RootState) => state.dailyExpenses.budgets);
  const summary = useSelector((state: RootState) => state.dailyExpenses.summary);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Sidebar */}
      <LeftSidebar summary={summary} year={year} month={month} />
      {/* Main Content */}
      <main className="flex-1 lg:ml-72 transition-all duration-300 ease-in-out">
        <div className="p-4 pt-20 lg:pt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
