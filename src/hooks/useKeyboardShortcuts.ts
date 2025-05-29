import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(({ key, ctrlKey, metaKey, shiftKey, altKey, handler }) => {
        const matchesKey = e.key.toLowerCase() === key.toLowerCase();
        const matchesCtrl = ctrlKey ? e.ctrlKey : !e.ctrlKey;
        const matchesMeta = metaKey ? e.metaKey : !e.metaKey;
        const matchesShift = shiftKey ? e.shiftKey : !e.shiftKey;
        const matchesAlt = altKey ? e.altKey : !e.altKey;

        if (matchesKey && matchesCtrl && matchesMeta && matchesShift && matchesAlt) {
          e.preventDefault();
          handler();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}
// Predefined common shortcuts
export const commonShortcuts = {
  newTransaction: (handler: () => void) => ({
    key: 'n',
    ctrlKey: true,
    handler,
    description: 'Create new transaction',
  }),
  escape: (handler: () => void) => ({
    key: 'Escape',
    handler,
    description: 'Close modal/dialog',
  }),
  save: (handler: () => void) => ({
    key: 's',
    ctrlKey: true,
    handler,
    description: 'Save current form',
  }),
  search: (handler: () => void) => ({
    key: 'k',
    ctrlKey: true,
    handler,
    description: 'Open search',
  }),
};
