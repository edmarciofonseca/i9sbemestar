/* =====================================================
   CACHE DE PÁGINA (HASH ROUTER)
   ===================================================== */

const cache = {};
let currentRoute = null;

/* =====================================================
   ROUTER
   ===================================================== */

async function router() {
    const app = document.getElementById('app');
    if (!app) return;

    const hash = location.hash || '#/home';

    // remove "#/" e quebra em partes
    const parts = hash
        .replace(/^#\/+/, '')
        .split('/')
        .filter(Boolean);

    // permite infinitas subpastas
    const routePath = parts.length ? parts.join('/') : 'home';

    await loadPage(routePath);

    // sempre vai pro topo
    window.scrollTo(0, 0);

    currentRoute = routePath;
}

/* =====================================================
   LOAD DE PÁGINA (SOMENTE HTML)
   ===================================================== */

async function loadPage(routePath) {
    const app = document.getElementById('app');
    if (!app) return;

    // cache por caminho completo
    if (cache[routePath]) {
        apply(cache[routePath]);
        return;
    }

    const basePath = `./pages/${routePath}/index.html`;

    try {
        const response = await fetch(basePath);
        if (!response.ok) throw new Error('not found');

        const html = await response.text();

        cache[routePath] = {html};
        apply(cache[routePath]);

    } catch {
        // fallback 404
        if (!cache['404']) {
            const html404 = await fetch('./pages/404/index.html').then(r => r.text());
            cache['404'] = {html: html404};
        }
        apply(cache['404']);
    }
}

/* =====================================================
   APPLY HTML
   ===================================================== */

function apply(entry) {
    const app = document.getElementById('app');
    app.innerHTML = entry.html;
}

/* =====================================================
   INIT
   ===================================================== */

window.addEventListener('hashchange', router);

window.addEventListener('DOMContentLoaded', () => {
    if (!location.hash) {
        location.hash = '#/home';
    } else {
        router();
    }
});
