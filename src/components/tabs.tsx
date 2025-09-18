import {
  Children,
  useState,
  useRef,
  ReactNode,
  isValidElement,
  ReactElement,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import { LucideIcon, SquarePen } from 'lucide-react';
import { Button } from './action/button';
import { KeyboardShortcutsHelp } from './ui/keyboard-shortcuts-help';
import { cn } from '../utils/tailwind';

export interface TabHandle {
  handleAdd: () => void;
}

export interface TabProps {
  name: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  component: ForwardRefExoticComponent<{ name: string } & RefAttributes<TabHandle>>;
}

// Tab component - just a configuration component that doesn't render anything
/* eslint-disable @typescript-eslint/no-unused-vars */
export const Tab = (_props: TabProps) => {
  return null;
};

export function Tabs({ children }: { children: ReactNode[] }) {
  const tabs: TabProps[] = Children.toArray(children)
    .filter((child): child is ReactElement => isValidElement(child))
    .map((child) => child.props as TabProps);
  const tabRef = useRef<TabHandle>(null);
  const handleAdd = () => tabRef.current?.handleAdd();

  // Get the first tab name as default active tab
  const firstTabName = tabs[0].name;
  const [active, setActive] = useState(firstTabName);
  const [showOptions, setShowOptions] = useState(false);

  // Find the active tab's component
  const activeTabProps: TabProps | undefined = tabs.find(({ name }) => name === active);
  const ActiveComponent = activeTabProps?.component;
  return (
    <div>
      {/* Compact Tab Navigation */}
      <div className="hidden md:flex items-center justify-between mb-4">
        {/* Modern Tab Pills */}
        <div className="flex items-center bg-white dark:bg-zinc-900 rounded-lg p-1 gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.name;
            return (
              <button
                key={t.name}
                className={`
                  relative px-3 py-2 rounded-md transition-all duration-200 flex items-center sm:space-x-1.5
                  ${isActive ? 'bg-zinc-700/10 dark:bg-white/10 text-zinc-900 dark:text-white' : 'text-slate-500 hover:text-zinc-900 dark:hover:text-white hover:bg-white/5'}
                `}
                onClick={() => setActive(t.name)}
              >
                <Icon className={`${cn('w-5 h-5', t.color)}`} />
                <span className="text-xs md:text-sm font-medium hidden sm:inline">{t.label}</span>
                {isActive && (
                  <div className="absolute inset-0 rounded-md ring-1 ring-zinc-400/40 dark:ring-white/20"></div>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex">
          <KeyboardShortcutsHelp />
          <Button onClick={handleAdd} leftIcon={<SquarePen className="h-4 w-4" />}>
            <span className="hidden sm:inline ml-2 text-sm">Add</span>
          </Button>
        </div>
      </div>
      {/* Navigation for Mobile */}
      <div className="md:hidden fixed bottom-3 right-1/2 translate-x-1/2 w-screen z-2 mx-auto px-4">
        <div className="px-4 py-3 flex justify-between bg-white/20 dark:bg-zinc-800/30 rounded-xl border-y-1 border-white dark:border-zinc-800/70">
          <div className="flex md:hidden items-center justify-between">
            {/* Modern Tab Pills */}
            <div className="flex items-center bg-white dark:bg-zinc-900 shadow rounded-lg p-2 gap-2">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = active === t.name;
                return (
                  <button
                    key={t.name}
                    className={`
                    relative p-2 rounded-md transition-all duration-200 flex items-center sm:space-x-1.5
                    ${isActive ? 'bg-zinc-400/10 dark:bg-white/5 text-zinc-900 dark:text-white' : 'text-slate-500 hover:text-zinc-900 dark:hover:text-white hover:bg-white/5'}
                  `}
                    onClick={() => setActive(t.name)}
                  >
                    <Icon className={`${cn('w-5 h-5', t.color)}`} />
                    <span className="text-xs md:text-sm font-medium hidden sm:inline">{t.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 rounded-md ring-1 ring-zinc-400/20 dark:ring-white/15"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={handleAdd}
            className={`
              p-4 rounded-md transition-all duration-200 flex items-center sm:space-x-1.5
              bg-white/60 dark:bg-zinc-900 shadow backdrop-blur ${showOptions ? 'rotate-45' : ''}
            `}
          >
            <SquarePen className="h-5 w-5 opacity-90" strokeWidth={2.5} absoluteStrokeWidth />
          </button>
        </div>
      </div>
      {showOptions && (
        <div
          className="lg:hidden fixed top-0 left-0 w-screen h-screen bg-black/20 z-1"
          onClick={() => setShowOptions(false)}
        />
      )}
      {/* Active tab content */}
      <div className="rounded-2xl h-full animate-slide-in">
        {ActiveComponent && <ActiveComponent ref={tabRef} {...activeTabProps} />}
      </div>
    </div>
  );
}
