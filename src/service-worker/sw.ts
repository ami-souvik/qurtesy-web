// Type declarations for service worker context
declare const self: ServiceWorkerGlobalScope;

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { clientsClaim, skipWaiting } from 'workbox-core';

// Initialize Workbox
console.log('Workbox is loaded');

// Clean up outdated caches
cleanupOutdatedCaches();

// Take control of all clients as soon as the service worker activates
clientsClaim();

// Skip waiting and immediately activate the new service worker
skipWaiting();

// This is where Workbox will inject the precache manifest - SINGLE REFERENCE ONLY
precacheAndRoute(self.__WB_MANIFEST);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => `${request.url}?v=1`,
      },
    ],
  })
);

// Cache API responses with network-first strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          return response.status === 200 ? response : null;
        },
      },
    ],
  })
);

// Cache images with cache-first strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => request.url,
      },
    ],
  })
);

// Handle background sync for offline transactions
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'background-sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

// Handle push notifications
self.addEventListener('push', (event: PushEvent) => {
  if (event.data) {
    const data = event.data.json();
    const options: NotificationOptions = {
      body: data.body,
      icon: '/icon-512x512.png',
      badge: '/icon-border-512x512.png',
      data: data.data,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

async function syncTransactions() {
  console.log('Syncing pending transactions...');
}
