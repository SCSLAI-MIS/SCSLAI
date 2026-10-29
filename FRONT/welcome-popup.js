/* =========================================================================
   SCSLAI — WELCOME POPUP  (behaviour)
   -------------------------------------------------------------------------
   Shows the "A new way to connect with us" banner once, before the visitor
   starts using the site.

   Closing it:  the × button, a click on the dark area around the banner,
                the ESC key, or a click on the banner itself.

   Settings ........ CONFIG below
   Colours / sizes . welcome-popup.css
   Artwork ......... images/welcome/welcome-banner.webp (+ .jpg fallback)

   Testing: add ?welcome=1 to the URL to force it open (ignores the "already
            seen" memory) or ?welcome=0 to switch it off for that visit.
   ========================================================================= */

(function () {
    'use strict';

    if (window.__SCSLAI_WELCOME_INIT__) { return; }
    window.__SCSLAI_WELCOME_INIT__ = true;

    /* Never render inside another iframe (prevents nested popups). */
    try {
        if (window.top !== window.self) { return; }
    } catch (err) {
        return;
    }

    /* ------------------------------------------------------------------
       SETTINGS
       ------------------------------------------------------------------ */

    var CONFIG = {
        imageWebp: 'images/welcome/welcome-banner.webp',
        imageFallback: 'images/welcome/welcome-banner.jpg',
        imageWidth: 1671,
        imageHeight: 941,
        alt: 'Welcome to SCSLAI — a new way to connect with us. Explore our ' +
             'online services: information and updates, services online, loan ' +
             'checking and application forms. Together, we grow.',
        /* 'session' = once per browser session (default)
           'local'   = once per browser, ever
           'none'    = every time the home page is opened */
        remember: 'session',
        delay: 350      /* ms after the banner picture is ready to show */
    };

    var STORAGE_KEY = 'scslai-welcome-dismissed';
    var RATIO = CONFIG.imageWidth / CONFIG.imageHeight;
    var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2.6" stroke-linecap="round" aria-hidden="true" focusable="false">' +
        '<path d="M6 6l12 12M18 6L6 18"/></svg>';

    /* Captured while this file executes: lets the artwork be found next to
       this script, so the popup also works from /reports/ and other folders. */
    var SELF_SRC = '';
    try {
        SELF_SRC = (document.currentScript && document.currentScript.src) || '';
    } catch (err) {
        SELF_SRC = '';
    }

    var modal = null;
    var picture = null;
    var closeButton = null;
    var lastFocus = null;
    var scrollLock = null;
    var closing = false;
    var shown = false;

    /* ------------------------------------------------------------------
       Small helpers
       ------------------------------------------------------------------ */

    function assetUrl(path) {
        if (!SELF_SRC) { return path; }
        var base = SELF_SRC.replace(/[?#].*$/, '').replace(/[^/]*$/, '');
        return base + path;
    }

    /* ?welcome=1 forces the popup, ?welcome=0 hides it, no value = null. */
    function queryFlag(name) {
        try {
            var value = new URLSearchParams(window.location.search).get(name);
            if (value === null) { return null; }
            return !(value === '0' || value === 'false' || value === 'off');
        } catch (err) {
            return null;
        }
    }

    function storageArea() {
        try {
            if (CONFIG.remember === 'local') { return window.localStorage; }
            if (CONFIG.remember === 'session') { return window.sessionStorage; }
        } catch (err) { /* storage can be blocked — treat as "never seen" */ }
        return null;
    }

    function isDismissed() {
        var area = storageArea();
        if (!area) { return false; }
        try { return area.getItem(STORAGE_KEY) === '1'; } catch (err) { return false; }
    }

    function rememberDismissal() {
        var area = storageArea();
        if (!area) { return; }
        try { area.setItem(STORAGE_KEY, '1'); } catch (err) { /* ignore */ }
    }

    function reducedMotion() {
        try {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (err) {
            return false;
        }
    }

    /* ------------------------------------------------------------------
       Markup
       ------------------------------------------------------------------ */

    function build() {
        modal = document.createElement('div');
        modal.id = 'scslai-welcome';
        modal.className = 'scslai-welcome';
        modal.hidden = true;
        /* Keeps the card's shape in sync with the artwork (see the CSS). */
        modal.style.setProperty('--scslai-welcome-ratio', String(RATIO));

        modal.innerHTML =
            '<div class="scslai-welcome__backdrop" data-scslai-welcome-close="true"></div>' +
            '<div class="scslai-welcome__card" role="dialog" aria-modal="true" ' +
                'aria-label="Welcome to the SCSLAI website">' +
                '<button type="button" class="scslai-welcome__close" ' +
                    'aria-label="Close the welcome message">' + ICON_CLOSE + '</button>' +
                '<picture>' +
                    '<source srcset="' + assetUrl(CONFIG.imageWebp) + '" type="image/webp">' +
                    '<img class="scslai-welcome__image" draggable="false" ' +
                        'data-scslai-welcome-close="true" ' +
                        'src="' + assetUrl(CONFIG.imageFallback) + '" ' +
                        'width="' + CONFIG.imageWidth + '" height="' + CONFIG.imageHeight + '" ' +
                        'alt="' + CONFIG.alt.replace(/"/g, '&quot;') + '">' +
                '</picture>' +
            '</div>';

        picture = modal.querySelector('picture');
        closeButton = modal.querySelector('.scslai-welcome__close');

        closeButton.addEventListener('click', function () { close(true); });
        modal.addEventListener('click', handleClick);

        return modal;
    }

    /* Any element marked data-scslai-welcome-close closes the popup: the dark
       area around the banner and the banner artwork itself. */
    function handleClick(event) {
        var el = event.target;
        if (!el || !el.closest) { return; }
        if (el.closest('[data-scslai-welcome-close]')) { close(true); }
    }

    /* ------------------------------------------------------------------
       Wait for the artwork, then reveal
       ------------------------------------------------------------------ */

    function whenPictureReady(done) {
        var img = picture ? picture.querySelector('img') : null;
        var settled = false;

        function finish(ok) {
            if (settled) { return; }
            settled = true;
            done(ok);
        }

        if (!img) { finish(false); return; }
        if (img.complete && img.naturalWidth > 0) { finish(true); return; }

        img.addEventListener('load', function () { finish(true); });
        /* A missing picture is no reason to block the site — just skip it. */
        img.addEventListener('error', function () { finish(false); });
        /* Slow connection: show the card anyway, the picture fills in. */
        setTimeout(function () { finish(true); }, 5000);
    }

    /* ------------------------------------------------------------------
       Open / close
       ------------------------------------------------------------------ */

    function show() {
        if (!modal || shown || closing) { return; }
        shown = true;

        if (!document.body.contains(modal)) { document.body.appendChild(modal); }

        lastFocus = document.activeElement;
        modal.hidden = false;
        lockScroll(true);

        /* Two frames so the browser paints the start state first and the
           entrance transition actually runs. */
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                if (modal && !modal.hidden) { modal.classList.add('is-visible'); }
            });
        });

        if (closeButton && closeButton.focus) {
            try { closeButton.focus(); } catch (err) {}
        }

        document.addEventListener('keydown', handleKeydown, true);
    }

    function close(returnFocus) {
        if (!modal || modal.hidden || closing) { return; }
        closing = true;
        shown = false;

        /* Once dismissed it stays out of the way for this visit. */
        rememberDismissal();

        modal.classList.remove('is-visible');
        document.removeEventListener('keydown', handleKeydown, true);

        var wait = reducedMotion() ? 0 : 260;

        setTimeout(function () {
            if (modal) { modal.hidden = true; }
            lockScroll(false);
            closing = false;
        }, wait);

        if (returnFocus !== false) {
            var target = (lastFocus && lastFocus !== document.body && document.body.contains(lastFocus))
                ? lastFocus
                : null;
            if (target && target.focus) {
                try { target.focus(); } catch (err) {}
            }
        }

        lastFocus = null;
    }

    function handleKeydown(event) {
        if (!modal || modal.hidden) { return; }

        if (event.key === 'Escape' || event.key === 'Esc') {
            event.preventDefault();
            event.stopPropagation();
            close(true);
            return;
        }

        if (event.key !== 'Tab') { return; }

        /* Keep the keyboard inside the popup while it is open. */
        var focusables = modal.querySelectorAll('button:not([disabled]), a[href]');
        if (!focusables.length) { return; }

        var first = focusables[0];
        var last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    /* ------------------------------------------------------------------
       Page scroll lock (only while the popup is open)
       ------------------------------------------------------------------ */

    function lockScroll(lock) {
        var html = document.documentElement;
        var body = document.body;

        if (lock) {
            if (scrollLock) { return; }

            /* Compensate the scrollbar so the page behind does not jump. */
            var gap = Math.max(0, window.innerWidth - html.clientWidth);
            scrollLock = { paddingRight: body.style.paddingRight };

            body.classList.add('scslai-welcome-open');
            if (gap > 0) { body.style.paddingRight = gap + 'px'; }
            return;
        }

        if (!scrollLock) { return; }

        body.classList.remove('scslai-welcome-open');
        body.style.paddingRight = scrollLock.paddingRight;
        scrollLock = null;
    }

    /* ------------------------------------------------------------------
       Start
       ------------------------------------------------------------------ */

    function boot() {
        var forced = queryFlag('welcome');

        if (forced === false) { return; }
        if (forced !== true && isDismissed()) { return; }

        build();

        /* Attached while still hidden so the artwork starts downloading right
           away; the popup is revealed once the picture is ready. */
        document.body.appendChild(modal);

        whenPictureReady(function (ready) {
            if (!ready) { return; }
            setTimeout(show, CONFIG.delay);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
