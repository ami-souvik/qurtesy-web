import React, { useState } from 'react';
import {
  Home,
  BarChart3,
  PiggyBank,
  Repeat,
  Download,
  Upload,
  Settings,
  TrendingUp,
  User,
  Menu,
  X,
  ChevronRight,
  Target,
  Wallet,
} from 'lucide-react';
import { CurrencySelector, CurrencyDisplay } from '../currency';
import { NotificationPanel } from '../notifications';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  summary: {
    income: number;
    expense: number;
    balance: number;
  };
  year: number;
  month: number;
}

export const LeftSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, summary, year, month }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigationItems = [
    {
      key: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Dashboard insights',
      category: 'main',
    },
    {
      key: 'home',
      label: 'Transactions',
      icon: Home,
      description: 'Track expenses',
      category: 'main',
    },
    {
      key: 'budget',
      label: 'Budgets',
      icon: PiggyBank,
      description: 'Manage budgets',
      category: 'planning',
    },
    {
      key: 'accounts',
      label: 'Data Management',
      icon: Wallet,
      description: 'Accounts, participants & categories',
      category: 'planning',
    },
    {
      key: 'recurring',
      label: 'Recurring',
      icon: Repeat,
      description: 'Auto transactions',
      category: 'planning',
    },
    {
      key: 'goals',
      label: 'Goals',
      icon: Target,
      description: 'Financial goals',
      category: 'planning',
    },
    {
      key: 'investments',
      label: 'Investments',
      icon: TrendingUp,
      description: 'Portfolio tracking',
      category: 'planning',
    },
    {
      key: 'export',
      label: 'Export',
      icon: Download,
      description: 'Export data',
      category: 'tools',
    },
    {
      key: 'import',
      label: 'Import',
      icon: Upload,
      description: 'Import data',
      category: 'tools',
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'App preferences',
      category: 'tools',
    },
  ] as const;
  const categories = {
    main: { label: 'Main', items: navigationItems.filter((item) => item.category === 'main') },
    planning: { label: 'Planning', items: navigationItems.filter((item) => item.category === 'planning') },
    tools: { label: 'Tools', items: navigationItems.filter((item) => item.category === 'tools') },
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-white">Qurtesy</h1>
                <p className="text-xs text-slate-400">Finance Manager</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-700/50">
          <div className="text-xs text-slate-400 mb-3 font-medium">
            {new Date(year, month).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-xs text-slate-400">Income</span>
              </div>
              <span className="text-sm font-medium text-green-400">
                <CurrencyDisplay amount={summary.income} />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-xs text-slate-400">Expenses</span>
              </div>
              <span className="text-sm font-medium text-red-400">
                <CurrencyDisplay amount={summary.expense} />
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <span className="text-xs text-slate-400">Balance</span>
              <span className={`text-sm font-bold ${summary.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <CurrencyDisplay amount={summary.balance} />
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {Object.entries(categories).map(([categoryKey, category]) => (
          <div key={categoryKey}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{category.label}</h3>
            )}
            <div className="space-y-1">
              {category.items.map(({ key, label, icon: Icon, description }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center group relative transition-all duration-200 ${
                    isCollapsed ? 'justify-center p-3' : 'space-x-3 p-3'
                  } rounded-xl ${
                    activeTab === key
                      ? 'bg-blue-600/20 text-blue-400 shadow-lg border border-blue-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`flex-shrink-0 ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'}`} />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-slate-500">{description}</div>
                    </div>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {label}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      {/* Bottom section */}
      <div className="p-4 border-t border-slate-700/50">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Currency</span>
              <CurrencySelector />
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Welcome back!</div>
                <div className="text-xs text-slate-400">Financial Manager</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 flex flex-col items-center">
            <CurrencySelector />
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800/90 backdrop-blur rounded-lg text-white"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full glass-card border-r border-slate-700/50 z-50 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Top Bar for Mobile */}
      <div className="lg:hidden fixed top-0 right-0 left-0 h-16 glass-card border-b border-slate-700/50 z-30 flex items-center justify-end px-4 space-x-4">
        <NotificationPanel />
      </div>
    </>
  );
};
