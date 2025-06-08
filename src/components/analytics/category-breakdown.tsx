import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.types';
import { PieChart } from 'lucide-react';
import { TooltipItem } from 'chart.js';

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#e2e8f0',
        font: { size: 12 },
        padding: 20,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      titleColor: '#e2e8f0',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
      callbacks: {
        label: (context: TooltipItem<'doughnut'>) => {
          const value = context.parsed;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
        },
      },
    },
  },
  cutout: '60%',
};

export const CategoryBreakdownChart: React.FC = () => {
  const transactions = useSelector((state: RootState) => state.dailyExpenses.transactions);
  const categories = useSelector((state: RootState) => state.dailyExpenses.categories);

  const getCategoryBreakdownData = () => {
    const categorySpending = categories
      .map((category) => {
        const categoryTransactions = transactions.filter(
          (t) => t.category?.id === category.id && t.section === 'EXPENSE'
        );
        const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
        return {
          category: category.value,
          emoji: category.emoji,
          amount: total,
        };
      })
      .filter((c) => c.amount > 0);

    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(6, 182, 212, 0.8)',
      'rgba(34, 197, 94, 0.8)',
    ];

    return {
      labels: categorySpending.map((c) => `${c.emoji || '📊'} ${c.category}`),
      datasets: [
        {
          data: categorySpending.map((c) => c.amount),
          backgroundColor: colors.slice(0, categorySpending.length),
          borderColor: colors.slice(0, categorySpending.length).map((c) => c.replace('0.8', '1')),
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <PieChart className="h-5 w-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Category Breakdown</h3>
      </div>
      <div className="h-64">
        <Doughnut data={getCategoryBreakdownData()} options={doughnutOptions} />
      </div>
    </div>
  );
};
