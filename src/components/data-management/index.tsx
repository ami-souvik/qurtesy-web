import React, { useEffect, ForwardRefExoticComponent, RefAttributes } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/index.types';
import { fetchProfiles } from '../../slices/transactions-slice';
import { Wallet, Users, ArrowUpCircle, ArrowDownCircle, LucideIcon } from 'lucide-react';
import { Tab, TabHandle, Tabs } from '../tabs';
import { Accounts } from './accounts';
import { Participants } from './participants';
import { Categories } from './categories';

interface SectionRecord {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  component: ForwardRefExoticComponent<{ name: string } & RefAttributes<TabHandle>>;
}

const sections: { [k: string]: SectionRecord } = {
  ACCOUNT: {
    label: 'Accounts',
    icon: Wallet,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20 border-purple-500/30',
    component: Accounts,
  },
  PARTICIPANT: {
    label: 'Participants',
    icon: Users,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20 border-orange-500/30',
    component: Participants,
  },
  INCOME_CATEGORY: {
    label: 'Income Categories',
    icon: ArrowUpCircle,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20 border-cyan-500/30',
    component: Categories,
  },
  EXPENSE_CATEGORY: {
    label: 'Expense Categories',
    icon: ArrowDownCircle,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20 border-cyan-500/30',
    component: Categories,
  },
};

export const DataManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);
  return (
    <Tabs>
      {Object.keys(sections).map((s) => (
        <Tab name={s} {...sections[s]} />
      ))}
    </Tabs>
  );
};
