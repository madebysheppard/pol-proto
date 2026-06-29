const SW_VERSION = "ut-proto-sw-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/*
 * Keep network behavior unchanged while satisfying installability checks.
 * We intentionally do not cache yet to avoid stale prototype assets.
 */
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

self.addEventListener("message", (event) => {
  if (event.data === "SW_VERSION") {
    event.source?.postMessage({ type: "SW_VERSION", value: SW_VERSION });
  }
});
