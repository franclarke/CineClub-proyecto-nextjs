self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    self.clients.claim();
});

self.addEventListener('push', function (event) {
    const data = event.data?.json() || {};
    const title = data.title || 'Notificación';
    const options = {
        body: data.body || '',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: data.url ? { url: data.url } : {},
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(
        clients.openWindow(url)
    );
});