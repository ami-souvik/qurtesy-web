import { Workbox } from 'workbox-window';

let wb: Workbox | null = null;

export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    wb = new Workbox('/sw.js');

    wb.addEventListener('controlling', () => {
      window.location.reload();
    });

    wb.addEventListener('waiting', () => {
      if (confirm('New version available! Click OK to update.')) {
        wb?.messageSkipWaiting();
      }
    });

    wb.register();
  }
};

export const unregisterSW = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      registration.unregister();
    }
  }
};
