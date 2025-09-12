import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
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
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { RootState } from '../../store/index.types';
import { Line } from 'react-chartjs-2';
import { Transaction as TransactionTable } from '../../sqlite';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#1b1718',
        font: { size: 12, family: 'Hubot Sans' },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      titleColor: '#e2e8f0',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      // borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      ticks: { color: '#1b1718', font: { size: 11, family: 'Hubot Sans' } },
    },
    y: {
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      ticks: { color: '#1b1718', font: { size: 11, family: 'Hubot Sans' } },
    },
  },
};

export const BalanceGraphChart: React.FC = () => {
  const { yearmonth } = useSelector((state: RootState) => state.transactions);
  const [year, month] = yearmonth;
  const prevYear = month < 1 ? year - 1 : year;
  const prevMonth = month > 1 ? month - 1 : 12;
  const transactions = useMemo(() => {
    return TransactionTable.getByYearMonth(year, month);
  }, [yearmonth]);
  const prevTransactions = useMemo(() => {
    return TransactionTable.getByYearMonth(prevYear, prevMonth);
  }, [yearmonth]);

  const getDailySpendingData = useCallback(() => {
    const prevDays = eachDayOfInterval({
      start: startOfMonth(new Date(prevYear, prevMonth)),
      end: endOfMonth(new Date(prevYear, prevMonth)),
    });
    const currDays = eachDayOfInterval({
      start: startOfMonth(new Date(year, month)),
      end: endOfMonth(new Date(year, month)),
    });

    const previousSpendings = prevDays.map((day) => {
      const dayStr = format(day, 'dd/MM/yyyy');
      const dayTransactions = prevTransactions.filter((t) => t.date === dayStr && t.section === 'EXPENSE');
      const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        date: format(day, 'MMM dd'),
        amount: total,
      };
    });
    const currentSpendings = currDays.map((day) => {
      const dayStr = format(day, 'dd/MM/yyyy');
      const dayTransactions = transactions.filter((t) => t.date === dayStr && t.section === 'EXPENSE');
      const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        date: format(day, 'MMM dd'),
        amount: total,
      };
    });

    return {
      labels: currentSpendings.map((d) => d.date),
      datasets: [
        {
          label: `Current ${year}, ${month + 1}`,
          data: currentSpendings.map((d) => d.amount),
          borderColor: '#10B981',
          backgroundColor: '#10B981',
          tension: 0.4,
          fill: true,
        },
        {
          label: `Previous ${prevYear}, ${prevMonth + 1}`,
          data: previousSpendings.map((d) => d.amount),
          borderColor: '#8B5CF6',
          backgroundColor: '#8B5CF622',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, []);

  return (
    <div className="w-full h-full p-4 bg-lime-200 rounded-2xl font-[Hubot_Sans] text-black">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold text-xl">Balance</p>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#8B5CF6] rounded-xl" />
            <p>
              {prevYear}, {prevMonth + 1}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#10B981] rounded-xl" />
            <p>
              {year}, {month + 1}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <p className="font-semibold text-8xl">5</p>
          <p className="text-2xl">%</p>
        </div>
      </div>
      {/* <div className='flex items-center justify-center'>
                <LineChart
                    data1={getCurrentSpendingData().map(t => t.amount)}
                    data2={getPreviousSpendingData().map(t => t.amount)}
                    labels={getCurrentSpendingData().map(t => '')}
                    width={350}
                    height={180}
                />
            </div> */}
      <div className="h-56 w-full self-end">
        <Line data={getDailySpendingData()} options={chartOptions} />
      </div>
    </div>
  );
};
