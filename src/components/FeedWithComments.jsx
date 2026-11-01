import { useCallback, useEffect, useState } from 'react'
import CommentsPanel from '@/components/CommentsPanel'
import Feed from '@/components/Feed'
import { examples, findExample } from '@/data/examples'
import { fetchCards, fetchFunShorts, fetchShorts } from '@/lib/api'
import { guessTopic, makeCards } from '@/lib/makeCards'
import { loadSettings, saveSettings } from '@/lib/settings'

// Load Shorts from the server into state, as { status, items, error }.
// A failure just means no Shorts; the feed carries on with what it has.
function useShorts(load, deps) {
  const [shorts, setShorts] = useState({ status: 'loading', items: [] })
  useEffect(() => {
    const controller = new AbortController()
    const request = load(controller.signal)
    if (!request) {
      setShorts({ status: 'off', items: [] })
      return
    }
    setShorts({ status: 'loading', items: [] })
    request
      .then((items) => setShorts({ status: 'ready', items }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setShorts({ status: 'error', items: [], error: error.message })
        }
      })
    return () => controller.abort()
  }, deps) // the caller lists what should trigger a reload

  return shorts
}

// Feed plus its comments panel. Owns:
// - the current deck (topic + cards), which the Search topic tab can replace
// - learning Shorts for that topic and fun Shorts for the chosen categories
// - the feed settings (mix and fun categories), saved in this browser
// - whether the panel is open, on which tab, and for which card or Short
// - recent searches (while the app is open)
function FeedWithComments() {
  // status: 'ready', or 'loading' while Gemini writes the cards, or 'error'.
  const [deck, setDeck] = useState({
    id: 0,
    topic: examples[0].topic,
    cards: examples[0].cards,
    status: 'ready',
  })
  const [settings, setSettings] = useState(loadSettings)
  const changeSettings = (next) => {
    setSettings(next)
    saveSettings(next)
  }

  // Bumped by "Try again" to reload Shorts without touching the cards.
  const [shortsRetry, setShortsRetry] = useState(0)
  const wantLearn = settings.mix.learn > 0 && deck.topic !== 'My notes'
  const learn = useShorts(
    (signal) => (wantLearn ? fetchShorts(deck.topic, { signal }) : null),
    [deck.id, deck.topic, wantLearn, shortsRetry],
  )
  const funKey = settings.mix.fun > 0 ? [...settings.funCategories].sort().join(',') : ''
  const fun = useShorts(
    (signal) => (funKey ? fetchFunShorts(funKey.split(','), { signal }) : null),
    [deck.id, funKey, shortsRetry],
  )

  const [panel, setPanel] = useState({
    open: false,
    tab: 'comments',
    target: null,
    notes: false,
    openId: 0,
  })
  const [recent, setRecent] = useState([])

  const close = useCallback(() => setPanel((p) => ({ ...p, open: false })), [])

  // Called by a card's or Short's Comments button, or by 🔍 / ➕ / You.
  const openPanel = ({ tab, card, channel, seed, short, notes = false }) =>
    setPanel((p) => ({
      open: true,
      tab,
      target: card ? { card, channel, seed } : short ? { short } : p.target,
      notes,
      openId: p.openId + 1,
    }))

  // Swap in a new deck. The Feed remounts (new key), so it starts at the top.
  // `input` is what Gemini is asked for ({ topic } or { notes }); while it
  // works, the deck is 'loading' and the feed shows Shorts in the meantime.
  const loadDeck = (topic, cards, input = null) => {
    const id = deck.id + 1
    setDeck({ id, topic, cards, status: input ? 'loading' : 'ready', input })
    if (topic !== 'My notes') {
      setRecent((list) => [topic, ...list.filter((t) => t !== topic)].slice(0, 5))
    }
    setPanel((p) => ({ ...p, open: false, target: null }))
    if (input) generate(id, input)
  }

  // Ask Gemini for cards. If it fails on notes, fall back to the note splitter.
  // Results for an older deck (the person searched again meanwhile) are ignored.
  const generate = (id, input) => {
    const update = (changes) =>
      setDeck((d) => (d.id === id ? { ...d, ...changes } : d))
    fetchCards(input)
      .then((result) =>
        update({
          status: 'ready',
          cards: result.cards,
          // For notes, Gemini names the topic (that also finds better Shorts).
          ...(input.notes ? { topic: result.topic } : {}),
        }),
      )
      .catch((error) => {
        const backup = input.notes ? makeCards(input.notes) : []
        if (backup.length > 0) {
          const guessed = guessTopic(input.notes)
          const topic = guessed === 'My notes' ? (findExample(input.notes)?.topic ?? guessed) : guessed
          update({ status: 'ready', cards: backup, topic })
        } else {
          update({ status: 'error', error: error.message })
        }
      })
  }

  const retryCards = () => {
    setDeck((d) => ({ ...d, status: 'loading', error: undefined }))
    generate(deck.id, deck.input)
  }

  // Each handler returns a message to show in the panel, or nothing if it worked.
  const search = (text) => {
    const example = findExample(text)
    if (example) return loadDeck(example.topic, example.cards)
    // Any other topic: Gemini writes the cards while real Shorts load.
    loadDeck(text, [], { topic: text })
  }

  const pick = (id) => {
    const example = examples.find((ex) => ex.id === id)
    loadDeck(example.topic, example.cards)
  }

  const fromNotes = (notes) => loadDeck('My notes', [], { notes })

  return (
    <>
      <Feed
        key={deck.id}
        deck={deck}
        learn={learn}
        fun={fun}
        pattern={settings.mix}
        onOpenComments={openPanel}
        onRetry={() => setShortsRetry((n) => n + 1)}
        onRetryCards={retryCards}
      />
      <CommentsPanel
        open={panel.open}
        onClose={close}
        tab={panel.tab}
        onTabChange={(tab) => setPanel((p) => ({ ...p, tab }))}
        target={panel.target}
        openId={panel.openId}
        topic={deck.topic}
        recent={recent}
        startWithNotes={panel.notes}
        onSearch={search}
        onPick={pick}
        onNotes={fromNotes}
        settings={settings}
        onSettingsChange={changeSettings}
      />
    </>
  )
}

export default FeedWithComments
