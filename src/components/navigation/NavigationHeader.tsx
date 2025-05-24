import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, User } from 'lucide-react';
import { CurrencySelector } from '../currency';

const NavigationHeader: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <header className="glass-card border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-3 pb-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <h1 className="text-xl text-nowrap font-bold text-white">Qurtesy Finance</h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="w-full md:w-auto flex justify-end items-center space-x-4">
            <CurrencySelector />
            <div className="text-sm text-slate-400">Welcome back!</div>
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
