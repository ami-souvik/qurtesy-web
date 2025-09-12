import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Use injectManifest strategy for custom service worker
      strategies: 'injectManifest',
      srcDir: 'src/service-worker',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },

      // Enable in development for testing
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },

      manifest: {
        name: 'Jamms',
        short_name: 'Jamms',
        description: 'Personal finance tracking and budget management app',
        theme_color: '#1e293b',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-512x512.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-border-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-border-256x256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        categories: ['finance', 'productivity'],
        shortcuts: [
          {
            name: 'Add Expense',
            url: '/?action=add-expense',
            icons: [{ src: '/icons/expense.png', sizes: '96x96' }],
          },
          {
            name: 'View Budget',
            url: '/?action=view-budget',
            icons: [{ src: '/icons/pigggy-bank.png', sizes: '96x96' }],
          },
        ],
      },
    }),
  ],
});
