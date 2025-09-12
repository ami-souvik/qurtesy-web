import { ChevronUp } from 'lucide-react';

const balance = String(1234567890);

export const CurrentBalanceCard = () => (
  <div className="w-full h-full p-4 flex flex-col items-start justify-between font-[Hubot_Sans] text-black bg-green-300 rounded-2xl">
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <div className="rounded-lg bg-green-500">
          <ChevronUp className="w-8 h-8" />
        </div>
        <p className="text-xl">+3.51%</p>
      </div>
    </div>
    <div className="w-full">
      {balance.length > 5 && (
        <div className="mb-2 flex justify-between items-end text-sm md:text-base">
          <p>FULL</p>
          <p>{balance}</p>
        </div>
      )}
      <div className="mb-2 flex justify-between items-end">
        <p className="text-xl md:text-2xl">₹</p>
        <p className="text-4xl md:text-5xl">{balance.length > 5 ? `..${balance.slice(5)}` : balance}</p>
      </div>
      <p className="text-lg font-[Hubot_Sans]">Current Balance</p>
    </div>
  </div>
);
