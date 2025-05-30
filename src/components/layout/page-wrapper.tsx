import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { NotificationPanel } from '../notifications';

export interface StatCard {
  label: string;
  value: string | number;
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
  title: string;
  subtitle?: string;
  showNotifications?: boolean;
  statCards?: StatCard[];
  actionButtons?: ActionButton[];
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  subtitle,
  showNotifications = false,
  statCards = [],
  actionButtons = [],
  headerActions,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {headerActions}
          {showNotifications && (
            <div className="hidden lg:flex items-center">
              <NotificationPanel />
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      {statCards.length > 0 && (
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
                className={`glass-card rounded-lg p-4 transition-colors ${
                  stat.onClick ? 'hover:bg-slate-800/60 cursor-pointer' : 'hover:bg-slate-800/60'
                }`}
                onClick={stat.onClick}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 ${stat.iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <IconComponent className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold truncate ${stat.valueColor || 'text-white'}`}>{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      {actionButtons.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actionButtons.map((action, index) => {
            const IconComponent = action.icon;
            const baseClasses = 'inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors';
            const variantClasses = {
              primary: 'bg-blue-600 hover:bg-blue-700 text-white',
              secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
              outline: 'border border-slate-600 hover:bg-slate-700 text-white',
            };

            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`${baseClasses} ${variantClasses[action.variant || 'primary']}`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {action.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Page Content */}
      <div className="space-y-4">{children}</div>
    </div>
  );
};
