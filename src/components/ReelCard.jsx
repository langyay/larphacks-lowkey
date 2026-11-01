import { useState } from 'react'
import { Music2, Search } from 'lucide-react'
import ReelSidebar from '@/components/ReelSidebar'

// One flashcard dressed up as a Short. Tap anywhere (except the buttons) to flip
// between question and answer. "Clear screen" (from ⋮) hides everything but the card.
function ReelCard({ card, topic, onRemix, onOpenComments }) {
  const [revealed, setRevealed] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [clear, setClear] = useState(false)

  // While the screen is cleared, a tap brings the buttons back instead of flipping.
  const handleTap = () => (clear ? setClear(false) : setRevealed((r) => !r))

  return (
    <section className="relative h-dvh snap-start snap-always overflow-hidden bg-reel text-reel-foreground">
      <button
        type="button"
        onClick={handleTap}
        aria-pressed={revealed}
        aria-label={
          clear
            ? 'Show buttons'
            : revealed
              ? 'Show the question'
              : 'Reveal the answer'
        }
        className="absolute inset-0 flex cursor-pointer items-center px-6 pt-14 pr-20 pb-44 text-left outline-none [perspective:1200px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        {/* Both faces sit in the same grid cell; the inner div rotates to show one. */}
        <div
          className={`grid w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:transition-none ${
            revealed ? '[transform:rotateX(180deg)]' : ''
          }`}
        >
          <div className="[grid-area:1/1] [backface-visibility:hidden]">
            <p className="mb-3 text-sm font-medium text-reel-muted">
              Question
            </p>
            <h2 className="text-3xl leading-tight font-bold sm:text-4xl">
              {card.question}
            </h2>
          </div>
          <div className="[grid-area:1/1] [backface-visibility:hidden] [transform:rotateX(180deg)]">
            <p className="mb-3 text-sm font-medium text-primary">Answer</p>
            <p className="text-2xl leading-snug font-medium sm:text-3xl">
              {card.answer}
            </p>
          </div>
        </div>
      </button>

      {!clear && (
        <>
          {/* Top-right search, like the Shorts top bar. It opens the topic panel. */}
          <button
            type="button"
            onClick={onOpenComments}
            aria-label="Search a topic"
            className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center text-white drop-shadow-[0_1px_3px_rgb(0_0_0/0.7)] outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Search className="size-6" />
          </button>

          {/* Black fade behind the caption, like Shorts, so white text stays readable. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/70 to-transparent" />

          {/* Channel line, title and chip row, bottom-left like a Short. */}
          <div className="pointer-events-none absolute right-16 bottom-5 left-3 text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.7)]">
            <div className="flex items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground [text-shadow:none]">
                L
              </span>
              <span className="text-sm font-medium">@lowkey</span>
              <button
                type="button"
                onClick={() => setSubscribed((s) => !s)}
                aria-pressed={subscribed}
                className={`pointer-events-auto ml-1 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium [text-shadow:none] ${
                  subscribed ? 'bg-white/20 text-white' : 'bg-white text-black'
                }`}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            <p className="mt-2.5 line-clamp-2 text-[15px] leading-snug">
              {topic} ·{' '}
              <span className="text-white/75">
                {revealed ? 'tap to see the question' : 'tap to reveal the answer'}
              </span>
            </p>

            {/* Swipeable chip row under the title (sound + topic), as in the 2026 layout. */}
            <div className="pointer-events-auto mt-2.5 flex gap-2 overflow-x-auto [scrollbar-width:none] [text-shadow:none]">
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium">
                <Music2 className="size-3.5" />
                Original sound · lowkey
              </span>
              <button
                type="button"
                onClick={onOpenComments}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium"
              >
                <Search className="size-3.5" />
                {topic}
              </button>
            </div>
          </div>

          <ReelSidebar
            shareText={card.question}
            onOpenComments={onOpenComments}
            onRemix={onRemix}
            onClearScreen={() => setClear(true)}
          />
        </>
      )}
    </section>
  )
}

export default ReelCard
