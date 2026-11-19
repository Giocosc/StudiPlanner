const CACHE_NAME = 'studiplanner-v3'; // v3: elimina le risposte API GitLab messe in cache dalle versioni precedenti
const STATIC_ASSETS = [
  './',
  './index.html',
  './bundle.js',
  './manifest.json',
  './favicon.ico',
  './icons/app.ico',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './vendor/react.production.min.js',
  './vendor/react-dom.production.min.js',
  './vendor/babel.min.js',
  './vendor/xlsx.full.min.js',
  './vendor/tailwindcss.js'
];

// Install: Cache critical static assets locally
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching local app shell and vendor assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Some static assets failed to pre-cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache version:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Chiamate API (GitLab REST v4 o richieste autenticate): sempre dalla rete, mai in cache.
  // Servirle cache-first restituiva per sempre il primo stato scaricato: il pull non vedeva
  // le modifiche degli altri dispositivi e ogni push andava in conflitto.
  if (url.pathname.includes('/api/') || event.request.headers.has('PRIVATE-TOKEN') || event.request.headers.has('Authorization')) {
    return;
  }

  // Local app assets (Network-first with immediate cache fallback)
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('./index.html');
            }
          });
        })
    );
  } else {
    // External CDN assets (Cache-first with network fallback)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
