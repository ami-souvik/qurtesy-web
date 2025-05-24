import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#e2e8f0',
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      titleColor: '#e2e8f0',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      ticks: { color: '#94a3b8', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      ticks: { color: '#94a3b8', font: { size: 11 } },
    },
  },
};

export const SpendingTrendsChart: React.FC = () => {
  const transactions = useSelector((state: RootState) => state.dailyExpenses.transactions);
  const [year, month] = useSelector((state: RootState) => state.dailyExpenses.yearmonth);

  const getDailySpendingData = () => {
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(new Date(year, month));
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const dailySpending = days.map((day) => {
      const dayStr = format(day, 'dd/MM/yyyy');
      const dayTransactions = transactions.filter((t) => t.date === dayStr && t.section === 'EXPENSE');
      const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        date: format(day, 'MMM dd'),
        amount: total,
      };
    });

    return {
      labels: dailySpending.map((d) => d.date),
      datasets: [
        {
          label: 'Daily Spending',
          data: dailySpending.map((d) => d.amount),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Spending Trends</h3>
      </div>
      <div className="h-64">
        <Line data={getDailySpendingData()} options={chartOptions} />
      </div>
    </div>
  );
};
