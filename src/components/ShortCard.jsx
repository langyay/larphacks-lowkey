import { useEffect, useMemo, useRef, useState } from 'react'
import { Pause } from 'lucide-react'
import { toggleCover, useCover } from '@/lib/cover'
import { useLook } from '@/skins'

// A real YouTube Short in the feed, laid out exactly like the flashcards:
// player in the "video" spot, our rail, the real channel and title.
// The player only exists while the Short is on screen, starts muted (phones
// require that) and tapping pauses it, like real Shorts.
function ShortCard({ short, onRemix, onOpenComments }) {
  const look = useLook()
  const channel = useMemo(
    () => ({
      handle: short.handle ?? short.channel,
      initial: (short.channel || '?')[0].toUpperCase(),
      tone: { bg: 'oklch(0.42 0.005 60)', fg: 'white' },
      avatar: short.avatar,
      likes: short.likes,
      comments: short.comments,
      dislikes: null, // YouTube hides dislike counts
    }),
    [short],
  )
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [clear, setClear] = useState(false)
  const cover = useCover()

  const sectionRef = useRef(null)
  const playerRef = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (!entry.isIntersecting) setPaused(false)
      },
      { threshold: 0.6 },
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Send a command to the YouTube player (its "IFrame API").
  const command = (func) =>
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      '*',
    )
  const togglePause = () => {
    if (clear) return setClear(false)
    command(paused ? 'playVideo' : 'pauseVideo')
    setPaused((p) => !p)
  }
  const toggleMute = () => {
    command(muted ? 'unMute' : 'mute')
    setMuted((m) => !m)
  }
  const toggleFullscreen = () => {
    const request = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen()
    request?.catch(() => {})
  }

  const url = `https://www.youtube.com/shorts/${short.id}`
  const src =
    `https://www.youtube.com/embed/${short.id}?autoplay=1&mute=1&playsinline=1` +
    `&controls=0&loop=1&playlist=${short.id}&rel=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`

  const chrome = {
    channel,
    title: short.title,
    paused,
    onPause: togglePause,
    soundOn: !muted,
    onSound: toggleMute,
    soundLabel: muted ? 'Unmute' : 'Mute',
    onCover: toggleCover,
    onSearch: () => onOpenComments({ tab: 'search' }),
    onClear: () => setClear(true),
    onFullscreen: toggleFullscreen,
    subscribed,
    onSubscribe: () => setSubscribed((s) => !s),
    rail: {
      channel,
      shareText: short.title,
      shareUrl: url,
      liked,
      onLike: () => {
        setLiked((l) => !l)
        setDisliked(false)
      },
      disliked,
      onDislike: () => {
        setDisliked((d) => !d)
        setLiked(false)
      },
      saved,
      onSave: () => setSaved((s) => !s),
      onOpenComments: () => onOpenComments({ tab: 'comments', short }),
      onRemix,
    },
  }

  return (
    <section
      ref={sectionRef}
      style={{ '--bg': look.frame.shortBg }}
      className="relative flex h-[calc(100dvh-var(--nav-h))] snap-start snap-always items-center justify-center overflow-hidden bg-black text-white lg:h-dvh lg:[background:var(--bg)]"
    >
      <div className="flex h-full w-full max-w-[500px] items-end lg:h-auto lg:w-auto lg:max-w-none lg:gap-4">
        {/* The video. */}
        <div
          className={`relative h-full w-full overflow-hidden bg-black lg:aspect-[9/16] lg:h-[calc(100dvh-24px)] lg:w-auto lg:rounded-xl ${look.frame.videoClass}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-60"
          />
          {inView && !cover && (
            <iframe
              ref={playerRef}
              src={src}
              title={short.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              className="absolute inset-0 size-full border-0"
            />
          )}

          {/* Catches taps so they pause the video instead of opening YouTube. */}
          <button
            type="button"
            onClick={togglePause}
            aria-label={clear ? 'Show buttons' : paused ? 'Play' : 'Pause'}
            className="absolute inset-0 cursor-pointer outline-none"
          >
            {paused && !clear && (
              <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50">
                <Pause className="size-7 fill-white" />
              </span>
            )}
          </button>

          {!clear && <look.Inside {...chrome} />}
        </div>

        {!clear && <look.Rail {...chrome} />}
      </div>

      {!clear && <look.Info {...chrome} />}
    </section>
  )
}

export default ShortCard
