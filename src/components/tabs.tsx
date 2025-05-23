import { useDispatch, useSelector } from 'react-redux';
import { Section } from '../types/daily-expenses';
import { Transactions } from './transaction/transactions';
import { Transfer } from './transfer/transfer';
import { AppDispatch, RootState } from '../store.types';
import { setSection } from '../slices/daily-expenses-slice';
import { CreditCard, TrendingDown, TrendingUp, ArrowLeftRight, PiggyBank, HandHeart, Users } from 'lucide-react';

const sections: Section[] = ['EXPENSE', 'INCOME', 'TRANSFER', 'INVESTMENT', 'LEND', 'SPLIT'];

const sectionsMeta = {
  EXPENSE: {
    label: 'Expenses',
    icon: TrendingDown,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20 border-red-500/30',
  },
  INCOME: {
    label: 'Income',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20 border-emerald-500/30',
  },
  TRANSFER: {
    label: 'Transfers',
    icon: ArrowLeftRight,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20 border-blue-500/30',
  },
  INVESTMENT: {
    label: 'Investments',
    icon: PiggyBank,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20 border-purple-500/30',
  },
  LEND: {
    label: 'Lend',
    icon: HandHeart,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20 border-orange-500/30',
  },
  SPLIT: {
    label: 'Split',
    icon: Users,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20 border-cyan-500/30',
  },
};

export function Tab({ active }: { active: string }) {
  if (active == 'EXPENSE' || active == 'INCOME' || active == 'INVESTMENT') return <Transactions />;
  else if (active == 'TRANSFER') return <Transfer />;
  else
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
            <CreditCard className="w-8 h-8" />
          </div>
          <p>Feature coming soon...</p>
        </div>
      </div>
    );
}

export function Tabs() {
  const dispatch = useDispatch<AppDispatch>();
  const section = useSelector((state: RootState) => state.dailyExpenses.section);

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Financial Overview</h2>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          {sections.map((s: Section) => {
            const meta = sectionsMeta[s];
            const Icon = meta.icon;
            const isActive = section === s;

            return (
              <button
                key={s}
                className={`
                  group relative p-3 rounded-xl border backdrop-blur-sm transition-all duration-200
                  ${
                    isActive
                      ? `${meta.bgColor} ${meta.color} shadow-lg scale-105`
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }
                `}
                onClick={() => dispatch(setSection(s))}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{meta.label}</span>
                </div>
                {isActive && (
                  <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 ring-offset-2 ring-offset-transparent"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <Tab active={section} />
      </div>
    </div>
  );
}
