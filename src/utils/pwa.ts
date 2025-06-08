import { Workbox } from 'workbox-window';

let wb: Workbox | null = null;

export const registerSW = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
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

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const setupPWAInstall = () => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    showInstallPromotion();
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
  });
};

export const installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt = null;
  }
};
const showInstallPromotion = () => {
  const installBanner = document.createElement('div');
  installBanner.innerHTML = `
    <div style="
      position: fixed; 
      bottom: 20px; 
      right: 20px; 
      background: rgba(30, 41, 59, 0.9); 
      color: white; 
      padding: 16px; 
      border-radius: 12px; 
      backdrop-filter: blur(8px);
      z-index: 1000;
      max-width: 300px;
    ">
      <p style="margin: 0 0 12px 0; font-size: 14px;">Install Qurtesy Finance for quick access!</p>
      <button id="install-btn" style="
        background: #3b82f6; 
        color: white; 
        border: none; 
        padding: 8px 16px; 
        border-radius: 6px; 
        cursor: pointer;
        margin-right: 8px;
      ">Install</button>
      <button id="dismiss-btn" style="
        background: transparent; 
        color: #94a3b8; 
        border: 1px solid #475569; 
        padding: 8px 16px; 
        border-radius: 6px; 
        cursor: pointer;
      ">Dismiss</button>
    </div>
  `;

  document.body.appendChild(installBanner);

  const installBtn = document.getElementById('install-btn');
  const dismissBtn = document.getElementById('dismiss-btn');

  installBtn?.addEventListener('click', () => {
    installPWA();
    document.body.removeChild(installBanner);
  });

  dismissBtn?.addEventListener('click', () => {
    document.body.removeChild(installBanner);
  });

  setTimeout(() => {
    if (document.body.contains(installBanner)) {
      document.body.removeChild(installBanner);
    }
  }, 10000);
};
