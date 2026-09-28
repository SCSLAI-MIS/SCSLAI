

// ===========================
// Premium yearbook library
// ===========================

// 2022 Edition - Using scslaicares images
const pages2022 = [
  'images/gallery/silungan/SCSLAI.png',
  'images/gallery/silungan/1S.jpg',
  'images/gallery/silungan/2S.jpg',
  'images/gallery/silungan/3S.jpg',
  'images/gallery/silungan/4S.jpg',
  'images/gallery/silungan/5S.jpg',
  'images/gallery/silungan/6S.jpg',
  'images/gallery/silungan/7S.jpg',
  'images/gallery/silungan/8S.jpg'
  
];

// 2024 Edition - Using outreach images
const pages2024 = [
  'images/gallery/Tree planting/tree-planting.jpg',
  'images/gallery/Tree planting/1T.jpg',
  'images/gallery/Tree planting/2T.jpg',
  'images/gallery/Tree planting/3T.jpg',
  'images/gallery/Tree planting/4T.jpg',
  'images/gallery/Tree planting/5T.jpg',
  'images/gallery/Tree planting/6T.jpg',
  'images/gallery/Tree planting/7T.jpg',
  'images/gallery/Tree planting/8T.jpg',
  'images/gallery/Tree planting/9T.jpg',
  'images/gallery/Tree planting/10T.jpg',
  'images/gallery/Tree planting/11T.jpg',
  'images/gallery/Tree planting/12T.jpg',
  'images/gallery/Tree planting/13T.jpg',
  'images/gallery/Tree planting/14T.jpg',
  'images/gallery/Tree planting/15T.jpg',
  'images/gallery/Tree planting/16T.jpg'
  
];

// 2025 Edition - Using Tree planting images
const pages2025 = [
  'images/gallery/outreach/OUTREACH.png',
  'images/gallery/outreach/1.jpg',
  'images/gallery/outreach/2.jpg',
  'images/gallery/outreach/3.jpg',
  'images/gallery/outreach/4.jpg',
  'images/gallery/outreach/5.jpg',
  'images/gallery/outreach/6.jpg',
  'images/gallery/outreach/7.jpg',
  'images/gallery/outreach/8.jpg',
  'images/gallery/outreach/9.jpg',
  'images/gallery/outreach/10.jpg',
  'images/gallery/outreach/11.jpg',
  'images/gallery/outreach/12.jpg',
  'images/gallery/outreach/13.jpg',
  'images/gallery/outreach/14.jpg',
  'images/gallery/outreach/15.jpg',
  'images/gallery/outreach/16.jpg',
  'images/gallery/outreach/17.jpg',
  'images/gallery/outreach/18.jpg',
  'images/gallery/outreach/19.jpg',
  'images/gallery/outreach/20.jpg',
  'images/gallery/outreach/21.jpg',
  'images/gallery/outreach/22.jpg',
  'images/gallery/outreach/24.jpg', 
  'images/gallery/outreach/25.jpg',
  'images/gallery/outreach/26.jpg',
  'images/gallery/outreach/27.jpg',
  'images/gallery/outreach/28.jpg',
  'images/gallery/outreach/29.jpg',
  'images/gallery/outreach/30.jpg',
  'images/gallery/outreach/31.jpg',
  'images/gallery/outreach/32.jpg',
  'images/gallery/outreach/33.jpg',
  'images/gallery/outreach/34.jpg',
  'images/gallery/outreach/35.jpg',
  'images/gallery/outreach/36.jpg',
  'images/gallery/outreach/37.jpg'

];

function buildPageRecords(year, imageList) {
  return imageList.map((image, index) => ({
    image,
    pageNumber: index + 1,
    // Optional: keep a simple title for alt text
    activityTitle: `${year} Activity ${index + 1}`
  }));
}

const yearbookData = [
{
    year: 2025,
    badge: 'Serving with Compassion',
    title: '2025 Edition',
    summary: 'Serving with Compassion',
    pages: buildPageRecords(2025, pages2025),
    editionDetails: {
        activityTitle: '2025 Outreach Program for the Aeta Community',
        caption: 'SCSLAI extended care and support to the Aeta community in Calumpang, Pampanga through a meaningful community outreach program.',
        narrative: 'The outreach program brought SCSLAI members, volunteers, and community partners together to extend assistance and support to the Aeta community in Calumpang, Pampanga. The initiative reflects SCSLAI’s commitment to community service by reaching underserved communities, promoting compassion, and strengthening partnerships through meaningful outreach activities.',
        date: '2025',
        venue: 'Calumpang, Mabalacat City, Pampanga',
        participants: 'SCSLAI members, volunteers, community partners, and Aeta community beneficiaries',
        photographer: 'SCSLAI Documentation Team',
        album: '2025 Aeta Community Outreach Collection',
        remarks: 'A meaningful outreach initiative that strengthened SCSLAI’s commitment to serving and supporting communities in need.',
        tags: ['2025', 'outreach', 'Aeta community', 'Calumpang', 'Pampanga', 'community service']
    }
},
{
    year: 2024,
    badge: 'Growing a Greener Future',
    title: '2024 Edition',
    summary: 'Growing a Greener Future.',
    pages: buildPageRecords(2024, pages2024),
    editionDetails: {
        activityTitle: '2024 Tree Planting Activity',
        caption: 'SCSLAI members and volunteers came together in Rizal to help protect the environment and promote a greener future through tree planting.',
        narrative: 'The tree planting activity brought together SCSLAI members, volunteers, and community partners in an effort to contribute to environmental conservation. Through planting and caring for trees, the activity promoted environmental awareness, community participation, and a shared commitment to creating a healthier and greener environment for future generations.',
        date: '2024',
        venue: 'Rizal',
        participants: 'SCSLAI members, volunteers, and community partners',
        photographer: 'SCSLAI Documentation Team',
        album: '2024 Tree Planting Activity Collection',
        remarks: 'A meaningful environmental initiative that encouraged community involvement and contributed to the preservation and restoration of green spaces.',
        tags: ['2024', 'tree planting', 'Rizal', 'environment', 'conservation', 'community']
    }
},
{
    year: 2022,
    badge: 'Silungan ng Pag-asa',
    title: '2022-2023 Edition',
    summary: 'A community initiative focused on providing support, care, and a safe place for individuals and families in need.',
    pages: buildPageRecords(2022 , pages2022),
    editionDetails: {
        activityTitle: 'Silungan ng Pag-asa',
        caption: 'An SCSLAI initiative that extends compassion and assistance to individuals and families in need through community support and outreach.',
        narrative: 'Silungan ng Pag-asa reflects SCSLAI’s commitment to serving the community by providing support and assistance to people facing difficult circumstances. The initiative aims to offer hope, care, and meaningful help to beneficiaries while strengthening the spirit of compassion and solidarity among SCSLAI members and community partners.',
        date: '2022-2023',
        venue: 'Silungan ng Pag-asa Community Center',
        participants: 'SCSLAI members, volunteers, beneficiaries, and community partners',
        photographer: 'SCSLAI Documentation Team',
        album: 'Silungan ng Pag-asa Collection',
        remarks: 'A meaningful community initiative that provided support and hope to beneficiaries in need.',
        tags: ['2022-2023', 'Silungan ng Pag-asa', 'community', 'outreach', 'support', 'hope']
    }
}
];

function preloadBasePages() {
  if (preloadPromise) return preloadPromise;

  // Combine all image sources for preloading
  const sourcesToPreload = [
    ...pages2022, 
    ...pages2024, 
    ...pages2025
  ];
  
  preloadPromise = Promise.all(sourcesToPreload.map((src) => new Promise(async (resolve) => {
    const resolvedSrc = await preloadImageBlobUrl(src);
    const img = new Image();
    img.decoding = 'sync';
    img.loading = 'eager';

    const finish = () => {
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {}).finally(resolve);
        return;
      }
      resolve();
    };

    img.src = resolvedSrc;
    if (img.complete) {
      finish();
      return;
    }
    img.onload = finish;
    img.onerror = () => resolve();
  })));

  return preloadPromise;
}

const yearbookButtons = document.querySelectorAll('.yearbook-book');
const yearbookReader = document.getElementById('yearbook-reader');
const readerBadge = document.querySelector('[data-reader-badge]');
const readerTitle = document.querySelector('[data-reader-title]');
const readerSummary = document.querySelector('[data-reader-summary]');
const pageFlipHost = document.getElementById('page-flip-host');
let flipbookElement = document.getElementById('flipbook');
const closeReaderButtons = document.querySelectorAll('[data-close-reader]');
const detailsToggle = document.querySelector('[data-toggle-details]');
const readerPaginationPrev = document.querySelector('[data-reader-prev]');
const readerPaginationNext = document.querySelector('[data-reader-next]');
const readerPageIndicator = document.querySelector('[data-reader-indicator]');
const readerPanel = document.querySelector('.reader-panel');
let detailsExpanded = false;
const bookOpening = document.getElementById('book-opening');
const bookOpeningLabel = document.querySelector('[data-book-opening-label]');
const bookOpeningVideo = document.getElementById('book-opening-video');
// ===========================
// Green-screen chroma key for the book-opening animation
// ===========================
//
// The book-opening video ("animation/Book.mp4") is recorded against
// a green screen. A plain <video> element cannot display transparency, so each
// frame is copied onto a single reused canvas and the green background is keyed
// out in real time (alpha = 0) before the frame is presented. The exact shade
// of green is sampled from the video itself instead of assuming pure #00FF00,
// a hue tolerance plus a soft feather band keeps the edges free of hard halos,
// and green spill is suppressed along those softened edges. Neutral (paper,
// white) and near-black pixels are always kept so the book itself stays solid.

const CHROMA_KEY_CONFIG = {
  hueTolerance: 20,          // degrees around the sampled hue that are fully removed
  hueFeather: 24,            // soft falloff band that prevents harsh halos
  despillRange: 30,          // extra band where green spill is neutralized on kept pixels
  saturationFloor: 0.18,     // low-saturation (neutral) pixels are always kept
  valueFloor: 0.10,          // near-black pixels are always kept
  sampleHueRange: [70, 170], // hues counted as "green-ish" while sampling
  minSamplePixels: 200,      // green samples required before the sample is trusted
  fallbackKeyHue: 120        // used until (and unless) the video itself is sampled
};

function hueDistanceTo(hue, keyHue) {
  const diff = Math.abs(hue - keyHue) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function computeHue(r, g, b, max, delta) {
  if (delta === 0) return 0;
  let hue;
  if (max === r) hue = 60 * (((g - b) / delta) % 6);
  else if (max === g) hue = 60 * ((b - r) / delta + 2);
  else hue = 60 * ((r - g) / delta + 4);
  return hue < 0 ? hue + 360 : hue;
}

function createBookOpeningChromaKey(video) {
  if (!video) {
    return { start() {}, stop() {} };
  }

  const supportsVideoFrameCallback = typeof video.requestVideoFrameCallback === 'function';
  const state = {
    canvas: null,
    ctx: null,
    overlay: null,
    active: false,
    usingFallback: false,
    frameHandle: 0,
    rafId: 0,
    keyHue: CHROMA_KEY_CONFIG.fallbackKeyHue,
    hasSampledKey: false,
    lastVideoTime: -1,
    resizeHandler: null
  };

  function ensureCanvas() {
    if (state.canvas) return true;
    const panel = video.parentElement;
    if (!panel) return false;

    // One canvas for the whole session; reused on every opening.
    const canvas = document.createElement('canvas');
    canvas.className = 'book-opening-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    panel.appendChild(canvas);

    state.canvas = canvas;
    state.ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true });
    return Boolean(state.ctx);
  }

  function syncCanvasSize() {
    if (!state.canvas) return;
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;
    // Backing store matches the video's intrinsic size, so the aspect ratio is
    // preserved exactly; CSS (object-fit: contain) handles responsive display.
    if (state.canvas.width !== width || state.canvas.height !== height) {
      state.canvas.width = width;
      state.canvas.height = height;
    }
  }

  function readFramePixels() {
    try {
      return state.ctx.getImageData(0, 0, state.canvas.width, state.canvas.height);
    } catch (error) {
      // Pixel access failed (e.g. tainted canvas) - fall back to the raw video.
      return null;
    }
  }

function sampleKeyColorFromEdges(imageData) {
    const { data } = imageData;
    const width = state.canvas.width;
    const height = state.canvas.height;
    const [hueMin, hueMax] = CHROMA_KEY_CONFIG.sampleHueRange;
    const band = Math.max(2, Math.floor(Math.min(width, height) * 0.1));
    const step = Math.max(2, Math.floor(Math.min(width, height) / 40));

    let sumCos = 0;
    let sumSin = 0;
    let samples = 0;

    const consider = (x, y) => {
      const index = (y * width + x) * 4;
      if (data[index + 3] === 0) return;
      const r = data[index] / 255;
      const g = data[index + 1] / 255;
      const b = data[index + 2] / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      if (max === 0 || max < 0.06 || delta / max < 0.15) return;

      const hue = computeHue(r, g, b, max, delta);
      if (hue < hueMin || hue > hueMax) return;

      // Circular mean so a hue near 0/360 cannot skew the average.
      const radians = (hue * Math.PI) / 180;
      sumCos += Math.cos(radians);
      sumSin += Math.sin(radians);
      samples += 1;
    };

    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < band; y += step) {
        consider(x, y);
        consider(x, height - 1 - y);
      }
    }
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < band; x += step) {
        consider(x, y);
        consider(width - 1 - x, y);
      }
    }

    if (samples < CHROMA_KEY_CONFIG.minSamplePixels) return false;

    const meanHue = (Math.atan2(sumSin, sumCos) * 180) / Math.PI;
    state.keyHue = meanHue < 0 ? meanHue + 360 : meanHue;
    return true;
  }

  function keyOutGreenPixels(imageData) {
    const data = imageData.data;
    const { hueTolerance, hueFeather, despillRange, saturationFloor, valueFloor } = CHROMA_KEY_CONFIG;
    const innerBound = hueTolerance;
    const outerBound = hueTolerance + hueFeather;
    const despillBound = outerBound + despillRange;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      const saturation = max === 0 ? 0 : delta / max;

      // Keep neutral tones (paper, white pages) and near-black detail opaque.
      if (saturation < saturationFloor || max < valueFloor) continue;

      const hue = computeHue(r, g, b, max, delta);
      const distance = hueDistanceTo(hue, state.keyHue);

      if (distance <= innerBound) {
        // Solid background: fully transparent (alpha = 0), never recolored.
        data[i + 3] = 0;
        continue;
      }
      if (distance >= outerBound) {
        // Just outside the feather: foreground blends that still carry a green
        // cast (e.g. hair mixed with the screen). Neutralize the spill so no
        // green halo remains, but keep the pixel itself fully visible.
        if (distance < despillBound && g > r && g > b) {
          data[i + 1] = Math.round(Math.max(r, b) * 255);
        }
        continue;
      }

      // Feathered edge: soften the mix and pull the green spill back so the
      // boundary does not glow green against the page behind it.
      const alpha = Math.round(((distance - innerBound) / hueFeather) * 255);
      if (alpha <= 0) {
        data[i + 3] = 0;
        continue;
      }
      if (g > r && g > b) {
        data[i + 1] = Math.round(Math.max(r, b) * 255);
      }
      data[i + 3] = alpha;
    }
  }

  function detachFrameLoop() {
    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
    if (state.frameHandle && supportsVideoFrameCallback) {
      video.cancelVideoFrameCallback?.(state.frameHandle);
      state.frameHandle = 0;
    }
    if (state.resizeHandler) {
      video.removeEventListener('resize', state.resizeHandler);
      state.resizeHandler = null;
    }
  }

  function disableChromaProcessing() {
    state.usingFallback = true;
    state.active = false;
    detachFrameLoop();
    // Real-time keying is unavailable; the plain video element takes over so
    // the opening animation still plays.
    state.overlay?.classList.remove('is-chroma');
    state.overlay?.classList.add('is-fallback');
  }

  function processFrame() {
    if (!state.active || state.usingFallback) return;
    syncCanvasSize();
    if (!state.ctx || !state.canvas.width || !state.canvas.height) return;

    try {
      state.ctx.drawImage(video, 0, 0, state.canvas.width, state.canvas.height);
    } catch (error) {
      disableChromaProcessing();
      return;
    }

    const imageData = readFramePixels();
    if (!imageData) {
      disableChromaProcessing();
      return;
    }

    if (!state.hasSampledKey) {
      // Learn the actual green shade from this first frame before keying it.
      sampleKeyColorFromEdges(imageData);
      state.hasSampledKey = true;
    }

    keyOutGreenPixels(imageData);

    try {
      state.ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      disableChromaProcessing();
    }
  }

  function scheduleNextFrame() {
    if (!state.active || state.usingFallback) return;
    if (supportsVideoFrameCallback) {
      state.frameHandle = video.requestVideoFrameCallback(() => {
        if (!state.active || state.usingFallback) return;
        processFrame();
        scheduleNextFrame();
      });
      return;
    }
    state.rafId = window.requestAnimationFrame(() => {
      if (!state.active || state.usingFallback) return;
      const currentTime = video.currentTime;
      if (currentTime !== state.lastVideoTime) {
        state.lastVideoTime = currentTime;
        processFrame();
      }
      scheduleNextFrame();
    });
  }

  function start() {
    if (state.active) return;
    state.overlay = video.closest('.book-opening');

    if (state.usingFallback) {
      state.overlay?.classList.remove('is-chroma');
      state.overlay?.classList.add('is-fallback');
      return;
    }
    if (!ensureCanvas()) {
      disableChromaProcessing();
      return;
    }

    state.active = true;
    state.hasSampledKey = false;
    state.lastVideoTime = -1;
    syncCanvasSize();

    state.overlay?.classList.remove('is-fallback');
    state.overlay?.classList.add('is-chroma');

    state.resizeHandler = state.resizeHandler || (() => syncCanvasSize());
    if (state.resizeHandler) {
      video.removeEventListener('resize', state.resizeHandler);
    }
    video.addEventListener('resize', state.resizeHandler);
    scheduleNextFrame();
  }

  function stop() {
    state.active = false;
    detachFrameLoop();
    state.overlay?.classList.remove('is-chroma');
    state.overlay?.classList.remove('is-fallback');
    if (state.ctx && state.canvas) {
      state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    }
  }

  return { start, stop };
}

const bookOpeningChromaKey = createBookOpeningChromaKey(bookOpeningVideo);

const detailBindings = {
  activityTitle: document.querySelector('[data-activity-title]'),
  caption: document.querySelector('[data-activity-caption]'),
  narrative: document.querySelector('[data-activity-narrative]'),
  date: document.querySelector('[data-meta-date]'),
  venue: document.querySelector('[data-meta-venue]'),
  participants: document.querySelector('[data-meta-participants]'),
  photographer: document.querySelector('[data-meta-photographer]'),
  album: document.querySelector('[data-meta-album]'),
  remarks: document.querySelector('[data-meta-remarks]'),
  tags: document.querySelector('[data-meta-tags]')
};

let activeYearbookIndex = -1;
let activePages = [];
let resizeRaf = null;
let preloadPromise = null;
const resolvedImageSources = new Map();
let flipLock = false;
let currentSpreadStart = 0;
let currentSpreadPage = 1;
let lastSinglePageMode = false;
let bookOpeningSequence = 0;
let isBookOpening = false;
let photoLightboxIndex = 0;
let photoLightboxOpen = false;
let photoLightboxLastFocus = null;

const photoLightbox = document.getElementById('photo-lightbox');
const photoLightboxImage = photoLightbox?.querySelector('[data-photo-image]') || null;
const photoLightboxCaption = photoLightbox?.querySelector('[data-photo-caption]') || null;
const photoLightboxCounter = photoLightbox?.querySelector('[data-photo-counter]') || null;

function getPhotoAt(index) {
  if (!activePages.length) return null;
  const safe = (index + activePages.length) % activePages.length;
  return activePages[safe];
}

function renderPhotoLightbox() {
  const page = getPhotoAt(photoLightboxIndex);
  if (!page || !photoLightboxImage) return;
  photoLightboxIndex = activePages.indexOf(page);
  photoLightboxImage.src = getResolvedImageSource(page.image);
  photoLightboxImage.alt = page.activityTitle || ('Page ' + page.pageNumber);
  if (photoLightboxCaption) {
    photoLightboxCaption.textContent = page.activityTitle || ('Page ' + page.pageNumber);
  }
  if (photoLightboxCounter) {
    photoLightboxCounter.textContent = 'Page ' + page.pageNumber + ' of ' + activePages.length;
  }
}

function openPhotoLightbox(pageNumber) {
  if (!photoLightbox || !activePages.length) return;
  const idx = activePages.findIndex((p) => p.pageNumber === Number(pageNumber));
  photoLightboxIndex = idx >= 0 ? idx : 0;
  photoLightboxLastFocus = document.activeElement;
  photoLightbox.hidden = false;
  photoLightboxOpen = true;
  document.body.style.overflow = 'hidden';
  renderPhotoLightbox();
  photoLightbox.querySelector('.photo-lightbox-close')?.focus();
}

function closePhotoLightbox() {
  if (!photoLightbox || !photoLightboxOpen) return;
  photoLightbox.hidden = true;
  photoLightboxOpen = false;
  if (!yearbookReader?.hidden) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  if (photoLightboxLastFocus && typeof photoLightboxLastFocus.focus === 'function') {
    photoLightboxLastFocus.focus();
  }
}

function stepPhotoLightbox(delta) {
  if (!photoLightboxOpen || !activePages.length) return;
  photoLightboxIndex = (photoLightboxIndex + delta + activePages.length) % activePages.length;
  renderPhotoLightbox();
}

function bindPhotoLightboxClicks() {
  if (!flipbookElement || flipbookElement.dataset.photoBound === 'true') return;
  flipbookElement.dataset.photoBound = 'true';
  flipbookElement.addEventListener('click', (event) => {
    const card = event.target.closest('[data-photo-page]');
    if (!card || flipLock) return;
    event.stopPropagation();
    openPhotoLightbox(card.getAttribute('data-photo-page'));
  }, true);
  flipbookElement.addEventListener('keydown', (event) => {
    const card = event.target.closest?.('[data-photo-page]');
    if (!card) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      if (!flipLock) openPhotoLightbox(card.getAttribute('data-photo-page'));
    }
  });
}

bindPhotoLightboxClicks();

photoLightbox?.querySelectorAll('[data-close-photo]').forEach((el) => {
  el.addEventListener('click', closePhotoLightbox);
});
photoLightbox?.querySelector('[data-photo-prev]')?.addEventListener('click', (e) => {
  e.stopPropagation();
  stepPhotoLightbox(-1);
});
photoLightbox?.querySelector('[data-photo-next]')?.addEventListener('click', (e) => {
  e.stopPropagation();
  stepPhotoLightbox(1);
});
document.addEventListener('keydown', (event) => {
  if (!photoLightboxOpen) return;
  if (event.key === 'Escape') {
    event.stopPropagation();
    closePhotoLightbox();
  } else if (event.key === 'ArrowLeft') {
    stepPhotoLightbox(-1);
  } else if (event.key === 'ArrowRight') {
    stepPhotoLightbox(1);
  }
});

function getResolvedImageSource(src) {
  return resolvedImageSources.get(src) || src;
}

async function preloadImageBlobUrl(src) {
  if (resolvedImageSources.has(src)) return resolvedImageSources.get(src);

  try {
    const response = await fetch(src, { cache: 'force-cache' });
    if (!response.ok) {
      resolvedImageSources.set(src, src);
      return src;
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    resolvedImageSources.set(src, objectUrl);
    return objectUrl;
  } catch (error) {
    resolvedImageSources.set(src, src);
    return src;
  }
}

function isPhoneLayout() {
  return window.innerWidth <= 820;
}

function isSinglePageMode() {
  // The reader must READ as a book on every device: the open two-page spread
  // (spine + facing pages) is the book cue, so phones keep it too — just at a
  // phone-scaled size with a large taped print on each page.
  return false;
}

function getFlipSize() {
  const visibleHeight = Math.floor(window.visualViewport?.height || window.innerHeight);

  if (isPhoneLayout()) {
    // Open two-page spread sized to the phone width. Facing portrait pages
    // (ratio ~0.61 w/h, like real book pages) keep the book shape while each
    // taped print stays viewable. Prefer measuring the real stage once the
    // panel is on screen; fall back to a conservative estimate while hidden.
    let availableWidth = window.innerWidth - 36;
    const reader = document.querySelector('.yearbook-reader');
    const stage = document.querySelector('.reader-stage');
    if (reader && stage && yearbookReader && !yearbookReader.hidden) {
      const measured = stage.clientWidth;
      if (measured > 200) availableWidth = measured;
    }
    const width = Math.max(260, Math.min(720, Math.floor(availableWidth)));
    const height = Math.max(200, Math.min(Math.floor(width * 0.82), Math.floor(visibleHeight * 0.52)));
    return { width, height };
  }

  const maxWidth = Math.min(1100, Math.floor(window.innerWidth * 0.86));
  const spreadWidth = Math.max(600, maxWidth);
  // Cap by the truly visible height so short/landscape viewports still fit.
  const desiredHeight = Math.max(420, Math.floor(spreadWidth * 0.43));
  const heightCap = Math.max(300, visibleHeight - 160);
  return {
    width: spreadWidth,
    height: Math.min(desiredHeight, heightCap)
  };
}

function applyDetailsState() {
  // Phones open with the detail text collapsed so the taped print is the
  // hero of the first screen; desktop always shows the full details.
  if (!readerPanel) return;
  const collapsed = isPhoneLayout() && !detailsExpanded;
  readerPanel.classList.toggle('details-collapsed', collapsed);
  if (detailsToggle) {
    detailsToggle.setAttribute('aria-expanded', String(!collapsed));
    detailsToggle.textContent = collapsed ? 'View activity details' : 'Hide activity details';
  }
}

function setActiveDetails(pageNumber) {
  const page = activePages[Math.max(0, Math.min(activePages.length - 1, pageNumber - 1))];
  if (!page) return;

  detailBindings.activityTitle.textContent = page.activityTitle;
  detailBindings.caption.textContent = page.caption;
  detailBindings.narrative.textContent = page.narrative;
  detailBindings.date.textContent = page.date;
  detailBindings.venue.textContent = page.venue;
  detailBindings.participants.textContent = page.participants;
  detailBindings.photographer.textContent = page.photographer;
  detailBindings.album.textContent = page.album;
  detailBindings.remarks.textContent = page.remarks;
  detailBindings.tags.textContent = page.tags.join(', ');
}

function currentLogicalPage() {
  return currentSpreadPage;
}

function updateReaderStatus() {
  const page = currentLogicalPage();
  setActiveDetails(page);
}

function getPageAt(index) {
  if (index < 0 || index >= activePages.length) return null;
  return activePages[index];
}

function pageMarkup(page) {
  if (!page) {
    return '<section class="album-page"><article class="print-layout blank-page"></article></section>';
  }

  return `
    <section class="album-page ${page.pageNumber % 2 === 0 ? 'album-page-right' : 'album-page-left'}" data-page-number="${page.pageNumber}">
      <article class="print-layout">
        <h3 class="layout-title"></h3>
        <figure class="scrap-card" data-photo-page="${page.pageNumber}" role="button" tabindex="0" aria-label="View photo for ${page.activityTitle}">
          <span class="tape tape-tl" aria-hidden="true"></span>
          <span class="tape tape-tr" aria-hidden="true"></span>
          <span class="tape tape-bl" aria-hidden="true"></span>
          <span class="tape tape-br" aria-hidden="true"></span>
          <div class="photo-mat">
            <img src="${getResolvedImageSource(page.image)}" alt="${page.activityTitle}" loading="eager" decoding="sync" fetchpriority="high" draggable="false">
          </div>
        </figure>
      </article>
    </section>
  `;
}

function buildBookShell() {
  const size = getFlipSize();
  flipbookElement.style.width = `${size.width}px`;
  flipbookElement.style.height = `${size.height}px`;

  flipbookElement.innerHTML = `
    <div class="book3d" data-book3d>
      <div class="book-half left" data-static-left></div>
      <div class="book-half right" data-static-right></div>
      <div class="turn-sheet" data-turn-sheet hidden>
        <div class="turn-face turn-front" data-turn-front></div>
        <div class="turn-face turn-back" data-turn-back></div>
        <div class="turn-shadow" data-turn-shadow></div>
      </div>
    </div>
  `;
}

function renderStaticSpread() {
  const leftEl = flipbookElement.querySelector('[data-static-left]');
  const rightEl = flipbookElement.querySelector('[data-static-right]');
  if (!leftEl || !rightEl) return;

  if (isSinglePageMode()) {
    // One full-width page per view on phones.
    const current = getPageAt(currentSpreadStart);
    leftEl.innerHTML = '';
    rightEl.innerHTML = pageMarkup(current);
    currentSpreadPage = current?.pageNumber || 1;
    return;
  }

  const left = getPageAt(currentSpreadStart);
  const right = getPageAt(currentSpreadStart + 1);

  leftEl.innerHTML = pageMarkup(left);
  rightEl.innerHTML = pageMarkup(right);

  currentSpreadPage = (left?.pageNumber || right?.pageNumber || 1);
  // updateReaderStatus(); // Removed - details are now set per-edition, not per-page
  updatePageIndicator();
}

function updatePageIndicator() {
  if (!readerPageIndicator) return;

  const total = activePages.length || 1;
  const leftNum = getPageAt(currentSpreadStart)?.pageNumber ?? null;
  const rightNum = getPageAt(currentSpreadStart + 1)?.pageNumber ?? null;

  if (leftNum && rightNum) {
    readerPageIndicator.textContent = `Pages ${leftNum}–${rightNum} of ${total}`;
  } else {
    readerPageIndicator.textContent = `Page ${leftNum || rightNum || 1} of ${total}`;
  }

  if (readerPaginationPrev) readerPaginationPrev.disabled = currentSpreadStart <= 0;
  if (readerPaginationNext) readerPaginationNext.disabled = currentSpreadStart + 2 >= activePages.length;
}

// Keep JS timing in lockstep with the CSS book-turn animation duration
// (bookTurnForward/Backward: 0.9s + a small settle margin).
const PAGE_TURN_MS = 920;

function playTurnAnimation(sheet, directionClass, finalize) {
  // Runs the 3D sheet animation and finalizes the turn when the rotation
  // actually completes (animationend), with a timeout fallback for missed
  // events — never before the arc has played, even on slow devices.
  const oppositeClass = directionClass === 'turn-forward' ? 'turn-backward' : 'turn-forward';
  sheet.hidden = false;
  sheet.classList.remove(oppositeClass, 'animate');
  sheet.classList.add(directionClass);

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    sheet.removeEventListener('animationend', onAnimationEnd);
    finalize();
  };
  const onAnimationEnd = (event) => {
    if (event.target === sheet) finish();
  };
  sheet.addEventListener('animationend', onAnimationEnd);
  window.setTimeout(finish, PAGE_TURN_MS + 700);

  void sheet.offsetWidth;
  sheet.classList.add('animate');
}

function animateForwardTurn() {
  if (flipLock) return;

  if (isSinglePageMode()) {
    const current = getPageAt(currentSpreadStart);
    const next = getPageAt(currentSpreadStart + 1);
    if (!current || !next) return;

    flipLock = true;

    const rightEl = flipbookElement.querySelector('[data-static-right]');
    const sheet = flipbookElement.querySelector('[data-turn-sheet]');
    const front = flipbookElement.querySelector('[data-turn-front]');
    const back = flipbookElement.querySelector('[data-turn-back]');
    if (!rightEl || !sheet || !front || !back) {
      flipLock = false;
      return;
    }

    // Static layer already shows the destination; the full-width sheet
    // carries the current page away (front) with the next page on its back.
    rightEl.innerHTML = pageMarkup(next);
    front.innerHTML = pageMarkup(current);
    back.innerHTML = pageMarkup(next);

    playTurnAnimation(sheet, 'turn-forward', () => {
      currentSpreadStart += 1;
      renderStaticSpread();
      sheet.hidden = true;
      sheet.classList.remove('turn-forward', 'animate');
      flipLock = false;
    });
    return;
  }

  const right = getPageAt(currentSpreadStart + 1);
  const nextLeft = getPageAt(currentSpreadStart + 2);
  const nextRight = getPageAt(currentSpreadStart + 3);
  if (!right || !nextLeft) return;

  flipLock = true;

  const rightEl = flipbookElement.querySelector('[data-static-right]');
  const sheet = flipbookElement.querySelector('[data-turn-sheet]');
  const front = flipbookElement.querySelector('[data-turn-front]');
  const back = flipbookElement.querySelector('[data-turn-back]');
  if (!rightEl || !sheet || !front || !back) {
    flipLock = false;
    return;
  }

  rightEl.innerHTML = pageMarkup(nextRight);
  front.innerHTML = pageMarkup(right);
  back.innerHTML = pageMarkup(nextLeft);

  playTurnAnimation(sheet, 'turn-forward', () => {
    currentSpreadStart += 2;
    renderStaticSpread();
    sheet.hidden = true;
    sheet.classList.remove('turn-forward', 'animate');
    flipLock = false;
  });
}

function animateBackwardTurn() {
  if (flipLock) return;

  if (isSinglePageMode()) {
    const current = getPageAt(currentSpreadStart);
    const prev = getPageAt(currentSpreadStart - 1);
    if (!current || !prev) return;

    flipLock = true;

    const rightEl = flipbookElement.querySelector('[data-static-right]');
    const sheet = flipbookElement.querySelector('[data-turn-sheet]');
    const front = flipbookElement.querySelector('[data-turn-front]');
    const back = flipbookElement.querySelector('[data-turn-back]');
    if (!rightEl || !sheet || !front || !back) {
      flipLock = false;
      return;
    }

    // Static layer keeps the current page; the sheet sweeps the previous
    // page in from the left (front), its back carrying the page being left.
    rightEl.innerHTML = pageMarkup(current);
    front.innerHTML = pageMarkup(prev);
    back.innerHTML = pageMarkup(current);

    playTurnAnimation(sheet, 'turn-backward', () => {
      currentSpreadStart -= 1;
      renderStaticSpread();
      sheet.hidden = true;
      sheet.classList.remove('turn-backward', 'animate');
      flipLock = false;
    });
    return;
  }

  const left = getPageAt(currentSpreadStart);
  const prevLeft = getPageAt(currentSpreadStart - 2);
  const prevRight = getPageAt(currentSpreadStart - 1);
  if (!left || !prevLeft || !prevRight) return;

  flipLock = true;

  const leftEl = flipbookElement.querySelector('[data-static-left]');
  const sheet = flipbookElement.querySelector('[data-turn-sheet]');
  const front = flipbookElement.querySelector('[data-turn-front]');
  const back = flipbookElement.querySelector('[data-turn-back]');
  if (!leftEl || !sheet || !front || !back) {
    flipLock = false;
    return;
  }

  leftEl.innerHTML = pageMarkup(prevLeft);
  front.innerHTML = pageMarkup(left);
  back.innerHTML = pageMarkup(prevRight);

  playTurnAnimation(sheet, 'turn-backward', () => {
    currentSpreadStart -= 2;
    renderStaticSpread();
    sheet.hidden = true;
    sheet.classList.remove('turn-backward', 'animate');
    flipLock = false;
  });
}

function initTurnJs(pages, startPage) {
  if (!flipbookElement) return;

  activePages = pages.slice();

  const safeStart = Math.max(1, Math.min(activePages.length, startPage || 1));
  currentSpreadStart = Math.max(0, safeStart - 1);
  if (!isSinglePageMode() && currentSpreadStart % 2 !== 0) {
    currentSpreadStart -= 1;
  }
  lastSinglePageMode = isSinglePageMode();

  buildBookShell();
  renderStaticSpread();
}

function setActiveYearbookCard(index) {
  yearbookButtons.forEach((button, idx) => {
    button.classList.toggle('is-selected', idx === index);
  });
}

async function openReader(index, startPage) {
  const edition = yearbookData[index];
  if (!edition || !yearbookReader) return;

  await preloadBasePages();

  activeYearbookIndex = index;
  readerBadge.textContent = `SCSLAI CARES ${edition.year}`;
  readerTitle.textContent = edition.title;
  readerSummary.textContent = edition.summary;
  setActiveYearbookCard(index);

  // Set edition-level details once (NEW CODE)
  if (edition.editionDetails) {
    detailBindings.activityTitle.textContent = edition.editionDetails.activityTitle;
    detailBindings.caption.textContent = edition.editionDetails.caption;
    detailBindings.narrative.textContent = edition.editionDetails.narrative;
    detailBindings.date.textContent = edition.editionDetails.date;
    detailBindings.venue.textContent = edition.editionDetails.venue;
    detailBindings.participants.textContent = edition.editionDetails.participants;
    detailBindings.photographer.textContent = edition.editionDetails.photographer;
    detailBindings.album.textContent = edition.editionDetails.album;
    detailBindings.remarks.textContent = edition.editionDetails.remarks;
    detailBindings.tags.textContent = edition.editionDetails.tags.join(', ');
  }

  initTurnJs(edition.pages, startPage || 1);
  yearbookReader.hidden = false;
  yearbookReader.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
  // Every open starts with the phone details collapsed so the book leads.
  detailsExpanded = false;
  applyDetailsState();
  // Now that the panel is measurable, re-apply the exact fitted book size.
  resizeActiveFlipbook();
}

function hasReducedMotionPreference() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function getBookOpeningDuration() {
  if (hasReducedMotionPreference()) return Promise.resolve();

  return new Promise((resolve) => {
    if (!bookOpeningVideo) return resolve();

    let settled = false;
    let fallbackTimer = 0;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(fallbackTimer);
      bookOpeningChromaKey?.stop();
      resolve();
    };
    // Safety cap: prefer the video's real duration so the animation is never
    // cut short; keep a fixed cap as a fallback if metadata is unavailable.
    const duration = Number(bookOpeningVideo.duration);
    const capMs = Number.isFinite(duration) && duration > 0 ? (duration + 3) * 1000 : 15000;
    const startFallbackTimer = () => {
      if (fallbackTimer) return;
      fallbackTimer = window.setTimeout(finish, capMs);
    };

    bookOpeningVideo.addEventListener('ended', finish, { once: true });
    bookOpeningVideo.addEventListener('error', finish, { once: true });
    bookOpeningVideo.addEventListener('loadedmetadata', startFallbackTimer, { once: true });
    startFallbackTimer();

    // The tap/click that triggered the opening counts as user interaction, so
    // keep the video's own audio when the browser allows it. If playback is
    // refused, retry once muted so the animation still runs.
    bookOpeningVideo.muted = false;

    try {
      const playPromise = bookOpeningVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          if (settled) return;
          bookOpeningVideo.muted = true;
          try {
            const retryPromise = bookOpeningVideo.play();
            if (retryPromise && typeof retryPromise.catch === 'function') {
              retryPromise.catch(finish);
            }
          } catch (error) {
            finish();
          }
        });
      }
    } catch (error) {
      finish();
    }
  });
}

function cancelBookOpening() {
  if (!isBookOpening) return;

  bookOpeningSequence += 1;
  isBookOpening = false;
  bookOpeningChromaKey?.stop();
  bookOpening?.classList.remove('is-playing');
  if (bookOpeningVideo) {
    bookOpeningVideo.pause();
    bookOpeningVideo.currentTime = 0;
  }
  if (bookOpening) {
    bookOpening.hidden = true;
    bookOpening.setAttribute('aria-hidden', 'true');
  }
  yearbookButtons.forEach((button) => button.classList.remove('is-opening'));
  setActiveYearbookCard(-1);
  document.body.style.overflow = '';
}

async function openReaderAfterBookOpening(index, startPage) {
  const edition = yearbookData[index];
  if (!edition || !yearbookReader) return;

  if (!bookOpening) {
    openReader(index, startPage);
    return;
  }

  if (isBookOpening) return;

  const sequence = ++bookOpeningSequence;
  isBookOpening = true;
  setActiveYearbookCard(index);
  const selectedBook = yearbookButtons[index];
  selectedBook?.classList.add('is-opening');

  const cardTransitionDuration = hasReducedMotionPreference() ? 0 : 560;
  await new Promise((resolve) => window.setTimeout(resolve, cardTransitionDuration));

  if (sequence !== bookOpeningSequence) {
    selectedBook?.classList.remove('is-opening');
    return;
  }

  if (bookOpeningLabel) {
    bookOpeningLabel.textContent = `Opening ${edition.title}`;
  }

  bookOpening.hidden = false;
  bookOpening.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  bookOpening.classList.remove('is-playing');
  void bookOpening.offsetWidth;
  bookOpening.classList.add('is-playing');
  bookOpeningChromaKey?.start();

  if (bookOpeningVideo) {
    bookOpeningVideo.currentTime = 0;
  }
  await Promise.all([
    preloadBasePages(),
    getBookOpeningDuration()
  ]);

  if (sequence !== bookOpeningSequence) return;

  isBookOpening = false;
  bookOpeningChromaKey?.stop();
  bookOpening.classList.remove('is-playing');
  if (bookOpeningVideo) bookOpeningVideo.pause();
  bookOpening.hidden = true;
  bookOpening.setAttribute('aria-hidden', 'true');
  selectedBook?.classList.remove('is-opening');
  await openReader(index, startPage);
}

function closeReader() {
  if (!yearbookReader) return;
  if (photoLightboxOpen) closePhotoLightbox();
  yearbookReader.hidden = true;
  yearbookReader.classList.remove('is-visible');
  document.body.style.overflow = '';
}

function resizeActiveFlipbook() {
  if (yearbookReader?.hidden) return;
  if (!flipbookElement) return;

  // Rebuild the shell when crossing the single-page breakpoint so spread and
  // single page never render with the wrong geometry.
  const single = isSinglePageMode();
  if (single !== lastSinglePageMode) {
    lastSinglePageMode = single;
    buildBookShell();
    renderStaticSpread();
  }

  const size = getFlipSize();
  flipbookElement.style.width = `${size.width}px`;
  flipbookElement.style.height = `${size.height}px`;
}

function turnNext() {
  animateForwardTurn();
}

function turnPrevious() {
  animateBackwardTurn();
}

function turnFromSide(side) {
  if (side === 'right') turnNext();
  if (side === 'left') turnPrevious();
}

function setupPageNavigation() {
  if (!pageFlipHost) return;

  let lastTouchTime = 0;

  const handleHostTurn = (clientX, clientY) => {
    const rect = pageFlipHost.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;

    const localX = clientX - rect.left;
    if (localX > rect.width * 0.5) {
      turnFromSide('right');
    } else {
      turnFromSide('left');
    }
  };

  pageFlipHost.addEventListener('click', (event) => {
    if (event.target.closest('[data-photo-page]')) return;
    if (Date.now() - lastTouchTime < 450) return;
    handleHostTurn(event.clientX, event.clientY);
  }, true);

  let touchStartX = 0;
  let touchStartY = 0;
  pageFlipHost.addEventListener('touchstart', (event) => {
    lastTouchTime = Date.now();
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true, capture: true });

  pageFlipHost.addEventListener('touchend', (event) => {
    lastTouchTime = Date.now();
    if (event.target.closest?.('[data-photo-page]')) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    const deltaY = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(delta) < 18 && Math.abs(deltaY) < 18) {
      handleHostTurn(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      return;
    }
    if (Math.abs(delta) < 40) return;
    if (delta < 0) turnNext();
    if (delta > 0) turnPrevious();
  }, { passive: true, capture: true });

  document.addEventListener('keydown', (event) => {
    if (yearbookReader?.hidden) return;
    if (photoLightboxOpen) return;
    if (event.key === 'Escape') {
      closeReader();
      return;
    }
    if (event.key === 'ArrowRight') {
      turnNext();
      event.preventDefault();
    }
    if (event.key === 'ArrowLeft') {
      turnPrevious();
      event.preventDefault();
    }
  });

  readerPaginationPrev?.addEventListener('click', () => turnPrevious());
  readerPaginationNext?.addEventListener('click', () => turnNext());
}

yearbookButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const index = Number(button.getAttribute('data-yearbook-index'));
    openReaderAfterBookOpening(index, 1);
  });
});

closeReaderButtons.forEach((button) => {
  button.addEventListener('click', closeReader);
});

detailsToggle?.addEventListener('click', () => {
  detailsExpanded = !detailsExpanded;
  applyDetailsState();
});

yearbookReader?.addEventListener('click', (event) => {
  if (event.target === yearbookReader || event.target.classList.contains('reader-overlay')) {
    closeReader();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isBookOpening) {
    cancelBookOpening();
  }
});

window.addEventListener('resize', () => {
  if (resizeRaf) {
    window.cancelAnimationFrame(resizeRaf);
  }
  resizeRaf = window.requestAnimationFrame(() => {
    applyDetailsState();
    resizeActiveFlipbook();
    resizeRaf = null;
  });
});

setupPageNavigation();
preloadBasePages();

const slides = document.querySelectorAll('.carousel-slide');
const nextButton = document.querySelector('.carousel-control.next');
const prevButton = document.querySelector('.carousel-control.prev');
let currentIndex = 0;
let slideInterval;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  currentIndex = index;
}

function nextSlide() {
  const nextIndex = (currentIndex + 1) % slides.length;
  showSlide(nextIndex);
}

function prevSlide() {
  const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(prevIndex);
}

function startCarousel() {
  slideInterval = setInterval(nextSlide, 40000);
}

function resetCarousel() {
  clearInterval(slideInterval);
  startCarousel();
}

if (slides.length > 0) {
  showSlide(0);
  startCarousel();
}

const announcementImages = [
  {src: 'images/Annoncements/calamity-loan-2.png', alt: 'Final Educational Poster'},
  {src: 'images/Annoncements/Authority-to-deduct.jpg', alt: 'Announcement 1'},
  {src: 'images/Annoncements/TLA.jpg', alt: 'Announcement 3'},
  {src: 'images/Annoncements/STD-FINAL.png', alt: 'Announcement 2'},
  {src: 'images/Annoncements/anniv.png', alt: 'ANNIVERSARY'}
];
const announcementImg = document.querySelector('.announcement-posters img');
const announcementPrev = document.querySelector('.announcement-control.prev');
const announcementNext = document.querySelector('.announcement-control.next');
const announcementDotsWrap = document.querySelector('.announcement-dots');
let announcementIndex = 0;
let announcementTimer = null;
let announcementDots = [];

function updateAnnouncementDots() {
  announcementDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === announcementIndex);
  });
}

function showAnnouncement(index) {
  if (!announcementImg) return;
  const safeIndex = (index + announcementImages.length) % announcementImages.length;
  announcementImg.classList.remove('slide-up');
  announcementImg.style.animation = 'none';
  announcementImg.offsetWidth;
  announcementImg.style.animation = '';
  announcementImg.src = announcementImages[safeIndex].src;
  announcementImg.alt = announcementImages[safeIndex].alt;
  announcementImg.classList.add('slide-up');
  announcementIndex = safeIndex;
  updateAnnouncementDots();
}

function nextAnnouncement() {
  showAnnouncement(announcementIndex + 1);
}

function prevAnnouncement() {
  showAnnouncement(announcementIndex - 1);
}

function startAnnouncementAuto() {
  stopAnnouncementAuto();
  announcementTimer = setInterval(nextAnnouncement, 30000);
}

function stopAnnouncementAuto() {
  if (announcementTimer) {
    clearInterval(announcementTimer);
    announcementTimer = null;
  }
}

if (announcementImg) {
  announcementImg.classList.add('slide-up');
  if (announcementDotsWrap) {
    announcementDots = announcementImages.map((item, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'announcement-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Show announcement ' + (i + 1) + ': ' + item.alt);
      dot.addEventListener('click', () => {
        showAnnouncement(i);
        startAnnouncementAuto();
      });
      announcementDotsWrap.appendChild(dot);
      return dot;
    });
  }
  if (announcementPrev) {
    announcementPrev.addEventListener('click', () => {
      prevAnnouncement();
      startAnnouncementAuto();
    });
  }
  if (announcementNext) {
    announcementNext.addEventListener('click', () => {
      nextAnnouncement();
      startAnnouncementAuto();
    });
  }
  const announcementBox = announcementImg.closest('.announcement-posters');
  if (announcementBox) {
    announcementBox.addEventListener('mouseenter', stopAnnouncementAuto);
    announcementBox.addEventListener('mouseleave', startAnnouncementAuto);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnnouncementAuto();
    } else {
      startAnnouncementAuto();
    }
  });
  startAnnouncementAuto();
}

const galleryItems = document.querySelectorAll('.gallery-item');
let galleryOverlay = document.querySelector('.gallery-overlay');
let galleryHideTimer;
let activeGalleryImage = null;

if (!galleryOverlay) {
  galleryOverlay = document.createElement('div');
  galleryOverlay.className = 'gallery-overlay';
  galleryOverlay.innerHTML = '<img alt=""><div class="gallery-overlay-text">Click outside to close</div>';
  document.body.appendChild(galleryOverlay);
}

const galleryOverlayImage = galleryOverlay.querySelector('img');

function showGalleryOverlay(image) {
  clearTimeout(galleryHideTimer);
  galleryOverlayImage.src = image.src;
  galleryOverlayImage.alt = image.alt;
  galleryOverlay.classList.add('visible');
  activeGalleryImage = image;
}

function hideGalleryOverlay() {
  clearTimeout(galleryHideTimer);
  galleryOverlay.classList.remove('visible');
  activeGalleryImage = null;
}

galleryItems.forEach((item) => {
  const image = item.querySelector('img');
  if (!image) return;

  item.addEventListener('click', () => {
    if (activeGalleryImage === image && galleryOverlay.classList.contains('visible')) {
      hideGalleryOverlay();
      return;
    }

    showGalleryOverlay(image);
  });
});

galleryOverlay.addEventListener('click', (event) => {
  if (event.target === galleryOverlay) {
    hideGalleryOverlay();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideGalleryOverlay();
  }
});

nextButton?.addEventListener('click', () => {
  nextSlide();
  resetCarousel();
});

prevButton?.addEventListener('click', () => {
  prevSlide();
  resetCarousel();
});

// Mobile navigation toggle
const siteHeader = document.querySelector('header');
const siteNav = document.querySelector('header nav');
let navToggle = null;
const NAV_BREAKPOINT = 1100;

if (siteHeader && siteNav) {
  if (!siteNav.id) {
    siteNav.id = 'site-navigation';
  }

  navToggle = document.createElement('button');
  navToggle.type = 'button';
  navToggle.className = 'nav-toggle';
  navToggle.setAttribute('aria-label', 'Toggle navigation menu');
  navToggle.setAttribute('aria-controls', siteNav.id);
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';

  siteHeader.appendChild(navToggle);

  navToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = siteHeader.classList.toggle('nav-open');
    navToggle?.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (window.innerWidth > NAV_BREAKPOINT || !siteHeader.classList.contains('nav-open')) {
      return;
    }

    if (!siteHeader.contains(event.target)) {
      siteHeader.classList.remove('nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > NAV_BREAKPOINT) {
      siteHeader.classList.remove('nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
}

// Dropdown should always open when ABOUT US is clicked
const dropbtn = document.querySelector('.dropbtn');
const dropdown = document.querySelector('.dropdown');

if (dropbtn && dropdown) {
  dropbtn.addEventListener('click', (e) => {
    e.stopPropagation();

    const isMobile = window.innerWidth <= NAV_BREAKPOINT;
    const willOpen = isMobile ? !dropdown.classList.contains('open') : true;

    dropdown.classList.toggle('open', willOpen);
    dropbtn.setAttribute('aria-expanded', String(willOpen));
  });

  document.addEventListener('click', (e) => {
    const isClickInsideDropdown = dropdown.contains(e.target);
    if (!isClickInsideDropdown && dropdown.classList.contains('open')) {
      dropdown.classList.remove('open');
      dropbtn.setAttribute('aria-expanded', 'false');
    }
  });

  dropdown.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      dropdown.classList.remove('open');
      dropbtn.setAttribute('aria-expanded', 'false');

      if (window.innerWidth <= NAV_BREAKPOINT && siteHeader?.classList.contains('nav-open')) {
        siteHeader.classList.remove('nav-open');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

siteNav?.querySelectorAll(':scope > a').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= NAV_BREAKPOINT && siteHeader?.classList.contains('nav-open')) {
      siteHeader.classList.remove('nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Close dropdown on Escape
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape') {
    if (dropdown && dropdown.classList.contains('open')) {
      dropdown.classList.remove('open');
      dropbtn?.setAttribute('aria-expanded', 'false');
      dropbtn?.focus();
    }

    if (siteHeader?.classList.contains('nav-open')) {
      siteHeader.classList.remove('nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.focus();
    }
  }
});

// Navbar active-page highlight
(function () {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Main navigation links
  siteNav?.querySelectorAll(":scope > a").forEach((link) => {
    const linkPage = (link.getAttribute("href") || "").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

  // Dropdown submenu links — also highlight the ABOUT US button
  // Annual report pages live in reports/<year>-annual-report.html while the
  // "Annual Report" menu item points to about-annual-report.html; treat any
  // yearly report page as the Annual Report submenu item so both the submenu
  // link and the ABOUT US button stay highlighted on report pages.
  const isAnnualReportPage = /^\d{4}-annual-report\.html$/.test(currentPage);

  document.querySelectorAll(".dropdown-content a").forEach((link) => {
    const linkPage = (link.getAttribute("href") || "").split("/").pop();
    if (linkPage === currentPage || (isAnnualReportPage && linkPage === "about-annual-report.html")) {
      link.classList.add("active");
      link.closest(".dropdown")?.classList.add("active");
    }
  });
})();

// Calculator popup
const calculatorLinks = document.querySelectorAll('a[href="calculator.html"]');
let calculatorModal = document.querySelector('[data-calculator-modal]');
let openCalculatorButton = document.querySelector('[data-open-calculator]');
let closeCalculatorButton = document.querySelector('[data-close-calculator]');
let calculatorTabs = document.querySelectorAll('[data-court-tab]');
let calculatorPanels = document.querySelectorAll('[data-court-panel]');
let supremeLoanType = document.querySelector('[data-loan-type]');
let supremeLoanAmount = document.querySelector('[data-loan-amount]');
let supremeDesiredLoanAmount = document.querySelector('[data-desired-loan-amount]');
let supremeLoanTerm = document.querySelector('[data-loan-term]');
let supremeTakeHomePay = document.querySelector('[data-take-home-pay]');
let supremeEligibleTakeHomePay = document.querySelector('[data-eligible-take-home-pay]');
let supremeComputeButton = document.querySelector('[data-compute-supreme]');
let supremeResult = document.querySelector('[data-supreme-result]');
let lowerLoanType = document.querySelector('[data-loan-type-lower]');
let lowerLoanAmount = document.querySelector('[data-loan-amount-lower]');
let lowerDesiredLoanAmount = document.querySelector('[data-desired-loan-amount-lower]');
let lowerLoanTerm = document.querySelector('[data-loan-term-lower]');
let lowerTakeHomePay = document.querySelector('[data-take-home-pay-lower]');
let lowerEligibleTakeHomePay = document.querySelector('[data-eligible-take-home-pay-lower]');
let lowerComputeButton = document.querySelector('[data-compute-lower]');
let lowerResult = document.querySelector('[data-lower-result]');

// Source: UPDATED LOAN MATRIX.xlsx, Sheet1. Zero/blank cells in the workbook
// mean that the corresponding term is not available.
const loanMatrix = {
  supreme: {
    regular: [
      { id: 'allowanceCasual', label: 'Allowance Loan (Casual)', rates: { 1: 12, 2: 12 }, max: 40000 },
      { id: 'allowance', label: 'Allowance Loan', rates: { 1: 12, 2: 12, 3: 12, 4: 12, 5: 12 }, max: 130000 },
      { id: 'business', label: 'Business Loan', rates: { 1: 12, 2: 12, 3: 12, 4: 12, 5: 12 } },
      { id: 'character', label: 'Character Loan', rates: { 1: 12, 2: 12, 3: 15 } },
      { id: 'educationalCasual', label: 'Educational Loan (Casual)', rates: { 1: 12, 2: 12 }, max: 200000 },
      { id: 'educational', label: 'Educational Loan', rates: { 1: 12, 2: 12, 3: 15, 4: 15, 5: 15 }, max: 200000 },
      { id: 'emergencyRata', label: 'Emergency RATA Loan', rates: { 1: 12, 2: 12 } },
      { id: 'equitable', label: 'Equitable Loan', rates: { 1: 10 } },
      { id: 'equity', label: 'Equity Loan', rates: { 1: 12, 2: 12, 3: 15, 4: 15, 5: 15 } },
      { id: 'healthEmergency', label: 'Health Emergency Loan PR', rates: { 1: 12, 2: 12, 3: 12 }, max: 400000 },
      { id: 'help', label: 'Help Loan DIR', rates: { 1: 12, 2: 12, 3: 12 } },
      { id: 'housing', label: 'Housing Loan', rates: { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 }, min: 600000, max: 2000000 },
      { id: 'longTerm', label: 'Long Term Loan', rates: { 1: 12, 2: 12, 3: 15, 4: 15, 5: 15 } },
      { id: 'maxi', label: 'Maxi Loan', rates: { 1: 6, 2: 8, 3: 10, 4: 12, 5: 14 }, min: 100000, max: 550000 },
      { id: 'mealCasual', label: 'MEAL (Casual)', rates: { 1: 8, 2: 8 }, max: 50000 },
      { id: 'meal', label: 'MEAL', rates: { 2: 8, 3: 10 }, min: 50000, max: 300000 },
      { id: 'salaryEmergency', label: 'Salary Emergency Loan', rates: { 2: 12 } },
      { id: 'multiPurpose', label: 'Multi-Purpose Loan', rates: { 1: 12, 2: 12, 3: 15 }, max: 100000 },
      //{ id: 'motorcycle', label: 'Motorcycle Loan', rates: { 4: 18, 5: 18 } },
      { id: 'petty', label: 'Petty Loan', rates: { 1: 5 }, max: 150000 },
      { id: 'subsistence', label: 'Subsistence Loan', rates: { 1: 12, 2: 12 }, max: 100000 }
    ],
    //special: [
     // { id: 'anniversary', label: 'Anniversary Loan', monthlyRate: 1, max: 10000 },
     // { id: 'cashGift', label: 'Cash Gift', monthlyRate: 1, max: 10000 },
     /// { id: 'economicAssistance1', label: 'Emergency Economic Assistance 1', monthlyRate: 1 },
      ///{ id: 'economicAssistance2', label: 'Emergency Economic Assistance 2', monthlyRate: 1 },
      ///{ id: 'midYearBonus', label: 'Mid Year Bonus', monthlyRate: 1 },
      //{ id: 'yearEndBonus', label: 'Year End Bonus', monthlyRate: 1 }
    //],
    occasional: [
      { id: 'calamity2', label: 'Calamity Loan II', rates: { 1: 5, 2: 5, 3: 5 }, min: 50000, max: 150000 },
      { id: 'calamity-2 Casual', label: 'Calamity Loan II (Casual)', rates: { 1: 5, 2: 5 }, min: 50000, max: 150000 },
      { id: 'inflationAssistance', label: 'Inflation Assistance Loan', rates: { 1: 5, 2: 5, 3: 5 }, min: 20000, max: 120000 }
    ]
  },
  lower: {
    regular: [
      { id: 'allowance', label: 'Allowance Loan', rates: { 1: 12, 2: 12, 3: 12, 4: 12, 5: 12 }, max: 130000 },
      { id: 'allowanceCasual', label: 'Allowance Loan (Casual)', rates: { 1: 12, 2: 12 }, max: 40000 },
      { id: 'business', label: 'Business Loan', rates: { 1: 12, 2: 12, 3: 12, 4: 12, 5: 12 } },
      { id: 'educational', label: 'Educational Loan', rates: { 1: 12, 2: 12, 3: 15, 4: 15, 5: 15 } },
      { id: 'educationalCasual', label: 'Educational Loan (Casual)', rates: { 1: 12, 2: 12 }, max: 200000 },
      { id: 'emergencyRata', label: 'Emergency RATA Loan', rates: { 1: 12, 2: 12 } },
      { id: 'healthEmergency', label: 'Health Emergency Loan PR', rates: { 1: 12, 2: 12, 3: 12 }, max: 400000 },
      { id: 'housing', label: 'Housing Loan', rates: { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 }, min: 600000, max: 2000000 },
      { id: 'maxi', label: 'Maxi Loan', rates: { 1: 6, 2: 8, 3: 10, 4: 12, 5: 14 }, max: 500000 },
      { id: 'meal', label: 'MEAL', rates: { 2: 8, 3: 10 }, min: 50000, max: 150000 },
      { id: 'mealCasual', label: 'MEAL (Casual)', rates: { 1: 8, 2: 8 }, max: 40000 },
      { id: 'salaryEmergency', label: 'Salary Emergency Loan', rates: { 2: 12 } },
      { id: 'multiPurpose', label: 'Multi-Purpose Loan', rates: { 1: 12, 2: 12, 3: 15 }, max: 100000 },
      { id: 'salary', label: 'Salary Loan', rates: { 1: 12, 2: 12, 3: 15, 4: 15, 5: 15 } }
    ],
    //special: [
    // { id: 'anniversary', label: 'Anniversary Loan', monthlyRate: 1, max: 10000 },
      //{ id: 'cashGift', label: 'Cash Gift', monthlyRate: 1, max: 10000 },
      //{ id: 'economicAssistance1', label: 'Emergency Economic Assistance 1', monthlyRate: 1 },
      //{ id: 'economicAssistance2', label: 'Emergency Economic Assistance 2', monthlyRate: 1 },
      //{ id: 'midYearBonus', label: 'Mid Year Bonus', monthlyRate: 1 },
      //{ id: 'yearEnd', label: 'Year End', monthlyRate: 1 }
    //],
    occasional: [
      { id: 'calamity2', label: 'Calamity Loan II', rates: { 1: 5, 2: 5, 3: 5 }, min: 50000, max: 150000 },
      { id: 'calamity2Casual', label: 'Calamity Loan II (Casual)', rates: { 1: 5, 2: 5 }, min: 50000, max: 150000 },
      { id: 'inflationAssistance', label: 'Inflation Assistance Loan', rates: { 1: 5, 2: 5, 3: 5 }, min: 20000, max: 120000 }
    ]
  }
};

const minimumRetainedTakeHomePay = 5000;

function clearCalculatedLoanAmount(court) {
  const elements = getLoanElements(court);

  if (!elements.loanAmount) return;

  elements.loanAmount.value = '';
  elements.loanAmount.placeholder = 'Calculated from eligible take-home pay';
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2
  }).format(value);
}

function parseAmountInput(value) {
  if (typeof value !== 'string') return Number.NaN;
  const cleaned = value.replace(/,/g, '').trim();
  return cleaned ? Number(cleaned) : Number.NaN;
}

function formatAmountInput(value) {
  const cleaned = String(value || '').replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  const integerPart = (parts[0] || '').replace(/^0+(?=\d)/, '');
  const decimalPart = parts.slice(1).join('');
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (parts.length > 1) {
    return `${grouped || '0'}.${decimalPart}`;
  }

  return grouped;
}

function pmt(annualRate, years, loanAmount) {
  const monthlyRate = annualRate / 12;
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) {
    return loanAmount / numberOfPayments;
  }

  return (monthlyRate * loanAmount) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
}

function getFactorRate(annualRate, years) {
  return pmt(annualRate, years, 1);
}

function createCalculatorModal() {
  if (calculatorModal) return calculatorModal;

  const modal = document.createElement('div');
  modal.className = 'calculator-modal';
  modal.setAttribute('data-calculator-modal', '');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="calculator-dialog" role="dialog" aria-modal="true" aria-labelledby="calculator-title">
      <button class="calculator-close" type="button" aria-label="Close calculator" data-close-calculator>&times;</button>

      <div class="calculator-dialog-header">
        <p class="calculator-eyebrow">SCSLAI Calculator</p>
        <h2 id="calculator-title">Select your member type</h2>
      </div>

      <div class="calculator-tabs" role="tablist" aria-label="Member type">
        <button class="calculator-tab active" type="button" data-court-tab="supreme" aria-selected="true">SUPREME COURT</button>
        <button class="calculator-tab" type="button" data-court-tab="lower" aria-selected="false">LOWER COURT</button>
      </div>

      <div class="calculator-panel active" data-court-panel="supreme">
        <div class="calculator-grid">
          <div class="calculator-field calculator-field--full">
            <label for="supreme-take-home-pay">Current Take-Home Pay</label>
            <input id="supreme-take-home-pay" type="text" inputmode="decimal" placeholder="Enter current take-home pay" data-take-home-pay>
          </div>

          <div class="calculator-field calculator-field--full">
            <label for="supreme-eligible-take-home-pay">Eligible Take-Home Pay</label>
            <input id="supreme-eligible-take-home-pay" type="text" readonly placeholder="Calculated from current take-home pay" data-eligible-take-home-pay>
          </div>

          <div class="calculator-field">
            <label for="supreme-loan-type">Loan Type</label>
            <select id="supreme-loan-type" data-loan-type></select>
          </div>

          <div class="calculator-field">
            <label for="supreme-loan-amount">Maximun Eligible Loan Amount</label>
            <input id="supreme-loan-amount" type="text" readonly placeholder="Calculated from eligible take-home pay" data-loan-amount>
          </div>

          <div class="calculator-field calculator-field--full">
            <label for="supreme-desired-loan-amount">Desired Loan Amount (Optional)</label>
            <input id="supreme-desired-loan-amount" type="text" inputmode="decimal" placeholder="Enter desired amount" data-desired-loan-amount>
          </div>

          <div class="calculator-field calculator-field--full">
            <label for="supreme-loan-term">Loan Term</label>
            <select id="supreme-loan-term" data-loan-term></select>
          </div>
        </div>

        <div class="calculator-actions">
          <button class="calculator-compute" type="button" data-compute-supreme>Compute</button>
        </div>

        <div class="calculator-result" data-supreme-result>
          <strong>Loan Amortization</strong>
          <span>Your calculated monthly amortization appears here.</span>
        </div>

        <div class="calculator-disclaimer">
          
          <span>The eligible loan amount shown on the screen is subject to further adjustment, particularly with regard to the interest computation of your previous loan/s, if any. Therefore, the amount shown is <em class="not-final">NOT FINAL</em>.</span>
        </div>

        <div class="calculator-note">
          <strong>Note:</strong>
          <span>The calculation is based on the information you provide. To determine your Eligible Loan Amount, ₱5,000 is deducted from your take-home pay to ensure that your remaining pay does not fall below ₱5,000.</span>

          <div class="calculator-notice">
            <strong>Privacy Notice:</strong>
            <span>The information you enter into this calculator is used only to calculate your estimated loan amount. The website does not store, collect, or save any information you provide.</span>
          </div>
          
        </div>

      </div>

      <div class="calculator-panel" data-court-panel="lower">
        <div class="calculator-lower-copy">
        </div>

        <div class="calculator-grid">
          <div class="calculator-field calculator-field--full">
            <label for="lower-take-home-pay">Current Take-Home Pay</label>
            <input id="lower-take-home-pay" type="text" inputmode="decimal" placeholder="Enter current take-home pay" data-take-home-pay-lower>
          </div>

          <div class="calculator-field calculator-field--full">
            <label for="lower-eligible-take-home-pay">Eligible Take-Home Pay</label>
            <input id="lower-eligible-take-home-pay" type="text" readonly placeholder="Calculated from current take-home pay" data-eligible-take-home-pay-lower>
          </div>

          <div class="calculator-field">
            <label for="lower-loan-type">Loan Type</label>
            <select id="lower-loan-type" data-loan-type-lower></select>
          </div>

          <div class="calculator-field">
            <label for="lower-loan-amount">Maximum Eligible Loan Amount</label>
            <input id="lower-loan-amount" type="text" readonly placeholder="Calculated from eligible take-home pay" data-loan-amount-lower>
          </div>

          <div class="calculator-field calculator-field--full">
            <label for="lower-desired-loan-amount">Desired Loan Amount (Optional)</label>
            <input id="lower-desired-loan-amount" type="text" inputmode="decimal" placeholder="Enter desired amount" data-desired-loan-amount-lower>
          </div>

          <div class="calculator-field calculator-field--full">
            <label for="lower-loan-term">Loan Term</label>
            <select id="lower-loan-term" data-loan-term-lower></select>
          </div>
        </div>

        <div class="calculator-actions">
          <button class="calculator-compute" type="button" data-compute-lower>Compute</button>
        </div>

        <div class="calculator-result calculator-result-muted" data-lower-result>
          <strong>Loan Amortization</strong>
          <span>Your calculated monthly amortization appears here.</span>
        </div>

        <div class="calculator-disclaimer">
          <strong>Disclaimer:</strong>
          <span>The loan amortization shown on the screen is subject to further adjustment, particularly with regard to the interest computation of your previous loan/s, if any. Therefore, the amount shown is <em class="not-final">NOT FINAL</em>.</span>
        </div>

        <div class="calculator-note">
          <strong>Note:</strong>
          <span>The calculation is based on the information you provide. To determine your Eligible Loan Amount, ₱5,000 is deducted from your take-home pay to ensure that your remaining pay does not fall below ₱5,000.</span>

          <div class="calculator-notice">
            <strong>Privacy Notice:</strong>
            <span>The information you enter into this calculator is used only to calculate your estimated loan amount. The website does not store, collect, or save any information you provide.</span>
          </div>
          
        </div>
        
      </div>
    </div>
  `;

  document.body.appendChild(modal); 
  return modal;
}

function getLoanDefinitions(court) {
  return Object.values(loanMatrix[court]).flat();
}

function getLoanDefinition(court, loanType) {
  return getLoanDefinitions(court).find((loan) => loan.id === loanType);
}

function getLoanTypeOptions(court) {
  const categoryLabels = {
    regular: 'Regular Loans',
    //special: 'Special Loans (1% per month)',
    occasional: 'Occasional Loans'
  };

  return Object.entries(loanMatrix[court])
    .map(([category, loans]) => {
      const options = loans
        .map((loan) => `<option value="${loan.id}">${loan.label}</option>`)
        .join('');
      return `<optgroup label="${categoryLabels[category]}">${options}</optgroup>`;
    })
    .join('');
}

function getLoanElements(court) {
  return court === 'lower'
    ? {
        loanType: lowerLoanType,
        loanAmount: lowerLoanAmount,
        desiredLoanAmount: lowerDesiredLoanAmount,
        loanTerm: lowerLoanTerm,
        takeHomePay: lowerTakeHomePay,
        eligibleTakeHomePay: lowerEligibleTakeHomePay,
        result: lowerResult
      }
    : {
        loanType: supremeLoanType,
        loanAmount: supremeLoanAmount,
        desiredLoanAmount: supremeDesiredLoanAmount,
        loanTerm: supremeLoanTerm,
        takeHomePay: supremeTakeHomePay,
        eligibleTakeHomePay: supremeEligibleTakeHomePay,
        result: supremeResult
      };
}

function getEligibleMonthlyAmortization(takeHomePay) {
  return Math.max(takeHomePay - minimumRetainedTakeHomePay, 0);
}

function updateEligibleTakeHomePay(court) {
  const elements = getLoanElements(court);
  if (!elements.takeHomePay || !elements.eligibleTakeHomePay) return;

  const takeHomePay = parseAmountInput(elements.takeHomePay.value);
  elements.eligibleTakeHomePay.value = Number.isFinite(takeHomePay) && takeHomePay > 0
    ? formatCurrency(getEligibleMonthlyAmortization(takeHomePay))
    : '';
}

// Shows the Maximum Eligible Loan Amount as soon as the current take-home pay
// is typed, so the member never has to press Compute just to see it. The
// Compute button still performs the full amortization computation.
function updateMaximumEligibleLoanAmount(court) {
  const elements = getLoanElements(court);
  if (!elements.loanAmount || !elements.loanType || !elements.loanTerm || !elements.takeHomePay) return;

  const loan = getLoanDefinition(court, elements.loanType.value);
  const termYears = Number(elements.loanTerm.value);
  const takeHomePay = parseAmountInput(elements.takeHomePay.value);
  const rate = loan?.rates?.[termYears];

  if (!loan || typeof loan.monthlyRate === 'number' || typeof rate !== 'number' || !Number.isFinite(takeHomePay) || takeHomePay <= 0) {
    clearCalculatedLoanAmount(court);
    return;
  }

  const eligibleMonthlyAmortization = getEligibleMonthlyAmortization(takeHomePay);
  if (eligibleMonthlyAmortization <= 0) {
    clearCalculatedLoanAmount(court);
    return;
  }

  const calculatedLoanAmount = eligibleMonthlyAmortization / getFactorRate(rate / 100, termYears);

  if (typeof loan.min === 'number' && calculatedLoanAmount < loan.min) {
    clearCalculatedLoanAmount(court);
    return;
  }

  const eligibleLoanAmount = typeof loan.max === 'number'
    ? Math.min(calculatedLoanAmount, loan.max)
    : calculatedLoanAmount;

  elements.loanAmount.value = formatCurrency(eligibleLoanAmount);
}

function updateLoanTerms(court, loanType) {
  const elements = getLoanElements(court);
  if (!elements.loanTerm) return;

  const loan = getLoanDefinition(court, loanType);
  const terms = Object.keys(loan?.rates || {}).map(Number).sort((a, b) => a - b);

  if (terms.length === 0) {
    elements.loanTerm.disabled = true;
    elements.loanTerm.innerHTML = '<option value="">Term not listed in the updated matrix</option>';
    return;
  }

  elements.loanTerm.disabled = false;
  elements.loanTerm.innerHTML = terms
    .map((term) => `<option value="${term}">${term} Year${term > 1 ? 's' : ''}</option>`)
    .join('');
}

function openCalculator() {
  calculatorModal = createCalculatorModal();
  openCalculatorButton = document.querySelector('[data-open-calculator]');
  closeCalculatorButton = document.querySelector('[data-close-calculator]');
  calculatorTabs = document.querySelectorAll('[data-court-tab]');
  calculatorPanels = document.querySelectorAll('[data-court-panel]');
  supremeLoanType = document.querySelector('[data-loan-type]');
  supremeLoanAmount = document.querySelector('[data-loan-amount]');
  supremeDesiredLoanAmount = document.querySelector('[data-desired-loan-amount]');
  supremeLoanTerm = document.querySelector('[data-loan-term]');
  supremeTakeHomePay = document.querySelector('[data-take-home-pay]');
  supremeEligibleTakeHomePay = document.querySelector('[data-eligible-take-home-pay]');
  supremeComputeButton = document.querySelector('[data-compute-supreme]');
  supremeResult = document.querySelector('[data-supreme-result]');
  lowerLoanType = document.querySelector('[data-loan-type-lower]');
  lowerLoanAmount = document.querySelector('[data-loan-amount-lower]');
  lowerDesiredLoanAmount = document.querySelector('[data-desired-loan-amount-lower]');
  lowerLoanTerm = document.querySelector('[data-loan-term-lower]');
  lowerTakeHomePay = document.querySelector('[data-take-home-pay-lower]');
  lowerEligibleTakeHomePay = document.querySelector('[data-eligible-take-home-pay-lower]');
  lowerComputeButton = document.querySelector('[data-compute-lower]');
  lowerResult = document.querySelector('[data-lower-result]');

  if (supremeLoanType) {
    supremeLoanType.innerHTML = getLoanTypeOptions('supreme');
  }

  if (lowerLoanType) {
    lowerLoanType.innerHTML = getLoanTypeOptions('lower');
  }

  if (!calculatorModal) return;
  calculatorModal.classList.add('open');
  document.body.classList.add('calculator-modal-open');
  calculatorModal.setAttribute('aria-hidden', 'false');

  if (supremeLoanType && supremeLoanTerm) {
    updateLoanTerms('supreme', supremeLoanType.value);
    clearCalculatedLoanAmount('supreme');

    if (supremeTakeHomePay) {
      supremeTakeHomePay.value = '';
    }

    if (supremeEligibleTakeHomePay) {
      supremeEligibleTakeHomePay.value = '';
    }

    if (supremeDesiredLoanAmount) {
      supremeDesiredLoanAmount.value = '';
    }
  }

  if (lowerLoanType && lowerLoanTerm) {
    updateLoanTerms('lower', lowerLoanType.value);
    clearCalculatedLoanAmount('lower');

    if (lowerTakeHomePay) {
      lowerTakeHomePay.value = '';
    }

    if (lowerEligibleTakeHomePay) {
      lowerEligibleTakeHomePay.value = '';
    }

    if (lowerDesiredLoanAmount) {
      lowerDesiredLoanAmount.value = '';
    }
  }
}

function closeCalculator() {
  if (!calculatorModal) return;
  calculatorModal.classList.remove('open');
  document.body.classList.remove('calculator-modal-open');
  calculatorModal.setAttribute('aria-hidden', 'true');
}

function setCalculatorCourt(court) {
  calculatorTabs.forEach((tab) => {
    const isActive = tab.dataset.courtTab === court;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  calculatorPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.courtPanel === court);
  });
}

function computeLoan(court) {
  const elements = getLoanElements(court);

  if (!elements.loanType || !elements.loanAmount || !elements.loanTerm || !elements.takeHomePay || !elements.eligibleTakeHomePay || !elements.result) return;

  const loanType = elements.loanType.value;
  const termYears = Number(elements.loanTerm.value);
  const takeHomePay = parseAmountInput(elements.takeHomePay.value);
  const loan = getLoanDefinition(court, loanType);

  if (!loan) {
    clearCalculatedLoanAmount(court);
    elements.result.classList.add('error-result');
    elements.result.innerHTML = '<strong>Loan Eligibility</strong><span>The selected loan type is not available in the updated matrix.</span>';
    return;
  }

  if (!Number.isFinite(takeHomePay) || takeHomePay <= 0) {
    clearCalculatedLoanAmount(court);
    elements.result.classList.add('error-result');
    elements.result.innerHTML = '<strong>Loan Eligibility</strong><span>Please enter a valid current take-home pay.</span>';
    return;
  }

    elements.result.classList.remove('error-result');
    elements.result.innerHTML = '<strong>Loan Eligibility</strong><span>Your eligible loan amount appears here.</span>';

  if (typeof loan.monthlyRate === 'number') {
    clearCalculatedLoanAmount(court);
    elements.result.classList.add('error-result');
    elements.result.innerHTML = `<strong>Loan Eligibility</strong><span>${loan.label} has a 1% monthly interest rate in the updated matrix, but no repayment term is listed. An eligible loan amount cannot be calculated.</span>`;
    return;
  }

  const rate = loan.rates?.[termYears];

  if (typeof rate !== 'number') {
    clearCalculatedLoanAmount(court);
    elements.result.classList.add('error-result');
    elements.result.innerHTML = '<strong>Loan Eligibility</strong><span>The selected term is not available for this loan type.</span>';
    return;
  }

  const eligibleMonthlyAmortization = getEligibleMonthlyAmortization(takeHomePay);
  elements.eligibleTakeHomePay.value = formatCurrency(eligibleMonthlyAmortization);

  if (eligibleMonthlyAmortization <= 0) {
  clearCalculatedLoanAmount(court);

  elements.result.classList.add('error-result');

  elements.result.innerHTML = `
    <strong>Loan Eligibility</strong>
    <span>Current take-home pay must be greater than ${formatCurrency(minimumRetainedTakeHomePay)} to provide a loan payment.</span>
  `;

    return;
  }

  const factorRate = getFactorRate(rate / 100, termYears);
  const calculatedLoanAmount = eligibleMonthlyAmortization / factorRate;
  if (typeof loan.min === 'number' && calculatedLoanAmount < loan.min) {
    clearCalculatedLoanAmount(court);
    elements.result.classList.add('error-result');
    elements.result.innerHTML = `<strong>Loan Eligibility</strong><span>The income-based amount is below this loan type's matrix minimum of ${formatCurrency(loan.min)}.</span>`;
    return;
  }

  const eligibleLoanAmount = typeof loan.max === 'number'
    ? Math.min(calculatedLoanAmount, loan.max)
    : calculatedLoanAmount;
  const desiredLoanAmountInput = parseAmountInput(elements.desiredLoanAmount?.value || '');
  let amortizationBaseAmount = eligibleLoanAmount;

  if (Number.isFinite(desiredLoanAmountInput)) {
    if (desiredLoanAmountInput <= 0) {
      clearCalculatedLoanAmount(court);
      elements.result.classList.add('error-result');
      elements.result.innerHTML = '<strong>Loan Eligibility</strong><span>Please enter a valid desired loan amount.</span>';
      return;
    }

    if (typeof loan.min === 'number' && desiredLoanAmountInput < loan.min) {
      clearCalculatedLoanAmount(court);
      elements.result.classList.add('error-result');
      elements.result.innerHTML = `<strong>Loan Eligibility</strong><span>Desired amount is below this loan type\'s matrix minimum of ${formatCurrency(loan.min)}.</span>`;
      return;
    }

    // INVALID
  if (desiredLoanAmountInput > eligibleLoanAmount) {
    clearCalculatedLoanAmount(court);

    elements.result.classList.add('error-result');

    elements.result.innerHTML = `
      <strong>Loan Eligibility</strong>
      <span>Your maximum eligible amount is ${formatCurrency(eligibleLoanAmount)}. Please enter a desired amount within eligibility.</span>
    `;

    return;
  }

    // VALID
    elements.result.classList.remove('error-result');

    elements.result.innerHTML = `
      <strong>Loan Eligibility</strong>
      <span>Your eligible loan amount is ${formatCurrency(eligibleLoanAmount)}.</span>
    `;

      amortizationBaseAmount = desiredLoanAmountInput;
    }

  const monthlyAmortization = amortizationBaseAmount * factorRate;

  elements.loanAmount.value = formatCurrency(eligibleLoanAmount);

  elements.result.classList.remove('error-result');
  elements.result.innerHTML = `
    <strong>Loan Amortization</strong>
    <span>Monthly amortization: ${formatCurrency(monthlyAmortization)}</span>
  `;
}

if (calculatorModal) {
  // no-op: modal is created on demand
}

calculatorLinks.forEach((link) => {
  link.setAttribute('role', 'button');
  link.setAttribute('aria-haspopup', 'dialog');
  link.setAttribute('aria-expanded', 'false');
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openCalculator();
    link.setAttribute('aria-expanded', 'true');
  });
});

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;

  if (target?.closest('[data-open-calculator]')) {
    openCalculator();
  }

  if (target?.closest('[data-close-calculator]')) {
    closeCalculator();
  }

  const courtTab = target?.closest('[data-court-tab]');
  if (courtTab) {
    setCalculatorCourt(courtTab.dataset.courtTab);
  }

  if (target?.closest('[data-compute-supreme]')) {
    computeLoan('supreme');
  }

  if (target?.closest('[data-compute-lower]')) {
    computeLoan('lower');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && calculatorModal?.classList.contains('open')) {
    closeCalculator();
  }
});

document.addEventListener('input', (event) => {
  if (event.target?.matches?.('[data-take-home-pay]')) {
    event.target.value = formatAmountInput(event.target.value);
    updateEligibleTakeHomePay('supreme');
    updateMaximumEligibleLoanAmount('supreme');
  }

  if (event.target?.matches?.('[data-take-home-pay-lower]')) {
    event.target.value = formatAmountInput(event.target.value);
    updateEligibleTakeHomePay('lower');
    updateMaximumEligibleLoanAmount('lower');
  }

  if (event.target?.matches?.('[data-desired-loan-amount], [data-desired-loan-amount-lower]')) {
    event.target.value = formatAmountInput(event.target.value);
  }
});

document.addEventListener('blur', (event) => {
  if (event.target?.matches?.('[data-take-home-pay], [data-take-home-pay-lower], [data-desired-loan-amount], [data-desired-loan-amount-lower]')) {
    event.target.value = formatAmountInput(event.target.value);
  }
}, true);

document.addEventListener('change', (event) => {
  if (event.target?.matches?.('[data-loan-type]')) {
    updateLoanTerms('supreme', event.target.value);
    updateMaximumEligibleLoanAmount('supreme');
  }

  if (event.target?.matches?.('[data-loan-type-lower]')) {
    updateLoanTerms('lower', event.target.value);
    updateMaximumEligibleLoanAmount('lower');
  }

  if (event.target?.matches?.('[data-loan-term]')) {
    updateMaximumEligibleLoanAmount('supreme');
  }

  if (event.target?.matches?.('[data-loan-term-lower]')) {
    updateMaximumEligibleLoanAmount('lower');
  }
});

if (document.querySelector('.calculator-page')) {
  openCalculator();
}

// Annual report book reader
const reportBook = document.querySelector('[data-report-book]');

if (reportBook) {
  const pages = Array.from(reportBook.querySelectorAll('.book-page'));
  const previousPageButton = reportBook.querySelector('[data-report-prev]');
  const nextPageButton = reportBook.querySelector('[data-report-next]');
  const currentPageLabel = reportBook.querySelector('[data-report-current]');
  const totalPageLabel = reportBook.querySelector('[data-report-total]');
  let reportPageIndex = 0;

  function showReportPage(index) {
    reportPageIndex = Math.max(0, Math.min(index, pages.length - 1));

    pages.forEach((page, pageIndex) => {
      const isActive = pageIndex === reportPageIndex;
      page.classList.toggle('active', isActive);
      page.setAttribute('aria-hidden', String(!isActive));
    });

    if (currentPageLabel) currentPageLabel.textContent = String(reportPageIndex + 1);
    if (totalPageLabel) totalPageLabel.textContent = String(pages.length);
    if (previousPageButton) previousPageButton.disabled = reportPageIndex === 0;
    if (nextPageButton) nextPageButton.disabled = reportPageIndex === pages.length - 1;
  }

  previousPageButton?.addEventListener('click', () => {
    showReportPage(reportPageIndex - 1);
  });

  nextPageButton?.addEventListener('click', () => {
    showReportPage(reportPageIndex + 1);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      showReportPage(reportPageIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      showReportPage(reportPageIndex + 1);
    }
  });

  showReportPage(0);
}

/* SCSLAIcares Gallery Lightbox */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

if (lightbox && lightboxImg) {
  document.querySelectorAll(
      ".cares-featured-image img, .cares-photo-grid img"
  ).forEach(img => {
      img.addEventListener("click", () => {
          lightboxImg.src = img.src;
          lightbox.classList.add("show");

          // Prevent page from scrolling while open
          document.body.style.overflow = "hidden";
      });
  });

  // Close when clicking the dark overlay
  lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
          lightbox.classList.remove("show");
          document.body.style.overflow = "";
      }
  });

  // Optional: close with Esc
  document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
          lightbox.classList.remove("show");
          document.body.style.overflow = "";
      }
  });
}
