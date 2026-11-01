import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Captions,
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
import Avatar from '@/components/Avatar'
import MemeBackground from '@/components/MemeBackground'
import ReelSidebar from '@/components/ReelSidebar'
import { toggleCover, useCover } from '@/lib/cover'
import { makeChannel } from '@/lib/fakeChannel'
import { toggleSound, unlockSound, useNarration, useSound } from '@/lib/narration'

// Caption text where the word being spoken lights up yellow, like Shorts captions.
function SpokenText({ text, active }) {
  if (active < 0) return text
  return text.split(/\s+/).map((word, i) => (
    <span key={i} className={i === active ? 'text-[#ffe14d]' : undefined}>
      {word}{' '}
    </span>
  ))
}

// Round dark button used for the desktop player controls (top of the video).
export function PlayerButton({ label, onClick, pressed, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className="flex size-12 cursor-pointer items-center justify-center rounded-full text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
    >
      {children}
    </button>
  )
}

export function ChannelLine({ channel, subscribed, onSubscribe, big }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar
        channel={channel}
        className={`rounded-full ${big ? 'size-9 text-base' : 'size-8 text-sm'}`}
      />
      <span className={`truncate font-medium ${big ? 'text-base' : 'text-[15px]'}`}>
        @{channel.handle}
      </span>
      <button
        type="button"
        onClick={onSubscribe}
        aria-pressed={subscribed}
        className={`pointer-events-auto shrink-0 cursor-pointer rounded-full font-medium [text-shadow:none] ${
          big ? 'h-9 px-4 text-sm' : 'h-[30px] px-3.5 text-sm'
        } ${subscribed ? 'bg-white/20 text-white' : 'bg-[#f1f1f1] text-[#0f0f0f]'}`}
      >
        {subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  )
}

// One flashcard dressed up as a Short, posted by a made-up channel.
// Phone layout (under 1024px wide): everything sits on top of the video.
// Desktop layout: rounded video in the middle, rail beside it, channel bottom-left.
// Tap the video to flip question/answer. ⋮ / ••• clears the screen.
function ReelCard({ card, topic, seed, onRemix, onOpenComments }) {
  const channel = useMemo(() => makeChannel(seed), [seed])
  const format = channel.format
  const split = format === 'split'
  const [revealed, setRevealed] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [clear, setClear] = useState(false)
  const [paused, setPaused] = useState(false)
  const [captionsOn, setCaptionsOn] = useState(true)
  const { soundOn } = useSound()
  const cover = useCover()

  // Know when this card is on screen, so its progress line only runs then
  // and starts from zero each time it comes into view.
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [playCount, setPlayCount] = useState(0)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setPlayCount((c) => c + 1)
      },
      { threshold: 0.6 },
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // The creator's voice reads the side that's showing while the card is on screen.
  const narration = useNarration(
    revealed ? card.answer : card.question,
    channel.voice,
    inView && !paused && !cover,
  )
  const spoken = captionsOn && narration.status === 'playing' ? narration.word : -1

  // Like and dislike cancel each other out, as on YouTube.
  const like = () => {
    setLiked((l) => !l)
    setDisliked(false)
  }
  const dislike = () => {
    setDisliked((d) => !d)
    setLiked(false)
  }

  // While the screen is cleared, a tap brings the buttons back instead of flipping.
  const handleTap = () => (clear ? setClear(false) : setRevealed((r) => !r))

  const toggleFullscreen = () => {
    const request = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen()
    request?.catch(() => {})
  }

  const railProps = {
    channel,
    shareText: card.question,
    liked,
    onLike: like,
    disliked,
    onDislike: dislike,
    saved,
    onSave: () => setSaved((s) => !s),
    // The panel needs to know which card it's explaining.
    onOpenComments: () => onOpenComments({ tab: 'comments', card, channel, seed }),
    onRemix,
  }
  const title = `${topic} #study #exams`

  return (
    <section
      ref={sectionRef}
      style={{
        '--ambient': `radial-gradient(40% 60% at 50% 50%, color-mix(in oklch, ${channel.video} 40%, transparent), transparent 75%), #0f0f0f`,
      }}
      className="relative flex h-[calc(100dvh-var(--nav-h))] snap-start snap-always items-center justify-center overflow-hidden bg-black text-white lg:h-dvh lg:[background:var(--ambient)]"
    >
      <div className="flex h-full w-full max-w-[500px] items-end lg:h-auto lg:w-auto lg:max-w-none lg:gap-4">
        {/* The "video". */}
        <div
          style={{ backgroundColor: channel.video }}
          className="relative h-full w-full overflow-hidden lg:aspect-[9/16] lg:h-[calc(100dvh-24px)] lg:w-auto lg:rounded-xl"
        >
          {/* Meme background: gameplay in the bottom half (split screen) or
              behind everything (full / POV), dimmed a little so text reads. */}
          <MemeBackground
            kind={channel.background}
            playing={inView && !paused}
            className={`absolute inset-x-0 bottom-0 w-full ${split ? 'h-1/2' : 'h-full'}`}
          />
          {!split && <div className="pointer-events-none absolute inset-0 bg-black/15" />}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgb(0_0_0/0.45))]" />

          {format === 'pov' && (
            <p className="pointer-events-none absolute inset-x-0 top-[calc(env(safe-area-inset-top)+3.5rem)] bg-white px-4 py-3 text-center text-[19px] leading-snug font-bold text-black lg:top-[68px]">
              {channel.pov}
            </p>
          )}

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
            className="absolute inset-0 flex cursor-pointer flex-col outline-none [perspective:1200px]"
          >
            {/* Split screen: caption centred in the top half. Otherwise centred on screen. */}
            <div
              className={`flex w-full flex-col items-center justify-center px-14 text-center lg:px-10 ${
                split ? 'h-1/2 pt-10' : 'flex-1 pb-16'
              }`}
            >
              {/* Both faces sit in the same grid cell; the inner div rotates to show one. */}
              <div
                className={`grid w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:transition-none ${
                  revealed ? '[transform:rotateX(180deg)]' : ''
                }`}
              >
                <h2 className="shorts-caption text-[30px] leading-[1.15] [grid-area:1/1] [backface-visibility:hidden]">
                  <SpokenText text={card.question} active={revealed ? -1 : spoken} />
                </h2>
                <p className="shorts-caption text-[26px] leading-[1.2] [grid-area:1/1] [backface-visibility:hidden] [transform:rotateX(180deg)]">
                  <SpokenText text={card.answer} active={revealed ? spoken : -1} />
                </p>
              </div>
              {!clear && (
                <span className="mt-5 rounded-full bg-black/45 px-3 py-1 text-sm font-medium text-white/90">
                  {revealed ? 'Tap to see the question' : 'Tap to reveal the answer'}
                  {narration.status === 'error' && ' · voice unavailable'}
                </span>
              )}
            </div>
          </button>

          {!clear && (
            <>
              {/* Browsers block sound until the first tap, so ask for one. */}
              {narration.status === 'locked' && (
                <button
                  type="button"
                  onClick={unlockSound}
                  className="absolute top-[max(10px,env(safe-area-inset-top))] left-3 z-10 flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-black/60 px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-white lg:top-[76px]"
                >
                  <VolumeX className="size-4" />
                  Tap for sound
                </button>
              )}

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
                  onClick={toggleSound}
                  aria-label={soundOn ? 'Mute narration' : 'Unmute narration'}
                  aria-pressed={!soundOn}
                  className="flex size-11 cursor-pointer items-center justify-center drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]"
                >
                  {soundOn ? <Volume2 className="size-6" /> : <VolumeX className="size-6" />}
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
                    <PlayerButton
                      label={paused ? 'Play' : 'Pause'}
                      onClick={() => setPaused((p) => !p)}
                    >
                      {paused ? (
                        <Play className="size-6 fill-white" />
                      ) : (
                        <Pause className="size-6 fill-white" />
                      )}
                    </PlayerButton>
                  </div>
                  <div className="rounded-full bg-black/40">
                    <PlayerButton
                      label={soundOn ? 'Mute narration' : 'Unmute narration'}
                      onClick={toggleSound}
                      pressed={!soundOn}
                    >
                      {soundOn ? (
                        <Volume2 className="size-6" />
                      ) : (
                        <VolumeX className="size-6" />
                      )}
                    </PlayerButton>
                  </div>
                </div>
                <div className="flex rounded-full bg-black/40">
                  <PlayerButton
                    label="Captions"
                    onClick={() => setCaptionsOn((c) => !c)}
                    pressed={captionsOn}
                  >
                    <Captions
                      className={`size-6 ${captionsOn ? '' : 'opacity-50'}`}
                    />
                  </PlayerButton>
                  <PlayerButton label="Someone's looking: show a decoy" onClick={toggleCover}>
                    <EyeOff className="size-6" />
                  </PlayerButton>
                  <PlayerButton
                    label="More: clear screen"
                    onClick={() => setClear(true)}
                  >
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
                <p className="mt-2 line-clamp-2 text-[15px] leading-snug">
                  {title}
                </p>
              </div>
              <div className="absolute right-1 bottom-3 lg:hidden">
                <ReelSidebar variant="phone" {...railProps} />
              </div>
            </>
          )}

          {/* Progress line along the bottom edge. Red with a dot while paused. */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/25 lg:inset-x-2 lg:bottom-1.5 lg:h-[3px] lg:rounded-full">
            <div
              key={playCount}
              style={{
                animation: 'shorts-progress 12s linear infinite',
                animationPlayState: inView && !paused ? 'running' : 'paused',
              }}
              className={`relative h-full lg:rounded-full lg:bg-primary ${
                paused ? 'bg-primary' : 'bg-white'
              }`}
            >
              {paused && (
                <span className="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
              )}
            </div>
          </div>
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
          <p className="mt-3 truncate text-lg font-bold">{title}</p>
        </div>
      )}
    </section>
  )
}

export default ReelCard
