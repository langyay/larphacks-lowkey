// Made-up creators and counts so each flashcard looks like a different Short.
// Everything comes from a seed string, so the same card keeps the same channel
// and numbers every time it scrolls past.

const words = ['study', 'notes', 'quick', 'daily', 'learn', 'brain', 'smart', 'exam', 'cram', 'facts']
const names = ['maya', 'sam', 'ari', 'kai', 'leo', 'nia', 'omar', 'zoe', 'eli', 'rin', 'jas', 'theo']
// Neutral study words, so a handle fits whatever topic the card is about.
const subjects = ['tutor', 'class', 'prep', 'school', 'review', 'recap']

// Avatar greys, darkest to lightest.
const tones = [
  { bg: 'oklch(0.32 0.005 60)', fg: 'white' },
  { bg: 'oklch(0.42 0.005 60)', fg: 'white' },
  { bg: 'oklch(0.52 0.005 60)', fg: 'white' },
  { bg: 'oklch(0.68 0.005 60)', fg: 'black' },
  { bg: 'oklch(0.85 0.005 60)', fg: 'black' },
]

// The "video" behind each flashcard: muted solid colours, like a text-on-colour Short.
const videoColours = [
  'oklch(0.34 0.05 235)', // slate blue
  'oklch(0.34 0.06 160)', // green
  'oklch(0.35 0.08 30)', // brick
  'oklch(0.38 0.06 80)', // olive
  'oklch(0.34 0.05 200)', // teal
  'oklch(0.3 0.015 60)', // charcoal
]

// Turn a string into a repeatable sequence of random numbers between 0 and 1.
function seededRandom(seed) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)]

function makeHandle(rand) {
  const word = pick(rand, words)
  const name = pick(rand, names)
  const subject = pick(rand, subjects)
  const patterns = [
    `${subject}with${name}`,
    `${name}.${word}`,
    `${word}_${name}`,
    `the${subject}${name}`,
    `${name}${subject}tok`,
    `${word}${subject}`,
  ]
  return pick(rand, patterns)
}

export function makeChannel(seed) {
  const rand = seededRandom(seed)
  const handle = makeHandle(rand)
  // Likes spread from a few hundred to a couple of million, mostly in the thousands.
  const likes = Math.round(10 ** (2.3 + rand() * 4))
  const comments = Math.max(3, Math.round(likes * (0.005 + rand() * 0.04)))
  const dislikes = Math.max(1, Math.round(likes * (0.003 + rand() * 0.01)))
  return {
    handle,
    initial: handle[0].toUpperCase(),
    tone: pick(rand, tones),
    video: pick(rand, videoColours),
    likes,
    comments,
    dislikes,
  }
}

// Write a count the way YouTube does: 847, 1.2K, 12K, 1.2M.
// The phone app writes thousands with a small k ("61k").
export function formatCount(n, { smallK = false } = {}) {
  const short = (value, unit) =>
    `${value < 10 ? Math.floor(value * 10) / 10 : Math.floor(value)}${unit}`
  if (n < 1000) return String(n)
  if (n < 1_000_000) return short(n / 1000, smallK ? 'k' : 'K')
  return short(n / 1_000_000, 'M')
}

// Desktop shows comments in full with commas: 1,807.
export const formatFull = (n) => n.toLocaleString('en-US')
