import { useCallback, useState } from 'react'
import CommentsPanel from '@/components/CommentsPanel'
import Feed from '@/components/Feed'
import { examples, findExample } from '@/data/examples'
import { guessTopic, makeCards } from '@/lib/makeCards'

// Feed plus its comments panel. Owns:
// - the current deck (topic + cards), which the Search topic tab can replace
// - whether the panel is open, on which tab, and for which card
// - recent searches (while the app is open)
function FeedWithComments() {
  const [deck, setDeck] = useState({
    id: 0,
    topic: examples[0].topic,
    cards: examples[0].cards,
  })
  const [panel, setPanel] = useState({
    open: false,
    tab: 'comments',
    target: null,
    notes: false,
    openId: 0,
  })
  const [recent, setRecent] = useState([])

  const close = useCallback(() => setPanel((p) => ({ ...p, open: false })), [])

  // Called by a card's Comments button (with that card) or by 🔍 / ➕ / You.
  const openPanel = ({ tab, card, channel, seed, notes = false }) =>
    setPanel((p) => ({
      open: true,
      tab,
      target: card ? { card, channel, seed } : p.target,
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
    return `No ready-made deck for "${text}" yet. Flashcards for any topic arrive with the AI step. For now, try a quick pick or paste your notes.`
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
      <Feed key={deck.id} deck={deck} onOpenComments={openPanel} />
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
      />
    </>
  )
}

export default FeedWithComments
