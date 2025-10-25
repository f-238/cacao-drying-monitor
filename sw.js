const CACHE = 'cacao-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/register.html',
  '/monitor.html',
  '/dashboard.html',
  '/overview.html',
  '/data-summary.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k=> k !== CACHE ? caches.delete(k) : null))).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', evt => {
  if(evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request).then(fetchResp => {
      // cache fetched GET responses for subsequent offline loads
      if(evt.request.url.startsWith(self.location.origin)){
        caches.open(CACHE).then(c => c.put(evt.request, fetchResp.clone()));
      }
      return fetchResp;
    }).catch(()=> caches.match('/index.html')))
  );
});
