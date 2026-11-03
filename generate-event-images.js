// Builds optimized copies of the home-page event album photos.
//
//   node generate-event-images.js ["C:\path\to\chrome.exe"]
//
// The event folders hold straight-off-the-camera files (3-4 MB each), so the
// reader and its thumbnail strip would be very slow to load. For every event
// folder under FRONT/ (the same folders generate-event-albums.js treats as
// events) this writes two derivatives beside the originals:
//
//   FRONT/<Event>/thumbs/<name>.jpg    small thumbnails for the strip
//   FRONT/<Event>/display/<name>.jpg   web-sized copies for the reader
//
// Originals are never modified or removed, and the album falls back to them
// when a derivative is missing. Chrome does the resizing through a canvas, so
// no native image library is required.
//
//   --limit=N   only process the first N photos that still need work
//
// Re-run after adding or removing photos.
const fs = require('fs');
const path = require('path');
const express = require('express');
const puppeteer = require('puppeteer-core');

const chromePath = process.argv[2] || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!fs.existsSync(chromePath)) {
  console.error('Chrome not found:', chromePath);
  process.exit(1);
}

const front = path.join(__dirname, 'FRONT');
const siteFolders = new Set(['animation', 'FORMS', 'Games', 'images', 'reports']);
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const THUMB = { max: 240, quality: 0.72 };
const DISPLAY = { max: 1280, quality: 0.75 };

function collectJobs() {
  const jobs = [];
  for (const entry of fs.readdirSync(front, { withFileTypes: true })) {
    if (!entry.isDirectory() || siteFolders.has(entry.name)) continue;
    const dir = path.join(front, entry.name);
    const files = fs
      .readdirSync(dir)
      .filter((name) => fs.statSync(path.join(dir, name)).isFile())
      .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
      .filter((name) => !/^cover\./i.test(name))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    for (const name of files) {
      const base = name.slice(0, -path.extname(name).length);
      jobs.push({
        folder: entry.name,
        name,
        urlPath: '/FRONT/' + entry.name.split('/').map(encodeURIComponent).join('/') + '/' + encodeURIComponent(name),
        thumbPath: path.join(dir, 'thumbs', base + '.jpg'),
        displayPath: path.join(dir, 'display', base + '.jpg')
      });
    }
  }
  return jobs;
}

const port = 8199;
const server = express()
  .get('/__blank', (req, res) => res.type('html').send('<!doctype html><meta charset="utf-8"><title>gen</title>'))
  .use(express.static(__dirname))
  .listen(port, () => console.log('[server] http://127.0.0.1:' + port));

(async () => {
  const jobs = collectJobs();
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number(limitArg.split('=')[1]) : 0;
  const todo = jobs.filter((job) => !fs.existsSync(job.thumbPath) || !fs.existsSync(job.displayPath));
  const batch = limit ? todo.slice(0, limit) : todo;

  console.log(`[images] ${jobs.length} photos, ${todo.length} need work, processing ${batch.length}`);
  if (!batch.length) {
    server.close();
    process.exit(0);
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/__blank`, { waitUntil: 'domcontentloaded', timeout: 30000 });

  let done = 0;
  let failed = 0;
  for (const job of batch) {
    try {
      const out = await page.evaluate(async (url, thumbMax, thumbQ, dispMax, dispQ) => {
        const img = await new Promise((resolve, reject) => {
          const i = new Image();
          i.onload = () => resolve(i);
          i.onerror = () => reject(new Error('decode failed'));
          i.src = url;
        });
        const draw = (max, q) => {
          const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
          const w = Math.max(1, Math.round(img.naturalWidth * scale));
          const h = Math.max(1, Math.round(img.naturalHeight * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);
          return canvas.toDataURL('image/jpeg', q);
        };
        return { thumb: draw(thumbMax, thumbQ), display: draw(dispMax, dispQ) };
      }, job.urlPath, THUMB.max, THUMB.quality, DISPLAY.max, DISPLAY.quality);

      fs.mkdirSync(path.dirname(job.thumbPath), { recursive: true });
      fs.mkdirSync(path.dirname(job.displayPath), { recursive: true });
      fs.writeFileSync(job.thumbPath, Buffer.from(out.thumb.split(',')[1], 'base64'));
      fs.writeFileSync(job.displayPath, Buffer.from(out.display.split(',')[1], 'base64'));
      done += 1;
      if (done % 10 === 0 || done === batch.length) console.log(`  ${done}/${batch.length}  ${job.folder}/${job.name}`);
    } catch (err) {
      failed += 1;
      console.error(`  FAILED ${job.folder}/${job.name}: ${err.message}`);
    }
  }

  await browser.close();
  server.close();
  console.log(`[images] wrote ${done} thumbnails + ${done} display copies${failed ? `, ${failed} failed` : ''}`);
  process.exit(failed ? 1 : 0);
})().catch((err) => {
  console.error('generate-event-images crashed:', err);
  try { server.close(); } catch (e) {}
  process.exit(1);
});
