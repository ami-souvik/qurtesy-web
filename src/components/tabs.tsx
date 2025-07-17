import { Children, useState, useRef, Component } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './action/button';
import { KeyboardShortcutsHelp } from './ui/keyboard-shortcuts-help';
import { cn } from '../utils/tailwind';

export interface TapProps {
  name: string;
  label: string;
  icon: Component;
  color: string;
  bgColor: string;
  component: Component;
}

// Tab component - just a configuration component that doesn't render anything
/* eslint-disable @typescript-eslint/no-unused-vars */
export const Tab = (_props: TapProps) => {
  return null;
};

interface TabRef {
  handleAdd: () => void;
}

export function Tabs({ children }) {
  const tabs = Children.toArray(children).map((child) => child?.props);
  const tabRef = useRef<TabRef>(null);
  const handleAdd = () => tabRef.current?.handleAdd();

  // Get the first tab name as default active tab
  const firstTabName = Children.toArray(children)[0]?.props.name;
  const [active, setActive] = useState(firstTabName);

  // Find the active tab's component
  const activeTabData = Children.toArray(children).find((child) => child.props.name === active);
  const ActiveComponent = activeTabData?.props.component;
  return (
    <div className="h-full flex flex-col">
      {/* Compact Tab Navigation */}
      <div className="flex items-center justify-between mb-4">
        {/* Modern Tab Pills */}
        <div className="flex items-center bg-slate-800/30 rounded-lg p-1 gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.name;
            return (
              <button
                key={t.name}
                className={`
                  relative px-3 py-2 rounded-md transition-all duration-200 flex items-center sm:space-x-1.5
                  ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
                onClick={() => setActive(t.name)}
              >
                <Icon className={`${cn('w-5 h-5', t.color)}`} />
                <span className="text-xs font-medium hidden sm:inline">{t.label}</span>
                {isActive && <div className="absolute inset-0 rounded-md ring-1 ring-white/20"></div>}
              </button>
            );
          })}
        </div>
        <div className="flex">
          <KeyboardShortcutsHelp />
          <Button onClick={handleAdd} leftIcon={<Plus className="h-4 w-4 sm:mr-2" />}>
            <span className="hidden sm:inline text-xs">Add</span>
          </Button>
        </div>
      </div>

      {/* Active tab content */}
      <div className="tab-content">{ActiveComponent && <ActiveComponent ref={tabRef} {...activeTabData?.props} />}</div>
    </div>
  );
}
