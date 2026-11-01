// "Someone's looking" cover mode: one shared on/off switch for the whole app.
// A two-finger double-tap, the backtick key or the eye button turns it on and
// off; the feed hides the study screen and shows a decoy Short instead.

import { useEffect, useSyncExternalStore } from 'react'

let covered = false
const listeners = new Set()
const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useCover = () => useSyncExternalStore(subscribe, () => covered)

export function setCover(value) {
  if (covered === value) return
  covered = value
  listeners.forEach((l) => l())
}
export const toggleCover = () => setCover(!covered)

// Listens for the shortcuts while `enabled` (the feed is showing). Leaving the
// feed switches cover mode off.
export function useCoverGesture(enabled) {
  useEffect(() => {
    if (!enabled) return
    let lastTap = 0
    const onTouch = (e) => {
      if (e.touches.length !== 2) return
      const now = Date.now()
      if (now - lastTap < 450) {
        lastTap = 0
        toggleCover()
      } else {
        lastTap = now
      }
    }
    const onKey = (e) => {
      if (e.key !== '`' || e.target?.closest?.('input, textarea')) return
      toggleCover()
    }
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('keydown', onKey)
      setCover(false)
    }
  }, [enabled])
}
