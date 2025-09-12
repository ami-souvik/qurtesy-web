import { FC } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

const PWAInstallBanner: FC = () => {
  const { showInstallPrompt, installPWA, dismissInstallPrompt } = usePWAInstall();

  if (!showInstallPrompt) return null;
  return (
    <div className="fixed bottom-5 right-1/2 translate-x-[50%] bg-white dark:bg-zinc-800/95 rounded-xl z-[1000] w-[60%] max-w-xs shadow-2xl">
      <p className="px-4 py-2 text-sm">Install Jamms for quick access!</p>
      <div className="grid grid-cols-2 border-t border-zinc-400 dark:border-zinc-700">
        <button
          onClick={installPWA}
          className="text-zinc-900 dark:text-white border-r border-zinc-400 dark:border-zinc-700 py-1 cursor-pointer rounded-bl-xl hover:bg-white/8 transition-colors"
        >
          Install
        </button>
        <button
          onClick={dismissInstallPrompt}
          className="bg-transparent text-zinc-500 dark:text-zinc-400 py-1 cursor-pointer rounded-br-xl hover:bg-white/5 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
