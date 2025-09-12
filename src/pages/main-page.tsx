import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { notificationService } from '../components/notifications';
import {
  fetchBudgets,
  fetchRecurringTransactions,
  fetchRecurringTransactionsDueToday,
} from '../slices/transactions-slice';
import { RootState, AppDispatch } from '../store/index.types';
import { PageWrapper } from '../components/layout';
import { Transaction } from '../sqlite';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate('/agent', { replace: true });
    }
  }, [navigate, window.location.pathname]);

  const dispatch = useDispatch<AppDispatch>();
  const budgets = useSelector((state: RootState) => state.transactions.budgets);
  const { yearmonth } = useSelector((state: RootState) => state.transactions);
  const transactions = useMemo(() => {
    return Transaction.getByYearMonth(yearmonth[0], yearmonth[1]);
  }, [yearmonth]);
  useEffect(() => {
    // Load initial data
    dispatch(fetchBudgets());
    dispatch(fetchRecurringTransactions());
    dispatch(fetchRecurringTransactionsDueToday());
  }, [dispatch, yearmonth]);

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
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="flex-1 lg:ml-72 transition-all duration-300 ease-in-out">
        <div className="p-4 pt-16 lg:pt-4">
          <PageWrapper>
            <Outlet />
          </PageWrapper>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
