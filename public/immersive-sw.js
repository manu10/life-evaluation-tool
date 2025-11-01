/* Simple service worker to show an alarm notification. */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', async (event) => {
  const { type, title, body } = event.data || {};
  if (type === 'show-alarm') {
    try {
      await self.registration.showNotification(title || 'Focus session finished', {
        body: body || 'Time is up. Start writing your outcome to stop the alarm.',
        tag: 'focus-session-alarm',
        renotify: true,
        badge: '/vite.svg',
        icon: '/vite.svg',
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 400, 100, 400],
      });
    } catch (e) {
      // no-op
    }
  }
});


