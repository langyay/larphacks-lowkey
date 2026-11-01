// Feed settings: the mix of flashcards / learning Shorts / fun Shorts, and which
// fun categories to mix in. Saved in this browser's localStorage so they
// survive closing the app.

export const FUN_CATEGORIES = [
  { id: 'movies', label: 'Movie recaps' },
  { id: 'tv', label: 'TV show clips' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'satisfying', label: 'Oddly satisfying' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'sports', label: 'Sports highlights' },
]

export const MAX_PER_TYPE = 5

// Which app the feed looks like.
export const APP_LOOKS = [
  { id: 'youtube', label: 'YouTube Shorts', hint: 'Red and rounded, with a home page' },
  { id: 'tiktok', label: 'TikTok', hint: 'For You feed, straight into the videos' },
  { id: 'instagram', label: 'Instagram Reels', hint: 'Explore grid home and Reels' },
]

// How the AI writes new flashcards: 0 normal, 1 Lowkey, 2 full brainrot.
export const BRAINROT_LEVELS = ['Normal', 'Lowkey', 'Full brainrot']

export const DEFAULT_SETTINGS = {
  mix: { cards: 2, learn: 1, fun: 1 },
  funCategories: ['movies', 'gaming'],
  brainrot: 0,
  app: 'youtube',
}

const STORAGE_KEY = 'lowkey-settings'

// Fill in anything missing or invalid with the defaults.
function clean(saved) {
  const mix = { ...DEFAULT_SETTINGS.mix }
  for (const key of Object.keys(mix)) {
    const n = saved?.mix?.[key]
    if (Number.isInteger(n) && n >= 0 && n <= MAX_PER_TYPE) mix[key] = n
  }
  if (mix.cards + mix.learn + mix.fun === 0) Object.assign(mix, DEFAULT_SETTINGS.mix)
  const known = FUN_CATEGORIES.map((c) => c.id)
  const funCategories = Array.isArray(saved?.funCategories)
    ? saved.funCategories.filter((id) => known.includes(id))
    : DEFAULT_SETTINGS.funCategories
  const brainrot = [0, 1, 2].includes(saved?.brainrot) ? saved.brainrot : 0
  const app = APP_LOOKS.some((a) => a.id === saved?.app) ? saved.app : 'youtube'
  return { mix, funCategories, brainrot, app }
}

export function loadSettings() {
  try {
    return clean(JSON.parse(localStorage.getItem(STORAGE_KEY)))
  } catch {
    return clean(null)
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Private browsing or storage blocked: settings just last until reload.
  }
}
