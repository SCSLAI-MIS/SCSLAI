# Anniversary Games (TEMPORARY)

Two hidden-object hunts for the SCSLAI anniversary. **Delete this whole
folder after the anniversary** — nothing else on the site depends on it.

```
Games/
├── game-control.js  ← THE SWITCH (one line, edit only this)
├── star-game.css    Game 1 look (stars + popup UI)
├── star-game.js     Game 1 logic (5 stars)
├── heart-game.css   Game 2 look (hearts + popup UI, same style as stars)
├── heart-game.js    Game 2 logic (5 hearts)
└── README.md        this file
```

## Current state — one line switches everything

`Games/game-control.js` holds exactly one line:

```js
const ACTIVE_GAME = "heart";   // current setting — Game 2 is live
```

| `ACTIVE_GAME` | What players see |
| --- | --- |
| `"star"` | 5 stars on the 5 star pages. **No hearts anywhere**, not even in the calculator. |
| `"heart"` | 5 hearts (4 page hearts + the calculator heart, reachable from every page). **No stars ever.** |

Both game scripts are loaded on their pages and check this value before
rendering anything. `game-control.js` must load before them (it does).

## Where the stars are (Game 1)

| Page | Spot |
| --- | --- |
| `index.html` | `.announcements .title` |
| `contact.html` | second contact card |
| `membership.html` | footer bottom line |
| `about-framework.html` | top of the framework chart |
| `download.html` | download note |

## Where the hearts are (Game 2)

| Page | Spot |
| --- | --- |
| `scslaicares.html` | inside the “Book” (yearbook) modal header |
| `about-mission-vision.html` | bottom of the Mission & Vision section |
| `loans.html` | header of the Lower Court section |
| `reports/2022-annual-report.html` | beside “UPCOMING EXPENSES/OPERATIONAL BUDGET” |
| Calculator popup | bottom edge of the calculator dialog — available from **every** page |

One heart per page (plus the calculator one). The calculator is a popup built
by `script.js`, so `heart-game.js` injects its heart the first time the popup
opens. That heart sticks to the visible bottom edge of the dialog, so it is
there immediately without scrolling the tall form.

## Switching games

1. Open `Games/game-control.js`.
2. Set the value — exactly one of these:

   ```js
   const ACTIVE_GAME = "star";    // Game 1 — stars only
   ```

   ```js
   const ACTIVE_GAME = "heart";   // Game 2 — hearts only
   ```

3. Save and hard-refresh the site (`Ctrl+F5` / `Cmd+Shift+R`).

Nothing else to comment, uncomment or delete. If `game-control.js` is missing,
or the value is anything other than exactly `"star"` or `"heart"`, **both**
hunts stay switched off (empty `""`, typos like `"hearts"`, and capitalised
values all produce no stars and no hearts). See the `activeGameName()` checks
at the top of `star-game.js` / `heart-game.js`.

### Which pages load what

- **Star pages** (`index`, `contact`, `membership`, `about-framework`,
  `download`): `star-game.css`, `star-game.js`, `game-control.js`,
  plus `heart-game.css` / `heart-game.js` for the calculator heart.
- **Heart pages** (`scslaicares`, `loans`, `about-mission-vision`,
  `reports/2022-annual-report`): `heart-game.css`, `heart-game.js`,
  `game-control.js`.
- **About pages** (`about-history`, `about-core-values`, `about-annual-report`,
  `about-data-protection-policy`): `heart-game.css`, `heart-game.js`,
  `game-control.js` — for the calculator heart only.
- `reports/2023` and `reports/2024` are left out on purpose: their CALCULATOR
  link points to `../calculator.html`, which `script.js` does not intercept,
  so the calculator cannot be opened there.

## Why hearts never show up early

Three independent safety nets:

1. Every heart in the HTML carries `style="display:none"` — invisible even
   with no CSS at all.
2. `heart-game.css` keeps hearts at `visibility:hidden` until `<html>` has the
   `heart-game-active` class.
3. Only `heart-game.js` adds that class, clears the inline `display:none` and
   binds the click handler — and it does that only when
   `ACTIVE_GAME === "heart"`. In star mode it exits at the top of `boot()`, so
   nothing is revealed even though the file is loaded.

## Heart look & behaviour = star look & behaviour

`heart-game.css` copies the star values 1:1 — 26px glyph, soft golden glow
(`0 0 6px rgba(255, 220, 120, 0.55)`), 2.4s twinkle/pulse (scale only, no
fading), fully opaque with their real colours and no blur. Only the symbol
changes.

Also identical to Game 1:

- **Click target** — invisible 89×89 hit area (the star button’s size).
- **Full visibility** — both games render at `opacity: 1` with no filter, so
  the star is fully gold and the heart fully red. The `heart-tint-*` /
  `egg-tint-*` classes still exist for a per-spot warm tint, but none of them
  dim the item any more.
- **Collected items vanish** — a tapped star/heart disappears and stays gone
  after a reload, while the popup dots and “Found X of 5” still count it.
- **Finale** — after the 5th find, closing the prize card sets
  `scslai_heart_done` / `scslai_easter_egg_done`, removes every item and plays
  the “WELCOME TO SCSLAI WEBSITE” confetti blast. One-time hunt, exactly the
  same for both games.

## Testing / resetting progress

Progress is stored per browser + per origin (`localStorage`), so Chrome, Edge,
another profile, another device or another port each start fresh.

- Stars: `scslai_easter_egg_found_v2`, `scslai_easter_egg_done`
- Hearts: `scslai_heart_found_v1`, `scslai_heart_done`
- Fast reset (also clears the finished flag and removes the `?…reset=1` from
  the URL so a normal refresh keeps the new progress):
  - stars → `.../index.html?starreset=1` (or any star page)
  - hearts → `.../scslaicares.html?heartreset=1` (or any heart/About page)
- The heart reset code sits outside the game gate, so it works whether
  `ACTIVE_GAME` is `"star"` or `"heart"`.

## Removing the games after the anniversary

1. Delete the whole `Games/` folder.
2. Remove the blocks marked “ANNIVERSARY GAMES (temporary)” from the 13 pages
   (that includes `Games/game-control.js`).
3. Optional tidy-up: delete the leftover heart markup
   (`<span class="heart-game-heart" ...>` — invisible without the game files).
4. Nothing in `style.css` or `script.js` belongs to the games — the site is
   unchanged once the folder is gone.

