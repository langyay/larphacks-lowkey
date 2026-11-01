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

export const DEFAULT_SETTINGS = {
  mix: { cards: 2, learn: 1, fun: 1 },
  funCategories: ['movies', 'gaming'],
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
  return { mix, funCategories }
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
