/* =====================================================
   Star Game — Game 1 of the SCSLAI anniversary games

   WHICH HUNT RUNS IS ONE LINE IN Games/game-control.js:
       const ACTIVE_GAME = "star";   -> this file renders the stars
       const ACTIVE_GAME = "heart";  -> this file does nothing
   Load Games/game-control.js BEFORE this file.

   TEMPORARY — delete the whole Games/ folder after the anniversary.
   ===================================================== */

(function initStarEasterEgg() {
  var TOTAL_EGGS = 5;
  var STORE_KEY = 'scslai_easter_egg_found_v2';
  var END_KEY = 'scslai_easter_egg_done';
  var EGGS = [
    { id: 'contact-card', match: /contact\.html?$/i, container: '.contact-card', mode: 'contact-card', tint: 'egg-tint-2' },
    { id: 'membership', match: /membership\.html?$/i, container: '.footer-bottom p', mode: 'append-inline', tint: 'egg-tint-3' },
    { id: 'framework', match: /about-framework\.html?$/i, container: '.framework-chart', mode: 'framework-top', tint: 'egg-tint-4' },
    { id: 'home-hero', match: /index\.html?$/i, isDefault: true, container: '.announcements .title', mode: 'append-inline', tint: 'egg-tint-5' },
    { id: 'annual-note', match: /download\.html?$/i, container: '.annual-note span', mode: 'append-inline', tint: 'egg-tint-1' }
  ];

  // Which hunt is live is decided by Games/game-control.js:
  //   const ACTIVE_GAME = "star";   -> stars only
  //   const ACTIVE_GAME = "heart";  -> hearts only
  // If that file is missing, fall back to the Star Game.
  function activeGameName() {
    try {
      return (typeof ACTIVE_GAME === 'string' ? ACTIVE_GAME : 'star').trim().toLowerCase();
    } catch (error) {
      return 'star';
    }
  }

  // TEMPORARY TEST SWITCH: ?starreset=1 wipes this browser's star-hunt
  // progress (and the "finished" flag), so the hunt can be replayed.
  // The flag is removed from the URL afterwards, so a normal refresh keeps
  // the new progress instead of resetting it again.
  try {
    var starQuery = new URLSearchParams(window.location.search);
    if (starQuery.get('starreset') === '1') {
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem(END_KEY);
      starQuery.delete('starreset');
      var starRest = starQuery.toString();
      window.history.replaceState(null, '', window.location.pathname + (starRest ? '?' + starRest : '') + window.location.hash);
    }
  } catch (error) {}

  function readFound() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeFound(list) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(list));
    } catch (error) {
      // Storage may be disabled; the hunt still works for the current view.
    }
  }

  function boot() {
    // Game control: render stars only while game-control.js says "star".
    if (activeGameName() !== 'star') return;

    try {
      if (localStorage.getItem(END_KEY) === '1') return;
    } catch (error) {}

    var pathname = window.location.pathname || '';
    var file = pathname.split('/').pop() || '';
    if (file === '' || file === 'FRONT') file = 'index.html';

    var pageEggs = EGGS.filter(function (egg) {
      if (egg.pages === 'all') return true;
      if (egg.isDefault && file.toLowerCase() === 'index.html') return true;
      return Boolean(egg.match && (egg.match.test(pathname) || egg.match.test(file)));
    });

    if (!pageEggs.length) return;

    var foundNow = readFound();

    function makeTrigger(egg) {
      var button = document.createElement('button');
      var done = foundNow.indexOf(egg.id) !== -1;
      button.type = 'button';
      button.className = 'easter-egg-trigger ' + egg.tint;
      button.setAttribute('aria-label', 'Hidden star — click me!');
      button.title = '...';
      button.setAttribute('data-egg-id', egg.id);
      button.innerHTML = '<span class="easter-egg-star" aria-hidden="true">🌟</span>';
      if (done) button.classList.add('found');
      return button;
    }

    function placeTrigger(egg, button) {
      var cards;
      var host;

      if (egg.mode === 'contact-card') {
        cards = document.querySelectorAll(egg.container);
        host = cards[1] || cards[0];
        if (!host) return false;
        host.style.position = 'relative';
        button.style.position = 'absolute';
        button.style.right = '10px';
        button.style.top = '10px';
        button.style.marginLeft = '0';
        host.appendChild(button);
        return true;
      }

      if (egg.mode === 'framework-top') {
        host = document.querySelector(egg.container);
        if (!host) return false;
        if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
        host.style.overflow = 'visible';
        button.style.position = 'absolute';
        button.style.marginLeft = '0';
        if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
          button.style.top = '8px';
          button.style.right = '10px';
        } else {
          button.style.top = '56px';
          button.style.right = '18%';
        }
        button.style.zIndex = '50';
        host.appendChild(button);
        return true;
      }

      if (egg.mode === 'cares-corner') {
        host = document.querySelector(egg.container);
        if (!host) return false;
        if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
        button.style.position = 'absolute';
        button.style.right = '6px';
        button.style.bottom = '2px';
        button.style.marginLeft = '0';
        button.style.zIndex = '5';
        host.appendChild(button);
        return true;
      }

      host = document.querySelector(egg.container);
      if (!host) return false;
      host.appendChild(button);
      return true;
    }
    // Shared popup for all stars found on this page.
    var overlay = document.createElement('div');
    overlay.className = 'easter-egg-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="easter-egg-card" role="document">' +
        '<span class="easter-egg-found-star" aria-hidden="true">🌟</span>' +
        '<h2 class="easter-egg-title">Congratulations, you found it! 🎉</h2>' +
        '<span class="easter-egg-count"></span>' +
        '<p class="easter-egg-message">You discovered a <strong>hidden star</strong>!</p>' +
        '<div class="easter-egg-progress" aria-hidden="true"></div>' +
        '<p class="easter-egg-sub">Keep hunting there are 5 hidden stars across the site!</p>' +
        '<div class="easter-egg-prize" hidden></div>' +
        '<button type="button" class="easter-egg-close">Awesome!</button>' +
      '</div>';

    document.body.appendChild(overlay);

    var card = overlay.querySelector('.easter-egg-card');
    var titleEl = overlay.querySelector('.easter-egg-title');
    var messageEl = overlay.querySelector('.easter-egg-message');
    var subEl = overlay.querySelector('.easter-egg-sub');
    var countEl = overlay.querySelector('.easter-egg-count');
    var progressEl = overlay.querySelector('.easter-egg-progress');
    var prizeEl = overlay.querySelector('.easter-egg-prize');
    var closeButton = overlay.querySelector('.easter-egg-close');
    var lastButton = null;

    function spawnConfetti(big) {
      var colors = ['#12503c', '#78fdc6', '#ffd166', '#ef476f', '#4ec291', '#ffffff'];
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
      var done = count >= TOTAL_EGGS;
      progressEl.innerHTML = '';
      for (var d = 0; d < TOTAL_EGGS; d++) {
        var dot = document.createElement('span');
        dot.className = 'easter-egg-dot' + (d < count ? ' lit' : '');
        progressEl.appendChild(dot);
      }
      countEl.textContent = 'Found ' + Math.min(count, TOTAL_EGGS) + ' of ' + TOTAL_EGGS + ' hidden stars';
      if (done) {
        titleEl.textContent = '🎉 Congratulations, you found it! 🎊';
        messageEl.innerHTML = 'You discovered the <strong>hidden stars!</strong>';
        subEl.textContent = 'You are an official SCSLAI treasure hunter!';
        prizeEl.hidden = false;
        prizeEl.innerHTML = '📸 <strong>Take a screenshot and claim your prize if you are the first one to find it!</strong><br/>Show this pop-up to SCSLAI to claim. First finder wins!';
        closeButton.textContent = 'Hope you enjoyed the hunt! 🎉';
      } else {
        prizeEl.hidden = true;
        prizeEl.innerHTML = '';
        closeButton.textContent = 'Awesome! (' + count + '/' + TOTAL_EGGS + ')';
      }
    }

    function openPopup(eggId, button) {
      var list = readFound();
      if (list.indexOf(eggId) === -1) {
        list.push(eggId);
        writeFound(list);
      }
      if (button) {
        button.classList.add('found');
        // Collected: the star disappears, but the hunt still counts it.
        button.style.display = 'none';
      }
      renderPopup(list);
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');
      spawnConfetti(list.length >= TOTAL_EGGS);
      if (closeButton) closeButton.focus();
    }

    function closePopup() {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
      if (lastButton && lastButton.getClientRects().length) lastButton.focus();
    }

    // One-time hunt: the finale wipes every star from the site for good.
    function finishHuntForever() {
      try {
        localStorage.setItem(END_KEY, '1');
        localStorage.removeItem(STORE_KEY);
      } catch (error) {}
      var triggers = document.querySelectorAll('.easter-egg-trigger');
      for (var r = 0; r < triggers.length; r++) {
        if (triggers[r].parentNode) triggers[r].parentNode.removeChild(triggers[r]);
      }
    }


    // Finale: big word-only WELCOME blast after the prize card closes.
    var welcomeShown = false;
    function showWelcomeBlast() {
      if (welcomeShown) return;
      welcomeShown = true;
      try {
        if (localStorage.getItem(END_KEY) !== '1') return;
      } catch (error) {}
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

    // Place every star on this page and wire its click.
    for (var k = 0; k < pageEggs.length; k++) {
      (function (eggDef) {
        if (document.querySelector('[data-egg-id="' + eggDef.id + '"]')) return;
        // Already collected on an earlier visit — leave the spot empty.
        if (foundNow.indexOf(eggDef.id) !== -1) return;
        var button = makeTrigger(eggDef);
        if (!placeTrigger(eggDef, button)) return;
        button.addEventListener('click', function () {
          lastButton = button;
          openPopup(eggDef.id, button);
        });
      })(pageEggs[k]);
    }

    closeButton.addEventListener('click', function () {
      var list = readFound();
      if (list.length >= TOTAL_EGGS && closeButton.textContent.indexOf('Hope you enjoyed') !== -1) {
        finishHuntForever();
        closePopup();
        setTimeout(showWelcomeBlast, 350);
        return;
      }
      closePopup();
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        var wasClaimed = false;
        try { wasClaimed = localStorage.getItem(END_KEY) === '1'; } catch (error) {}
        closePopup();
        if (wasClaimed) setTimeout(showWelcomeBlast, 350);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('show')) {
        var wasClaimedEsc = false;
        try { wasClaimedEsc = localStorage.getItem(END_KEY) === '1'; } catch (error) {}
        closePopup();
        if (wasClaimedEsc) setTimeout(showWelcomeBlast, 350);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
