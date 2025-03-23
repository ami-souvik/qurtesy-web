import { useDispatch, useSelector } from 'react-redux';
import { Section } from '../types/daily-expenses';
import { DailyExpenses } from './daily-expenses';
import { Income } from './income';
import { AppDispatch, RootState } from '../store.types';
import { setSection } from '../slices/daily-expenses-slice';

const sections: Section[] = ['expense', 'income', 'investment', 'lend', 'split'];

const sectionsMeta = {
  expense: {
    label: 'Daily Expenses',
  },
  income: {
    label: 'Income',
  },
  investment: {
    label: 'Investments',
  },
  lend: {
    label: 'Lend',
  },
  split: {
    label: 'Group/Share Expense',
  },
};

export function Tab({ active }: { active: string }) {
  switch (active) {
    case 'expense':
      return <DailyExpenses />;
    case 'income':
      return <Income />;
    case 'investment':
      return <></>;
    case 'lend':
      return <></>;
    case 'split':
      return <></>;
    default:
      return <></>;
  }
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
