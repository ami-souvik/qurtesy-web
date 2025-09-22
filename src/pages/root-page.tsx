import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { notificationService } from '../components/notifications';
import { RootState } from '../store/index.types';
import { PageWrapper } from '../components/layout';
import { Transaction } from '../sqlite';

const RootPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate('/agent', { replace: true });
    }
  }, [navigate, window.location.pathname]);

  const budgets = useSelector((state: RootState) => state.transactions.budgets);
  const { yearmonth } = useSelector((state: RootState) => state.transactions);
  const transactions = useMemo(() => {
    const [y, m] = yearmonth;
    return Transaction.getByYearMonth(y, m);
  }, [yearmonth]);

  // Check for budget warnings when budgets change
  useEffect(() => {
    if (budgets.length > 0) {
      notificationService.checkBudgetWarnings(budgets);
    }
  }, [budgets]);

  // Check for large expenses when transactions change
  useEffect(() => {
    const recentTransactions = transactions.filter((t) => {
      const transactionDate = new Date(
        t.date.toLocaleTimeString([], {
          day: 'numeric',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
      const today = new Date();
      const diffTime = today.getTime() - transactionDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      return diffDays <= 1 && t.type === 'expense'; // Check last 24 hours
    });

    recentTransactions.forEach((transaction) => {
      notificationService.checkLargeExpense(transaction.amount, transaction.category?.name || 'Unknown');
    });
  }, [transactions]);

  return (
    <main className="flex-1 lg:ml-72 transition-all duration-300 ease-in-out">
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    </main>
  );
};

export default RootPage;
