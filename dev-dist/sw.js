importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');
workbox
  ? (console.log('Workbox is loaded'),
    workbox.precaching.cleanupOutdatedCaches(),
    typeof self.__WB_MANIFEST < 'u' && Array.isArray(self.__WB_MANIFEST)
      ? (console.log('__WB_MANIFEST found:', self.__WB_MANIFEST),
        workbox.precaching.precacheAndRoute(self.__WB_MANIFEST))
      : (console.warn('__WB_MANIFEST not found or not an array, skipping precaching'),
        console.log('__WB_MANIFEST value:', self.__WB_MANIFEST)),
    workbox.routing.registerRoute(
      ({ url: o }) => o.origin === 'https://fonts.googleapis.com',
      new workbox.strategies.StaleWhileRevalidate({ cacheName: 'google-fonts-stylesheets' })
    ),
    workbox.routing.registerRoute(
      ({ url: o }) => o.origin === 'https://fonts.gstatic.com',
      new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [{ cacheKeyWillBeUsed: async ({ request: o }) => `${o.url}?v=1` }],
      })
    ),
    workbox.routing.registerRoute(
      ({ url: o }) => o.pathname.startsWith('/api/'),
      new workbox.strategies.NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        plugins: [{ cacheWillUpdate: async ({ response: o }) => (o.status === 200 ? o : null) }],
      })
    ),
    workbox.routing.registerRoute(
      ({ request: o }) => o.destination === 'image',
      new workbox.strategies.CacheFirst({
        cacheName: 'images',
        plugins: [{ cacheKeyWillBeUsed: async ({ request: o }) => o.url }],
      })
    ))
  : console.log('Workbox could not be loaded. No offline support');
self.addEventListener('sync', (o) => {
  o.tag === 'background-sync-transactions' && o.waitUntil(s());
});
self.addEventListener('push', (o) => {
  if (o.data) {
    const e = o.data.json(),
      t = {
        body: e.body,
        icon: '/icon-512x512.png',
        badge: '/icon-border-512x512.png',
        vibrate: [100, 50, 100],
        data: e.data,
        actions: e.actions,
      };
    o.waitUntil(self.registration.showNotification(e.title, t));
  }
});
async function s() {
  console.log('Syncing pending transactions...');
}
