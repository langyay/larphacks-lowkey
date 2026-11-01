import { useState } from 'react'
import { EyeOff } from 'lucide-react'
import MemeBackground from '@/components/MemeBackground'

// The decoy shown in cover mode: a real fun Short in the same 9:16 frame as the
// feed, with nothing that looks like studying. If no Short loaded, our own
// looping gameplay stands in. The eye button in the corner goes back.
function CoverScreen({ shorts, onBack }) {
  // Pick one when cover mode starts (this component only exists while it's on).
  const [short] = useState(() => (shorts.length ? shorts[Math.floor(Math.random() * shorts.length)] : null))

  const src = short
    ? `https://www.youtube-nocookie.com/embed/${short.id}?autoplay=1&mute=1&playsinline=1` +
      `&controls=0&loop=1&playlist=${short.id}&rel=0&origin=${encodeURIComponent(location.origin)}`
    : null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black text-white lg:bg-[#0f0f0f]">
      <div className="relative h-full w-full max-w-[500px] overflow-hidden bg-black lg:aspect-[9/16] lg:h-[calc(100dvh-24px)] lg:w-auto lg:rounded-xl">
        {short ? (
          <>
            <img
              src={`https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-60"
            />
            <iframe
              src={src}
              title={short.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              className="absolute inset-0 size-full border-0"
            />
          </>
        ) : (
          <MemeBackground kind="runner" playing className="absolute inset-0 size-full" />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="pointer-events-none absolute right-4 bottom-5 left-3 [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]">
          <p className="text-[15px] font-medium">@{short ? (short.handle ?? short.channel) : 'clips.daily'}</p>
          <p className="mt-1 line-clamp-2 text-[15px] leading-snug">{short ? short.title : 'wait for the ending'}</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          aria-label="Back to studying"
          className="absolute top-[max(8px,env(safe-area-inset-top))] right-2 flex size-11 cursor-pointer items-center justify-center rounded-full bg-black/40 outline-none focus-visible:ring-2 focus-visible:ring-white lg:top-3 lg:right-3"
        >
          <EyeOff className="size-6" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}

export default CoverScreen
