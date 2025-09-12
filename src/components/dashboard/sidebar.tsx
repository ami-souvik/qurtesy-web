import React, { useState } from 'react';
import { Moon, Sun, Equal, RefreshCcw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../ui/icon';
import { useDarkMode } from '../../hooks';
import { Button } from '../action/button';
import { routes, sqlite } from '../../config';

interface SidebarProps {
  summary: {
    income: number;
    expense: number;
    balance: number;
  };
  year: number;
  month: number;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathend = location.pathname.split('/').pop();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useDarkMode();
  const categories = {
    main: {
      label: 'Main',
      items: Object.entries(routes)
        .filter((v) => v[1].category === 'main')
        .map(([key, v]) => ({ key, ...v })),
    },
    planning: {
      label: 'Planning',
      items: Object.entries(routes)
        .filter((v) => v[1].category === 'planning')
        .map(([key, v]) => ({ key, ...v })),
    },
    tools: {
      label: 'Tools',
      items: Object.entries(routes)
        .filter((v) => v[1].category === 'tools')
        .map(([key, v]) => ({ key, ...v })),
    },
  };
  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-end space-x-2">
              <Icon className="w-8 h-8" />
              <h1 className="text-3xl leading-none font-black">Jamms</h1>
            </div>
            <p className="text-sm">Just another money manager service</p>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-6 overflow-y-auto">
        {Object.entries(categories).map(([categoryKey, category]) => (
          <div key={categoryKey}>
            <h3 className="max-md:text-xs font-semibold uppercase tracking-wider px-4 mb-3">{category.label}</h3>
            <div className="px-2 space-y-1">
              {category.items.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setIsMobileOpen(false);
                    navigate(key);
                  }}
                  className={`w-full flex items-center group relative transition-all duration-200 space-x-3 px-4 py-2 rounded-xl
                    ${
                      pathend === key
                        ? 'bg-slate-500/10 shadow-sm border border-slate-500/20'
                        : 'text-zinc-500 hover:bg-white/5'
                    }`}
                >
                  <Icon className="flex-shrink-0 h-4 w-4" />
                  <div className="flex-1 text-left">
                    <div className="max-md:text-sm font-medium">{label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      {/* Bottom section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700/50">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <button
              onClick={toggleTheme}
              className={`
                relative inline-flex items-center justify-center
                w-8 h-8 rounded-full transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-4 focus:ring-opacity-30
                ${theme === 'dark' ? 'bg-blue-600 focus:ring-blue-400' : 'bg-orange-100 focus:ring-orange-400'}
              `}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-blue-400" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </button>
            <Button variant="outline" onClick={() => sqlite.sync()} leftIcon={<RefreshCcw className="h-4 w-4" />}>
              <span className="hidden sm:inline ml-2 text-sm">Sync</span>
            </Button>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-200 dark:bg-zinc-800/50">
            <div className="flex-1">
              <div className="text-sm font-medium">Version: 1.2.459</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Made with ❤︎ by Qurtesy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {/* Mobile Menu Button */}
      <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-1 backdrop-blur rounded-lg">
        <Equal className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed top-0 left-0 w-screen h-screen bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white dark:bg-zinc-900 border-slate-700/50 max-md:z-99 transition-all duration-300 ease-in-out w-72
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
};
