import {
  Bookmark,
  Captions,
  Check,
  Ellipsis,
  EyeOff,
  Forward,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Plus,
  Search,
  Tv,
  Volume2,
  VolumeX,
} from 'lucide-react'
import Avatar from '@/components/Avatar'
import { railCounts, useShare } from '@/skins/common'

// The TikTok look: "For You" tabs on phones, round buttons with counts on the
// right, creator and caption at the bottom-left of the video.

const red = '#fe2c55'
const shadow = 'drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]'

function Btn({ label, onClick, pressed, count, desktop, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className="flex cursor-pointer flex-col items-center gap-1 text-white outline-none [text-shadow:0_1px_2px_rgb(0_0_0/0.5)] focus-visible:ring-2 focus-visible:ring-white"
    >
      <span
        className={
          desktop
            ? 'flex size-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20'
            : `flex size-11 items-center justify-center ${shadow}`
        }
      >
        {children}
      </span>
      <span className="min-h-4 text-[13px] leading-4 font-semibold">{count}</span>
    </button>
  )
}

function ButtonColumn({ c, desktop }) {
  const { channel, subscribed, onSubscribe, rail } = c
  const { liked, saved, onLike, onSave, onOpenComments } = rail
  const counts = railCounts(channel, { liked, saved })
  const { share } = useShare(rail.shareText, rail.shareUrl)

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative mb-3">
        <button type="button" onClick={onSubscribe} aria-label={subscribed ? 'Following' : 'Follow'} className="block cursor-pointer outline-none">
          <Avatar channel={channel} className="size-12 rounded-full border border-white/70 text-lg" />
        </button>
        <span
          style={{ backgroundColor: red }}
          className="pointer-events-none absolute -bottom-2 left-1/2 flex size-5 -translate-x-1/2 items-center justify-center rounded-full text-white"
        >
          {subscribed ? <Check className="size-3.5" strokeWidth={3} /> : <Plus className="size-3.5" strokeWidth={3} />}
        </span>
      </div>
      <Btn label="Like" onClick={onLike} pressed={liked} count={counts.likes} desktop={desktop}>
        <Heart className="size-7" fill={liked ? red : 'white'} stroke={liked ? red : 'white'} />
      </Btn>
      <Btn label="Comments" onClick={onOpenComments} count={counts.comments} desktop={desktop}>
        <MessageCircle className="size-7" fill="white" stroke="white" />
      </Btn>
      <Btn label="Save" onClick={onSave} pressed={saved} count={counts.saves} desktop={desktop}>
        <Bookmark className="size-7" fill={saved ? '#ffc107' : 'white'} stroke={saved ? '#ffc107' : 'white'} />
      </Btn>
      <Btn label="Share" onClick={share} count={counts.shares} desktop={desktop}>
        <Forward className="size-7" fill="white" stroke="white" />
      </Btn>
      {/* The spinning record at the bottom of the column. */}
      <span
        aria-hidden="true"
        className="mt-1 flex size-11 animate-[spin_6s_linear_infinite] items-center justify-center rounded-full bg-neutral-800 motion-reduce:animate-none"
      >
        <Avatar channel={channel} className="size-7 rounded-full text-xs" />
      </span>
    </div>
  )
}

const smallIcon =
  'flex size-9 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white'

export function Inside(c) {
  const { channel, title, paused, onPause, soundOn, onSound, soundLabel, onCover, onSearch, onClear, captionsOn, onCaptions } = c
  const volume = soundOn ? <Volume2 className="size-6" /> : <VolumeX className="size-6" />

  return (
    <>
      {/* Phone: the For You tab row. */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/45 to-transparent px-3 pt-[max(10px,env(safe-area-inset-top))] pb-6 lg:hidden">
        <span aria-hidden="true" className={`flex size-9 items-center justify-center ${shadow}`}>
          <Tv className="size-6" strokeWidth={2} />
        </span>
        <div className="flex items-center gap-5 text-[17px] font-bold [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]">
          <span className="text-white/65">Following</span>
          <span className="relative text-white">
            For You
            <span className="absolute -bottom-1.5 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-white" />
          </span>
        </div>
        <div className={`flex ${shadow}`}>
          <button type="button" onClick={onCover} aria-label="Someone's looking: show a decoy" className={smallIcon}>
            <EyeOff className="size-5" />
          </button>
          <button type="button" onClick={onSound} aria-label={soundLabel} aria-pressed={!soundOn} className={smallIcon}>
            {soundOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
          </button>
          <button type="button" onClick={onSearch} aria-label="Search a topic" className={smallIcon}>
            <Search className="size-6" strokeWidth={2.25} />
          </button>
        </div>
      </div>

      {/* Desktop: small controls at the top-left of the video. */}
      <div className="absolute top-3 left-3 hidden items-center gap-1 lg:flex">
        <button type="button" onClick={onSound} aria-label={soundLabel} aria-pressed={!soundOn} className={`${smallIcon} bg-black/30 hover:bg-black/50`}>
          {volume}
        </button>
        <button type="button" onClick={onPause} aria-label={paused ? 'Play' : 'Pause'} className={`${smallIcon} bg-black/30 hover:bg-black/50`}>
          {paused ? <Play className="size-5 fill-white" /> : <Pause className="size-5 fill-white" />}
        </button>
        {onCaptions && (
          <button type="button" onClick={onCaptions} aria-label="Captions" aria-pressed={captionsOn} className={`${smallIcon} bg-black/30 hover:bg-black/50`}>
            <Captions className={`size-5 ${captionsOn ? '' : 'opacity-50'}`} />
          </button>
        )}
        <button type="button" onClick={onCover} aria-label="Someone's looking: show a decoy" className={`${smallIcon} bg-black/30 hover:bg-black/50`}>
          <EyeOff className="size-5" />
        </button>
        <button type="button" onClick={onClear} aria-label="More: clear screen" className={`${smallIcon} bg-black/30 hover:bg-black/50`}>
          <Ellipsis className="size-5" />
        </button>
      </div>

      {/* Creator and caption, bottom-left (phone and desktop). */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="pointer-events-none absolute right-20 bottom-6 left-3 [text-shadow:0_1px_2px_rgb(0_0_0/0.5)] lg:bottom-7 lg:left-4">
        <p className="text-[17px] leading-tight font-bold">
          {channel.handle} <span className="text-[14px] font-normal text-white/70">· 1d ago</span>
        </p>
        <p className="mt-1.5 line-clamp-2 text-[15px] leading-snug">
          {title} <span className="font-semibold text-white/80">more</span>
        </p>
      </div>

      {/* Phone: the button column on the right. */}
      <div className="absolute right-1.5 bottom-6 lg:hidden">
        <ButtonColumn c={c} />
      </div>
    </>
  )
}

// Desktop: the button column beside the video.
export function Rail(c) {
  return (
    <div className="hidden pb-1 lg:block">
      <ButtonColumn c={c} desktop />
    </div>
  )
}

export function Info() {
  return null
}

// A bar with a knob along the bottom: white on phones, TikTok red on desktop.
export function Progress({ playCount, inView, paused }) {
  return (
    <div className="absolute inset-x-3 bottom-2 h-[3px] rounded-full bg-white/30 lg:inset-x-0 lg:bottom-0 lg:rounded-none">
      <div
        key={playCount}
        style={{
          animation: 'shorts-progress 12s linear infinite',
          animationPlayState: inView && !paused ? 'running' : 'paused',
          backgroundColor: 'white',
        }}
        className="relative h-full rounded-full lg:rounded-none lg:!bg-[#fe2c55]"
      >
        <span className="absolute top-1/2 right-0 size-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-white lg:hidden" />
      </div>
    </div>
  )
}

export const frame = {
  ambient: () => '#000',
  shortBg: '#000',
  videoClass: '',
  promptTop: 'top-[max(60px,calc(env(safe-area-inset-top)+52px))]',
}
