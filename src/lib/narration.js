// Narration: plays one ElevenLabs clip at a time and reports which word is
// being said, so captions can light up. Browsers only allow sound after the
// person has tapped the page once, so playback waits until then ("unlocked").

import { useEffect, useState, useSyncExternalStore } from 'react'

const BASE = import.meta.env.VITE_API_URL ?? ''
const SOUND_KEY = 'lowkey-sound'

// ---- Shared state: sound on/off (remembered) and whether sound is unlocked ----

let state = {
  soundOn: (() => {
    try {
      return localStorage.getItem(SOUND_KEY) !== 'off'
    } catch {
      return true
    }
  })(),
  unlocked: false,
}
const listeners = new Set()
const set = (changes) => {
  state = { ...state, ...changes }
  listeners.forEach((l) => l())
}
const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
export const useSound = () => useSyncExternalStore(subscribe, () => state)

export function toggleSound() {
  const soundOn = !state.soundOn
  try {
    localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off')
  } catch {
    // Storage blocked: the choice lasts until reload.
  }
  if (!soundOn) audio.pause()
  set({ soundOn })
}

// One audio element for the whole app, so only one clip ever plays.
const audio = typeof Audio === 'undefined' ? null : new Audio()

// A tiny silent clip, played on the first tap so phones (iPhones especially)
// let this audio element play later without another tap.
const SILENCE =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

export function unlockSound() {
  if (state.unlocked || !audio) return
  audio.src = SILENCE
  audio.play().catch(() => {})
  set({ unlocked: true })
}
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlockSound, { once: true, capture: true })
  window.addEventListener('keydown', unlockSound, { once: true, capture: true })
}

// ---- Clips ----

const clips = new Map() // "voice|text" -> Promise<{ url, words }>

function loadClip(text, voice) {
  const key = `${voice}|${text}`
  if (!clips.has(key)) {
    const request = fetch(`${BASE}/api/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(body.error ?? 'Voice unavailable')
        return { url: `data:audio/mpeg;base64,${body.audio}`, words: body.words ?? [] }
      })
      .catch((error) => {
        clips.delete(key) // let a later try ask again
        throw error
      })
    clips.set(key, request)
  }
  return clips.get(key)
}

let owner = 0 // which playback currently owns the audio element

// Read `text` aloud while `active` (the card is on screen and not paused).
// Returns { word } (index of the word being said, -1 before/after) and a
// status: 'off' | 'locked' | 'loading' | 'playing' | 'done' | 'error'.
export function useNarration(text, voice, active) {
  const { soundOn, unlocked } = useSound()
  const [progress, setProgress] = useState({ status: 'off', word: -1 })

  useEffect(() => {
    if (!active || !soundOn || !audio) {
      setProgress({ status: 'off', word: -1 })
      return
    }
    if (!unlocked) {
      setProgress({ status: 'locked', word: -1 })
      return
    }
    const me = ++owner
    let frame = 0
    setProgress({ status: 'loading', word: -1 })

    loadClip(text, voice)
      .then(({ url, words }) => {
        if (me !== owner) return
        audio.src = url
        audio.currentTime = 0
        audio.onended = () => {
          if (me === owner) setProgress({ status: 'done', word: -1 })
        }
        return audio.play().then(() => {
          // Follow the audio and work out which word is being said.
          const tick = () => {
            if (me !== owner) return
            const t = audio.currentTime
            const word = words.findIndex((w) => t >= w.start && t < w.end + 0.05)
            setProgress((p) =>
              p.status === 'done' ? p : { status: 'playing', word: word === -1 ? p.word : word },
            )
            if (!audio.paused && !audio.ended) frame = requestAnimationFrame(tick)
          }
          frame = requestAnimationFrame(tick)
        })
      })
      .catch(() => {
        if (me === owner) setProgress({ status: 'error', word: -1 })
      })

    return () => {
      cancelAnimationFrame(frame)
      if (me === owner) {
        owner++
        audio.pause()
      }
    }
  }, [text, voice, active, soundOn, unlocked])

  return progress
}
