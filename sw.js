/*
  Service worker: lets the app be installed and keeps it working without a connection.

  - Page, scripts, styles and perk data: always try the network first so daily perk updates
    show up, and fall back to the saved copy when offline.
  - Perk icons: served from the saved copy once seen (they rarely change), fetched otherwise.
*/
const CACHE = "perk-randomiser-v3";
const CORE = [
  "./",
  "styles.css",
  "app.js",
  "data/survivor-perks.js",
  "data/killer-perks.js",
  "data/descriptions.js",
  "data/challenges.js",
  "data/challenge-icons.js",
  "manifest.json",
  "app-icons/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n.startsWith("perk-randomiser-") && n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await fetch(request);
    // saved without the "?v=..." part, so each file is kept once however it was asked for
    if (fresh.ok) cache.put(request.url.split("?")[0], fresh.clone());
    return fresh;
  } catch (error) {
    // offline: the same file saved earlier, whatever version tag or cache-buster it was asked with
    const saved = await cache.match(request, { ignoreSearch: true });
    if (saved) return saved;
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const saved = await cache.match(request);
  if (saved) return saved;
  const fresh = await fetch(request);
  if (fresh.ok) cache.put(request, fresh.clone());
  return fresh;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return; // e.g. GitHub API calls
  const isPerkIcon = url.pathname.includes("/icons/") || url.pathname.includes("/portraits/");
  event.respondWith(isPerkIcon ? cacheFirst(request) : networkFirst(request));
});
