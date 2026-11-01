import { useRef, useState } from 'react'
import { ChevronDown, ChevronUp, LoaderCircle, Search } from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import ReelCard from '@/components/ReelCard'
import ShortCard from '@/components/ShortCard'
import { useSkin } from '@/lib/skin'

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
function Feed({ deck, learn, fun, pattern, plain, onHome, onOpenComments, onRetry, onRetryCards, onRetryVoice }) {
  // Remix keeps its own shuffled copy; cards that arrive later (from Gemini)
  // replace it, since they're a different list.
  const [shuffled, setShuffled] = useState(null)
  const cards = shuffled?.from === deck.cards ? shuffled.cards : deck.cards
  // Bumped on every Remix so each card starts fresh with a new channel.
  const [round, setRound] = useState(0)
  const feedRef = useRef(null)
  const skin = useSkin()

  const scrollToTop = () => feedRef.current.scrollTo({ top: 0 })

  const remix = () => {
    setShuffled({ from: deck.cards, cards: shuffle(deck.cards) })
    setRound((r) => r + 1)
    scrollToTop()
  }

  const makingCards = deck.status === 'loading'
  // While the flashcards are being made, show nothing else (no Shorts to scroll).
  const items = makingCards ? [] : mix(cards, learn.items, fun.items, pattern)
  const loading = makingCards || learn.status === 'loading' || fun.status === 'loading'
  const failed = learn.status === 'error' || fun.status === 'error'
  const searchAgain = () => onOpenComments({ tab: 'search' })

  return (
    <>
      <div
        ref={feedRef}
        className={`h-[calc(100dvh-var(--nav-h))] snap-y snap-mandatory bg-black [scrollbar-width:none] lg:h-dvh lg:bg-[#0f0f0f] ${
          makingCards ? 'overflow-hidden' : 'overflow-y-scroll'
        }`}
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
              plain={plain}
              onRemix={remix}
              onOpenComments={onOpenComments}
            />
          )
        })}

        {/* Making flashcards: a black screen with a loading bar and a label.
            Nothing to scroll until the cards arrive. */}
        {makingCards && (
          <section
            aria-busy="true"
            className="flex h-[calc(100dvh-var(--nav-h))] flex-col items-center justify-center gap-4 bg-black px-6 text-white lg:h-dvh"
          >
            <p className="text-lg font-medium">Generating flashcards</p>
            <div
              role="progressbar"
              aria-label="Generating flashcards"
              className="h-1.5 w-60 max-w-full overflow-hidden rounded-full bg-white/15"
            >
              <div className="h-full w-[60%] animate-[generating-bar_14s_cubic-bezier(0.1,0.6,0.3,1)_forwards] rounded-full bg-primary motion-reduce:animate-none" />
            </div>
            <span className="sr-only">
              {deck.topic === 'My notes' ? 'Turning your notes into flashcards' : `Making flashcards about ${deck.topic}`}
            </span>
          </section>
        )}

        {items.length === 0 && loading && !makingCards && (
          <FeedMessage>
            <LoaderCircle className="size-10 animate-spin text-white/70 motion-reduce:animate-none" />
            <p className="mt-4 text-lg font-medium">Finding Shorts about {deck.topic}…</p>
          </FeedMessage>
        )}

        {items.length === 0 && !loading && (
          <FeedMessage>
            <p className="text-xl font-bold">Nothing for “{deck.topic}” yet</p>
            <p className="mt-2 text-base text-white/70">
              {deck.error ??
                learn.error ??
                fun.error ??
                'Nothing came back with your current settings. Try different words, a quick pick, or more Shorts in Settings.'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {deck.status === 'error' && (
                <button
                  type="button"
                  onClick={onRetryCards}
                  className="flex h-10 cursor-pointer items-center rounded-full bg-[#f1f1f1] px-5 text-sm font-medium text-[#0f0f0f] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-white"
                >
                  Try again
                </button>
              )}
              {failed && deck.status !== 'error' && (
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

      {/* While Shorts are already showing: a small pill at the top saying the
          flashcards are on their way, or that they failed (with a retry). */}
      {items.length > 0 && (makingCards || deck.status === 'error') && (
        <div
          role="status"
          className="fixed top-[calc(env(safe-area-inset-top)+0.75rem)] left-1/2 z-30 flex max-w-[70vw] -translate-x-1/2 items-center gap-2 rounded-full bg-black/75 py-1.5 pr-1.5 pl-3 text-sm font-medium text-white lg:max-w-md"
        >
          {makingCards ? (
            <>
              <LoaderCircle className="size-4 shrink-0 animate-spin motion-reduce:animate-none" />
              <span className="truncate pr-2">Making your flashcards…</span>
            </>
          ) : (
            <>
              <span className="truncate">{deck.error}</span>
              <button
                type="button"
                onClick={onRetryCards}
                className="shrink-0 cursor-pointer rounded-full bg-white/15 px-3 py-1 outline-none hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white"
              >
                Try again
              </button>
            </>
          )}
        </div>
      )}

      {/* Rewording the cards in the chosen card voice, or that it failed. */}
      {items.length > 0 && (deck.styling || deck.voiceError) && (
        <div
          role="status"
          className="fixed top-[calc(env(safe-area-inset-top)+0.75rem)] left-1/2 z-30 flex max-w-[70vw] -translate-x-1/2 items-center gap-2 rounded-full bg-black/75 py-1.5 pr-1.5 pl-3 text-sm font-medium text-white lg:max-w-md"
        >
          {deck.styling ? (
            <>
              <LoaderCircle className="size-4 shrink-0 animate-spin motion-reduce:animate-none" />
              <span className="truncate pr-2">Rewording the flashcards…</span>
            </>
          ) : (
            <>
              <span className="truncate">{deck.voiceError}</span>
              <button
                type="button"
                onClick={onRetryVoice}
                className="shrink-0 cursor-pointer rounded-full bg-white/15 px-3 py-1 outline-none hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white"
              >
                Try again
              </button>
            </>
          )}
        </div>
      )}

      {/* TikTok on desktop: the up and down buttons beside the video. */}
      {skin === 'tiktok' && (
        <div className="fixed top-1/2 right-6 z-10 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
          {[
            ['Previous video', -1, ChevronUp],
            ['Next video', 1, ChevronDown],
          ].map(([label, dir, Icon]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => feedRef.current.scrollBy({ top: dir * feedRef.current.clientHeight, behavior: 'smooth' })}
              className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
            >
              <Icon className="size-6" strokeWidth={2} />
            </button>
          ))}
        </div>
      )}

      <BottomNav
        onSearch={searchAgain}
        onHome={onHome ?? scrollToTop}
        onCreate={() => onOpenComments({ tab: 'search', notes: true })}
        onProfile={() => onOpenComments({ tab: 'settings' })}
      />
    </>
  )
}

export default Feed
