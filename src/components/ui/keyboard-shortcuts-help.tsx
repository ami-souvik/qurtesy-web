import { useState } from 'react';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
}

const shortcuts: Shortcut[] = [
  { key: 'Ctrl + N', description: 'Create new transaction' },
  { key: 'Esc', description: 'Close modal or dialog' },
  { key: 'Ctrl + S', description: 'Save current form' },
  { key: 'Ctrl + K', description: 'Open search' },
];

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:block p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-300">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs text-slate-300 font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
