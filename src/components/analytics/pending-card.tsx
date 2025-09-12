export const PendingCard = () => (
  <div className="w-full h-full p-4 flex flex-col items-start justify-between font-[Hubot_Sans] bg-[#8a79f1] text-white rounded-2xl">
    <div className="w-full">
      <p className="text-xs font-[Hubot_Sans]">THIS MONTH</p>
      <p className="font-bold text-xl">4 SUBS</p>
    </div>
    <div className="w-full mt-2">
      <p className="text-xs font-[Hubot_Sans]">TOTAL</p>
      <div className="mb-4 pb-2 border-b flex justify-between items-end">
        <p className="text-2xl">₹</p>
        <p className="text-5xl">1248</p>
      </div>
      <p className="text-xs font-[Hubot_Sans]">THIS MONTH</p>
      <p className="font-bold text-xl">Spotify - ₹199</p>
    </div>
  </div>
);
