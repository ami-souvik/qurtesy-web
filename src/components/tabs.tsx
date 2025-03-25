import { useDispatch, useSelector } from 'react-redux';
import { Section } from '../types/daily-expenses';
import { DailyExpenses } from './daily-expenses';
import { Transfer } from './transfer';
import { AppDispatch, RootState } from '../store.types';
import { setSection } from '../slices/daily-expenses-slice';

const sections: Section[] = ['EXPENSE', 'INCOME', 'TRANSFER', 'INVESTMENT', 'LEND', 'SPLIT'];

const sectionsMeta = {
  EXPENSE: {
    label: 'Expenses',
  },
  INCOME: {
    label: 'Income',
  },
  TRANSFER: {
    label: 'Transfers',
  },
  INVESTMENT: {
    label: 'Investments',
  },
  LEND: {
    label: 'Lend',
  },
  SPLIT: {
    label: 'Group/Share Expense',
  },
};

export function Tab({ active }: { active: string }) {
  if (active == 'EXPENSE' || active == 'INCOME' || active == 'INVESTMENT') return <DailyExpenses />;
  else if (active == 'TRANSFER') return <Transfer />;
  else return <></>;
}

export function Tabs() {
  const dispatch = useDispatch<AppDispatch>();
  const section = useSelector((state: RootState) => state.dailyExpenses.section);
  return (
    <div className="h-full flex flex-col">
      <div className="flex">
        {sections.map((s: Section) => (
          <button
            key={s}
            className="my-2 py-1 px-4 rounded cursor-pointer"
            style={{
              backgroundColor: section === s ? '#1e2329' : 'transparent',
            }}
            onClick={() => {
              dispatch(setSection(s));
            }}
          >
            <p>{sectionsMeta[s].label}</p>
          </button>
        ))}
      </div>
      <Tab active={section} />
    </div>
  );
}
