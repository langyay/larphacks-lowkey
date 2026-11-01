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
import ReelSidebar from '@/components/ReelSidebar'

// The YouTube Shorts look. Every look exports the same four pieces, which the
// cards place around the video (see skins/index.jsx for what each one gets):
//   Inside   - controls, creator and caption on top of the video
//   Rail     - the desktop button column beside the video
//   Info     - desktop text at the bottom-left of the page
//   Progress - the line along the bottom edge (flashcards only)

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

const phoneIcon =
  'flex size-11 cursor-pointer items-center justify-center drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]'

export function Inside(c) {
  const {
    channel,
    title,
    paused,
    onPause,
    soundOn,
    onSound,
    soundLabel,
    onCover,
    onSearch,
    onClear,
    onFullscreen,
    captionsOn,
    onCaptions,
    subscribed,
    onSubscribe,
    rail,
  } = c
  const volume = soundOn ? <Volume2 className="size-6" /> : <VolumeX className="size-6" />

  return (
    <>
      {/* Phone: sound, search and ••• in the top-right corner. */}
      <div className="absolute top-0 right-0 flex pt-[max(6px,env(safe-area-inset-top))] pr-1.5 lg:hidden">
        <button type="button" onClick={onCover} aria-label="Someone's looking: show a decoy" className={phoneIcon}>
          <EyeOff className="size-6" strokeWidth={2} />
        </button>
        <button type="button" onClick={onSound} aria-label={soundLabel} aria-pressed={!soundOn} className={phoneIcon}>
          {volume}
        </button>
        <button type="button" onClick={onSearch} aria-label="Search a topic" className={phoneIcon}>
          <Search className="size-6" strokeWidth={2} />
        </button>
        <button type="button" onClick={onClear} aria-label="More: clear screen" className={phoneIcon}>
          <Ellipsis className="size-6" strokeWidth={2.5} />
        </button>
      </div>

      {/* Desktop: player controls along the top of the video. */}
      <div className="absolute inset-x-0 top-0 hidden items-start justify-between bg-gradient-to-b from-black/40 to-transparent p-3 pb-10 lg:flex">
        <div className="flex gap-2">
          <div className="rounded-full bg-black/40">
            <PlayerButton label={paused ? 'Play' : 'Pause'} onClick={onPause}>
              {paused ? <Play className="size-6 fill-white" /> : <Pause className="size-6 fill-white" />}
            </PlayerButton>
          </div>
          <div className="rounded-full bg-black/40">
            <PlayerButton label={soundLabel} onClick={onSound} pressed={!soundOn}>
              {volume}
            </PlayerButton>
          </div>
        </div>
        <div className="flex rounded-full bg-black/40">
          {onCaptions && (
            <PlayerButton label="Captions" onClick={onCaptions} pressed={captionsOn}>
              <Captions className={`size-6 ${captionsOn ? '' : 'opacity-50'}`} />
            </PlayerButton>
          )}
          <PlayerButton label="Someone's looking: show a decoy" onClick={onCover}>
            <EyeOff className="size-6" />
          </PlayerButton>
          <PlayerButton label="More: clear screen" onClick={onClear}>
            <EllipsisVertical className="size-6" />
          </PlayerButton>
          <PlayerButton label="Full screen" onClick={onFullscreen}>
            <Maximize className="size-6" />
          </PlayerButton>
        </div>
      </div>

      {/* Phone: shading, channel + title bottom-left, rail bottom-right. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/55 to-transparent lg:hidden" />
      <div className="pointer-events-none absolute right-16 bottom-4 left-3 [text-shadow:0_1px_2px_rgb(0_0_0/0.5)] lg:hidden">
        <ChannelLine channel={channel} subscribed={subscribed} onSubscribe={onSubscribe} />
        <p className="mt-2 line-clamp-2 text-[15px] leading-snug">{title}</p>
      </div>
      <div className="absolute right-1 bottom-3 lg:hidden">
        <ReelSidebar variant="phone" {...rail} />
      </div>
    </>
  )
}

// Desktop: rail beside the video.
export function Rail(c) {
  return (
    <div className="hidden pb-1 lg:block">
      <ReelSidebar variant="desktop" {...c.rail} />
    </div>
  )
}

// Desktop: channel and bold title at the bottom-left of the page.
export function Info(c) {
  return (
    <div className="absolute bottom-8 left-6 hidden max-w-[calc((100vw-56.25dvh)/2-56px)] lg:block">
      <ChannelLine channel={c.channel} subscribed={c.subscribed} onSubscribe={c.onSubscribe} big />
      <p className="mt-3 truncate text-lg font-bold">{c.title}</p>
    </div>
  )
}

// Progress line along the bottom edge. Red with a dot while paused.
export function Progress({ playCount, inView, paused }) {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/25 lg:inset-x-2 lg:bottom-1.5 lg:h-[3px] lg:rounded-full">
      <div
        key={playCount}
        style={{
          animation: 'shorts-progress 12s linear infinite',
          animationPlayState: inView && !paused ? 'running' : 'paused',
        }}
        className={`relative h-full lg:rounded-full lg:bg-primary ${paused ? 'bg-primary' : 'bg-white'}`}
      >
        {paused && (
          <span className="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
        )}
      </div>
    </div>
  )
}

export const frame = {
  // Colour behind the video on desktop. Used by both cards' sections.
  ambient: (video) =>
    `radial-gradient(40% 60% at 50% 50%, color-mix(in oklch, ${video} 40%, transparent), transparent 75%), #0f0f0f`,
  shortBg: '#0f0f0f',
  videoClass: '',
  // Where the "Tap for sound" button sits on phones.
  promptTop: 'top-[max(10px,env(safe-area-inset-top))]',
}
