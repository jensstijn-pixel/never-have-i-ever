/* Service worker — maakt de app offline speelbaar.
   Bump CACHE bij elke update zodat oude bestanden vervangen worden. */
var CACHE = "ihnn-v2";

var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data/questions.js",
  "./manifest.webmanifest",
  "./fonts/fonts.css",
  "./fonts/font-1.woff2",
  "./fonts/font-2.woff2",
  "./fonts/font-3.woff2",
  "./fonts/font-4.woff2",
  "./fonts/font-5.woff2",
  "./fonts/font-6.woff2",
  "./fonts/font-7.woff2",
  "./fonts/font-8.woff2",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        // Nieuwe same-origin bestanden ook cachen (runtime).
        try {
          if (res && res.status === 200 && e.request.url.indexOf(self.location.origin) === 0) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          }
        } catch (err) {}
        return res;
      }).catch(function () {
        // Offline en niet in cache: val terug op de app zelf voor navigaties.
        if (e.request.mode === "navigate") return caches.match("./index.html");
      });
    })
  );
});
