// Talks to our server (/server). Locally Vite forwards /api to it; online,
// VITE_API_URL is the server's Render address.
const BASE = import.meta.env.VITE_API_URL ?? ''

// Real YouTube Shorts that teach a topic. Throws with a friendly message on failure.
export const fetchShorts = (topic, options) =>
  getShorts(`/api/shorts?topic=${encodeURIComponent(topic)}`, options)

// Doomscroll Shorts for the chosen fun categories (e.g. ['movies', 'gaming']).
export const fetchFunShorts = (categories, options) =>
  getShorts(`/api/fun?categories=${encodeURIComponent(categories.join(','))}`, options)

// Flashcards written by Gemini, from a topic ({ topic }) or from notes ({ notes }).
// Returns { topic, cards }. Throws with a friendly message on failure.
export async function fetchCards(input, { signal } = {}) {
  let res
  try {
    res = await fetch(`${BASE}/api/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error("Couldn't reach the Lowkey server.")
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error ?? "Couldn't reach the Lowkey server. Try again in a minute.")
  return body
}

async function getShorts(path, { signal } = {}) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error("Couldn't reach the Lowkey server.")
  }
  const body = await res.json().catch(() => ({}))
  // No message from our server means it isn't running (or is still waking up on Render).
  if (!res.ok) throw new Error(body.error ?? "Couldn't reach the Lowkey server. Try again in a minute.")
  return body.shorts ?? []
}
