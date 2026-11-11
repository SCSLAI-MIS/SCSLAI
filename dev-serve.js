
// Deliberately NOT a Live-Server-style auto-reloader. If anything else reloaded
// the page when you saved a file, the test would prove nothing about
// Games/game-watch.js. Nothing here reloads a page — only the site's own watcher
// can do that.
//
// /Games/ is served with Cache-Control: no-store, exactly like the vercel.json
// rule on the live site, so the test behaves the same locally as in production.
const express = require('express');
const path = require('path');

const PORT = Number(process.argv[2]) || 5500;
const root = path.join(__dirname, 'FRONT');

const app = express();
app.use('/Games', (req, res, next) => {
  res.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  next();
});
app.use(express.static(root));

app.listen(PORT, () => {
  console.log(`Serving ${root}`);
  console.log(`  http://localhost:${PORT}/index.html`);
  console.log(`  http://localhost:${PORT}/reports/2022-annual-report.html`);
  console.log('');
  console.log('Now edit FRONT/Games/game-control.js and watch the open page reload itself.');
});
