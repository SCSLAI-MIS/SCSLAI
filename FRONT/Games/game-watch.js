/* =====================================================
   GAME WATCH — refreshes open pages by itself when the Game Controls change

   TEMPORARY — delete the whole Games/ folder after the anniversary.

   THE FLOW THIS SUPPORTS
     1. The site ships with the hunt off:  const ACTIVE_GAME = "";  (or "heart")
     2. The admin sets        const ACTIVE_GAME = "STAR";
        (upper or lower case both work — the games lower-case it) and pushes.
     3. Vercel redeploys the site.
     4. Every page that is ALREADY OPEN is running this file, so it re-reads
        Games/game-control.js on a timer — with no-store + a one-off query
        string, so the answer is always the deployment that is live now.
     5. The instant that value differs from the value this page booted with,
        the page reloads itself. The visitor touches nothing, and the Star
        Hunt is on screen after that one automatic refresh.

   WHY IT CANNOT MISBEHAVE
     - It reloads ONLY when the value changed. After the reload the page boots
       with the new value, the next look agrees, and nothing more happens — so
       there is no reload loop.
     - MAX_RELOADS caps automatic reloads per tab per WINDOW_MS, so even a
       pathological cache can never bounce a visitor forever.
     - It stands down while the visitor is busy — a field has focus, or the
       Calculator / loan form / "you found a star!" card is open — so a
       half-filled form is never wiped. The next poll simply tries again.
     - It looks only while the tab is visible, and looks again the moment the
       visitor comes back to the tab, so background tabs cost nothing.
     - If the file cannot be fetched or its value cannot be read, it does
       nothing at all. It never guesses.

   TUNABLES (inside the IIFE below)
     POLL_MS  how often an open page re-checks the Game Controls.
     DEBUG    true to log every check to the console. You can also turn the
              logging on for one visit without editing anything by adding
              ?gamewatchdebug=1 to the URL.

   PUT IT ON EVERY PAGE THAT LOADS THE GAMES, AFTER Games/game-control.js:
     <script src="Games/game-watch.js?v=20261109a"></script>
   ===================================================== */

(function initGameWatch() {
  'use strict';

  var POLL_MS = 20000;              // re-check the Game Controls every 20s
  var MIN_GAP_MS = 3000;            // never two checks closer than this
  var MAX_RELOADS = 5;              // per tab, per window
  var WINDOW_MS = 3 * 60 * 1000;    // the window MAX_RELOADS is counted over
  var STORE_KEY = 'scslai_game_watch';
  // Logging is off in production; ?gamewatchdebug=1 turns it on for one visit.
  var DEBUG = /[?&]gamewatchdebug=1(&|$)/.test(window.location.search);

  // "The visitor is in the middle of something" — reload later, not now.
  var BUSY_SELECTORS = [
    '[data-calculator-modal].open',   // Calculator popup (script.js)
    '#loanModal.active',             // Loan application form (download.html)
    '.easter-egg-overlay.show'       // "You found a hidden star!" popup
  ];

  // The switch sits next to this file, so it resolves correctly from the site
  // root (index.html) and from a sub-folder (reports/2022-annual-report.html).
  var me = document.currentScript || document.querySelector('script[src*="game-watch.js"]');
  var switchUrl = (me && me.src)
    ? new URL('game-control.js', me.src).href
    : 'Games/game-control.js';

  function log() {
    if (!DEBUG || !window.console) return;
    var parts = ['[game-watch]'];
    for (var i = 0; i < arguments.length; i++) parts.push(arguments[i]);
    console.log.apply(console, parts);
  }
  // The value THIS page is running — the very value the games already read.
  function bootedValue() {
    try {
      return (typeof ACTIVE_GAME === 'string') ? ACTIVE_GAME.trim().toLowerCase() : null;
    } catch (error) {
      return null;
    }
  }

  // Pull const ACTIVE_GAME = "..." out of the file text.
  // Anything unexpected returns null, and null means "do nothing".
  function readValue(text) {
    var strict = /^[ \t]*(?:const|let|var)[ \t]+ACTIVE_GAME[ \t]*=[ \t]*['"]([^'"]*)['"]/m.exec(text);
    var found = strict || /ACTIVE_GAME[ \t]*=[ \t]*['"]([^'"]*)['"]/.exec(text);
    return found ? found[1].trim().toLowerCase() : null;
  }

  function isBusy() {
    var el = document.activeElement;
    if (el && el !== document.body) {
      var tag = (el.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable) return true;
    }
    for (var i = 0; i < BUSY_SELECTORS.length; i++) {
      if (document.querySelector(BUSY_SELECTORS[i])) return true;
    }
    return false;
  }

  // Spend one reload from this tab's budget. False once the budget is gone,
  // so a mismatch that never resolves cannot loop the page forever.
  function spendReloadBudget() {
    var now = Date.now();
    var count = 0;
    var started = 0;
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && typeof saved === 'object') {
          count = saved.count | 0;
          started = saved.started | 0;
        }
      }
    } catch (error) {}
    if (!started || (now - started) > WINDOW_MS) { count = 0; started = now; }
    if (count >= MAX_RELOADS) return false;
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify({ count: count + 1, started: started })); } catch (error) {}
    return true;
  }

  var pageValue = bootedValue();
  var lastCheck = 0;
  var inFlight = false;

  function applyValue(value) {
    if (value === null) return;                     // unreadable — never guess
    if (pageValue === null) {                       // first look sets the baseline
      pageValue = value;
      log('baseline from the server:', value);
      return;
    }
    if (value === pageValue) return;                // no change, nothing to do
    log('Game Controls changed:', pageValue, '->', value);
    if (isBusy()) { log('visitor is busy — retrying next poll'); return; }
    if (!spendReloadBudget()) { log('reload budget spent — standing down'); return; }
    log('reloading');
    window.location.reload();
  }

  function check() {
    if (document.hidden) return;
    var now = Date.now();
    if (inFlight || (now - lastCheck) < MIN_GAP_MS) return;
    lastCheck = now;
    inFlight = true;

    var request = new XMLHttpRequest();
    request.open('GET', switchUrl + (switchUrl.indexOf('?') === -1 ? '?' : '&') + 'watch=' + now, true);
    request.onreadystatechange = function () {
      if (request.readyState !== 4) return;
      inFlight = false;
      if (request.status < 200 || request.status >= 300) return;   // offline / 404 — try later
      applyValue(readValue(request.responseText || ''));
    };
    try {
      request.send();
    } catch (error) {
      inFlight = false;
    }
  }

  function start() {
    log('watching', switchUrl, '| this page runs:', pageValue);
    setTimeout(check, 1500);
    setInterval(check, POLL_MS);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) check();
    });
    window.addEventListener('focus', check);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
