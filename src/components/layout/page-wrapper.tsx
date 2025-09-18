import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { NotificationPanel } from '../notifications';
import { useSelector } from 'react-redux';
import { Sidebar } from '../dashboard/sidebar';
import { RootState } from '../../store/index.types';
import { routes } from '../../config';

export interface StatCard {
  label: string;
  value: string | number | ReactNode;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  valueColor?: string;
  onClick?: () => void;
}

export interface ActionButton {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface PageWrapperProps {
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ headerActions, children, className = '' }) => {
  const [year, month] = useSelector((state: RootState) => state.transactions.yearmonth);
  const summary = useSelector((state: RootState) => state.transactions.summary);
  const pathend: string | undefined = location.pathname.split('/').pop();
  return (
    <div className={className}>
      {/* Top Bar for Mobile */}
      <div className="lg:hidden w-screen px-4 py-2">
        <div className="flex items-center justify-between bg-white/20 dark:bg-zinc-800/30 rounded-xl border-y-1 border-white dark:border-zinc-800/70 px-4 py-2 space-x-4 backdrop-blur">
          <Sidebar summary={summary} year={year} month={month} />
          {pathend && routes[pathend] && (
            <div>
              <h1 className="text-xl font-bold uppercase">{routes[pathend].label}</h1>
            </div>
          )}
          <NotificationPanel />
        </div>
      </div>
      {/* Page Header */}
      <div className="hidden lg:flex lg:items-center justify-between px-4">
        {pathend && routes[pathend] && (
          <div>
            <h1 className="text-2xl font-bold mb-1">{routes[pathend].label}</h1>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <NotificationPanel />
          {/* Sidebar */}
          <Sidebar summary={summary} year={year} month={month} />
        </div>
      </div>
      {headerActions}
      {/* Page Content */}
      <div className="px-4">{children}</div>
    </div>
  );
};
