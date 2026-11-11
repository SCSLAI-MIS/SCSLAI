// Which anniversary hunt runs across the site. Games/star-game.js and
// Games/heart-game.js read this value and only run when it matches their name
// EXACTLY (case-insensitive):
//   "star"  -> the Star hunt
//   "heart" -> the Heart hunt
// Anything else — empty "", "stars", "hearts" — turns BOTH hunts off.
const ACTIVE_GAME = "";