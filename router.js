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
    const parts = hash.replace(/^#\/+/, '').split('/').filter(Boolean);

    const route = parts[0] || 'home';
    const param = parts[1];

    await loadPage(route, param);

    // sempre vai pro topo
    window.scrollTo(0, 0);

    currentRoute = route;
}

/* =====================================================
   LOAD DE PÁGINA (SOMENTE HTML)
   ===================================================== */

async function loadPage(route, param) {
    const app = document.getElementById('app');

    if (cache[route]) {
        apply(cache[route], param);
        return;
    }

    const basePath = `./pages/${route}/index.html`;

    try {
        const html = await fetch(basePath).then(r => {
            if (!r.ok) throw new Error('not found');
            return r.text();
        });

        cache[route] = {html};
        apply(cache[route], param);

    } catch {
        // se não encontrou, carrega 404
        const html404 = await fetch(`./pages/404/index.html`).then(r => r.text());
        cache['404'] = {html: html404};
        apply(cache['404'], param);
    }
}

function apply(entry, param) {
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
