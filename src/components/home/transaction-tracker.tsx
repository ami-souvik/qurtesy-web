import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { PiggyBank, HandHeart, Users, LucideIcon } from 'lucide-react';
import { Tab, TabHandle, Tabs } from '../tabs';
import { PageWrapper } from '../layout';

import { Transactions } from '../transaction/transactions';
import { Lends } from '../lend/lends';
import { Splits } from '../split/splits';

interface SectionRecord {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  component: ForwardRefExoticComponent<RefAttributes<TabHandle>>;
}

const sections: { [k: string]: SectionRecord } = {
  TRANSACTION: {
    label: 'Transactions',
    icon: PiggyBank,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20 border-purple-500/30',
    component: Transactions,
  },
  LEND: {
    label: 'Lend',
    icon: HandHeart,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20 border-orange-500/30',
    component: Lends,
  },
  SPLIT: {
    label: 'Split',
    icon: Users,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20 border-cyan-500/30',
    component: Splits,
  },
};

export const TransactionTracker: React.FC = () => {
  return (
    <PageWrapper
      title="Transaction Management"
      subtitle="Track and manage your income, expenses, transfers, and investments"
    >
      <div className="rounded-2xl h-full animate-slide-in">
        <Tabs>
          {Object.keys(sections).map((s) => (
            <Tab name={s} {...sections[s]} />
          ))}
        </Tabs>
      </div>
    </PageWrapper>
  );
};
