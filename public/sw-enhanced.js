
// Enhanced Service Worker with production-grade caching strategies
const CACHE_VERSION = 'toyota-uae-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Cache duration constants
const CACHE_DURATIONS = {
  STATIC: 31536000, // 1 year for hashed assets
  DYNAMIC: 86400, // 1 day for pages
  IMAGES: 2592000, // 30 days for images
  API: 300 // 5 minutes for API responses
};

// Critical assets to precache
const CRITICAL_ASSETS = [
  '/',
  '/static/js/main.js',
  '/static/css/main.css',
  '/manifest.json'
];

// External domains for preconnect
const PRECONNECT_DOMAINS = [
  'https://dam.alfuttaim.com',
  'https://toyota.com',
  'https://virtualshowroom.toyota.ae',
  'https://cdn.gpteng.co'
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('SW: Installing enhanced service worker');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(CRITICAL_ASSETS)),
      self.skipWaiting()
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating enhanced service worker');
  event.waitUntil(
    Promise.all([
      // Delete old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => !cacheName.startsWith(CACHE_VERSION))
            .map(cacheName => caches.delete(cacheName))
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Enhanced fetch handler with smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const isNavigateRequest = request.mode === 'navigate';
  const isImageRequest = request.destination === 'image';
  const isAPIRequest = url.pathname.startsWith('/api/');
  const isStaticAsset = /\.(js|css|woff2?|png|jpg|jpeg|webp|avif|svg|ico)$/i.test(url.pathname);

  try {
    // Handle different request types with appropriate strategies
    if (isNavigateRequest) {
      return await handleNavigationRequest(request);
    } else if (isImageRequest) {
      return await handleImageRequest(request);
    } else if (isAPIRequest) {
      return await handleAPIRequest(request);
    } else if (isStaticAsset) {
      return await handleStaticAssetRequest(request);
    } else {
      return await handleDynamicRequest(request);
    }
  } catch (error) {
    console.error('SW: Request failed:', error);
    return fetch(request);
  }
}

// Cache-first for static assets (immutable, hashed files)
async function handleStaticAssetRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const response = await fetch(request);
  if (response.ok) {
    // Add cache headers for static assets
    const clonedResponse = response.clone();
    const headers = new Headers(clonedResponse.headers);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    cache.put(request, new Response(clonedResponse.body, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers: headers
    }));
  }
  
  return response;
}

// Network-first for navigation requests
async function handleNavigationRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Add no-cache headers for HTML
      const clonedResponse = response.clone();
      const headers = new Headers(clonedResponse.headers);
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      
      cache.put(request, new Response(clonedResponse.body, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: headers
      }));
    }
    return response;
  } catch (error) {
    // Fallback to cache for offline
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline fallback', { status: 503 });
  }
}

// Stale-while-revalidate for images
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    // Revalidate in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {});
    
    return cachedResponse;
  }
  
  // No cache, fetch and cache
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network-first with SWR for API requests
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'max-age=300, stale-while-revalidate=86400');
      
      cache.put(request, new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      }));
    }
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('API offline', { status: 503 });
  }
}

// Cache-first for other dynamic content
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// Background sync for offline favorites
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  try {
    const favorites = JSON.parse(localStorage.getItem('offlineFavorites') || '[]');
    if (favorites.length > 0) {
      await fetch('/api/sync-favorites', {
        method: 'POST',
        body: JSON.stringify({ favorites }),
        headers: { 'Content-Type': 'application/json' }
      });
      localStorage.removeItem('offlineFavorites');
    }
  } catch (error) {
    console.log('Sync failed, will retry later');
  }
}

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
