/* Дневник состояния · кэш v19
   Для HTML сначала сеть: обновления интерфейса не застревают в старом кэше.
   При отсутствии сети — сохранённая страница. */
const CACHE = 'dnevnik-v19';
const PRECACHE = [
  './', './index.html', './universe-prototype.html',
  './manifest.webmanifest', './mood-cosmos.js', './screenings.js', './sleep.js', './support.js', './guide.js', './favicon-32.png', './icon-192.png', './icon-512.png',
  './apple-touch-icon.png', './assets/nebula-sky.jpg',
  './assets/planet-core.png', './assets/planet-volcanic.png',
  './assets/moon-ice.png', './assets/planet-auria.png',
  './assets/signal-relic.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('dnevnik-') && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if (isPage) {
    event.respondWith(
      fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          event.waitUntil(caches.open(CACHE).then(cache => cache.put(req, copy)));
        }
        return res;
      }).catch(() => caches.match(req, {ignoreSearch: true}).then(cached => cached || caches.match('./index.html')))
    );
  } else {
    event.respondWith(
      caches.match(req, {ignoreSearch: true}).then(cached => cached || fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          event.waitUntil(caches.open(CACHE).then(cache => cache.put(req, copy)));
        }
        return res;
      }))
    );
  }
});
