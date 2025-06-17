
const CACHE_NAME = 'toyota-uae-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Background sync for offline favorites
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  const favorites = JSON.parse(localStorage.getItem('offlineFavorites') || '[]');
  if (favorites.length > 0) {
    try {
      // Sync with server when online
      await fetch('/api/sync-favorites', {
        method: 'POST',
        body: JSON.stringify({ favorites }),
        headers: { 'Content-Type': 'application/json' }
      });
      localStorage.removeItem('offlineFavorites');
    } catch (error) {
      console.log('Sync failed, will retry later');
    }
  }
}
