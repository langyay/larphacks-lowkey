import { useMemo, useRef, useState } from 'react'
import BottomNav from '@/components/BottomNav'
import ShortCard from '@/components/ShortCard'
import { makeChannel } from '@/lib/fakeChannel'

// Stand-ins when no real Shorts loaded (server asleep, YouTube's bot check):
// our looping gameplay clips with made-up creators and meme captions.
const standIns = [
  { background: 'runner', title: 'wait for the ending' },
  { background: 'slice', title: 'this is so satisfying i could watch it all day' },
  { background: 'parkour', title: 'bro did NOT see that coming' },
  { background: 'marbles', title: 'POV: you finally found the perfect run' },
].map((s, i) => {
  const ch = makeChannel(`decoy-${i}`)
  return { ...s, channel: ch.handle, handle: ch.handle, likes: ch.likes, comments: ch.comments }
})

// Focus mode ("someone's looking"): a whole feed in the chosen app's look, but
// only fun Shorts, with nothing that looks like studying. The study feed stays
// hidden underneath (so your place is kept); the eye button brings it back.
function CoverScreen({ shorts }) {
  const feedRef = useRef(null)
  // Start at a random point (picked once), so it doesn't open on the same Short every time.
  const [offset] = useState(() => Math.floor(Math.random() * 1000))
  const items = useMemo(() => {
    const list = shorts.length ? shorts : standIns
    const start = offset % list.length
    return [...list.slice(start), ...list.slice(0, start)]
  }, [shorts, offset])

  return (
    <>
      <div
        ref={feedRef}
        className="h-[calc(100dvh-var(--nav-h))] snap-y snap-mandatory overflow-y-scroll bg-black [scrollbar-width:none] lg:h-dvh lg:bg-[#0f0f0f]"
      >
        {items.map((short) => (
          <ShortCard
            key={short.id ?? short.background}
            short={short}
            onRemix={() => feedRef.current.scrollTo({ top: 0 })}
            onOpenComments={() => {}}
          />
        ))}
      </div>
      {/* The tab bar looks and scrolls like the real one; nothing in it leads to studying. */}
      <BottomNav onHome={() => feedRef.current.scrollTo({ top: 0, behavior: 'smooth' })} />
    </>
  )
}

export default CoverScreen
