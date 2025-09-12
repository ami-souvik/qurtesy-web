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
import BarChart from '../charts/bar-chart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

export const SpendingTrendsChart: React.FC = () => {
  const spendingData = [
    { label: 'Jan', value: 16 },
    { label: 'Feb', value: 78 },
    { label: 'Feb', value: 11 },
    { label: 'Mar', value: 62 },
    { label: 'Apr', value: 18 },
    { label: 'Apr', value: 70 },
    { label: 'May', value: 75 },
    { label: 'Jun', value: 95 },
  ];

  return (
    <div className="w-full h-full p-4 flex flex-col items-start justify-between bg-zinc-900 text-white rounded-2xl font-[Hubot_Sans]">
      <div>
        <div className="px-4 py-2 inline-block text-black bg-orange-200 rounded-3xl">
          <p className="text-xs font-bold">PERFORMANCE</p>
        </div>
        <div className="my-2">
          <p className="text-5xl">+280%</p>
          <p>In the past 30 days</p>
        </div>
      </div>
      <div className="w-full h-28 md:h-40 flex items-center justify-center">
        <BarChart data={spendingData} />
      </div>
    </div>
  );
};
