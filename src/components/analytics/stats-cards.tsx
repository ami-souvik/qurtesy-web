import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Activity, ArrowDownCircle, ArrowUpCircle, LucideIcon, Wallet } from 'lucide-react';
import { CurrencyDisplay } from '../currency';
import { RootState } from '../../store/index.types';

interface StatCard {
  label: string;
  value: string | number | ReactNode;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  valueColor?: string;
  onClick?: () => void;
}

export const StatsCards = () => {
  const summary = useSelector((state: RootState) => state.transactions.summary);
  const statCards: StatCard[] = [
    {
      label: 'Income',
      value: <CurrencyDisplay amount={summary.income} />,
      icon: ArrowUpCircle,
      iconColor: 'text-green-400',
      iconBgColor: 'bg-green-500/20',
    },
    {
      label: 'Expenses',
      value: <CurrencyDisplay amount={summary.expense} />,
      icon: ArrowDownCircle,
      iconColor: 'text-red-400',
      iconBgColor: 'bg-red-500/20',
    },
    {
      label: 'Balance',
      value: <CurrencyDisplay amount={summary.balance} />,
      icon: Wallet,
      iconColor: 'text-blue-400',
      iconBgColor: 'bg-blue-500/20',
      valueColor: summary.balance >= 0 ? 'text-green-400' : 'text-red-400',
    },
    {
      label: 'Savings',
      value: `${summary.income > 0 ? Math.round((summary.balance / summary.income) * 100) : 0}%`,
      icon: Activity,
      iconColor: 'text-purple-400',
      iconBgColor: 'bg-purple-500/20',
    },
  ];
  return (
    <div
      className={`grid gap-3 ${
        statCards.length === 1
          ? 'grid-cols-1'
          : statCards.length === 2
            ? 'grid-cols-1 lg:grid-cols-2'
            : statCards.length === 3
              ? 'grid-cols-1 lg:grid-cols-3'
              : 'grid-cols-2 lg:grid-cols-4'
      }`}
    >
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className={`glass-card rounded-lg px-4 py-2 transition-colors ${
              stat.onClick ? 'hover:bg-slate-800/60 cursor-pointer' : 'hover:bg-slate-800/60'
            }`}
            onClick={stat.onClick}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${stat.iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <IconComponent className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                <p className={`font-bold truncate ${stat.valueColor || 'text-white'}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
