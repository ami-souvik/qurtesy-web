import { ChevronUp } from 'lucide-react';

export const ProgressCard = () => (
  <div className="w-full h-full p-4 flex flex-col items-start justify-between font-[Hubot_Sans] text-black bg-white rounded-2xl">
    <div className="w-full">
      <p className="text-lg font-[Hubot_Sans]">Progress</p>
      <div className="my-3 flex justify-between items-center">
        <ChevronUp className="w-8 h-8" />
        <p className="font-semibold text-5xl">+72%</p>
      </div>
    </div>
    <div className="px-3 py-1 inline-block text-black bg-green-200 rounded-3xl">
      <p className="text-xl">+0,10 (+0,13%)</p>
    </div>
  </div>
);
