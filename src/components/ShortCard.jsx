import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Ellipsis,
  EllipsisVertical,
  EyeOff,
  Maximize,
  Pause,
  Play,
  Search,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { ChannelLine, PlayerButton } from '@/components/ReelCard'
import ReelSidebar from '@/components/ReelSidebar'
import { toggleCover, useCover } from '@/lib/cover'

// A real YouTube Short in the feed, laid out exactly like the flashcards:
// player in the "video" spot, our rail, the real channel and title.
// The player only exists while the Short is on screen, starts muted (phones
// require that) and tapping pauses it, like real Shorts.
function ShortCard({ short, onRemix, onOpenComments }) {
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

  const railProps = {
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
  }
  const volumeIcon = muted ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[calc(100dvh-var(--nav-h))] snap-start snap-always items-center justify-center overflow-hidden bg-black text-white lg:h-dvh lg:bg-[#0f0f0f]"
    >
      <div className="flex h-full w-full max-w-[500px] items-end lg:h-auto lg:w-auto lg:max-w-none lg:gap-4">
        {/* The video. */}
        <div className="relative h-full w-full overflow-hidden bg-black lg:aspect-[9/16] lg:h-[calc(100dvh-24px)] lg:w-auto lg:rounded-xl">
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

          {!clear && (
            <>
              {/* Phone: sound, search and ••• in the top-right corner. */}
              <div className="absolute top-0 right-0 flex pt-[max(6px,env(safe-area-inset-top))] pr-1.5 lg:hidden">
                <button
                  type="button"
                  onClick={toggleCover}
                  aria-label="Someone's looking: show a decoy"
                  className="flex size-11 cursor-pointer items-center justify-center drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]"
                >
                  <EyeOff className="size-6" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                  className="flex size-11 cursor-pointer items-center justify-center drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]"
                >
                  {volumeIcon}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenComments({ tab: 'search' })}
                  aria-label="Search a topic"
                  className="flex size-11 cursor-pointer items-center justify-center drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]"
                >
                  <Search className="size-6" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => setClear(true)}
                  aria-label="More: clear screen"
                  className="flex size-11 cursor-pointer items-center justify-center drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]"
                >
                  <Ellipsis className="size-6" strokeWidth={2.5} />
                </button>
              </div>

              {/* Desktop: player controls along the top of the video. */}
              <div className="absolute inset-x-0 top-0 hidden items-start justify-between bg-gradient-to-b from-black/40 to-transparent p-3 pb-10 lg:flex">
                <div className="flex gap-2">
                  <div className="rounded-full bg-black/40">
                    <PlayerButton label={paused ? 'Play' : 'Pause'} onClick={togglePause}>
                      {paused ? (
                        <Play className="size-6 fill-white" />
                      ) : (
                        <Pause className="size-6 fill-white" />
                      )}
                    </PlayerButton>
                  </div>
                  <div className="rounded-full bg-black/40">
                    <PlayerButton label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute}>
                      {volumeIcon}
                    </PlayerButton>
                  </div>
                </div>
                <div className="flex rounded-full bg-black/40">
                  <PlayerButton label="Someone's looking: show a decoy" onClick={toggleCover}>
                    <EyeOff className="size-6" />
                  </PlayerButton>
                  <PlayerButton label="More: clear screen" onClick={() => setClear(true)}>
                    <EllipsisVertical className="size-6" />
                  </PlayerButton>
                  <PlayerButton label="Full screen" onClick={toggleFullscreen}>
                    <Maximize className="size-6" />
                  </PlayerButton>
                </div>
              </div>

              {/* Phone: shading, channel + title bottom-left, rail bottom-right. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/55 to-transparent lg:hidden" />
              <div className="pointer-events-none absolute right-16 bottom-4 left-3 [text-shadow:0_1px_2px_rgb(0_0_0/0.5)] lg:hidden">
                <ChannelLine
                  channel={channel}
                  subscribed={subscribed}
                  onSubscribe={() => setSubscribed((s) => !s)}
                />
                <p className="mt-2 line-clamp-2 text-[15px] leading-snug">{short.title}</p>
              </div>
              <div className="absolute right-1 bottom-3 lg:hidden">
                <ReelSidebar variant="phone" {...railProps} />
              </div>
            </>
          )}
        </div>

        {/* Desktop: rail beside the video. */}
        {!clear && (
          <div className="hidden pb-1 lg:block">
            <ReelSidebar variant="desktop" {...railProps} />
          </div>
        )}
      </div>

      {/* Desktop: channel and bold title at the bottom-left of the page. */}
      {!clear && (
        <div className="absolute bottom-8 left-6 hidden max-w-[calc((100vw-56.25dvh)/2-56px)] lg:block">
          <ChannelLine
            channel={channel}
            subscribed={subscribed}
            onSubscribe={() => setSubscribed((s) => !s)}
            big
          />
          <p className="mt-3 truncate text-lg font-bold">{short.title}</p>
        </div>
      )}
    </section>
  )
}

export default ShortCard
