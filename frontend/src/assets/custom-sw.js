self.addEventListener('install', event => {
  console.log(JSON.stringify(event))
  console.log('Service Worker installing.');
});

self.addEventListener('fetch', event => {
  console.log(JSON.stringify(event))
  event.respondWith(fetch(event.request));});

self.addEventListener('push', event => {
  console.log(JSON.stringify(event))
  console.log('Service Worker push.');
});

self.addEventListener('message', event => {
  console.log(JSON.stringify(event))
  console.log('Service Worker message.');
});
