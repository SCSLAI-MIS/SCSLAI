// qa-site.js — full-site QA sweep for the SCSLAI website.
// Serves the workspace over HTTP and walks EVERY page under FRONT/ in headless
// Chrome at desktop (1440x900) and mobile (390x844), collecting:
//   * JavaScript page errors and console errors
//   * failed / 4xx-5xx network requests (local files vs external CDNs, kept apart)
//   * horizontal overflow (layout that spills past the viewport)
//   * broken images and <img> tags missing an alt attribute
//   * duplicate element ids and interactive controls with no accessible name
//   * header/footer presence (every page should carry the shared chrome)
// It also statically scans each HTML file for local href/src references that do
// not exist on disk (clean-URL aware: "foo" also matches "foo.html").
// Writes a JSON report + screenshots into qa-results-site/.
// Usage: node qa-site.js "C:\path\to\chrome.exe"
const puppeteer = require('puppeteer-core');
const express = require('express');
const fs = require('fs');
const path = require('path');

const chromePath = process.argv[2] || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!fs.existsSync(chromePath)) {
  console.error('Chrome not found:', chromePath);
  process.exit(1);
}

const root = __dirname;
const front = path.join(root, 'FRONT');
const outDir = path.join(root, 'qa-results-site');
fs.rmSync(outDir, { force: true, recursive: true });
fs.mkdirSync(outDir, { recursive: true });

const PORT = 8140;
const base = `http://127.0.0.1:${PORT}`;
const app = express();
// /Games/ is served no-store exactly like the vercel.json rule on the live site,
// so the sweep behaves the same locally as in production.
app.use('/FRONT/Games', (req, res, next) => {
  res.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  next();
});
app.use(express.static(root));
const server = app.listen(PORT, () => console.log('[server]', base));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* Every page under FRONT/                                            */
/* ------------------------------------------------------------------ */
function walkHtml(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(p, out);
    else if (entry.name.toLowerCase().endsWith('.html')) out.push(p);
  }
  return out;
}
const pages = walkHtml(front, [])
  .sort()
  .map((p) => path.relative(root, p).split(path.sep).join('/')); // e.g. FRONT/index.html

// Optional 3rd CLI argument limits the sweep to pages whose path contains it,
// e.g. `node qa-site.js <chrome> reports/` for a fast targeted re-check.
const only = process.argv[3] || '';
const targetPages = only ? pages.filter((p) => p.indexOf(only) !== -1) : pages;

/* ------------------------------------------------------------------ */
/* Static scan: local href/src that does not exist on disk            */
/* ------------------------------------------------------------------ */
const SKIP_REF = /^(https?:|\/\/|mailto:|tel:|javascript:|data:|#|$)/i;
function refExists(pageAbs, ref) {
  const clean = ref.split('#')[0].split('?')[0].trim();
  if (!clean) return true;
  const target = clean.startsWith('/')
    ? path.join(front, clean.slice(1))
    : path.join(path.dirname(pageAbs), clean);
  const candidates = [target, target + '.html', path.join(target, 'index.html')];
  return candidates.some((c) => { try { return fs.existsSync(c); } catch (e) { return false; } });
}
function scanLinks(pageRel) {
  const abs = path.join(root, pageRel);
  const html = fs.readFileSync(abs, 'utf8');
  const missing = new Set();
  const re = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const ref = m[1].trim();
    if (SKIP_REF.test(ref)) continue;
    if (!refExists(abs, ref)) missing.add(ref);
  }
  return Array.from(missing);
}
// Known intentional exception: nav links to calculator.html are intercepted by
// script.js and open a popup — there is deliberately no calculator.html file.
const KNOWN_MISSING = new Set(['calculator.html', '../calculator.html']);

/* ------------------------------------------------------------------ */
/* Runtime audit of one page at one viewport                          */
/* ------------------------------------------------------------------ */
async function audit(browser, pageRel, viewport, tag) {
  const page = await browser.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const failed = [];
  page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 300)));
  page.on('console', (m) => {
    if (m.type() === 'error') {
      const t = m.text();
      if (!/favicon/i.test(t)) consoleErrors.push(t.slice(0, 300));
    }
  });
  const recordFail = (url, detail) => {
    const local = url.includes('127.0.0.1') || url.includes('localhost');
    failed.push({ url: url.slice(0, 200), detail, local });
  };
  page.on('requestfailed', (r) => {
    const err = (r.failure() && r.failure().errorText) || '';
    // ERR_ABORTED is a cancellation (e.g. a resource superseded mid-flight),
    // not a missing or failed asset.
    if (err.indexOf('ERR_ABORTED') !== -1) return;
    recordFail(r.url(), 'failed: ' + err);
  });
  page.on('response', (r) => { if (r.status() >= 400) recordFail(r.url(), 'HTTP ' + r.status()); });

  await page.setViewport(viewport);
  page.setDefaultTimeout(40000);
  try {
    await page.goto(`${base}/${pageRel}?welcome=0&starreset=1&heartreset=1`, {
      waitUntil: 'domcontentloaded', timeout: 40000
    });
  } catch (e) {
    pageErrors.push('navigation: ' + e.message);
  }
  // The page-load coin holds the page while it comes down (by design).
  await page.waitForFunction(() => !document.querySelector('.scslai-loader--boot'), { timeout: 12000 }).catch(() => {});
  await wait(1800);

  // Below-the-fold <img loading="lazy"> tags have not been fetched yet, so they
  // would read as false "broken image" hits. Force any image that is still
  // pending to load now, independent of its scroll position. (A genuinely
  // missing file still 404s and is still caught.)
  await page.evaluate(() => {
    Array.from(document.images).forEach((img) => {
      const src = img.getAttribute('src');
      if (!src || (img.complete && img.naturalWidth > 0)) return;
      img.setAttribute('loading', 'eager');
      img.setAttribute('data-qa-forced', '1');
      img.setAttribute('src', src + (src.indexOf('?') === -1 ? '?' : '&') + 'qaLoad=1');
    });
  }).catch(() => {});
  await page.waitForFunction(
    () => Array.from(document.images).filter((i) => i.getAttribute('src')).every((i) => i.complete),
    { timeout: 15000 }
  ).catch(() => {});
  await wait(600);

  const dom = await page.evaluate(() => {
    const doc = document.documentElement;
    const images = Array.from(document.images).map((i) => ({
      src: (i.currentSrc || i.getAttribute('src') || '').replace(/[?&]qaLoad=1/, '').slice(0, 160),
      loaded: i.complete && i.naturalWidth > 0,
      hasAltAttr: i.hasAttribute('alt')
    }));
    const idCount = {};
    document.querySelectorAll('[id]').forEach((el) => { idCount[el.id] = (idCount[el.id] || 0) + 1; });
    const dupeIds = Object.keys(idCount).filter((k) => idCount[k] > 1);
    const unlabelled = [];
    document.querySelectorAll('button, a[href], input, select, textarea').forEach((el) => {
      const label = (el.getAttribute('aria-label') || el.getAttribute('title') ||
        (el.textContent || '').trim() || el.getAttribute('placeholder') || el.getAttribute('value') || '').trim();
      if (!label) unlabelled.push(el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''));
    });
    return {
      scrollWidth: doc.scrollWidth,
      innerWidth: window.innerWidth,
      images,
      dupeIds,
      unlabelled: unlabelled.slice(0, 20),
      unlabelledCount: unlabelled.length,
      title: document.title,
      hasHeader: !!document.querySelector('header'),
      hasFooter: !!document.querySelector('footer')
    };
  });

  await page.screenshot({ path: path.join(outDir, `${tag}.png`) }).catch(() => {});
  await page.close();

  return {
    page: pageRel,
    view: tag.startsWith('mobile') ? 'mobile' : 'desktop',
    title: dom.title,
    pageErrors,
    consoleErrors,
    localFailed: failed.filter((f) => f.local),
    externalFailed: failed.filter((f) => !f.local),
    overflow: dom.scrollWidth - dom.innerWidth,
    scrollWidth: dom.scrollWidth,
    innerWidth: dom.innerWidth,
    brokenImages: dom.images.filter((i) => i.src && !i.loaded),
    missingAlt: dom.images.filter((i) => !i.hasAltAttr),
    dupeIds: dom.dupeIds,
    unlabelledCount: dom.unlabelledCount,
    unlabelled: dom.unlabelled,
    hasHeader: dom.hasHeader,
    hasFooter: dom.hasFooter
  };
}

/* ------------------------------------------------------------------ */
/* Interactive smoke test — the shared chrome the JS builds at runtime */
/* ------------------------------------------------------------------ */
async function interactiveSmoke(browser) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${base}/FRONT/index.html?welcome=0&starreset=1`, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForFunction(() => !document.querySelector('.scslai-loader--boot'), { timeout: 12000 }).catch(() => {});
  await wait(1200);

  const out = {};
  // 1. Calculator link opens the popup instead of navigating.
  const pathBefore = await page.evaluate(() => location.pathname + location.search);
  await page.evaluate(() => { const a = document.querySelector('a[href="calculator.html"]'); if (a) a.click(); });
  out.calculatorOpens = await page
    .waitForFunction(() => !!document.querySelector('[data-calculator-modal].open'), { timeout: 8000 })
    .then(() => true).catch(() => false);
  out.calculatorStayedOnPage = (await page.evaluate(() => location.pathname + location.search)) === pathBefore;
  // 2. Calculator tabs switch panels.
  out.calculatorTabs = await page.evaluate(() => document.querySelectorAll('[data-court-tab]').length);
  await page.evaluate(() => { const b = document.querySelector('[data-court-tab]'); if (b) b.click(); });
  await wait(300);
  out.calculatorPanelVisible = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-court-panel]')).some((p) => !p.hidden && p.offsetParent !== null));
  await page.evaluate(() => { const c = document.querySelector('[data-close-calculator]'); if (c) c.click(); });
  await wait(400);
  out.calculatorCloses = await page.evaluate(() => !document.querySelector('[data-calculator-modal].open'));
  // 3. ABOUT US dropdown opens its submenu (script.js toggles .dropdown.open).
  await page.click('.dropdown .dropbtn').catch(() => {});
  await wait(400);
  out.dropdownItems = await page.evaluate(() => {
    const dd = document.querySelector('.dropdown');
    const menu = dd && dd.querySelector('.dropdown-content');
    if (!menu) return { links: 0, opens: false };
    const s = getComputedStyle(menu);
    return {
      links: menu.querySelectorAll('a').length,
      opens: !!dd.classList.contains('open') && s.display !== 'none' && s.visibility !== 'hidden'
    };
  });
  // 4. Facebook live widget: report the config + whether a node was injected.
  out.fbLiveConfigEnabled = await page.evaluate(() => {
    const c = window.SCSLAI_FACEBOOK_LIVE;
    return !!(c && c.enabled && c.liveUrl);
  });
  out.fbLiveNodePresent = await page.evaluate(() =>
    !!document.querySelector('#scslai-fb-live, #scslai-fb-live-pill, .scslai-fb-live-modal'));
  out.pageErrors = errors;
  await page.close();
  return out;
}

/* ------------------------------------------------------------------ */
/* Main sweep                                                         */
/* ------------------------------------------------------------------ */
(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: [
      '--window-size=1440,900', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
      '--no-sandbox', '--disable-features=MediaRouter'
    ]
  });

  console.log(`\n[pages] ${targetPages.length} HTML page(s) queued for sweep (of ${pages.length})\n`);

  const report = { generatedAt: new Date().toISOString(), pages: [], views: [], static: [] };

  for (const rel of targetPages) {
    const slug = rel.replace(/^FRONT\//, '').replace(/\.html$/i, '').replace(/[\\/]/g, '_') || 'index';
    const desktop = await audit(browser, rel, { width: 1440, height: 900 }, `desktop-${slug}`);
    const mobile = await audit(browser, rel, { width: 390, height: 844 }, `mobile-${slug}`);
    report.views.push(desktop, mobile);
    report.pages.push({ page: rel, title: desktop.title, header: desktop.hasHeader, footer: desktop.hasFooter });

    const flag = (v) => {
      const bits = [];
      if (v.pageErrors.length) bits.push(`${v.pageErrors.length} JS error`);
      if (v.localFailed.length) bits.push(`${v.localFailed.length} local 4xx/fail`);
      if (v.brokenImages.length) bits.push(`${v.brokenImages.length} broken img`);
      if (v.overflow > 2) bits.push(`overflow ${v.overflow}px`);
      if (v.dupeIds.length) bits.push(`${v.dupeIds.length} dup id`);
      if (v.unlabelledCount) bits.push(`${v.unlabelledCount} unlabelled`);
      return bits.length ? bits.join(', ') : 'clean';
    };
    console.log(`  ${rel.padEnd(42)} desktop: ${flag(desktop).padEnd(34)} mobile: ${flag(mobile)}`);
  }

  const missingStatic = [];
  for (const rel of targetPages) {
    const missing = scanLinks(rel);
    if (missing.length) {
      missingStatic.push({ page: rel, missing });
      report.static.push({ page: rel, missing });
    }
  }

  /* ------------------------- SEO / metadata ------------------------ */
  const seo = { robotsTxt: fs.existsSync(path.join(front, 'robots.txt')), sitemap: null, missingDescription: [], duplicateTitles: {} };
  const sitemapPath = path.join(front, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, 'utf8');
    seo.sitemap = { locCount: (xml.match(/<loc>/g) || []).length, hasLastmod: /<lastmod>/i.test(xml) };
  }
  const titleMap = {};
  for (const rel of pages) {
    const html = fs.readFileSync(path.join(root, rel), 'utf8');
    const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
    (titleMap[title] = titleMap[title] || []).push(rel);
    if (!/name\s*=\s*["']description["']/i.test(html)) seo.missingDescription.push(rel);
  }
  seo.duplicateTitles = Object.fromEntries(Object.entries(titleMap).filter(([, v]) => v.length > 1));
  report.seo = seo;
  console.log(`\n[seo] robots.txt: ${seo.robotsTxt ? 'present' : 'MISSING'} | sitemap URLs: ${seo.sitemap ? seo.sitemap.locCount : 'no sitemap'} | pages missing meta description: ${seo.missingDescription.length}/${pages.length}`);

  console.log(`\n[static] ${missingStatic.length} page(s) reference a local file that does not exist on disk`);
  for (const s of missingStatic) console.log(`   ${s.page}: ${s.missing.join(', ')}`);

  const smoke = await interactiveSmoke(browser);
  await browser.close();
  server.close();

  report.smoke = smoke;
  fs.writeFileSync(path.join(outDir, 'qa-site-report.json'), JSON.stringify(report, null, 2));

  /* ---------------------------- Verdict ---------------------------- */
  const jsErrors = report.views.filter((v) => v.pageErrors.length);
  const localFails = report.views.filter((v) => v.localFailed.length);
  const brokenImgs = report.views.filter((v) => v.brokenImages.length);
  const overflows = report.views.filter((v) => v.overflow > 2);
  const dupIds = report.views.filter((v) => v.dupeIds.length);
  const consoleErrs = report.views.filter((v) => v.consoleErrors.length);
  const externalFails = report.views.filter((v) => v.externalFailed.length);
  const unknownMissing = report.static.filter((s) => s.missing.some((r) => !KNOWN_MISSING.has(r)));
  const altGaps = report.views.filter((v) => v.missingAlt.length);
  const unlabelled = report.views.filter((v) => v.unlabelledCount > 0);

  const line = (label, list, extraTxt) =>
    console.log(`  ${list.length ? 'FAIL' : 'PASS'} — ${label}${list.length ? ' :: ' + extraTxt : ''}`);

  console.log('\n================ QA-SITE SUMMARY (' + report.views.length + ' page-views) ================');
  line('no JavaScript page errors', jsErrors, jsErrors.map((v) => `${v.page}:${v.view}(${v.pageErrors[0]})`).join(', '));
  line('no local (site file) request failures', localFails, localFails.map((v) => `${v.page}:${v.view} ${v.localFailed.map((f) => f.detail + ' ' + f.url).join(' | ')}`).join(' ;; '));
  line('no broken images', brokenImgs, brokenImgs.map((v) => `${v.page}:${v.view}(${v.brokenImages.length})`).join(', '));
  line('no horizontal overflow', overflows, overflows.map((v) => `${v.page}:${v.view} +${v.overflow}px`).join(', '));
  line('no duplicate element ids', dupIds, dupIds.map((v) => `${v.page}:${v.view}[${v.dupeIds.join(',')}]`).join(', '));
  line('all local href/src references resolve', unknownMissing,
    unknownMissing.map((s) => `${s.page}: ${s.missing.filter((r) => !KNOWN_MISSING.has(r)).join(', ')}`).join(' ;; '));

  console.log('\n  -- non-blocking observations --');
  console.log(`  ${consoleErrs.length ? 'WARN' : 'ok  '} — console errors on ${consoleErrs.length} view(s): ${consoleErrs.map((v) => `${v.page}:${v.view}(${v.consoleErrors.length})`).slice(0, 8).join(', ')}`);
  console.log(`  ${externalFails.length ? 'WARN' : 'ok  '} — external (CDN) request failures on ${externalFails.length} view(s)`);
  console.log(`  ${altGaps.length ? 'NOTE' : 'ok  '} — <img> without alt attr on ${altGaps.length} view(s): ${altGaps.map((v) => `${v.page}:${v.view}(${v.missingAlt.length})`).slice(0, 8).join(', ')}`);
  console.log(`  ${unlabelled.length ? 'NOTE' : 'ok  '} — unlabelled controls on ${unlabelled.length} view(s)`);
  console.log(`  ${seo.robotsTxt ? 'ok  ' : 'NOTE'} — robots.txt ${seo.robotsTxt ? 'present' : 'MISSING (search engines get no crawl guidance)'}`);
  console.log(`  ${seo.sitemap && seo.sitemap.locCount >= pages.length ? 'ok  ' : 'NOTE'} — sitemap lists ${seo.sitemap ? seo.sitemap.locCount : 0} URL(s) for ${pages.length} pages`);
  console.log(`  ${seo.missingDescription.length ? 'NOTE' : 'ok  '} — ${seo.missingDescription.length} page(s) missing a meta description`);
  console.log(`  ${Object.keys(seo.duplicateTitles).length ? 'NOTE' : 'ok  '} — duplicate <title>: ${Object.entries(seo.duplicateTitles).map(([t, p]) => `"${t}" (${p.length})`).join(', ') || 'none'}`);
  console.log('  interactive smoke:', JSON.stringify(smoke));

  const failures = jsErrors.length + localFails.length + brokenImgs.length + overflows.length + dupIds.length + unknownMissing.length;
  console.log(`\nQA-SITE RESULT: ${failures === 0 ? 'PASS' : 'FAIL'} (${failures} blocking finding(s))`);
  console.log('report:', path.join(outDir, 'qa-site-report.json'));
  process.exit(failures === 0 ? 0 : 1);
})().catch((err) => {
  console.error('QA-SITE crashed:', err);
  try { server.close(); } catch (e) {}
  process.exit(1);
});

