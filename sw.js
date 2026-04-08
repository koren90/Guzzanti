const CACHE = 'co2remote-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://unpkg.com/mqtt@5.5.0/dist/mqtt.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // MQTT WSS connections — never cache
  if (e.request.url.includes('hivemq') || e.request.url.startsWith('wss:')) return;

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
