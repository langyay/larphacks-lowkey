import { useRef, useState } from 'react'
import BottomNav from '@/components/BottomNav'
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

// The scrolling feed. CSS scroll-snap makes each swipe land on exactly one Short.
// On phones it stops above the bottom nav; on desktop it fills the window.
function Feed({ deck, onOpenComments }) {
  const [cards, setCards] = useState(deck.cards)
  // Bumped on every Remix so each card starts fresh with a new channel.
  const [round, setRound] = useState(0)
  const feedRef = useRef(null)

  const scrollToTop = () => feedRef.current.scrollTo({ top: 0 })

  const remix = () => {
    setCards(shuffle(cards))
    setRound((r) => r + 1)
    scrollToTop()
  }

  return (
    <>
      <div
        ref={feedRef}
        className="h-[calc(100dvh-var(--nav-h))] snap-y snap-mandatory overflow-y-scroll bg-black [scrollbar-width:none] lg:h-dvh lg:bg-[#0f0f0f]"
      >
        {cards.map((card) => {
          // The seed picks the made-up channel and counts; Remix gives new ones.
          const seed = `${round}-${card.question}`
          return (
            <ReelCard
              key={seed}
              seed={seed}
              card={card}
              topic={deck.topic}
              onRemix={remix}
              onOpenComments={onOpenComments}
            />
          )
        })}
      </div>
      <BottomNav onHome={scrollToTop} onCreate={onOpenComments} />
    </>
  )
}

export default Feed
