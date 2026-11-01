import { useCallback, useEffect, useState } from 'react'
import CommentsPanel from '@/components/CommentsPanel'
import Feed from '@/components/Feed'
import { examples, findExample } from '@/data/examples'
import { fetchFunShorts, fetchShorts } from '@/lib/api'
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
  const [deck, setDeck] = useState({
    id: 0,
    topic: examples[0].topic,
    cards: examples[0].cards,
  })
  const [settings, setSettings] = useState(loadSettings)
  const changeSettings = (next) => {
    setSettings(next)
    saveSettings(next)
  }

  const wantLearn = settings.mix.learn > 0 && deck.topic !== 'My notes'
  const learn = useShorts(
    (signal) => (wantLearn ? fetchShorts(deck.topic, { signal }) : null),
    [deck.id, deck.topic, wantLearn],
  )
  const funKey = settings.mix.fun > 0 ? [...settings.funCategories].sort().join(',') : ''
  const fun = useShorts(
    (signal) => (funKey ? fetchFunShorts(funKey.split(','), { signal }) : null),
    [deck.id, funKey],
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
  const loadDeck = (topic, cards) => {
    setDeck((d) => ({ id: d.id + 1, topic, cards }))
    setRecent((list) => [topic, ...list.filter((t) => t !== topic)].slice(0, 5))
    setPanel((p) => ({ ...p, open: false, target: null }))
  }

  // Each handler returns a message to show in the panel, or nothing if it worked.
  const search = (text) => {
    const example = findExample(text)
    if (example) return loadDeck(example.topic, example.cards)
    // No flashcards for this topic until the AI step, so it's a feed of real Shorts.
    loadDeck(text, [])
  }

  const pick = (id) => {
    const example = examples.find((ex) => ex.id === id)
    loadDeck(example.topic, example.cards)
  }

  const fromNotes = (notes) => {
    const cards = makeCards(notes)
    if (cards.length === 0) {
      return "Couldn't find any facts to turn into cards. Try one fact per line, like \"catalyst: speeds up a reaction\" or \"pressure up -> fewer gas moles\"."
    }
    const guessed = guessTopic(notes)
    const topic = guessed === 'My notes' ? (findExample(notes)?.topic ?? guessed) : guessed
    loadDeck(topic, cards)
  }

  return (
    <>
      <Feed
        key={deck.id}
        deck={deck}
        learn={learn}
        fun={fun}
        pattern={settings.mix}
        onOpenComments={openPanel}
        onRetry={() => setDeck((d) => ({ ...d, id: d.id + 1 }))}
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
