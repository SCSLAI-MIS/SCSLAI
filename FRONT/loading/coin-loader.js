/* =========================================================================
   SCSLAI — COIN LOADER  (behaviour)
   -------------------------------------------------------------------------
   The one loading animation used everywhere the site has to wait:

     • building the fill-out form PDF        FORMS/engine.js
     • loading the fill-out form artwork     FORMS/engine.js
     • opening a SCSLAICares yearbook        script.js
     • swapping an announcement photo        script.js
     • opening an event album photo          script.js
     • downloading the welcome-popup banner  welcome-popup.js

   API — window.SCSLAILoader
   -------------------------------------------------------------------------
     show(options)                 full-screen overlay (scrim + coin + label)
                                   → handle { element, hide(), label(), visible() }
     hide(handle)                  hide a handle (or the last overlay)
     inline(target, options)       loader covering `target`; returns a handle
     image(img, options)           loader over an image's box, hides itself as
                                   soon as the picture has painted
     waitForImages(images, opts)   one loader until every image in the list is
                                   in (opts.box = the element it covers)
     busy(control, options)        disables a button and puts a tiny coin in it
     wrap(promise, options)        shows while the promise is pending

   Page load / navigation — linked from <head> on every page, this file also
   puts the coin on screen while the page itself is still loading (slow first
   paint, slow first byte after a link click, no internet connection) and takes
   it away again as soon as the DOM is ready. See bootPageLoader() below.

   Options: label, glyph ('$'), delay (250 ms), minVisible (320 ms),
            theme ('dark' | 'light'), size ('xs' | 'sm' | 'md' | 'lg'),
            zIndex, scrim, timeout, box.

   The loader only appears when a wait really takes longer than `delay`, so
   instant actions never flash a spinner.

   Styles: loading/coin-loader.css
   ========================================================================= */

(function () {
    'use strict';

    if (window.SCSLAILoader) { return; }

    var DEFAULTS = {
        label: 'Loading…',
        glyph: '$',
        delay: 250,          /* only appear when the wait is longer than this   */
        minVisible: 320,     /* once visible, stay long enough not to flicker   */
        theme: 'dark',
        size: 'md',
        zIndex: 120000,      /* above the form preview (100000)                 */
        scrim: true,
        timeout: 20000       /* image / document safety valve                   */
    };

    /* ---------------------------------------------------------------------
       Small helpers
       --------------------------------------------------------------------- */

    function settings(options) {
        var out = {};
        var key;

        for (key in DEFAULTS) {
            if (Object.prototype.hasOwnProperty.call(DEFAULTS, key)) {
                out[key] = DEFAULTS[key];
            }
        }

        if (options) {
            for (key in options) {
                if (Object.prototype.hasOwnProperty.call(options, key) &&
                    options[key] !== undefined && options[key] !== null) {
                    out[key] = options[key];
                }
            }
        }

        return out;
    }

    function escapeHTML(value) {
        return String(value === undefined || value === null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function now() {
        return (window.performance && window.performance.now)
            ? window.performance.now()
            : Date.now();
    }

    function listOf(value) {
        if (!value) { return []; }
        if (value.nodeType === 1) {
            return Array.prototype.slice.call(value.querySelectorAll('img'));
        }
        return Array.prototype.slice.call(value);
    }

    function coinHTML(glyph, tiny) {
        var face = escapeHTML(glyph);

        return '<span class="scslai-loader__coin' + (tiny ? ' scslai-loader__coin--tiny' : '') + '">' +
            '<span class="scslai-loader__face scslai-loader__face--front">' + face + '</span>' +
            '<span class="scslai-loader__face scslai-loader__face--back">' + face + '</span>' +
        '</span>';
    }

    function markup(options, extraClass) {
        var el = document.createElement('div');

        el.className = 'scslai-loader scslai-loader--' + options.theme +
            ' scslai-loader--' + options.size +
            (extraClass ? ' ' + extraClass : '');

        el.setAttribute('role', 'status');
        el.setAttribute('aria-live', 'polite');
        el.setAttribute('aria-busy', 'true');

        el.innerHTML = coinHTML(options.glyph, false) +
            '<span class="scslai-loader__label">' + escapeHTML(options.label) + '</span>';

        return el;
    }

    function emptyHandle() {
        return {
            element: null,
            visible: function () { return false; },
            label: function () { return this; },
            hide: function () { return this; }
        };
    }

    function setLabel(el, text) {
        var label = el ? el.querySelector('.scslai-loader__label') : null;
        if (label) { label.textContent = text === undefined || text === null ? '' : String(text); }
    }


    /* ---------------------------------------------------------------------
       Delayed reveal — a handle that only shows when the wait outlasts
       `options.delay`, and that lingers `options.minVisible` once shown.
       --------------------------------------------------------------------- */

    function revealHandle(el, options, onGone) {
        var revealTimer = 0;
        var hideTimer = 0;
        var visible = false;
        var shownAt = 0;
        var closed = false;

        function reveal() {
            revealTimer = 0;
            if (closed) { return; }
            visible = true;
            shownAt = now();
            el.classList.add('is-visible');
        }

        function gone() {
            el.classList.remove('is-visible');

            window.setTimeout(function () {
                if (el.parentNode) { el.parentNode.removeChild(el); }
                if (typeof onGone === 'function') { onGone(); }
            }, 220);
        }

        if (options.delay > 0) {
            revealTimer = window.setTimeout(reveal, options.delay);
        } else {
            reveal();
        }

        var handle = {
            element: el,
            visible: function () { return visible; },
            label: function (text) {
                setLabel(el, text);
                return handle;
            },
            hide: function () {
                if (closed) { return handle; }
                closed = true;

                if (revealTimer) { window.clearTimeout(revealTimer); revealTimer = 0; }
                if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = 0; }

                var wait = visible
                    ? Math.max(0, options.minVisible - (now() - shownAt))
                    : 0;

                if (wait > 0) {
                    hideTimer = window.setTimeout(gone, wait);
                } else {
                    gone();
                }

                return handle;
            }
        };

        return handle;
    }

    /* ---------------------------------------------------------------------
       Full-screen overlay — ref-counted, so nested waits share one scrim
       --------------------------------------------------------------------- */

    var overlay = {
        el: null,
        count: 0,
        visible: false,
        shownAt: 0,
        revealTimer: 0,
        hideTimer: 0,
        removeTimer: 0
    };

    function overlayDestroy() {
        if (!overlay.el) { return; }

        var el = overlay.el;

        overlay.visible = false;
        el.classList.remove('is-visible');

        overlay.removeTimer = window.setTimeout(function () {
            overlay.removeTimer = 0;
            if (el.parentNode) { el.parentNode.removeChild(el); }
            if (overlay.el === el) { overlay.el = null; }
        }, 220);
    }

    function overlayRelease(options) {
        overlay.count = Math.max(0, overlay.count - 1);
        if (overlay.count > 0) { return; }

        if (!overlay.visible) {
            if (overlay.revealTimer) {
                window.clearTimeout(overlay.revealTimer);
                overlay.revealTimer = 0;
            }
            overlayDestroy();
            return;
        }

        var wait = Math.max(0, options.minVisible - (now() - overlay.shownAt));

        overlay.hideTimer = window.setTimeout(function () {
            overlay.hideTimer = 0;
            overlayDestroy();
        }, wait);
    }

    function show(options) {
        var o = settings(options);

        /* A previous overlay may still be fading out — reuse it instead of
           stacking a second scrim on top. */
        if (overlay.removeTimer) {
            window.clearTimeout(overlay.removeTimer);
            overlay.removeTimer = 0;
        }

        if (!overlay.el) {
            overlay.el = markup(o, 'scslai-loader--overlay');
            document.body.appendChild(overlay.el);
        }

        overlay.el.style.setProperty('--scslai-loader-z', String(o.zIndex));
        overlay.el.classList.toggle('scslai-loader--bare', o.scrim === false);
        setLabel(overlay.el, o.label);

        overlay.count += 1;

        if (overlay.hideTimer) {
            window.clearTimeout(overlay.hideTimer);
            overlay.hideTimer = 0;
        }

        if (!overlay.visible && !overlay.revealTimer) {
            var reveal = function () {
                overlay.revealTimer = 0;
                if (!overlay.el) { return; }
                overlay.visible = true;
                overlay.shownAt = now();
                overlay.el.classList.add('is-visible');
            };

            if (o.delay > 0) {
                overlay.revealTimer = window.setTimeout(reveal, o.delay);
            } else {
                reveal();
            }
        }

        var closed = false;

        return {
            element: overlay.el,
            visible: function () { return overlay.visible; },
            label: function (text) {
                setLabel(overlay.el, text);
                return this;
            },
            hide: function () {
                if (closed) { return this; }
                closed = true;
                overlayRelease(o);
                return this;
            }
        };
    }

    /* ---------------------------------------------------------------------
       In-place loader — covers `target` (SCSLAILoader.inline)
       --------------------------------------------------------------------- */

    function placeFloating(el, host) {
        var rect = host.getBoundingClientRect();

        el.style.top = rect.top + 'px';
        el.style.left = rect.left + 'px';
        el.style.width = rect.width + 'px';
        el.style.height = rect.height + 'px';
    }

    function watchFloating(el, host) {
        var frame = 0;

        function update() {
            frame = 0;
            if (!el.parentNode) { return; }
            placeFloating(el, host);
        }

        function schedule() {
            if (frame) { return; }
            frame = window.requestAnimationFrame
                ? window.requestAnimationFrame(update)
                : window.setTimeout(update, 60);
        }

        window.addEventListener('resize', schedule);
        window.addEventListener('scroll', schedule, true);

        return function () {
            window.removeEventListener('resize', schedule);
            window.removeEventListener('scroll', schedule, true);
            if (frame && window.cancelAnimationFrame) { window.cancelAnimationFrame(frame); }
            frame = 0;
        };
    }

    function inline(target, options) {
        var o = settings(options);

        if (!target || !target.appendChild) { return emptyHandle(); }

        var el = markup(o, 'scslai-loader--inline');
        var floating = false;
        var stopWatching = null;

        /* A static host cannot anchor an absolutely positioned child without
           changing its layout (which could move its own absolute children), so
           fall back to a fixed box that simply follows the host's rect. */
        if (window.getComputedStyle(target).position === 'static') {
            floating = true;
            el.classList.add('scslai-loader--floating');
        }

        target.appendChild(el);

        if (floating) {
            placeFloating(el, target);
            stopWatching = watchFloating(el, target);
        }

        return revealHandle(el, o, function () {
            if (stopWatching) { stopWatching(); }
        });
    }

    /* ---------------------------------------------------------------------
       Image wait — SCSLAILoader.image(img, options)
       Covers the picture (or options.box) and takes itself away the moment
       the picture has painted, errored or timed out.
       --------------------------------------------------------------------- */

    function image(img, options) {
        var o = settings(options);

        if (!img || !img.addEventListener) { return emptyHandle(); }

        var host = o.box || img.parentElement || document.body;
        var handle = inline(host, o);
        var settled = false;
        var timer = 0;

        function done() {
            if (settled) { return; }
            settled = true;

            if (timer) { window.clearTimeout(timer); timer = 0; }

            img.removeEventListener('load', done);
            img.removeEventListener('error', done);

            handle.hide();
        }

        img.addEventListener('load', done);
        img.addEventListener('error', done);

        timer = window.setTimeout(done, o.timeout);

        /* Already painted (cached file): never show a spinner for it. */
        if (img.complete && img.naturalWidth > 0) { done(); }

        return {
            element: handle.element,
            visible: handle.visible,
            label: function (text) { handle.label(text); return this; },
            hide: done
        };
    }

    /* ---------------------------------------------------------------------
       SCSLAILoader.waitForImages(images, options)
       One loader for a whole batch: `images` is a list of <img> elements or a
       container to scan, `options.box` the element the loader covers.
       --------------------------------------------------------------------- */

    function waitForImages(images, options) {
        var o = settings(options);
        var list = listOf(images);

        if (!list.length) { return emptyHandle(); }

        var host = o.box || list[0].parentElement || document.body;
        var handle = inline(host, o);
        var remaining = list.length;
        var settled = false;
        var timer = 0;

        function finish() {
            if (settled) { return; }
            settled = true;

            if (timer) { window.clearTimeout(timer); timer = 0; }

            list.forEach(function (img) {
                img.removeEventListener('load', one);
                img.removeEventListener('error', one);
            });

            handle.hide();
        }

        function one() {
            remaining -= 1;
            if (remaining <= 0) { finish(); }
        }

        list.forEach(function (img) {
            /* Listen first: an image can finish between the check and the
               listener, which would leave the loader up until the timeout. */
            img.addEventListener('load', one);
            img.addEventListener('error', one);

            if (img.complete && img.naturalWidth > 0) {
                remaining -= 1;
                return;
            }
        });

        timer = window.setTimeout(finish, o.timeout);

        if (remaining <= 0) { finish(); }

        return {
            element: handle.element,
            visible: handle.visible,
            label: function (text) { handle.label(text); return this; },
            hide: finish
        };
    }


    /* ---------------------------------------------------------------------
       Busy control — SCSLAILoader.busy(button, options)
       The control is disabled and shows a tiny coin + label while it works.
       --------------------------------------------------------------------- */

    function busy(control, options) {
        var o = settings(options);

        if (!control || !control.classList) { return emptyHandle(); }

        var original = control.innerHTML;
        var hadDisabled = 'disabled' in control;
        var wasDisabled = hadDisabled ? control.disabled : false;
        var closed = false;

        control.classList.add('scslai-loader-busy');
        control.setAttribute('aria-busy', 'true');
        if (hadDisabled) { control.disabled = true; }

        control.innerHTML = coinHTML(o.glyph, true) +
            '<span class="scslai-loader__busy-label">' + escapeHTML(o.label) + '</span>';

        return {
            element: control,
            visible: function () { return !closed; },
            label: function (text) {
                var label = control.querySelector('.scslai-loader__busy-label');
                if (label) { label.textContent = text === undefined || text === null ? '' : String(text); }
                return this;
            },
            hide: function () {
                if (closed) { return this; }
                closed = true;

                control.innerHTML = original;
                control.classList.remove('scslai-loader-busy');
                control.removeAttribute('aria-busy');
                if (hadDisabled) { control.disabled = wasDisabled; }

                return this;
            }
        };
    }

    /* ---------------------------------------------------------------------
       SCSLAILoader.wrap(promise, options)
       Shows the overlay for as long as the promise is pending — an instantly
       resolved promise never flashes anything.
       --------------------------------------------------------------------- */

    function wrap(promise, options) {
        var handle = show(options);
        var pending = (typeof promise === 'function') ? promise() : promise;

        return Promise.resolve(pending).then(
            function (value) {
                handle.hide();
                return value;
            },
            function (error) {
                handle.hide();
                throw error;
            }
        );
    }

    /* ---------------------------------------------------------------------
       PAGE-LOAD / NAVIGATION LOADER
       coin-loader.js is linked from <head> on every page, so this runs while
       the rest of the document is still coming down the wire: the coin is on
       screen during a slow first paint and during a slow first byte after a
       link is clicked. It only appears when the wait is real, and it steps
       aside as soon as the DOM is ready — the per-feature loaders (form PDF,
       album photos, yearbook pages, …) take over from there.
       --------------------------------------------------------------------- */

    var BOOT_DELAY = 400;        /* ms of loading before the coin appears    */
    var BOOT_MIN_VISIBLE = 300;  /* ms it stays once it is on screen         */
    var BOOT_LIMIT = 15000;      /* safety valve for a stalled page          */
    var NAV_DELAY = 200;         /* link click → coin (slow first byte)      */
    var NAV_LIMIT = 6000;        /* give up if the navigation never happens  */
    var BOOT_Z = 130000;         /* above every other layer on the site      */

    var pageWaitHandle = null;
    var pageWaitLimit = 0;
    var bootSettled = false;

    function connectionLabel() {
        try {
            if (navigator.onLine === false) {
                return 'No internet connection — waiting for the network\u2026';
            }
        } catch (err) { /* no navigator.onLine: assume the network is there */ }

        return 'Loading\u2026';
    }

    function pageWaitStop() {
        if (pageWaitLimit) {
            window.clearTimeout(pageWaitLimit);
            pageWaitLimit = 0;
        }

        var handle = pageWaitHandle;
        pageWaitHandle = null;

        if (handle) { handle.hide(); }
    }

    function pageWaitShow(delay, label, limit) {
        var host = document.body || document.documentElement;
        if (!host) { return; }

        if (pageWaitHandle) {
            pageWaitHandle.label(label);
        } else {
            var o = settings({
                label: label,
                delay: delay,
                minVisible: BOOT_MIN_VISIBLE,
                size: 'lg',
                zIndex: BOOT_Z
            });

            var el = markup(o, 'scslai-loader--overlay scslai-loader--boot');

            el.style.setProperty('--scslai-loader-z', String(o.zIndex));

            host.appendChild(el);

            pageWaitHandle = revealHandle(el, o, function () { pageWaitHandle = null; });
        }

        if (pageWaitLimit) { window.clearTimeout(pageWaitLimit); }
        pageWaitLimit = window.setTimeout(pageWaitStop, limit);
    }

    /* Only real, same-tab, same-origin page loads: everything the site handles
       in JavaScript (the calculator and the fill-out links) is skipped. */
    function isPageNavigation(event) {
        if (event.defaultPrevented) { return false; }
        if (event.button !== 0) { return false; }
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { return false; }

        var link = event.target && event.target.closest
            ? event.target.closest('a[href]')
            : null;

        if (!link) { return false; }
        if (link.target && link.target !== '_self') { return false; }
        if (link.hasAttribute('download')) { return false; }
        if (link.getAttribute('rel') === 'external') { return false; }
        /* Dialogs dressed as links (the calculator, …). */
        if (link.getAttribute('role') === 'button' || link.hasAttribute('aria-haspopup')) { return false; }

        var href = link.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#') { return false; }
        if (/^(mailto:|tel:|javascript:|blob:|data:)/i.test(href)) { return false; }

        var url;
        try {
            url = new URL(link.href, window.location.href);
        } catch (err) {
            return false;
        }

        if (url.origin !== window.location.origin) { return false; }
        if (url.pathname === window.location.pathname) { return false; }

        return true;
    }

    /* Chrome/Edge report the first contentful paint. Releasing the coin there —
       instead of waiting for every blocking script — is what keeps the site
       feeling quick on a phone, where DOMContentLoaded can be seconds away. */
    function onFirstPaint(callback) {
        if (!window.PerformanceObserver) { return false; }

        try {
            var observer = new PerformanceObserver(function (list) {
                var entries = list.getEntries();

                for (var i = 0; i < entries.length; i++) {
                    if (entries[i].name === 'first-contentful-paint') {
                        observer.disconnect();
                        callback();
                        return;
                    }
                }
            });

            observer.observe({ type: 'paint', buffered: true });
            return true;
        } catch (err) {
            return false;
        }
    }

    function bootPageLoader() {
        if (bootSettled || document.readyState === 'complete') { return; }

        function settle() {
            if (bootSettled) { return; }
            bootSettled = true;
            pageWaitStop();
        }

        function refreshLabel() {
            if (pageWaitHandle) { pageWaitHandle.label(connectionLabel()); }
        }

        pageWaitShow(BOOT_DELAY, connectionLabel(), BOOT_LIMIT);

        /* The coin only has to cover the blank screen: the moment the page
           paints something it steps aside, even if scripts are still coming. */
        onFirstPaint(settle);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                /* One frame, so the first paint lands behind the coin. */
                window.requestAnimationFrame(function () {
                    window.setTimeout(settle, 60);
                });
            }, { once: true });
        } else {
            window.setTimeout(settle, 60);
        }

        window.addEventListener('load', settle, { once: true });
        window.addEventListener('pageshow', function (event) {
            if (event.persisted) { settle(); }
        });

        window.addEventListener('online', refreshLabel);
        window.addEventListener('offline', refreshLabel);

        document.addEventListener('click', function (event) {
            if (!isPageNavigation(event)) { return; }
            pageWaitShow(NAV_DELAY, connectionLabel(), NAV_LIMIT);
        }, false);
    }

    /* ---------------------------------------------------------------------
       PUBLIC API
       --------------------------------------------------------------------- */

    window.SCSLAILoader = {
        show: show,
        inline: inline,
        image: image,
        waitForImages: waitForImages,
        busy: busy,
        wrap: wrap,
        hide: function (handle) {
            if (handle && typeof handle.hide === 'function') {
                handle.hide();
                return;
            }
            if (overlay.count > 0) { overlayRelease(DEFAULTS); }
        }
    };

    /* Linked from <head> on every page: the page-load coin has to be on screen
       while the rest of the document is still being parsed. Loading this file
       from the bottom of <body> instead skips the boot loader and only uses the
       API above. */
    if (!document.body) { bootPageLoader(); }
})();

