import React from 'react';
import PieChart from '../charts/pie-chart';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { sqlite } from '../../config';
import { Category } from '../../types';

export const CategoryBreakdownChart: React.FC = () => {
  const matches = useMediaQuery('md');
  const categories = sqlite.categories.get<Category>();
  return (
    <div className="w-full h-full p-4 bg-zinc-900 rounded-2xl font-[Hubot_Sans]">
      <div className="px-4 py-2 inline-block text-black bg-green-200 rounded-3xl">
        <p className="text-xs font-bold">EXPENSES</p>
      </div>
      <div className="my-2 text-white">
        <p>In the past 30 days</p>
      </div>
      <div className="flex">
        <div className="h-40 md:h-90 w-full flex items-center justify-center">
          <PieChart lineWidth={matches ? 24 : 18} />
        </div>
        <div className="w-full">
          {categories
            .filter((c) => c.type === 'expense')
            .map((c) => (
              <div className="flex justify-between">
                <div className="w-3 h-3 bg-[#8B5CF6] rounded-xl" />
                <p>{c.name}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
