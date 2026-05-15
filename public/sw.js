const CACHE_NAME = 'dean-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/next.svg',
  '/globe.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-alerts') {
    event.waitUntil(syncAlertsWithRetry());
  }
});

async function syncAlertsWithRetry(retries = 3) {
  try {
    await syncAlerts();
  } catch (error) {
    if (retries > 0) {
      console.log(`Sync failed, retrying... (${retries} left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return syncAlertsWithRetry(retries - 1);
    }
    throw error;
  }
}

async function syncAlerts() {
  console.log('[SW] Background Sync: Starting synchronization...');
  
  // Note: For a production app, we would use a library or a shared utility 
  // to access IndexedDB here. This is a placeholder for the logic 
  // implemented in the frontend's OfflineSync component.
  
  // Broadcast to open tabs that sync is starting
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_STARTED' });
  });

  return Promise.resolve();
}
