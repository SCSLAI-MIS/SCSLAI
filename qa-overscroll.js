// qa-overscroll.js — checks the colour the browser repeats into the overscroll
// (rubber-band) strip at the very top / very bottom of the page, plus a visual
// regression check of the page itself. Local scratch tool (like qa-covers.js):
// serves this folder over HTTP, opens FRONT/index.html in headless Chrome and
// reports:
//   a) computed background-colour of <html> and <body>  (must be the theme
//      green, not transparent — see the note in FRONT/style.css)
//   b) the body's layered page background is intact (photo still bottom layer)
//   c) the visible page renders the same with the colour on/off (0 diff pixels
//      in the static background column)
//   d) the pixel colour of the canvas area — what the overscroll strip shows
// Usage: node qa-overscroll.js "C:\path\to\chrome.exe"
const puppeteer = require('puppeteer-core');
const { PNG } = require('pngjs');
const express = require('express');

const chromePath = process.argv[2] || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const root = __dirname;
const W = 1400, H = 780;
const server = express().use(express.static(root)).listen(8137, () => console.log('[server] http://127.0.0.1:8137'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const readPng = (buf) => PNG.sync.read(Buffer.from(buf));
const px = (png, x, y) => { const i = (png.width * Math.round(x) + Math.round(y)) << 2; return `${png.data[i]},${png.data[i + 1]},${png.data[i + 2]}`; };
const diff = (a, b) => {
  if (a.width !== b.width || a.height !== b.height) { return 'size mismatch'; }
  let n = 0, worst = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    const d = Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]);
    if (d > 6) { n++; worst = Math.max(worst, d); }
  }
  return `differing pixels: ${n} / ${a.width * a.height} (${((n / (a.width * a.height)) * 100).toFixed(3)}%)${worst ? `, max channel delta ${worst}` : ''}`;
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath, headless: 'new',
    args: [`--window-size=${W},${H}`, '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H });
  await page.goto('http://127.0.0.1:8137/FRONT/index.html?welcome=0', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  const styles = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const bs = getComputedStyle(document.body);
    return {
      htmlBgColor: cs.backgroundColor,
      bodyBgColor: bs.backgroundColor,
      bodyBgLayers: bs.backgroundImage.split(/,(?![^(]*\))/).length,
      bodyBgBottomLayer: bs.backgroundImage.slice(-60),
      sheetRules: document.styleSheets[1] ? document.styleSheets[1].cssRules.length : 'n/a',
      bodyMinHeight: bs.minHeight
    };
  });
  console.log('\n(a/b) computed styles:', JSON.stringify(styles, null, 2));

  const top = async () => readPng(await page.screenshot({ encoding: 'binary' }));
  const at = async (y) => { await page.evaluate((v) => window.scrollTo(0, v === 'bottom' ? document.documentElement.scrollHeight : 0), y); await sleep(800); return top(); };

  // (d) area the body box does not cover == the canvas colour the browser
  //     repeats into the overscroll strip.
  const canvasProbe = async (label) => {
    await page.addStyleTag({ content: 'header,main,footer{display:none !important;} body{min-height:0 !important;display:block !important;}' });
    await sleep(500);
    const shot = await top();
    console.log(`(d) ${label}: centre=${px(shot, W / 2, H / 2)}  corners=${px(shot, 20, 20)} / ${px(shot, W - 20, H - 20)}`);
  };
  await canvasProbe('with fix  (canvas colour now)');
  await page.addStyleTag({ content: 'html{background-color:transparent !important;} body{background-color:transparent !important;}' });
  await sleep(400);
  const shotOld = await top();
  console.log(`(d) old css  (canvas colour before): centre=${px(shotOld, W / 2, H / 2)}  corners=${px(shotOld, 20, 20)} / ${px(shotOld, W - 20, H - 20)}`);

  // (c) regression check: freeze CSS animations in BOTH states so only the
  //     background change can show up, then compare a background-only column
  //     (x 2..28: the photo/overlay left of the panels, the header and footer).
  const FREEZE = '*,*::before,*::after{animation-play-state:paused !important;transition:none !important;}';
  const diffRegion = (a, b, x0, x1) => {
    let n = 0, total = 0, worst = 0;
    for (let y = 0; y < a.height; y++) {
      for (let x = x0; x <= x1; x++) {
        const i = (a.width * y + x) << 2;
        const d = Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]);
        total++;
        if (d > 6) { n++; worst = Math.max(worst, d); }
      }
    }
    return `x[${x0}..${x1}]: ${n}/${total} differing (${((n / total) * 100).toFixed(3)}%)${worst ? ` max delta ${worst}` : ''}`;
  };

  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(3000);
  await page.addStyleTag({ content: FREEZE });
  await sleep(300);
  const fixTop = await at('top');
  const fixTopCtl = await at('top');
  const fixBottom = await at('bottom');

  await page.addStyleTag({ content: 'html{background-color:transparent !important;} body{background-color:transparent !important;}' });
  await sleep(500);
  const oldTop = await at('top');
  const oldBottom = await at('bottom');

  console.log(`\n(c) background column, control (fix vs fix) top    -> ${diffRegion(fixTop, fixTopCtl, 2, 28)}`);
  console.log(`(c) background column, top    fix vs old css      -> ${diffRegion(fixTop, oldTop, 2, 28)}`);
  console.log(`(c) background column, bottom fix vs old css      -> ${diffRegion(fixBottom, oldBottom, 2, 28)}`);
  console.log(`(c) probes fix  : header(5,40)=${px(fixTop, 5, 40)}  bg(10,400)=${px(fixTop, 10, 400)}  footer(5,${H - 8})=${px(fixBottom, 5, H - 8)}`);
  console.log(`(c) probes old  : header(5,40)=${px(oldTop, 5, 40)}  bg(10,400)=${px(oldTop, 10, 400)}  footer(5,${H - 8})=${px(oldBottom, 5, H - 8)}`);

  await browser.close();
  server.close();
})();
