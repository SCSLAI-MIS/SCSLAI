/* =========================================================================
   SCSLAI — FLOATING FACEBOOK LIVE WINDOW  (behaviour)
   -------------------------------------------------------------------------
   You do NOT need to edit this file.
     • Video link + date/time range .. facebook-live-config.js
     • Colours / sizes ............... facebook-live.css
   ========================================================================= */

(function () {
    'use strict';

    if (window.__SCSLAI_FB_LIVE_INIT__) { return; }
    window.__SCSLAI_FB_LIVE_INIT__ = true;

    /* Never render inside another iframe (prevents nested widgets). */
    try {
        if (window.top !== window.self) { return; }
    } catch (err) {
        return;
    }

    /* Captured while this file executes: used to find facebook-live-config.js
       next to this script (works for the site root and for /reports/). */
    var SELF_SRC = '';
    try {
        SELF_SRC = (document.currentScript && document.currentScript.src) || '';
    } catch (err) {
        SELF_SRC = '';
    }

    var DEFAULTS = {
        enabled: true,
        liveUrl: '',
        startDateTime: '',
        endDateTime: '',
        title: 'SCSLAI Live',
        previewWidth: 320,
        autoplayPreview: true,
        dismissForSession: true
    };

    var DISMISS_KEY = 'scslai-fb-live-dismissed';
    var PLUGIN_ENDPOINT = 'https://www.facebook.com/plugins/video.php';

    var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    var ICON_EXPAND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"/></svg>';
    var ICON_EXTERNAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>';

    var cfg = {};
    var liveUrl = '';
    var startDate = null;
    var endDate = null;
    var forceShow = false;
    var forceHide = false;

    var widget = null;
    var mediaEl = null;
    var previewFrame = null;
    var previewBuiltWidth = 0;
    var modal = null;
    var modalFrameHost = null;
    var modalFrame = null;
    var lastFocus = null;
    var resizeTimer = null;
    var tickTimer = null;
    var scrollLock = null;
    var previewNotice = null;
    var embeddable = true;
    var provider = 'other';
    var youtubeVideoId = '';

    /* ------------------------------------------------------------------
       Configuration helpers
       ------------------------------------------------------------------ */

    function trim(value) {
        return typeof value === 'string' ? value.trim() : '';
    }

    function parseDate(value) {
        var text = trim(value);
        if (!text) { return null; }
        var date = new Date(text);
        return isNaN(date.getTime()) ? null : date;
    }

    /* Works out which player the configured link needs.
       YouTube watch/live/shorts links and canonical Facebook video links can
       be embedded; Facebook /share/ + fb.watch short links cannot, and any
       other website can't be framed — those get a friendly fallback. */
    function extractYouTubeId(url) {
        var match = String(url).match(
            /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/
        );
        return match ? match[1] : '';
    }

    function resolveVideoSource(url) {
        var text = String(url);
        var lower = text.toLowerCase();

        var ytId = extractYouTubeId(text);
        if (ytId) {
            provider = 'youtube';
            youtubeVideoId = ytId;
            return true;
        }

        var isFacebook = /^https?:\/\/([a-z0-9-]+\.)*facebook\.com\//.test(lower) ||
            /^https?:\/\/fb\.watch\//.test(lower);

        if (isFacebook) {
            provider = 'facebook';
            var isShortLink = /\/share\//.test(lower) || /(^|\.)fb\.watch\//.test(lower);
            return !isShortLink;
        }

        provider = 'other';
        return false;
    }

    function providerLabel() {
        if (provider === 'youtube') { return 'YouTube'; }
        if (provider === 'facebook') { return 'Facebook'; }
        return '';
    }

    function watchLabel() {
        var label = providerLabel();
        return label ? ('Watch on ' + label) : 'Open video link';
    }

    function buildPreviewNotice() {
        var notice = document.createElement('div');
        notice.className = 'scslai-fb-live__notice';

        var title = document.createElement('strong');
        title.textContent = 'This video can\u2019t be embedded';

        var text = document.createElement('span');
        text.textContent = 'Open it on ' + (providerLabel() || 'the original site') + '.';

        notice.appendChild(title);
        notice.appendChild(text);
        return notice;
    }

    function fillModalNotice() {
        modalFrameHost.innerHTML = '';
        modalFrame = null;

        var notice = document.createElement('div');
        notice.className = 'scslai-fb-live-modal__notice';

        var title = document.createElement('strong');
        title.textContent = 'Watch this video on ' + (providerLabel() || 'the original site');

        var text = document.createElement('span');
        text.textContent = provider === 'facebook'
            ? 'Facebook does not allow this link to play inside other websites.'
            : 'This link cannot be played inside other websites.';

        var cta = document.createElement('a');
        cta.className = 'scslai-fb-live-modal__cta';
        cta.href = liveUrl;
        cta.target = '_blank';
        cta.rel = 'noopener noreferrer';
        cta.innerHTML = watchLabel() + ICON_EXTERNAL;

        notice.appendChild(title);
        notice.appendChild(text);
        notice.appendChild(cta);
        modalFrameHost.appendChild(notice);
    }

    function readQueryFlag() {
        var value = '';
        try {
            value = (new URLSearchParams(window.location.search).get('fblive') || '').toLowerCase();
        } catch (err) {
            value = '';
        }
        forceShow = ['1', 'on', 'yes', 'show', 'preview', 'true'].indexOf(value) !== -1;
        forceHide = ['0', 'off', 'no', 'hide', 'false'].indexOf(value) !== -1;
    }

    function resolveConfig() {
        var userConfig = window.SCSLAI_FACEBOOK_LIVE || {};

        Object.keys(DEFAULTS).forEach(function (key) {
            var value = userConfig[key];
            cfg[key] = (value === undefined || value === null) ? DEFAULTS[key] : value;
        });

        liveUrl = trim(cfg.liveUrl);
        startDate = parseDate(cfg.startDateTime);
        endDate = parseDate(cfg.endDateTime);

        embeddable = resolveVideoSource(liveUrl);
        if (liveUrl && !embeddable) {
            console.warn('[Live video] This link cannot be embedded: ' + liveUrl +
                '\nUse a YouTube link (https://www.youtube.com/watch?v=...) or a Facebook video link ' +
                '(https://www.facebook.com/<page>/videos/<number>/) instead of a /share/ or fb.watch short link.');
        }

        if (trim(cfg.startDateTime) && !startDate) {
            console.warn('[Facebook Live] startDateTime is not a valid date:', cfg.startDateTime);
        }
        if (trim(cfg.endDateTime) && !endDate) {
            console.warn('[Facebook Live] endDateTime is not a valid date:', cfg.endDateTime);
        }
    }

    function inSchedule(now) {
        if (!startDate && !endDate) { return true; }
        if (startDate && now.getTime() < startDate.getTime()) { return false; }
        if (endDate && now.getTime() > endDate.getTime()) { return false; }
        return true;
    }

    function dismissalKey() {
        return liveUrl + '|' + trim(cfg.startDateTime) + '|' + trim(cfg.endDateTime);
    }

    function isDismissed() {
        if (!cfg.dismissForSession) { return false; }
        try {
            return window.sessionStorage.getItem(DISMISS_KEY) === dismissalKey();
        } catch (err) {
            return false;
        }
    }

    function rememberDismissal() {
        if (!cfg.dismissForSession) { return; }
        try {
            window.sessionStorage.setItem(DISMISS_KEY, dismissalKey());
        } catch (err) { /* storage can be blocked — ignore */ }
    }

    function shouldShow() {
        if (forceHide) { return false; }
        if (cfg.enabled === false) { return false; }
        if (!liveUrl) { return false; }
        if (forceShow) { return true; }
        if (isDismissed()) { return false; }
        return inSchedule(new Date());
    }

    /* ------------------------------------------------------------------
       Embedded player (YouTube or Facebook)
       ------------------------------------------------------------------ */

    function frameSrc(width, height, autoplay, muted) {
        if (provider === 'youtube') {
            var params =
                'autoplay=' + (autoplay ? '1' : '0') +
                '&mute=' + (muted ? '1' : '0') +
                '&playsinline=1&rel=0';

            /* YouTube refuses to play with "Error 153 / Video player
               configuration error" when the embed request carries no Referer.
               Passing our own origin lets the player validate the embed even
               on hosts that strip the Referer (VS Code dev tunnels, strict
               Referrer-Policy headers). file:// has no usable origin. */
            try {
                if (/^https?:$/.test(window.location.protocol)) {
                    params += '&origin=' + encodeURIComponent(window.location.origin);
                }
            } catch (err) {}

            return 'https://www.youtube.com/embed/' + youtubeVideoId + '?' + params;
        }

        return PLUGIN_ENDPOINT +
            '?href=' + encodeURIComponent(liveUrl) +
            '&show_text=false' +
            '&width=' + Math.max(220, Math.round(width)) +
            '&height=' + Math.max(140, Math.round(height)) +
            '&autoplay=' + (autoplay ? 'true' : 'false') +
            '&allowfullscreen=true';
    }

    function createFrame(width, height, autoplay, title, fadeIn, muted) {
        var frame = document.createElement('iframe');
        frame.className = 'scslai-fb-live__iframe';
        frame.src = frameSrc(width, height, autoplay, muted);
        frame.setAttribute('width', String(Math.round(width)));
        frame.setAttribute('height', String(Math.round(height)));
        frame.setAttribute('frameborder', '0');
        frame.setAttribute('scrolling', 'no');
        frame.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share');
        frame.setAttribute('allowfullscreen', 'true');
        /* Force a Referer on the embed request. Hosts that send
           "Referrer-Policy: no-referrer" (e.g. dev tunnels) break YouTube
           embeds with Error 153; an iframe-level policy overrides the page. */
        frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        frame.title = title || cfg.title;

        if (fadeIn) {
            frame.addEventListener('load', function () {
                frame.classList.add('is-ready');
            });
        } else {
            frame.classList.add('is-ready');
        }

        return frame;
    }

    /* ------------------------------------------------------------------
       Small floating preview
       ------------------------------------------------------------------ */

    function buildWidget() {
        var aside = document.createElement('aside');
        aside.id = 'scslai-fb-live';
        aside.className = 'scslai-fb-live';
        aside.setAttribute('role', 'complementary');
        aside.setAttribute('aria-label', cfg.title + ' preview');

        var configuredWidth = parseInt(cfg.previewWidth, 10);
        if (configuredWidth > 0) {
            aside.style.setProperty('--scslai-fb-live-width', configuredWidth + 'px');
        }

        aside.innerHTML =
            '<div class="scslai-fb-live__card">' +
                '<div class="scslai-fb-live__media">' +
                    '<div class="scslai-fb-live__placeholder" aria-hidden="true">' +
                        '<span class="scslai-fb-live__spinner"></span>' +
                        '<span>Connecting to live video\u2026</span>' +
                    '</div>' +
                    '<button type="button" class="scslai-fb-live__open" aria-label="Open the live video in a larger window">' +
                        '<span class="scslai-fb-live__hint">' + ICON_EXPAND + '<span>Watch larger</span></span>' +
                    '</button>' +
                    '<span class="scslai-fb-live__badge"><span class="scslai-fb-live__dot"></span>Live</span>' +
                    '<button type="button" class="scslai-fb-live__close" aria-label="Hide the live video" title="Hide">' +
                        ICON_CLOSE +
                    '</button>' +
                '</div>' +
            '</div>';

        mediaEl = aside.querySelector('.scslai-fb-live__media');

        var openButton = aside.querySelector('.scslai-fb-live__open');
        openButton.addEventListener('click', function () {
            openModal();
        });

        var closeButton = aside.querySelector('.scslai-fb-live__close');
        closeButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            hideWidget(true);
        });

        return aside;
    }

    function mountPreview() {
        if (!mediaEl) { return; }
        destroyPreview();

        if (!embeddable) {
            previewNotice = buildPreviewNotice();
            mediaEl.appendChild(previewNotice);
            return;
        }

        var available = mediaEl.clientWidth || 0;
        if (!available) {
            available = Math.min(parseInt(cfg.previewWidth, 10) || 320, window.innerWidth - 24);
        }

        var width = Math.max(220, Math.min(520, Math.round(available)));
        var height = Math.round(width * 9 / 16);

        previewBuiltWidth = width;
        previewFrame = createFrame(width, height, cfg.autoplayPreview !== false, cfg.title + ' preview', true, true);
        mediaEl.appendChild(previewFrame);
    }

    function destroyPreview() {
        if (previewFrame && previewFrame.parentNode) {
            previewFrame.parentNode.removeChild(previewFrame);
        }
        if (previewNotice && previewNotice.parentNode) {
            previewNotice.parentNode.removeChild(previewNotice);
        }
        previewFrame = null;
        previewNotice = null;
        previewBuiltWidth = 0;
    }

    function showWidget() {
        if (!widget) {
            widget = buildWidget();
            document.body.appendChild(widget);
        }
        widget.hidden = false;
        if (!previewFrame && !previewNotice) { mountPreview(); }
    }

    function hideWidget(byUser) {
        if (byUser) { rememberDismissal(); }
        closeModal(false);
        destroyPreview();
        if (widget) { widget.hidden = true; }
    }


    /* ------------------------------------------------------------------
       Large popup
       ------------------------------------------------------------------ */

    function buildModal() {
        modal = document.createElement('div');
        modal.id = 'scslai-fb-live-modal';
        modal.className = 'scslai-fb-live-modal';
        modal.hidden = true;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', cfg.title);
        modal.innerHTML =
            '<div class="scslai-fb-live-modal__backdrop" data-scslai-fb-live-close="true"></div>' +
            '<div class="scslai-fb-live-modal__card" role="document">' +
                '<div class="scslai-fb-live-modal__head">' +
                    '<span class="scslai-fb-live-modal__badge"><span class="scslai-fb-live__dot"></span>Live</span>' +
                    '<h2 class="scslai-fb-live-modal__title"></h2>' +
                    '<a class="scslai-fb-live-modal__link" target="_blank" rel="noopener noreferrer">' +
                        (providerLabel() ? 'Open in ' + providerLabel() : 'Open link') + ICON_EXTERNAL +
                    '</a>' +
                    '<button type="button" class="scslai-fb-live-modal__close" aria-label="Close the Facebook Live video">' +
                        ICON_CLOSE +
                    '</button>' +
                '</div>' +
                '<div class="scslai-fb-live-modal__frame"></div>' +
            '</div>';

        modal.querySelector('.scslai-fb-live-modal__title').textContent = cfg.title;
        modal.querySelector('.scslai-fb-live-modal__link').href = liveUrl;

        modalFrameHost = modal.querySelector('.scslai-fb-live-modal__frame');

        modal.querySelector('.scslai-fb-live-modal__close').addEventListener('click', function () {
            closeModal(true);
        });

        modal.querySelector('[data-scslai-fb-live-close]').addEventListener('click', function () {
            closeModal(true);
        });

        return modal;
    }

    function loadModalVideo() {
        if (!modalFrameHost) { return; }

        if (!embeddable) {
            fillModalNotice();
            return;
        }

        modalFrameHost.innerHTML = '';
        modalFrame = null;

        var box = modalFrameHost.getBoundingClientRect();
        var width = Math.round(modalFrameHost.clientWidth || box.width);
        var height = Math.round(modalFrameHost.clientHeight || box.height);

        if (!width || !height) {
            width = Math.min(960, window.innerWidth - 40);
            height = Math.round(width * 9 / 16);
        }

        modalFrame = createFrame(width, height, true, cfg.title + ' (large view)', false, false);
        modalFrameHost.appendChild(modalFrame);
    }

    function openModal() {
        if (forceHide || !liveUrl) { return; }

        if (!modal) { buildModal(); }
        if (!document.body.contains(modal)) { document.body.appendChild(modal); }

        lastFocus = document.activeElement;
        modal.hidden = false;
        lockScroll(true);
        loadModalVideo();

        var closeButton = modal.querySelector('.scslai-fb-live-modal__close');
        if (closeButton) {
            try { closeButton.focus(); } catch (err) {}
        }

        document.addEventListener('keydown', handleModalKeydown, true);
    }

    function closeModal(returnFocus) {
        if (!modal || modal.hidden) { return; }

        modal.hidden = true;
        if (modalFrameHost) { modalFrameHost.innerHTML = ''; }
        modalFrame = null;

        lockScroll(false);
        document.removeEventListener('keydown', handleModalKeydown, true);

        if (returnFocus !== false) {
            var target = (lastFocus && document.body.contains(lastFocus)) ? lastFocus : null;
            if (!target && widget) {
                target = widget.querySelector('.scslai-fb-live__open');
            }
            if (target && target.focus) {
                try { target.focus(); } catch (err) {}
            }
        }

        lastFocus = null;
    }

    function handleModalKeydown(event) {
        if (!modal || modal.hidden) { return; }

        if (event.key === 'Escape' || event.key === 'Esc') {
            event.preventDefault();
            event.stopPropagation();
            closeModal(true);
            return;
        }

        if (event.key !== 'Tab') { return; }

        var focusables = modal.querySelectorAll('a[href], button:not([disabled])');
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

            var gap = Math.max(0, window.innerWidth - html.clientWidth);
            scrollLock = {
                htmlOverflow: html.style.overflow,
                bodyOverflow: body.style.overflow,
                bodyPaddingRight: body.style.paddingRight
            };

            html.classList.add('scslai-fb-live-lock');
            body.classList.add('scslai-fb-live-lock');
            if (gap > 0) { body.style.paddingRight = gap + 'px'; }
            return;
        }

        if (!scrollLock) { return; }

        html.classList.remove('scslai-fb-live-lock');
        body.classList.remove('scslai-fb-live-lock');
        html.style.overflow = scrollLock.htmlOverflow;
        body.style.overflow = scrollLock.bodyOverflow;
        body.style.paddingRight = scrollLock.bodyPaddingRight;
        scrollLock = null;
    }

    /* ------------------------------------------------------------------
       Keep sizes correct + re-check the schedule
       ------------------------------------------------------------------ */

    function handleResize() {
        if (resizeTimer) { clearTimeout(resizeTimer); }

        resizeTimer = setTimeout(function () {
            resizeTimer = null;

            if (widget && !widget.hidden && mediaEl && previewFrame) {
                var width = Math.round(mediaEl.clientWidth || 0);
                if (width > 0 && Math.abs(width - previewBuiltWidth) > 80) {
                    mountPreview();
                }
            }

            if (modal && !modal.hidden && embeddable) {
                loadModalVideo();
            }
        }, 300);
    }

    function tick() {
        if (document.hidden) { return; }

        if (shouldShow()) {
            showWidget();
            return;
        }

        if (modal && !modal.hidden) {
            closeModal(false);
        }
        if (widget && !widget.hidden) {
            hideWidget(false);
        }
    }

    /* Always load the settings file fresh: the ?t= number changes on every
       page load, so editing facebook-live-config.js takes effect on refresh
       instead of the browser serving a cached copy. */
    function loadConfig(done) {
        var url;

        try {
            url = SELF_SRC ? new URL('facebook-live-config.js', SELF_SRC).href : 'facebook-live-config.js';
        } catch (err) {
            url = 'facebook-live-config.js';
        }

        var script = document.createElement('script');
        script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now();
        script.async = false;
        script.onload = done;
        script.onerror = function () {
            console.warn('[Live video] Could not load facebook-live-config.js');
            done();
        };

        document.head.appendChild(script);
    }

    function start() {
        if (!document.body) { return; }

        readQueryFlag();
        resolveConfig();

        if (!liveUrl) {
            console.warn('[Live video] No liveUrl set in facebook-live-config.js — the floating window is disabled.');
            return;
        }

        console.info('[Live video] Link in use:', liveUrl);

        if (forceHide) { return; }

        tick();

        if (tickTimer) { clearInterval(tickTimer); }
        tickTimer = setInterval(tick, 30000);

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) { tick(); }
        });

        window.addEventListener('pageshow', function (event) {
            if (event.persisted) { tick(); }
        });

        /* Small handy API for testing from the console:
           SCSLAI_FACEBOOK_LIVE_WIDGET.open() / .close() / .hide() / .refresh() */
        window.SCSLAI_FACEBOOK_LIVE_WIDGET = {
            refresh: tick,
            open: openModal,
            close: function () { closeModal(true); },
            hide: function () { hideWidget(true); }
        };
    }

    loadConfig(function () {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start);
        } else {
            start();
        }
    });
})();
