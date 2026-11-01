import { useRef, useState } from 'react'
import { LoaderCircle, Search } from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import ReelCard from '@/components/ReelCard'
import ShortCard from '@/components/ShortCard'

// Shuffle a copy of the cards (Fisher-Yates), so Remix gives a new order.
function shuffle(cards) {
  const copy = [...cards]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Repeat the chosen pattern (e.g. 2 flashcards, 1 learning Short, 1 fun Short)
// until everything is used. A type that runs out is skipped, so a topic with
// no flashcards yet is all Shorts.
function mix(cards, learn, fun, pattern) {
  const sources = [
    { n: pattern.cards, list: cards.map((card) => ({ type: 'card', card })) },
    { n: pattern.learn, list: learn.map((short) => ({ type: 'learn', short })) },
    { n: pattern.fun, list: fun.map((short) => ({ type: 'fun', short })) },
  ].filter((s) => s.n > 0)
  const items = []
  const used = sources.map(() => 0)
  while (sources.some((s, i) => used[i] < s.list.length)) {
    sources.forEach((s, i) => {
      for (let k = 0; k < s.n && used[i] < s.list.length; k++) items.push(s.list[used[i]++])
    })
  }
  return items
}

// A full-screen message in the feed (loading, or nothing found).
function FeedMessage({ children }) {
  return (
    <section className="flex h-[calc(100dvh-var(--nav-h))] snap-start flex-col items-center justify-center px-8 text-center text-white lg:h-dvh">
      {children}
    </section>
  )
}

// The scrolling feed. CSS scroll-snap makes each swipe land on exactly one Short.
// On phones it stops above the bottom nav; on desktop it fills the window.
function Feed({ deck, learn, fun, pattern, onOpenComments, onRetry }) {
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

  const items = mix(cards, learn.items, fun.items, pattern)
  const loading = learn.status === 'loading' || fun.status === 'loading'
  const failed = learn.status === 'error' || fun.status === 'error'
  const searchAgain = () => onOpenComments({ tab: 'search' })

  return (
    <>
      <div
        ref={feedRef}
        className="h-[calc(100dvh-var(--nav-h))] snap-y snap-mandatory overflow-y-scroll bg-black [scrollbar-width:none] lg:h-dvh lg:bg-[#0f0f0f]"
      >
        {items.map((item) => {
          if (item.type !== 'card') {
            return (
              <ShortCard
                key={`${item.type}-${item.short.id}`}
                short={item.short}
                onRemix={remix}
                onOpenComments={onOpenComments}
              />
            )
          }
          // The seed picks the made-up channel and counts; Remix gives new ones.
          const seed = `${round}-${item.card.question}`
          return (
            <ReelCard
              key={seed}
              seed={seed}
              card={item.card}
              topic={deck.topic}
              onRemix={remix}
              onOpenComments={onOpenComments}
            />
          )
        })}

        {items.length === 0 && loading && (
          <FeedMessage>
            <LoaderCircle className="size-10 animate-spin text-white/70 motion-reduce:animate-none" />
            <p className="mt-4 text-lg font-medium">Finding Shorts about {deck.topic}…</p>
          </FeedMessage>
        )}

        {items.length === 0 && !loading && (
          <FeedMessage>
            <p className="text-xl font-bold">Nothing for “{deck.topic}” yet</p>
            <p className="mt-2 text-base text-white/70">
              {learn.error ??
                fun.error ??
                'Nothing came back with your current settings. Try different words, a quick pick, or more Shorts in Settings.'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {failed && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex h-10 cursor-pointer items-center rounded-full bg-[#f1f1f1] px-5 text-sm font-medium text-[#0f0f0f] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-white"
                >
                  Try again
                </button>
              )}
              <button
                type="button"
                onClick={searchAgain}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-medium outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
              >
                <Search className="size-4" />
                Search another topic
              </button>
            </div>
          </FeedMessage>
        )}
      </div>
      <BottomNav
        onHome={scrollToTop}
        onCreate={() => onOpenComments({ tab: 'search', notes: true })}
        onProfile={() => onOpenComments({ tab: 'settings' })}
      />
    </>
  )
}

export default Feed
