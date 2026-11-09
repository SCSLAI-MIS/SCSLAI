// qa-game-refresh.js — proves the Star Hunt reaches ALREADY-OPEN pages by itself.
// Serves the site, boots index.html with the hunt off, then changes
// Games/game-control.js exactly the way the admin would
// (const ACTIVE_GAME = "STAR";) and checks that the open page reloads itself and
// paints the star with nobody touching the browser. Also checks the
// "don't wipe what I'm typing" guard and that the page settles afterwards.
// Usage: node qa-game-refresh.js "C:\path\to\chrome.exe"
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
const PORT = 8137;
const base = `http://127.0.0.1:${PORT}`;
const PAGE = 'FRONT/index.html?welcome=0&starreset=1';

// The deployed value of the Game Controls. Flipping this stands in for the
// admin's one-line commit + the Vercel deploy that follows it.
let switchValue = '';

const app = express();

// The two files the test stands in for must be answered before the static
// handler, so the page really does run the value we "deploy".
app.get('/FRONT/Games/game-control.js', (req, res) => {
  res.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  res.type('application/javascript').send(
    '// Which anniversary hunt runs across the site.\n' +
    'const ACTIVE_GAME = "' + switchValue + '";\n'
  );
});

// Same watcher the site ships, only faster, so the test does not sit for 20s,
// and with its own logging switched on so the run explains itself.
app.get('/FRONT/Games/game-watch.js', (req, res) => {
  let src = fs.readFileSync(path.join(root, 'FRONT/Games/game-watch.js'), 'utf8');
  src = src
    .replace(/POLL_MS = \d+/, 'POLL_MS = 800')
    .replace(/setTimeout\(check, \d+\)/, 'setTimeout(check, 300)')
    .replace(/DEBUG = false/, 'DEBUG = true');
  res.type('application/javascript').send(src);
});

app.use(express.static(root));
const server = app.listen(PORT, () => console.log('[server]', base));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitFor(fn, timeout, label) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await fn()) return true;
    await wait(150);
  }
  return false;
}

// The page-load coin holds clicks while the page is still coming down.
async function settle(page) {
  await page.waitForFunction(() => !document.querySelector('.scslai-loader--boot'), { timeout: 8000 }).catch(() => {});
  await wait(150);
}

const results = [];
function check(name, ok, extra) {
  results.push({ name, ok: !!ok });
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}${extra ? ' :: ' + extra : ''}`);
}

async function newPage(browser) {
  const page = await browser.newPage();
  const state = { navs: 0, errors: [], logs: [] };
  page.on('framenavigated', (frame) => { if (frame === page.mainFrame()) state.navs += 1; });
  page.on('pageerror', (e) => state.errors.push(String(e).slice(0, 200)));
  page.on('console', (m) => {
    const text = m.text();
    if (text.indexOf('[game-watch]') === 0) state.logs.push(text);
  });
  page.on('dialog', (d) => d.accept().catch(() => {}));
  await page.setViewport({ width: 1400, height: 950 });
  page.__state = state;
  return page;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--window-size=1400,950', '--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });

  /* ====================================================================
     1. Default state — the site runs with the hunt off, so no stars
     ==================================================================== */
  const lone = await newPage(browser);
  await lone.goto(`${base}/${PAGE}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await wait(2500);

  const before = await lone.evaluate(() => ({
    value: typeof ACTIVE_GAME === 'string' ? ACTIVE_GAME : null,
    triggers: document.querySelectorAll('.easter-egg-trigger').length
  }));
  check('default state: the page is running the hunt-off value', before.value === '', JSON.stringify(before));
  check('default state: no stars on screen', before.triggers === 0, `triggers=${before.triggers}`);
  check('the watcher is running on the page', lone.__state.logs.length > 0, lone.__state.logs[0] || 'no [game-watch] log');

  /* ====================================================================
     2. The admin writes STAR, commits, Vercel deploys — the OPEN page
        notices on its own, reloads itself and paints the Star Hunt
     ==================================================================== */
  const navsBefore = lone.__state.navs;
  switchValue = 'STAR';                       // <- the admin's one-line change
  const reloaded = await waitFor(() => lone.__state.navs > navsBefore, 15000);
  check('an open page reloads itself after the Game Controls change',
    reloaded, `navigations ${navsBefore} -> ${lone.__state.navs}`);

  await wait(1000);
  const after = await lone.evaluate(() => {
    const trigger = document.querySelector('.easter-egg-trigger');
    return {
      value: typeof ACTIVE_GAME === 'string' ? ACTIVE_GAME : null,
      triggers: document.querySelectorAll('.easter-egg-trigger').length,
      glyph: !!document.querySelector('.easter-egg-trigger .easter-egg-star'),
      id: trigger ? trigger.getAttribute('data-egg-id') : null
    };
  });
  check('after the automatic reload the page runs the new value', after.value === 'STAR', JSON.stringify(after));
  check('the Star Hunt is on screen (star trigger rendered)', after.triggers > 0 && after.glyph, JSON.stringify(after));

  const navsSettled = lone.__state.navs;
  await wait(4500);                           // several poll cycles
  check('the page then settles — no reload loop', lone.__state.navs === navsSettled,
    `navigations ${navsSettled} -> ${lone.__state.navs}`);
  check('no page errors while refreshing itself', lone.__state.errors.length === 0, lone.__state.errors.join(' | '));
  await lone.close();

  /* ====================================================================
     3. A visitor mid-form is never interrupted: the reload waits for the
        Calculator popup to close instead of wiping it
     ==================================================================== */
  switchValue = 'star';
  const busy = await newPage(browser);
  await busy.goto(`${base}/${PAGE}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await settle(busy);
  await wait(1200);
  await busy.evaluate(() => {
    const link = document.querySelector('a[href="calculator.html"]');
    if (link) link.click();
  });
  await busy.waitForFunction(() => !!document.querySelector('[data-calculator-modal].open'), { timeout: 8000 })
    .catch(() => {});
  const calcOpen = await busy.evaluate(() => !!document.querySelector('[data-calculator-modal].open'));
  check('the Calculator popup is open', calcOpen === true);

  const navsBusy = busy.__state.navs;
  switchValue = 'heart';                      // the admin changes it mid-form
  await wait(4000);                           // several poll cycles
  check('no reload while the visitor has the Calculator open',
    busy.__state.navs === navsBusy, `navigations ${navsBusy} -> ${busy.__state.navs}`);

  await busy.click('[data-close-calculator]');
  const resumed = await waitFor(() => busy.__state.navs > navsBusy, 15000);
  check('the reload arrives once the visitor is done', resumed,
    `navigations ${navsBusy} -> ${busy.__state.navs}`);
  check('no page errors in the busy-visitor case', busy.__state.errors.length === 0, busy.__state.errors.join(' | '));
  await busy.close();

  /* ====================================================================
     Summary
     ==================================================================== */
  await browser.close();
  server.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\nQA-GAME-REFRESH RESULT: ${failed.length === 0 ? 'PASS' : 'FAIL'} (${results.length - failed.length}/${results.length})`);
  process.exit(failed.length === 0 ? 0 : 1);
})().catch((err) => {
  console.error('QA-GAME-REFRESH crashed:', err);
  try { server.close(); } catch (e) {}
  process.exit(1);
});

