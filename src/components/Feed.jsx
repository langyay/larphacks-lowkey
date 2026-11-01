import { useState } from 'react'
import ReelCard from '@/components/ReelCard'

// Shuffle a copy of the cards (Fisher-Yates), so Remix gives a new order.
function shuffle(cards) {
  const copy = [...cards]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// The scrolling column. CSS scroll-snap makes each swipe land on exactly one card.
function Feed({ deck }) {
  const [cards, setCards] = useState(deck.cards)
  // Bumped on every Remix so each card starts fresh (question side up).
  const [round, setRound] = useState(0)

  const remix = (e) => {
    setCards(shuffle(cards))
    setRound((r) => r + 1)
    e.currentTarget.closest('[data-feed]').scrollTo({ top: 0 })
  }

  return (
    <div
      data-feed
      className="mx-auto h-dvh max-w-[480px] snap-y snap-mandatory overflow-y-scroll border-x border-border"
    >
      {cards.map((card) => (
        <ReelCard
          key={`${round}-${card.question}`}
          card={card}
          topic={deck.topic}
          onRemix={remix}
        />
      ))}
    </div>
  )
}

export default Feed
