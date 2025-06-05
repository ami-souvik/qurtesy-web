import { forwardRef, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Section } from '../types/daily-expenses';
import { Transactions } from './transaction/transactions';
import { Transfer } from './transfer/transfer';
import { AppDispatch, RootState } from '../store.types';
import { setSection } from '../slices/daily-expenses-slice';
import { CreditCard, TrendingDown, TrendingUp, ArrowLeftRight, PiggyBank, HandHeart, Users, Plus } from 'lucide-react';
import { Button } from './action/button';
import { KeyboardShortcutsHelp } from './ui/keyboard-shortcuts-help';

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

export const Tab = forwardRef(function Tab({ active }: { active: string }, ref) {
  if (active == 'EXPENSE' || active == 'INCOME' || active == 'INVESTMENT') return <Transactions ref={ref} />;
  else if (active == 'TRANSFER') return <Transfer ref={ref} />;
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
});

export function Tabs() {
  const tabRef = useRef(null);
  const dispatch = useDispatch<AppDispatch>();
  const section = useSelector((state: RootState) => state.dailyExpenses.section);
  const handleAdd = () => tabRef.current.handleAdd();
  return (
    <div className="h-full flex flex-col">
      {/* Compact Tab Navigation */}
      <div className="flex items-center justify-between mb-4">
        {/* Modern Tab Pills */}
        <div className="flex items-center bg-slate-800/30 rounded-lg p-1 gap-1">
          {sections.map((s: Section) => {
            const meta = sectionsMeta[s];
            const Icon = meta.icon;
            const isActive = section === s;

            return (
              <button
                key={s}
                className={`
                  relative px-3 py-2 rounded-md transition-all duration-200 flex items-center space-x-1.5
                  ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
                onClick={() => dispatch(setSection(s))}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs font-medium hidden sm:inline">{meta.label}</span>
                {isActive && <div className="absolute inset-0 rounded-md ring-1 ring-white/20"></div>}
              </button>
            );
          })}
        </div>
        <div>
          <KeyboardShortcutsHelp />
          <Button onClick={handleAdd} leftIcon={<Plus className="h-4 w-4 mr-2" />}>
            <span className="hidden sm:inline">Add Transaction</span>
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <Tab ref={tabRef} active={section} />
      </div>
    </div>
  );
}
