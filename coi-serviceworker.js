/*! coi-serviceworker v0.1.7 - MIT License | Built on top of work by Guido Zuidhof */
if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", (e) => {
        if (e.request.cache === "only-if-cached" && e.request.mode !== "same-origin") {
            return;
        }

        e.respondWith(
            fetch(e.request)
                .then((response) => {
                    if (response.status === 0) {
                        return response;
                    }

                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
                    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((err) => console.error(err))
        );
    });
} else {
    (() => {
        const reloadedKey = "coi-reloaded";
        const isIsolated = window.crossOriginIsolated;
        
        if (!isIsolated && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register(window.document.currentScript.src)
                .then((reg) => {
                    reg.addEventListener("updatefound", () => {
                        window.sessionStorage.setItem(reloadedKey, "true");
                        window.location.reload();
                    });

                    if (reg.active && !navigator.serviceWorker.controller) {
                        window.sessionStorage.setItem(reloadedKey, "true");
                        window.location.reload();
                    }
                });
        }
    })();
}
