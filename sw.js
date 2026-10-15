const CACHE = 'abilearn-v1';
const STATIC = [
  '/index.html',
  '/learn.html',
  '/maths.html',
  '/science.html',
  '/english.html',
  '/social.html',
  '/about.html',
  '/learn-tips.html',
  '/css/style.css',
  '/js/app.js',
  '/js/data.js',
  '/js/protect.js',
  '/js/router.js',
  '/js/pinch-zoom.js',
  '/js/db-stub.js',
  '/js/watermark.js',
  '/js/community.js',
  '/assets/logo.jpeg',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(STATIC))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('/pdfs/') || url.includes('/assets/formula/')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached || new Response('Offline', { status: 503 }));
    })
  );
});
