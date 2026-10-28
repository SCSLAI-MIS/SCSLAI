/**
 * Book Opening Animation (SCSLAI Cares yearbook)
 * ---------------------------------------------------------------------------
 * CSS/DOM recreation of the old green-screen clip ("animation/Book.mp4").
 * The overlay renders the very same book the visitor clicked on the shelf: the
 * front board carries the .yearbook-cover / .cover-* classes from
 * scslaicares.css, so the shelf card and the opening book are one design - same
 * cloth colour, gold lettering and tipped-in activity plate.
 *
 * Geometry follows a real hardback spread:
 *   .book-scene  perspective (the camera)
 *   .book-zoom   uniform scale that fits the spread to the screen
 *   .book-rig    half-a-panel recentre (scaled by the wrapper above)
 *   .book-tilt   the turn in space: shelf tilt -> flat
 *   .book-spread two panels; the spine is the middle of the spread
 *
 * The paper block is a real 3D box (top page + fore-edge + bottom edge) with a
 * 13px depth, the back board sits behind it, and the turning elements are
 * two-faced cards hinged on the spine. Layering uses tiny translateZ offsets
 * instead of z-index: a leaf sits behind the closed cover, and because turning
 * it flips its local Z axis, the same offset puts it in front once it lands.
 *
 * Usage (see FRONT/script.js):
 *   const anim = BookAnimation.mount(document.getElementById('book-opening-stage'));
 *   anim.prepare(skin);          // paint the closed book (before the overlay shows)
 *   await anim.play(skin);       // run the sequence
 */
(function (global) {
  'use strict';

  // Master timeline. The cover opens first; the four leaves turn afterwards and
  // the last one lands just before the end, matching the pace of the old clip.
  const DURATION = 3600;
  const LEAF_DURATION = 900;
  const LEAF_START = 1850;
  const LEAF_STAGGER = 230;
  const TILT_ANIMATION = 'bookTiltOpen';

  // Unscaled geometry: one panel is exactly the shelf cover's 240x320 board.
  const PANEL_W = 240;
  const PANEL_H = 320;
  const SPREAD_W = PANEL_W * 2;
  const DEPTH = 13;               // paper block thickness
  const BLOCK_LIP = 10;           // pages overhang the boards by this much
  const BACK_Z = DEPTH + 6;       // back board sits behind the block
  const INFLATE_W = 1.1;          // extra projected width added by the 3D tilt
  const INFLATE_H = 1.2;          // extra projected height (worst case: shut book)
  const LEFT_REST = -178;         // angle the turned stack lies at
  // Recentring: the visible book is only the right half while the board is shut,
  // so the spread starts half a panel (plus half the page lip) left of centre.
  // The extra -3px cancels the perspective pull on the tilted near half.
  const SHIFT = -((PANEL_W + BLOCK_LIP) / 2) - 3;

  const STYLES = `
    .book-opening-stage {
      position: relative;
      order: 1;
      flex: 1 1 auto;
      min-height: 0;
      z-index: 1;
      /* Flex, not grid: a grid track would be sized to the 480px spread and
         left-aligned when it overflows a phone, pushing the book off centre. */
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      touch-action: none;
      /* Soft vignette so the book reads against whatever page sits behind it. */
      background: radial-gradient(ellipse at 50% 44%, rgba(24, 15, 6, 0.24), rgba(6, 4, 2, 0.74) 74%);
    }

    .book-scene {
      --sheet: #f6f1e4;
      --book-depth: ${DEPTH}px;
      --book-scale: 1;
      --book-scale-start: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      -webkit-perspective: 1100px;
      perspective: 1100px;
      -webkit-perspective-origin: 50% 50%;
      perspective-origin: 50% 50%;
    }

    /* Uniform fit scale. It lives above the rig so the recentre shift below is
       multiplied by it, which keeps the closed book centred at any size. The
       resting value matches the 0% keyframe so the book never pops when the
       sequence starts. flex:0 0 auto keeps the full spread width even when it
       is wider than a phone, so centring never falls back to flex-start. */
    .book-zoom {
      position: relative;
      flex: 0 0 auto;
      width: ${SPREAD_W}px;
      height: ${PANEL_H}px;
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
      transform: scale(var(--book-scale-start, 1));
    }

    /* While the book is shut only the right half of the spread is filled, so it
       starts half a panel left of centre and slides home as the book opens. */
    .book-rig {
      position: absolute;
      inset: 0;
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
      transform: translate(${SHIFT}px, 9px);
    }

    /* The turn in space: the book starts in the shelf cover's exact tilt and
       flattens out as the front board swings open. */
    .book-tilt {
      position: absolute;
      inset: 0;
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
      transform-origin: 50% 50%;
      transform: rotateX(11deg) rotateY(-24deg) rotateZ(-1.6deg);
    }

    .book-spread {
      position: absolute;
      inset: 0;
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
    }

    /* --- paper block: a real box, not a flat plane ----------------------- */
    .book-block {
      position: absolute;
      top: 0;
      left: 50%;
      width: calc(50% + 10px);
      height: calc(100% + 10px);
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
      transform: translateZ(-6px);
    }

    .book-block-page {
      position: absolute;
      inset: 0;
      border-radius: 2px 6px 7px 3px;
      background:
        repeating-linear-gradient(90deg, rgba(122, 108, 86, 0.45) 0 1px, rgba(255, 253, 246, 0.98) 1px 2.5px) right center / 10px 100% no-repeat,
        repeating-linear-gradient(180deg, rgba(122, 108, 86, 0.4) 0 1px, rgba(255, 253, 246, 0.98) 1px 2.5px) bottom center / 100% 10px no-repeat,
        linear-gradient(90deg, rgba(58, 42, 24, 0.36), rgba(0, 0, 0, 0) 32px),
        linear-gradient(180deg, #fdfaf1, #efe7d5);
      box-shadow: inset 0 0 0 1px rgba(150, 128, 92, 0.22);
    }

    /* Shadow the shut cover casts across the pages; it lifts as the cover opens. */
    .book-block-shade {
      position: absolute;
      inset: 0;
      border-radius: 2px 6px 7px 3px;
      background: linear-gradient(90deg, rgba(28, 18, 6, 0.5), rgba(28, 18, 6, 0.14) 44%, rgba(0, 0, 0, 0));
      pointer-events: none;
    }

    .book-block-edge {
      position: absolute;
      background-color: #efe7d5;
    }

    /* Fore-edge: the page lines of the stack, seen from the right. */
    .book-block-fore {
      top: 0;
      left: 100%;
      width: var(--book-depth);
      height: 100%;
      transform-origin: left center;
      transform: rotateY(90deg);
      background: repeating-linear-gradient(90deg, rgba(122, 108, 86, 0.5) 0 1px, rgba(255, 253, 246, 0.98) 1px 2.4px);
      box-shadow: inset 0 0 9px rgba(90, 70, 44, 0.3);
    }

    /* Bottom edge: the same stack seen from below. */
    .book-block-foot {
      left: 0;
      top: 100%;
      width: 100%;
      height: var(--book-depth);
      transform-origin: center top;
      transform: rotateX(-90deg);
      background: repeating-linear-gradient(180deg, rgba(122, 108, 86, 0.45) 0 1px, rgba(255, 253, 246, 0.98) 1px 2.4px);
      box-shadow: inset 0 0 9px rgba(90, 70, 44, 0.26);
    }

    /* The turned stack on the left half: the mirror of the paper block, lying on
       the opened board. It fades in as the cover passes the spine, so the open
       book shows page edges on BOTH sides instead of only the right one. It is
       hinged on the spine like a leaf and tipped 0.5px above the board, so the
       turned leaves stack on top of it in the right order. */
    .book-block-left {
      position: absolute;
      top: 0;
      left: 50%;
      width: calc(50% + ${BLOCK_LIP}px);
      height: calc(100% + ${BLOCK_LIP}px);
      transform-origin: left center;
      transform: rotateY(${LEFT_REST}deg) translateZ(0.5px);
      border-radius: 2px 6px 7px 3px;
      background:
        repeating-linear-gradient(90deg, rgba(122, 108, 86, 0.42) 0 1px, rgba(255, 253, 246, 0.98) 1px 2.5px) right center / 10px 100% no-repeat,
        repeating-linear-gradient(180deg, rgba(122, 108, 86, 0.36) 0 1px, rgba(255, 253, 246, 0.98) 1px 2.5px) bottom center / 100% 10px no-repeat,
        linear-gradient(90deg, rgba(58, 42, 24, 0.34), rgba(0, 0, 0, 0) 28px),
        linear-gradient(180deg, #fbf7ec, #efe7d5);
      box-shadow: inset 0 0 0 1px rgba(150, 128, 92, 0.2);
      /* Revealed from the spine outwards, in step with the board landing on it. */
      clip-path: inset(0 100% 0 0);
    }

    /* Contact shadow on the surface under the book. */
    .book-floor {
      position: absolute;
      top: 100%;
      left: 4%;
      width: 92%;
      height: 340px;
      transform-origin: center top;
      transform: rotateX(-90deg) translateZ(2px);
      background: radial-gradient(ellipse at 50% 0%, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2) 40%, rgba(0, 0, 0, 0) 72%);
      opacity: 0.72;
      pointer-events: none;
    }

    /* Back board, a little larger than the block so the boards overhang. */
    .book-back {
      position: absolute;
      top: 0;
      left: 50%;
      width: calc(50% + 14px);
      height: calc(100% + 14px);
      transform: translateZ(-${BACK_Z}px);
      border-radius: 2px 7px 8px 3px;
      background: linear-gradient(215deg, #33261a 0%, #150e08 58%, #0a0705 100%);
      box-shadow: -2px 8px 20px rgba(0, 0, 0, 0.5);
    }

    /* --- turning elements: two-faced cards hinged on the spine ----------- */
    .book-card {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 100%;
      transform-origin: left center;
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
    }

    .book-card-face {
      position: absolute;
      inset: 0;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
    }

    .book-card-back {
      transform: rotateY(180deg);
    }

    /* Front board: the shelf cover, unchanged. Only the sizing it inherits from
       the shelf grid and its own page-block strips are neutralised here - the
       animation draws its own block. */
    .book-cover-front.yearbook-cover {
      --cover-width: 100%;
      width: 100%;
      height: 100%;
      max-width: none;
      aspect-ratio: auto;
      margin: 0;
      transform: none;
      transition: none;
    }

    .book-cover-front.yearbook-cover::before,
    .book-cover-front.yearbook-cover::after {
      content: none;
    }

    /* Light sweeping across the board as the book turns. */
    .book-cover-sheen {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(104deg, rgba(255, 255, 255, 0) 26%, rgba(255, 255, 255, 0.26) 44%, rgba(255, 255, 255, 0) 60%);
      opacity: 0;
      pointer-events: none;
    }

    /* Inside of the front board. It is mirrored by its own 180deg flip, so the
       gutter shadow sits on its right edge to land beside the spine. */
    .book-cover-back {
      border-radius: 3px 4px 4px 9px;
      background: linear-gradient(160deg, #f8f2e3 0%, #e8dcc2 100%);
      box-shadow:
        inset -16px 0 20px -14px rgba(58, 42, 24, 0.55),
        inset 0 0 0 1px rgba(120, 98, 66, 0.32);
    }

    /* Leaves: a photo page on the front, plain paper on the back. The offsets
       order the stack; the values are mirrored once a leaf has turned, which is
       what puts the last-turned leaf on top of the pile. */
    .book-leaf-1 { --leaf-z: -1px; --leaf-rest: -178deg; }
    .book-leaf-2 { --leaf-z: -2px; --leaf-rest: -176deg; }
    .book-leaf-3 { --leaf-z: -3px; --leaf-rest: -174deg; }
    .book-leaf-4 { --leaf-z: -4px; --leaf-rest: -172deg; }

    .book-leaf-front {
      padding: 10px;
      background: var(--sheet);
      box-shadow: inset 14px 0 18px -14px rgba(58, 42, 24, 0.55);
    }

    .book-leaf-photo {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 2px;
      background: #e8e0cd;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
    }

    .book-leaf-back {
      background: linear-gradient(200deg, #fbf7ec, #efe7d5);
      box-shadow: inset -14px 0 18px -14px rgba(58, 42, 24, 0.5);
    }

    /* --- timeline ------------------------------------------------------- */

    /* Fit scale relaxes from the hero close-up to the whole spread. The shift
       below uses the same window and easing, so the closed book stays centred
       while the camera pulls back. */
    @keyframes bookZoomOpen {
      0% { transform: scale(var(--book-scale-start, 1)); }
      46% { transform: scale(var(--book-scale, 1)); }
      100% { transform: scale(var(--book-scale, 1)); }
    }

    /* Recentring, in unscaled panel px (the fit scale multiplies it). X follows
       the board's sweep; the small Y nudge cancels the way the perspective
       magnifies the near bottom edge as the book flattens - without it the book
       rides up to ~45px high mid-turn on a desktop. Both curves hold at every
       viewport size, and were measured off the rendered book. */
    @keyframes bookShiftOpen {
      0% { transform: translate(${SHIFT}px, 9px); }
      11% { transform: translate(${SHIFT}px, 16px); }
      22% { transform: translate(${SHIFT}px, 21px); }
      33% { transform: translate(${SHIFT}px, 22px); }
      44% { transform: translate(calc(${SHIFT}px + 35px), 22px); }
      56% { transform: translate(calc(${SHIFT}px + 77px), 22px); }
      67% { transform: translate(calc(${SHIFT}px + 127px), 18px); }
      78% { transform: translate(calc(${SHIFT}px + 132px), 14px); }
      89% { transform: translate(calc(${SHIFT}px + 130px), 4px); }
      100% { transform: translate(calc(${SHIFT}px + 129px), -3px); }
    }

    /* The left stack is uncovered exactly as fast as the board lands on it, so
       its page edges appear on the left half as the book opens. */
    @keyframes bookLeftStack {
      0%, 50% { clip-path: inset(0 100% 0 0); }
      62% { clip-path: inset(0 18% 0 0); }
      78% { clip-path: inset(0 1% 0 0); }
      100% { clip-path: inset(0 0 0 0); }
    }

    @keyframes bookTiltOpen {
      0% { transform: rotateX(11deg) rotateY(-24deg) rotateZ(-1.6deg); }
      22% { transform: rotateX(10deg) rotateY(-17deg) rotateZ(-1.1deg); }
      52% { transform: rotateX(7deg) rotateY(-3deg) rotateZ(-0.3deg); }
      76% { transform: rotateX(6deg) rotateY(4deg) rotateZ(0.4deg); }
      100% { transform: rotateX(4deg) rotateY(0deg) rotateZ(0deg); }
    }

    @keyframes bookCoverOpen {
      0% { transform: rotateY(0deg); }
      8% { transform: rotateY(-14deg); }
      24% { transform: rotateY(-42deg); }
      50% { transform: rotateY(-96deg); }
      78% { transform: rotateY(-172deg); }
      92% { transform: rotateY(-182deg); }
      100% { transform: rotateY(-178deg); }
    }

    @keyframes bookLeafFlip {
      0% { transform: rotateY(0deg) rotateZ(0deg) translateZ(var(--leaf-z, -1px)); }
      45% { transform: rotateY(calc(var(--leaf-rest, -176deg) * 0.5)) rotateZ(1.2deg) translateZ(var(--leaf-z, -1px)); }
      100% { transform: rotateY(var(--leaf-rest, -176deg)) rotateZ(0deg) translateZ(var(--leaf-z, -1px)); }
    }

    @keyframes bookSheen {
      0% { opacity: 0; }
      12% { opacity: 0.5; }
      38% { opacity: 0.85; }
      62% { opacity: 0.2; }
      100% { opacity: 0; }
    }

    @keyframes bookShadeLift {
      0% { opacity: 1; }
      30% { opacity: 0.8; }
      60% { opacity: 0.24; }
      100% { opacity: 0; }
    }

    @keyframes bookFloorSpread {
      0% { opacity: 0.72; }
      100% { opacity: 1; }
    }

    .book-scene.is-opening .book-zoom {
      animation: bookZoomOpen ${DURATION}ms cubic-bezier(0.33, 0.08, 0.26, 1) forwards;
    }

    .book-scene.is-opening .book-rig {
      animation: bookShiftOpen ${DURATION}ms cubic-bezier(0.32, 0.06, 0.24, 1) forwards;
    }

    .book-scene.is-opening .book-tilt {
      animation: bookTiltOpen ${DURATION}ms cubic-bezier(0.33, 0.08, 0.26, 1) forwards;
    }

    .book-scene.is-opening .book-cover {
      animation: bookCoverOpen ${DURATION}ms cubic-bezier(0.32, 0.06, 0.24, 1) forwards;
    }

    .book-scene.is-opening .book-leaf {
      animation: bookLeafFlip ${LEAF_DURATION}ms cubic-bezier(0.3, 0.08, 0.24, 1) forwards;
    }

    .book-scene.is-opening .book-leaf-1 { animation-delay: ${LEAF_START}ms; }
    .book-scene.is-opening .book-leaf-2 { animation-delay: ${LEAF_START + LEAF_STAGGER}ms; }
    .book-scene.is-opening .book-leaf-3 { animation-delay: ${LEAF_START + LEAF_STAGGER * 2}ms; }
    .book-scene.is-opening .book-leaf-4 { animation-delay: ${LEAF_START + LEAF_STAGGER * 3}ms; }

    .book-scene.is-opening .book-cover-sheen {
      animation: bookSheen ${DURATION}ms linear forwards;
    }

    .book-scene.is-opening .book-block-shade {
      animation: bookShadeLift ${DURATION}ms cubic-bezier(0.33, 0.08, 0.26, 1) forwards;
    }

    .book-scene.is-opening .book-block-left {
      animation: bookLeftStack ${DURATION}ms cubic-bezier(0.32, 0.06, 0.24, 1) forwards;
    }

    .book-scene.is-opening .book-floor {
      animation: bookFloorSpread ${DURATION}ms cubic-bezier(0.33, 0.08, 0.26, 1) forwards;
    }

    .book-scene.is-opening .book-zoom,
    .book-scene.is-opening .book-rig,
    .book-scene.is-opening .book-tilt,
    .book-scene.is-opening .book-card {
      will-change: transform;
    }

    @media (prefers-reduced-motion: reduce) {
      .book-scene.is-opening .book-zoom,
      .book-scene.is-opening .book-rig,
      .book-scene.is-opening .book-tilt,
      .book-scene.is-opening .book-cover,
      .book-scene.is-opening .book-leaf,
      .book-scene.is-opening .book-block-left {
        animation-duration: 1ms;
        animation-delay: 0ms;
      }
    }
`;

  function injectStyles() {
    if (document.getElementById('book-animation-styles')) return;
    const style = document.createElement('style');
    style.id = 'book-animation-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  function createLeafMarkup(index) {
    return `
            <span class="book-card book-leaf book-leaf-${index}">
              <span class="book-card-face book-leaf-front">
                <img class="book-leaf-photo" alt="" data-leaf-photo="${index}">
              </span>
              <span class="book-card-face book-card-back book-leaf-back"></span>
            </span>`;
  }

  function createBookMarkup() {
    // Deepest leaf first, so the DOM order matches the closed stack (cover last).
    const leaves = [4, 3, 2, 1].map(createLeafMarkup).join('');
    return `
      <span class="book-scene">
        <span class="book-zoom">
          <span class="book-rig">
            <span class="book-floor"></span>
            <span class="book-tilt">
              <span class="book-spread">
                <span class="book-back"></span>
                <span class="book-block">
                  <span class="book-block-page"></span>
                  <span class="book-block-shade"></span>
                  <span class="book-block-edge book-block-fore"></span>
                  <span class="book-block-edge book-block-foot"></span>
                </span>
                <span class="book-block-left"></span>${leaves}
                <span class="book-card book-cover">
                  <span class="book-card-face book-cover-front yearbook-cover">
                    <span class="cover-head">
                      <span class="cover-kicker">SCSLAI Cares</span>
                      <span class="cover-wordmark">Yearbook</span>
                      <span class="cover-year" data-book-year></span>
                    </span>
                    <span class="cover-plate">
                      <img alt="" data-book-cover-image>
                    </span>
                    <span class="cover-foot">
                      <span class="cover-motto" data-book-motto></span>
                    </span>
                    <span class="book-cover-sheen"></span>
                  </span>
                  <span class="book-card-face book-card-back book-cover-back"></span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </span>`;
  }

  function prefersReducedMotion() {
    return Boolean(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  const BookAnimation = {
    /**
     * Build the animated book inside a container (idempotent).
     * @param {HTMLElement|string} container
     * @returns {{prepare: Function, play: Function, stop: Function, reset: Function, destroy: Function}|null}
     */
    mount(container) {
      injectStyles();

      const stage = typeof container === 'string' ? document.querySelector(container) : container;
      if (!stage) {
        console.error('BookAnimation: container not found');
        return null;
      }
      if (stage.__bookAnimation) return stage.__bookAnimation;

      stage.classList.add('book-opening-stage');
      stage.innerHTML = createBookMarkup();

      const scene = stage.querySelector('.book-scene');
      const tilt = stage.querySelector('.book-tilt');
      const coverFront = stage.querySelector('.book-cover-front');
      const yearEl = stage.querySelector('[data-book-year]');
      const mottoEl = stage.querySelector('[data-book-motto]');
      const coverImage = stage.querySelector('[data-book-cover-image]');
      const leafPhotos = Array.from(stage.querySelectorAll('[data-leaf-photo]'));

      let finishCurrentRun = null;
      let capTimer = 0;
      let resizeRaf = 0;

      // Fit the spread to the stage box the overlay really gives us. The stage
      // is its own flex row above the caption, and visualViewport accounts for
      // mobile browser chrome, so the book never lands under either.
      function applyScale() {
        const rect = stage.getBoundingClientRect();
        const viewport = window.visualViewport;
        const stageW = Math.round(rect.width) || (viewport ? Math.round(viewport.width) : window.innerWidth) || 1024;
        const stageH = Math.round(rect.height) || (viewport ? Math.round(viewport.height) : window.innerHeight) || 768;
        const gutter = Math.min(48, Math.max(14, Math.round(stageW * 0.04)));
        // The 3D tilt enlarges the projected footprint, so both axes are fitted
        // with that headroom - the shut book is the tallest frame of the turn.
        const fit = Math.min(
          (stageW - gutter) / (SPREAD_W * INFLATE_W),
          (stageH / (PANEL_H * INFLATE_H)) * 0.86
        );
        const scale = Math.max(0.4, Math.min(2.6, fit));

        // Phones get a hero close-up of the shut book that relaxes as it opens,
        // clamped so the boosted cover still fits the stage height.
        const wantedBoost = stageW < 620 ? 1.24 : 1.06;
        const roomForBoost = stageH / (PANEL_H * scale * 1.25);
        const boost = Math.max(1, Math.min(wantedBoost, roomForBoost));

        scene.style.setProperty('--book-scale', scale.toFixed(4));
        scene.style.setProperty('--book-scale-start', (scale * boost).toFixed(4));
      }

      function scheduleScale() {
        if (resizeRaf) return;
        resizeRaf = window.requestAnimationFrame(() => {
          resizeRaf = 0;
          // Only re-fit while the book is idle: the scale feeds the keyframes.
          if (!scene.classList.contains('is-opening')) applyScale();
        });
      }

      window.addEventListener('resize', scheduleScale);
      window.addEventListener('orientationchange', scheduleScale);
      if (window.visualViewport) window.visualViewport.addEventListener('resize', scheduleScale);

      function applySkin(skin) {
        const year = String(skin.year || '').trim();
        const motto = String(skin.motto || '').trim();

        yearEl.textContent = year || 'Yearbook';
        // Two-year editions need the tighter numeral (same class as the shelf).
        yearEl.classList.toggle('cover-year-range', year.length > 4);
        mottoEl.textContent = motto;
        mottoEl.parentElement.hidden = !motto;

        if (skin.coverImage) coverImage.src = skin.coverImage;

        const pageImages = Array.isArray(skin.pageImages) ? skin.pageImages : [];
        leafPhotos.forEach((photo, index) => {
          const src = pageImages[index];
          if (src) {
            photo.src = src;
            photo.hidden = false;
          } else {
            photo.removeAttribute('src');
            photo.hidden = true;
          }
        });

        // Cloth colours come straight off the shelf card, so the shelf book and
        // the opening book can never drift apart.
        if (Array.isArray(skin.cloth)) {
          if (skin.cloth[0]) coverFront.style.setProperty('--cover-cloth-1', skin.cloth[0]);
          if (skin.cloth[1]) coverFront.style.setProperty('--cover-cloth-2', skin.cloth[1]);
        }
      }

      function settle() {
        const finish = finishCurrentRun;
        finishCurrentRun = null;
        if (typeof finish === 'function') finish();
      }

      function reset() {
        scene.classList.remove('is-opening');
        // Force a reflow so the next play() restarts from frame 0.
        void tilt.offsetWidth;
      }

      /**
       * Paint the closed book for an edition without starting the animation.
       * Lets the caller reveal the overlay with the book already on screen.
       * @param {Object} [skin] { year, motto, coverImage, pageImages, cloth }
       */
      function prepare(skin) {
        settle();
        applySkin(skin || {});
        applyScale();
        reset();
      }

      /**
       * Run the opening sequence.
       * @param {Object} [skin] { year, motto, coverImage, pageImages, cloth }
       * @returns {Promise<void>} resolves once the book has finished opening
       */
      function play(skin) {
        prepare(skin);

        if (prefersReducedMotion()) return Promise.resolve();

        return new Promise((resolve) => {
          const finish = () => {
            if (finishCurrentRun !== finish) return;
            finishCurrentRun = null;
            window.clearTimeout(capTimer);
            capTimer = 0;
            tilt.removeEventListener('animationend', onAnimationEnd);
            resolve();
          };
          const onAnimationEnd = (event) => {
            if (event.target === tilt && event.animationName === TILT_ANIMATION) finish();
          };

          finishCurrentRun = finish;
          tilt.addEventListener('animationend', onAnimationEnd);
          scene.classList.add('is-opening');
          // Safety cap in case animationend never fires (hidden tab, etc.).
          capTimer = window.setTimeout(finish, DURATION + 900);
        });
      }

      function stop() {
        window.clearTimeout(capTimer);
        capTimer = 0;
        scene.classList.remove('is-opening');
        settle();
      }

      function destroy() {
        stop();
        if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
        resizeRaf = 0;
        window.removeEventListener('resize', scheduleScale);
        window.removeEventListener('orientationchange', scheduleScale);
        if (window.visualViewport) window.visualViewport.removeEventListener('resize', scheduleScale);
        stage.innerHTML = '';
        stage.classList.remove('book-opening-stage');
        delete stage.__bookAnimation;
      }

      const api = { prepare, play, stop, reset, destroy };
      stage.__bookAnimation = api;
      return api;
    },

    /** Standalone demo: fills an empty document so the animation can be tuned. */
    createDemo(options = {}) {
      document.body.style.margin = '0';
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
      document.body.style.background = '#0b0805';
      const stage = document.createElement('div');
      stage.style.cssText = 'position:fixed;inset:0;';
      document.body.appendChild(stage);
      const api = this.mount(stage);
      if (api) api.play(options);
      return api;
    }
  };

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookAnimation;
  } else {
    global.BookAnimation = BookAnimation;
  }
})(typeof window !== 'undefined' ? window : globalThis);
