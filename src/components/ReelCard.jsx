import { useEffect, useMemo, useRef, useState } from 'react'
import { VolumeX } from 'lucide-react'
import MemeBackground from '@/components/MemeBackground'
import { toggleCover, useCover } from '@/lib/cover'
import { makeChannel } from '@/lib/fakeChannel'
import { toggleSound, unlockSound, useNarration, useSound } from '@/lib/narration'
import { useLook } from '@/skins'

// Caption text where the word being spoken lights up yellow, like Shorts captions.
function SpokenText({ text, active }) {
  if (active < 0) return text
  return text.split(/\s+/).map((word, i) => (
    <span key={i} className={i === active ? 'text-[#ffe14d]' : undefined}>
      {word}{' '}
    </span>
  ))
}

// One flashcard dressed up as a Short, posted by a made-up channel.
// Phone layout (under 1024px wide): everything sits on top of the video.
// Desktop layout: rounded video in the middle, rail beside it, channel bottom-left.
// The buttons, creator line and progress bar come from the chosen look (YouTube,
// TikTok or Instagram, see src/skins). Tap the video to flip question/answer.
// `plain` (actual study mode): no background video and no meme bar, just the caption.
function ReelCard({ card, topic, seed, plain = false, onRemix, onOpenComments }) {
  const look = useLook()
  const channel = useMemo(() => makeChannel(seed), [seed])
  const format = plain ? 'full' : channel.format
  const [revealed, setRevealed] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [liked, setLiked] = useState(false)
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

  const like = () => setLiked((l) => !l)

  // While the screen is cleared, a tap brings the buttons back instead of flipping.
  const handleTap = () => (clear ? setClear(false) : setRevealed((r) => !r))

  const toggleFullscreen = () => {
    const request = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen()
    request?.catch(() => {})
  }

  const chrome = {
    channel,
    title: `${topic} #study #exams`,
    paused,
    onPause: () => setPaused((p) => !p),
    soundOn,
    onSound: toggleSound,
    soundLabel: soundOn ? 'Mute narration' : 'Unmute narration',
    onCover: toggleCover,
    onSearch: () => onOpenComments({ tab: 'search' }),
    onClear: () => setClear(true),
    onFullscreen: toggleFullscreen,
    captionsOn,
    onCaptions: () => setCaptionsOn((c) => !c),
    subscribed,
    onSubscribe: () => setSubscribed((s) => !s),
    rail: {
      channel,
      shareText: card.question,
      liked,
      onLike: like,
      saved,
      onSave: () => setSaved((s) => !s),
      // The panel needs to know which card it's explaining.
      onOpenComments: () => onOpenComments({ tab: 'comments', card, channel, seed }),
      onRemix,
    },
  }

  return (
    <section
      ref={sectionRef}
      style={{ '--ambient': look.frame.ambient(channel.video) }}
      className="relative flex h-[calc(100dvh-var(--nav-h))] snap-start snap-always items-center justify-center overflow-hidden bg-black text-white lg:h-dvh lg:[background:var(--ambient)]"
    >
      <div className="flex h-full w-full max-w-[500px] items-end lg:h-auto lg:w-auto lg:max-w-none lg:gap-4">
        {/* The "video". */}
        <div
          className={`relative h-full w-full overflow-hidden bg-black lg:aspect-[9/16] lg:h-[calc(100dvh-24px)] lg:w-auto lg:rounded-xl ${look.frame.videoClass}`}
        >
          {/* Meme background: the gameplay video fills the whole card, with the
              question as a caption on top (dimmed a little so text reads). */}
          {plain ? (
            <div className="absolute inset-0 bg-[#141414]" />
          ) : (
            <>
              <MemeBackground
                kind={channel.background}
                playing={inView && !paused}
                className="absolute inset-0 size-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/15" />
            </>
          )}
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
            {/* The caption, centred on the video. */}
            <div className="flex w-full flex-1 flex-col items-center justify-center px-14 pb-16 text-center lg:px-10">
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
                  className={`absolute ${look.frame.promptTop} left-3 z-10 flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-black/60 px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-white lg:top-[76px]`}
                >
                  <VolumeX className="size-4" />
                  Tap for sound
                </button>
              )}

              <look.Inside {...chrome} />
            </>
          )}

          <look.Progress playCount={playCount} inView={inView} paused={paused} />
        </div>

        {!clear && <look.Rail {...chrome} />}
      </div>

      {!clear && <look.Info {...chrome} />}
    </section>
  )
}

export default ReelCard
