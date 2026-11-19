
// Deliberately NOT a Live-Server-style auto-reloader. If anything else reloaded
// the page when you saved a file, the test would prove nothing about
// Games/game-watch.js. Nothing here reloads a page — only the site's own watcher
// can do that.
//
// /Games/ is served with Cache-Control: no-store, exactly like the vercel.json
// rule on the live site, so the test behaves the same locally as in production.
const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = Number(process.argv[2]) || 5500;
const root = path.join(__dirname, 'FRONT');

const app = express();
app.use('/Games', (req, res, next) => {
  res.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  next();
});

// Clean URLs, exactly like "cleanUrls": true in vercel.json: /reports/2022-annual-report
// is served from reports/2022-annual-report.html. Without this, reloading a clean URL
// (the live site's shape, and what ?clean=1 puts in the address bar) answered
// "Cannot GET /reports/2022-annual-report" here while working on the deployed site.
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  let urlPath = req.path;
  try { urlPath = decodeURIComponent(urlPath); } catch (e) { return next(); }
  // /FRONT/... is the same site (the Live Server style), so resolve that too.
  if (urlPath === '/FRONT') { urlPath = '/'; }
  else if (urlPath.indexOf('/FRONT/') === 0) { urlPath = urlPath.slice('/FRONT'.length); }
  if (path.extname(urlPath)) return next();               // real file — static handles it
  const candidate = path.join(root, urlPath + '.html');
  if (!candidate.startsWith(root + path.sep)) return next();   // no path escapes
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return res.sendFile(candidate);
  }
  return next();
});

app.use(express.static(root));
// The same site also answers under /FRONT/... so the URLs opened by
// .vscode/launch.json (http://localhost:5500/FRONT/index.html) keep working here.
app.use('/FRONT', express.static(root));

app.listen(PORT, () => {
  console.log(`Serving ${root}`);
  console.log(`  http://localhost:${PORT}/index.html`);
  console.log(`  http://localhost:${PORT}/reports/2022-annual-report.html`);
  console.log(`  http://localhost:${PORT}/reports/2022-annual-report      (clean URL)`);
  console.log(`  http://localhost:${PORT}/FRONT/index.html                 (Live Server style)`);
  console.log('');
  console.log('Now edit FRONT/Games/game-control.js and watch the open page reload itself.');
});
