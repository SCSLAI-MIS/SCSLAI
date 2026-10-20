/* =====================================================
   HEART GAME — Game 2 of the SCSLAI anniversary games

   TEMPORARY — delete the whole Games/ folder after the anniversary.

   WHICH HUNT RUNS IS ONE LINE IN Games/game-control.js:
       const ACTIVE_GAME = "heart";  -> this file reveals the hearts
       const ACTIVE_GAME = "star";   -> this file does nothing
   Load Games/game-control.js BEFORE this file.

   Every heart is invisible by default, twice over:
     - style="display:none" on the heart in the HTML
     - visibility:hidden inside heart-game.css
   This script clears both and adds "heart-game-active" to <html>, but
   only when game-control.js selects "heart".

   The "Book" modal heart (SCSLAICares) is already in the page markup.
   The Calculator heart is injected here, because the calculator is a
   popup that script.js builds at runtime.
   ===================================================== */

(function initHeartEasterEggs() {
  'use strict';

  var TOTAL_HEARTS = 5;
  var STORE_KEY = 'scslai_heart_found_v1';
  var END_KEY = 'scslai_heart_done';
  var CALC_HEART_ID = 'heart-calculator';
  var HEART_SYMBOL = '\u2764\uFE0F'; // heart
  var finished = false;

  // Which hunt is live is decided by Games/game-control.js:
  //   const ACTIVE_GAME = "star";   -> stars only
  //   const ACTIVE_GAME = "heart";  -> hearts only
  // If that file is missing, fall back to the Star Game (so hearts stay off).
  function activeGameName() {
    try {
      return (typeof ACTIVE_GAME === 'string' ? ACTIVE_GAME : 'star').trim().toLowerCase();
    } catch (e) {
      return 'star';
    }
  }

  // TEMPORARY TEST SWITCH: ?heartreset=1 wipes this browser's heart-hunt
  // progress (and the "finished" flag), so the hunt can be replayed.
  // The flag is removed from the URL afterwards, so a normal refresh keeps
  // the new progress instead of resetting it again.
  try {
    var query = new URLSearchParams(window.location.search);
    if (query.get('heartreset') === '1') {
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem(END_KEY);
      query.delete('heartreset');
      var rest = query.toString();
      window.history.replaceState(null, '', window.location.pathname + (rest ? '?' + rest : '') + window.location.hash);
    }
  } catch (e) {}

  function readFound() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return [];
      var p = JSON.parse(raw);
      return Array.isArray(p) ? p : [];
    } catch (e) { return []; }
  }

  function writeFound(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {}
  }

  // Same one-time rule as the star hunt: once the finale ran, no heart
  // ever appears again on this browser.
  function isFinished() {
    if (finished) return true;
    try { return localStorage.getItem(END_KEY) === '1'; } catch (e) { return false; }
  }

  // Turn a heart on: this is the ONLY place that reveals hearts, and it
  // only runs when the host has enabled heart-game.js.
  function revealHeart(el) {
    if (!el) return;
    document.documentElement.classList.add('heart-game-active');
    el.style.display = '';          // clears the inline display:none
    el.removeAttribute('aria-hidden');
  }

  function boot() {
    // Game control: reveal hearts only while game-control.js says "heart".
    // Otherwise they stay hidden by the inline display:none + CSS.
    if (activeGameName() !== 'heart') return;

    // One-time hunt: after the finale, hearts never come back.
    if (isFinished()) return;

    var overlay = document.createElement('div');
    overlay.className = 'easter-egg-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="easter-egg-card" role="document">' +
        '<span class="easter-egg-found-star" aria-hidden="true">' + HEART_SYMBOL + '</span>' +
        '<h2 class="easter-egg-title">You found a hidden heart!</h2>' +
        '<span class="easter-egg-count"></span>' +
        '<p class="easter-egg-message">You discovered a <strong>hidden heart</strong>!</p>' +
        '<div class="easter-egg-progress" aria-hidden="true"></div>' +
        '<p class="easter-egg-sub">There are 5 hidden hearts across the site!</p>' +
        '<div class="easter-egg-prize" hidden></div>' +
        '<button type="button" class="easter-egg-close">Awesome!</button>' +
      '</div>';
    document.body.appendChild(overlay);

    var card = overlay.querySelector('.easter-egg-card');
    var titleEl = overlay.querySelector('.easter-egg-title');
    var msgEl = overlay.querySelector('.easter-egg-message');
    var subEl = overlay.querySelector('.easter-egg-sub');
    var countEl = overlay.querySelector('.easter-egg-count');
    var progEl = overlay.querySelector('.easter-egg-progress');
    var prizeEl = overlay.querySelector('.easter-egg-prize');
    var closeBtn = overlay.querySelector('.easter-egg-close');
    var lastHeart = null;

    function spawnConfetti(big) {
      var colors = ['#ef476f', '#ffd166', '#ff8fab', '#ffffff', '#12503c', '#78fdc6'];
      var total = big ? 110 : 60;
      for (var i = 0; i < total; i++) {
        var piece = document.createElement('span');
        piece.className = 'easter-egg-confetti';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = 1.6 + Math.random() * 1.8 + 's';
        piece.style.animationDelay = (Math.random() * 0.5) + 's';
        piece.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
        card.appendChild(piece);
        (function (el) {
          setTimeout(function () { el.remove(); }, 3800);
        })(piece);
      }
    }

    function renderPopup(list) {
      var count = list.length;
      var done = count >= TOTAL_HEARTS;
      progEl.innerHTML = '';
      for (var d = 0; d < TOTAL_HEARTS; d++) {
        var dot = document.createElement('span');
        dot.className = 'easter-egg-dot' + (d < count ? ' lit' : '');
        progEl.appendChild(dot);
      }
      countEl.textContent = 'Found ' + Math.min(count, TOTAL_HEARTS) + ' of ' + TOTAL_HEARTS + ' hidden hearts';
      if (done) {
        titleEl.textContent = 'Congratulations, you found them all!';
        msgEl.innerHTML = 'You discovered the <strong>hidden hearts!</strong>';
        subEl.textContent = 'You are an official SCSLAI heart hunter!';
        prizeEl.hidden = false;
        prizeEl.innerHTML = '<strong>Take a screenshot and claim your prize if you are the first one to find it!</strong><br/>Show this pop-up to SCSLAI to claim. First finder wins!';
        closeBtn.textContent = 'Hope you enjoyed the hunt!';
      } else {
        prizeEl.hidden = true;
        prizeEl.innerHTML = '';
        closeBtn.textContent = 'Awesome! (' + count + '/' + TOTAL_HEARTS + ')';
      }
    }

    function openPopup(heartId, el) {
      var list = readFound();
      if (list.indexOf(heartId) === -1) { list.push(heartId); writeFound(list); }
      if (el) {
        el.classList.add('is-found');
        // Collected: the heart disappears, but the hunt still counts it.
        el.style.display = 'none';
      }
      renderPopup(list);
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');
      spawnConfetti(list.length >= TOTAL_HEARTS);
      if (closeBtn) closeBtn.focus();
    }

    function closePopup() {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
      if (lastHeart && lastHeart.parentNode && lastHeart.getClientRects().length) lastHeart.focus();
    }

    // Same finale as the star hunt: wipe every heart from the site for good.
    function finishHuntForever() {
      finished = true;
      try {
        localStorage.setItem(END_KEY, '1');
        localStorage.removeItem(STORE_KEY);
      } catch (e) {}
      var hearts = document.querySelectorAll('.heart-game-heart');
      for (var i = 0; i < hearts.length; i++) {
        var slot = hearts[i].parentElement;
        if (hearts[i].parentNode) hearts[i].parentNode.removeChild(hearts[i]);
        if (slot && slot.classList && slot.classList.contains('heart-game-calc-slot') && slot.parentNode) {
          slot.parentNode.removeChild(slot);
        }
      }
      document.documentElement.classList.remove('heart-game-active');
    }

    // Finale: big word-only WELCOME blast after the prize card closes.
    var welcomeShown = false;
    function showWelcomeBlast() {
      if (welcomeShown) return;
      welcomeShown = true;
      try {
        if (localStorage.getItem(END_KEY) !== '1') return;
      } catch (e) {}
      var welcome = document.createElement('div');
      welcome.className = 'easter-egg-welcome-overlay';
      welcome.setAttribute('role', 'alert');
      welcome.innerHTML = '<h2 class="easter-egg-welcome-text">WELCOME TO <span>SCSLAI WEBSITE</span></h2>';
      document.body.appendChild(welcome);
      var colors = ['#12503c', '#78fdc6', '#ffd166', '#ef476f', '#4ec291', '#ffffff'];
      for (var i = 0; i < 130; i++) {
        var piece = document.createElement('span');
        piece.className = 'easter-egg-welcome-confetti';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (1.8 + Math.random() * 2) + 's';
        piece.style.animationDelay = (Math.random() * 0.8) + 's';
        welcome.appendChild(piece);
      }
      requestAnimationFrame(function () { welcome.classList.add('show'); });
      var done = false;
      function hideWelcome() {
        if (done) return;
        done = true;
        welcome.classList.remove('show');
        setTimeout(function () { if (welcome.parentNode) welcome.parentNode.removeChild(welcome); }, 400);
      }
      welcome.addEventListener('click', hideWelcome);
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { hideWelcome(); document.removeEventListener('keydown', esc); }
      });
      setTimeout(hideWelcome, 6000);
    }

    if (closeBtn) closeBtn.addEventListener('click', function () {
      var list = readFound();
      if (list.length >= TOTAL_HEARTS && closeBtn.textContent.indexOf('Hope you enjoyed') !== -1) {
        finishHuntForever();
        closePopup();
        setTimeout(showWelcomeBlast, 350);
        return;
      }
      closePopup();
    });

    overlay.addEventListener('click', function (e) {
      if (e.target !== overlay) return;
      var wasClaimed = false;
      try { wasClaimed = localStorage.getItem(END_KEY) === '1'; } catch (e) {}
      closePopup();
      if (wasClaimed) setTimeout(showWelcomeBlast, 350);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !overlay.classList.contains('show')) return;
      var wasClaimed = false;
      try { wasClaimed = localStorage.getItem(END_KEY) === '1'; } catch (e) {}
      closePopup();
      if (wasClaimed) setTimeout(showWelcomeBlast, 350);
    });

    function bindHeart(el) {
      if (isFinished()) return;
      if (el.dataset.heartBound === '1') return;
      el.dataset.heartBound = '1';

      // Stable identity comes from the authored location, not DOM order.
      // The path-based fallback keeps legacy hearts working if the markup
      // is ever rebuilt without data-heart-id.
      var explicitId = el.getAttribute('data-heart-id');
      var heartId = explicitId;
      if (!heartId) {
        var path = [];
        var node = el;
        while (node && node !== document.body) {
          path.push(Array.prototype.indexOf.call(node.parentNode.children, node));
          node = node.parentElement;
        }
        heartId = 'heart-path-' + path.reverse().join('-');
      }

      // Already collected on an earlier visit: stays hidden, still counted.
      if (readFound().indexOf(heartId) !== -1) {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
        return;
      }

      revealHeart(el);
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'Hidden heart — click me!');
      el.title = '...';

      el.addEventListener('click', function () {
        lastHeart = el;
        openPopup(heartId, el);
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          lastHeart = el;
          openPopup(heartId, el);
        }
      });
    }

    // The calculator is a popup that script.js builds on demand, so the
    // heart for "the Calculator page" is added here the first time that
    // popup appears. It is a direct child of the dialog and sticks to the
    // visible bottom edge, so it is there on the very first open without
    // having to scroll the (tall) calculator first.
    function ensureCalculatorHeart() {
      if (isFinished()) return;
      if (readFound().indexOf(CALC_HEART_ID) !== -1) return;

      var modal = document.querySelector('[data-calculator-modal]');
      if (!modal) return;

      var dialog = modal.querySelector('.calculator-dialog');
      if (!dialog) return;
      if (dialog.querySelector('[data-heart-id="' + CALC_HEART_ID + '"]')) return;

      var slot = document.createElement('div');
      slot.className = 'heart-game-calc-slot';

      var heart = document.createElement('span');
      heart.className = 'heart-game-heart heart-tint-4';
      heart.setAttribute('data-heart-id', CALC_HEART_ID);
      heart.setAttribute('aria-hidden', 'true');
      heart.style.display = 'none';
      heart.innerHTML = '<span class="heart-game-heart-glyph" aria-hidden="true">' + HEART_SYMBOL + '</span>';

      slot.appendChild(heart);
      dialog.appendChild(slot);
    }

    function bindAllHearts() {
      if (isFinished()) return;
      var all = document.querySelectorAll('.heart-game-heart');
      for (var i = 0; i < all.length; i++) bindHeart(all[i]);
    }

    ensureCalculatorHeart();
    bindAllHearts();

    // The Book modal and the Calculator popup are built/opened later, so
    // keep watching for newly added hearts and calculator tab switches.
    if (window.MutationObserver) {
      new MutationObserver(function (mutations) {
        var recheck = false;
        for (var m = 0; m < mutations.length; m++) {
          var record = mutations[m];
          if (record.type === 'attributes') {
            if (record.target && record.target.nodeType === 1 && record.target.hasAttribute('data-court-panel')) {
              recheck = true;
            }
          } else if (record.addedNodes && record.addedNodes.length) {
            recheck = true;
          }
        }
        if (recheck) ensureCalculatorHeart();
        bindAllHearts();
      }).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
