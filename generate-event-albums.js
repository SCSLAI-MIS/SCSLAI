// Builds FRONT/events-albums.js — the photo list behind each home-page event
// album (the cards built from eventsData in FRONT/script.js).
//
//   node generate-event-albums.js
//
// An event lives in its own folder under FRONT/ (e.g. FRONT/Halloween/) and must
// hold COVER.png — the card image — plus the event's photos. COVER.* is left out
// of the album because it is already the card. Every FRONT subfolder that is not
// a site folder (animation, FORMS, Games, images, reports) is treated as an
// event, so dropping a new folder in and re-running this is all it takes.
const fs = require('fs');
const path = require('path');

const front = path.join(__dirname, 'FRONT');
const outFile = path.join(front, 'events-albums.js');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const siteFolders = new Set(['animation', 'FORMS', 'Games', 'images', 'reports']);

const albums = {};
for (const entry of fs.readdirSync(front, { withFileTypes: true })) {
  if (!entry.isDirectory() || siteFolders.has(entry.name)) continue;
  const dir = path.join(front, entry.name);
  const photos = fs
    .readdirSync(dir)
    .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
    .filter((name) => !/^cover\./i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  if (photos.length) albums[entry.name] = photos;
}

const lines = [
  '// AUTO-GENERATED — do not edit by hand.',
  '// The photos behind each home-page event album (the cards built from',
  '// eventsData in script.js). One key per event folder under FRONT/; the',
  '// folder\'s COVER.png is not listed because it is the card image.',
  '// Rebuild after adding or removing photos:  node generate-event-albums.js',
  'window.SCSLAI_EVENT_ALBUMS = {'
];
const folders = Object.keys(albums);
folders.forEach((folder, folderIndex) => {
  lines.push(`  ${JSON.stringify(folder)}: [`);
  albums[folder].forEach((photo, photoIndex) => {
    const comma = photoIndex === albums[folder].length - 1 ? '' : ',';
    lines.push(`    ${JSON.stringify(photo)}${comma}`);
  });
  lines.push(`  ]${folderIndex === folders.length - 1 ? '' : ','}`);
});
lines.push('};');

fs.writeFileSync(outFile, lines.join('\r\n') + '\r\n', 'utf8');
console.log(`wrote ${path.relative(process.cwd(), outFile)}`);
for (const folder of folders) console.log(`  ${folder}: ${albums[folder].length} photos`);
