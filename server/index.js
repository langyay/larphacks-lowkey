// The Lowkey server. It holds the API keys (read from .env locally, or from
// Render's Environment settings online) so they never reach the browser.
//
//   GET /api/health              -> { ok: true }
//   GET /api/shorts?topic=...    -> { shorts: [...] } real YouTube Shorts that teach the topic
//   GET /api/fun?categories=...  -> { shorts: [...] } doomscroll Shorts (movies, gaming, ...)

import express from 'express'

const PORT = process.env.PORT || 8787
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
// Sites allowed to call this server from a browser, comma-separated
// (the Render site address once it's online). Local dev goes through Vite's proxy.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const app = express()

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin)
    res.set('Vary', 'Origin')
  }
  next()
})

app.get('/api/health', (req, res) => res.json({ ok: true }))

// ---- YouTube Shorts ----

// The free key allows ~100 searches a day, so remember results per topic.
const SIX_HOURS = 6 * 60 * 60 * 1000
const shortsCache = new Map()

// YouTube titles come back with HTML codes like &#39; for an apostrophe.
const decode = (s) =>
  s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

// "PT1M5S" -> 65 seconds.
function seconds(isoDuration) {
  const m = isoDuration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return Infinity
  return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0)
}

async function youtube(path, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`)
  for (const [k, v] of Object.entries({ ...params, key: YOUTUBE_API_KEY })) {
    url.searchParams.set(k, v)
  }
  const res = await fetch(url)
  const body = await res.json()
  if (!res.ok) {
    const reason = body?.error?.errors?.[0]?.reason
    const error = new Error(body?.error?.message ?? `YouTube error ${res.status}`)
    error.quota = reason === 'quotaExceeded'
    throw error
  }
  return body
}

// Search for short videos (100 units), then fetch their length and counts
// (1 unit) and their channels' names and pictures (1 unit). If a YouTube
// category is given it's tried first, then everything if that finds too little.
async function searchShorts(query, categoryId) {
  const search = (extra) =>
    youtube('search', {
      part: 'id',
      type: 'video',
      q: query,
      videoDuration: 'short',
      videoEmbeddable: 'true',
      relevanceLanguage: 'en',
      safeSearch: 'strict',
      maxResults: '15',
      ...extra,
    })

  let found = categoryId ? await search({ videoCategoryId: categoryId }) : { items: [] }
  if ((found.items?.length ?? 0) < 4) found = await search({})
  const ids = (found.items ?? []).map((item) => item.id.videoId).filter(Boolean)
  if (ids.length === 0) return []

  const videos = await youtube('videos', {
    part: 'snippet,contentDetails,statistics',
    id: ids.join(','),
  })
  // Shorts are at most 3 minutes long.
  const shorts = (videos.items ?? []).filter(
    (v) => seconds(v.contentDetails?.duration) <= 180,
  )
  if (shorts.length === 0) return []

  const channelIds = [...new Set(shorts.map((v) => v.snippet.channelId))]
  const channels = await youtube('channels', { part: 'snippet', id: channelIds.join(',') })
  const channelById = new Map((channels.items ?? []).map((c) => [c.id, c.snippet]))

  return shorts.slice(0, 8).map((v) => {
    const channel = channelById.get(v.snippet.channelId)
    return {
      id: v.id,
      title: decode(v.snippet.title),
      channel: decode(v.snippet.channelTitle),
      handle: channel?.customUrl?.replace(/^@/, '') ?? null,
      avatar: channel?.thumbnails?.default?.url ?? null,
      // null when the channel hides the count (the rail then shows "Like").
      likes: v.statistics?.likeCount != null ? Number(v.statistics.likeCount) : null,
      comments: v.statistics?.commentCount != null ? Number(v.statistics.commentCount) : null,
    }
  })
}

app.get('/api/shorts', async (req, res) => {
  const topic = String(req.query.topic ?? '').trim()
  if (!topic || topic.length > 100) {
    return res.status(400).json({ error: 'Send a topic between 1 and 100 characters.' })
  }
  if (!YOUTUBE_API_KEY) {
    return res.status(503).json({ error: 'The YouTube key is missing on the server.' })
  }

  const key = topic.toLowerCase()
  const cached = shortsCache.get(key)
  if (cached && Date.now() - cached.at < SIX_HOURS) {
    return res.json({ shorts: cached.shorts, cached: true })
  }

  try {
    // Education category (27) first, so the videos teach the topic.
    const shorts = await searchShorts(`${topic} explained`, '27')
    shortsCache.set(key, { at: Date.now(), shorts })
    res.json({ shorts })
  } catch (error) {
    console.error('Shorts search failed:', error.message)
    res.status(502).json({ error: friendlyError(error) })
  }
})

const friendlyError = (error) =>
  error.quota
    ? "YouTube's daily search limit is used up. Shorts come back tomorrow."
    : "Couldn't reach YouTube right now."

// ---- Fun Shorts (the doomscroll mix-ins) ----

// Each category is one search, with the YouTube category that fits best.
const FUN_CATEGORIES = {
  movies: { query: 'movie recap #shorts', categoryId: '1' },
  tv: { query: 'tv show funny scene #shorts', categoryId: '24' },
  gaming: { query: 'gaming clip #shorts', categoryId: '20' },
  satisfying: { query: 'oddly satisfying #shorts' },
  comedy: { query: 'funny skit #shorts', categoryId: '23' },
  sports: { query: 'sports highlights #shorts', categoryId: '17' },
}
const TWELVE_HOURS = 12 * 60 * 60 * 1000
const funCache = new Map()

async function funShorts(category) {
  const cached = funCache.get(category)
  if (cached && Date.now() - cached.at < TWELVE_HOURS) return cached.shorts
  const { query, categoryId } = FUN_CATEGORIES[category]
  const shorts = await searchShorts(query, categoryId)
  funCache.set(category, { at: Date.now(), shorts })
  return shorts
}

app.get('/api/fun', async (req, res) => {
  const categories = String(req.query.categories ?? '')
    .split(',')
    .filter((c) => c in FUN_CATEGORIES)
  if (categories.length === 0) return res.json({ shorts: [] })
  if (!YOUTUBE_API_KEY) {
    return res.status(503).json({ error: 'The YouTube key is missing on the server.' })
  }

  // Search each category; if one fails, the others still show.
  const results = await Promise.allSettled(categories.map(funShorts))
  const lists = results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
  if (lists.length === 0) {
    console.error('Fun Shorts failed:', results[0].reason?.message)
    return res.status(502).json({ error: friendlyError(results[0].reason ?? {}) })
  }

  // Take one from each category in turn, so they're mixed.
  const shorts = []
  const longest = Math.max(...lists.map((l) => l.length))
  for (let i = 0; i < longest; i++) {
    for (const list of lists) if (list[i]) shorts.push(list[i])
  }
  res.json({ shorts })
})

app.listen(PORT, () => {
  console.log(`Lowkey server on http://localhost:${PORT}`)
  if (!YOUTUBE_API_KEY) console.warn('Warning: YOUTUBE_API_KEY is not set.')
})
