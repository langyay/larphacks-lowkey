import { useState } from 'react'
import ReelSidebar from '@/components/ReelSidebar'

// One flashcard dressed up as a Short. Tap anywhere (except the rail) to flip
// between question and answer.
function ReelCard({ card, topic }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <section className="relative h-dvh snap-start snap-always overflow-hidden bg-reel text-reel-foreground">
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        aria-pressed={revealed}
        aria-label={revealed ? 'Show the question' : 'Reveal the answer'}
        className="absolute inset-0 flex cursor-pointer items-center px-6 pt-10 pr-20 pb-40 text-left outline-none [perspective:1200px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        {/* Both faces sit in the same grid cell; the inner div rotates to show one. */}
        <div
          className={`grid w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:transition-none ${
            revealed ? '[transform:rotateX(180deg)]' : ''
          }`}
        >
          <div className="[grid-area:1/1] [backface-visibility:hidden]">
            <p className="mb-3 text-sm font-semibold text-reel-muted">
              Question
            </p>
            <h2 className="text-3xl leading-tight font-bold sm:text-4xl">
              {card.question}
            </h2>
          </div>
          <div className="[grid-area:1/1] [backface-visibility:hidden] [transform:rotateX(180deg)]">
            <p className="mb-3 text-sm font-semibold text-primary">Answer</p>
            <p className="text-2xl leading-snug font-semibold sm:text-3xl">
              {card.answer}
            </p>
          </div>
        </div>
      </button>

      {/* Channel line + caption, bottom-left like a Short. Taps pass through to the card. */}
      <div className="pointer-events-none absolute right-20 bottom-8 left-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            L
          </span>
          <span className="text-base font-semibold">@lowkey</span>
        </div>
        <p className="mt-2 text-base">{topic}</p>
        <p className="mt-1 text-sm text-reel-muted">
          {revealed ? 'Tap to see the question' : 'Tap to reveal the answer'}
        </p>
      </div>

      <ReelSidebar shareText={card.question} />
    </section>
  )
}

export default ReelCard
