import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store.types';
import { fetchTransactionsSummary } from '../slices/daily-expenses-slice';

export function Summary() {
  const dispatch = useDispatch<AppDispatch>();
  const { summary } = useSelector((state: RootState) => state.dailyExpenses);
  useEffect(() => {
    dispatch(fetchTransactionsSummary());
  }, []);
  return (
    <div>
      <div
        className="px-4 pt-2 pb-4 rounded-xl flex flex-col justify-center gap-2"
        style={{
          background:
            'linear-gradient(120deg, rgba(0,159,255,1) 0%, rgba(120,102,163,1) 31%, rgba(160,83,133,1) 53%, rgba(193,68,108,1) 73%, rgba(236,47,75,1) 100%)',
        }}
      >
        <div>
          <h1>Balance</h1>
          <h1 className="font-bold text-3xl">₹ {summary.balance}</h1>
        </div>
        <div className="flex">
          <div className="w-[50%] border-l-2 pl-4">
            <p>Income</p>
            <p className="font-bold">₹ {summary.income}</p>
          </div>
          <div className="w-[50%] border-l-2 pl-4">
            <p>Expenditure</p>
            <p className="font-bold">₹ {summary.expense}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
