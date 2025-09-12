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
import { PiggyBank, HandHeart, Users, LucideIcon, Plus } from 'lucide-react';
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
  const toggleShowOptions = () => setShowOptions((option) => !option);

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
          <Button onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />}>
            <span className="hidden sm:inline ml-2 text-sm">Add</span>
          </Button>
        </div>
      </div>
      {/* Navigation for Mobile */}
      <div className="md:hidden fixed bottom-6 right-1/2 translate-x-1/2 w-screen z-2 px-4">
        <div className="flex md:hidden items-center justify-between">
          {/* Modern Tab Pills */}
          <div className="flex items-center bg-white dark:bg-zinc-900 shadow rounded-lg p-1 gap-1">
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
        </div>
        <div className="relative">
          <button
            onClick={handleAdd}
            className={`
              absolute ${showOptions ? 'right-2.5 bottom-16' : 'right-1 bottom-1'} p-2 rounded-full transition-all duration-200 flex items-center sm:space-x-1.5
              bg-white/60 dark:bg-black/60 backdrop-blur
            `}
          >
            <PiggyBank className="h-5 w-5 opacity-90" strokeWidth={1.5} absoluteStrokeWidth />
          </button>
          <button
            onClick={handleAdd}
            className={`
              absolute ${showOptions ? 'right-13 bottom-13' : 'right-1 bottom-1'} p-2 rounded-full transition-all duration-200 flex items-center sm:space-x-1.5
              bg-white/60 dark:bg-black/60 backdrop-blur
            `}
          >
            <HandHeart className="h-5 w-5 opacity-90" strokeWidth={1.5} absoluteStrokeWidth />
          </button>
          <button
            onClick={handleAdd}
            className={`
              absolute ${showOptions ? 'right-16 bottom-2.5' : 'right-1 bottom-1'} p-2 rounded-full transition-all duration-200 flex items-center sm:space-x-1.5
              bg-white/60 dark:bg-black/60 backdrop-blur
            `}
          >
            <Users className="h-5 w-5 opacity-90" strokeWidth={1.5} absoluteStrokeWidth />
          </button>
          <button
            onClick={toggleShowOptions}
            className={`
              absolute right-0 bottom-0 p-3 rounded-full transition-all duration-200 flex items-center sm:space-x-1.5
              bg-white/60 dark:bg-black/60 shadow backdrop-blur ${showOptions ? 'rotate-45' : ''}
            `}
          >
            <Plus className="h-8 w-8 opacity-90" strokeWidth={4} absoluteStrokeWidth />
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
