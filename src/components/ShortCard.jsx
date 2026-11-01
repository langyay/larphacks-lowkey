import { useEffect, useMemo, useRef, useState } from 'react'
import { Pause } from 'lucide-react'
import MemeBackground from '@/components/MemeBackground'
import { toggleCover } from '@/lib/cover'
import { toggleSound, unlockSound, useSound } from '@/lib/narration'
import { useLook } from '@/skins'

// A real YouTube Short in the feed, laid out exactly like the flashcards:
// player in the "video" spot, our rail, the real channel and title.
// The player only exists while the Short is on screen, starts muted (phones
// require that) and tapping pauses it, like real Shorts.
// A short with `background` instead of an `id` is a stand-in (used by focus mode
// when no real Shorts loaded): our looping gameplay clip with a made-up creator.
function ShortCard({ short, onRemix, onOpenComments }) {
  const fake = !short.id
  const look = useLook()
  const channel = useMemo(
    () => ({
      handle: short.handle ?? short.channel,
      initial: (short.channel || '?')[0].toUpperCase(),
      tone: { bg: 'oklch(0.42 0.005 60)', fg: 'white' },
      avatar: short.avatar,
      likes: short.likes,
      comments: short.comments,
    }),
    [short],
  )
  const [paused, setPaused] = useState(false)
  // Sound follows the one app-wide setting (remembered between visits). It only
  // plays once the browser allows sound, i.e. after the first tap on the page.
  const { soundOn, unlocked } = useSound()
  const audible = soundOn && unlocked
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [clear, setClear] = useState(false)

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
  // Players start muted (needed for autoplay); then match the saved setting.
  // The player may not be ready the moment it loads, so ask again shortly after.
  const syncSound = () => {
    command(audible ? 'unMute' : 'mute')
    setTimeout(() => command(audible ? 'unMute' : 'mute'), 800)
  }
  useEffect(syncSound, [audible, inView]) // eslint-disable-line react-hooks/exhaustive-deps
  const toggleMute = () => {
    unlockSound()
    toggleSound()
  }
  const toggleFullscreen = () => {
    const request = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen()
    request?.catch(() => {})
  }

  const url = fake ? undefined : `https://www.youtube.com/shorts/${short.id}`
  const src =
    `https://www.youtube.com/embed/${short.id}?autoplay=1&mute=1&playsinline=1` +
    `&controls=0&loop=1&playlist=${short.id}&rel=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`

  const chrome = {
    channel,
    title: short.title,
    paused,
    onPause: togglePause,
    soundOn: audible,
    onSound: toggleMute,
    soundLabel: audible ? 'Mute' : 'Unmute',
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
      onLike: () => setLiked((l) => !l),
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
          {fake ? (
            <MemeBackground
              kind={short.background}
              playing={inView && !paused}
              className="absolute inset-0 size-full"
            />
          ) : (
            <img
              src={`https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-60"
            />
          )}
          {/* A hidden feed (e.g. behind focus mode) is never "in view", so its
              players stop by themselves. */}
          {!fake && inView && (
            <iframe
              ref={playerRef}
              src={src}
              title={short.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              onLoad={syncSound}
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
