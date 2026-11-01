import {
  BadgeCheck,
  Bookmark,
  Ellipsis,
  EyeOff,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Repeat2,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react'
import Avatar from '@/components/Avatar'
import { friend, railCounts, useShare } from '@/skins/common'

// The Instagram Reels look: outline icons with counts on the right, "liked by"
// bubbles, a Follow button and a caption at the bottom-left.

const red = '#ff3040'
const shadow = 'drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]'

function Btn({ label, onClick, pressed, count, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={`flex cursor-pointer flex-col items-center gap-1 text-white outline-none [text-shadow:0_1px_2px_rgb(0_0_0/0.5)] focus-visible:ring-2 focus-visible:ring-white`}
    >
      <span className={`flex size-9 items-center justify-center ${shadow}`}>{children}</span>
      <span className="min-h-4 text-[13px] leading-4 font-medium">{count}</span>
    </button>
  )
}

function ButtonColumn({ c }) {
  const { channel, rail } = c
  const { liked, saved, onLike, onSave, onOpenComments } = rail
  const counts = railCounts(channel, { liked, saved })
  const { share } = useShare(rail.shareText, rail.shareUrl)
  const icon = 'size-7'

  return (
    <div className="flex flex-col items-center gap-2">
      <Btn label="Like" onClick={onLike} pressed={liked} count={counts.likes}>
        <Heart className={icon} strokeWidth={1.75} fill={liked ? red : 'none'} stroke={liked ? red : 'white'} />
      </Btn>
      <Btn label="Comments" onClick={onOpenComments} count={counts.comments}>
        <MessageCircle className={icon} strokeWidth={1.75} />
      </Btn>
      <Btn label="Repost" onClick={rail.onRemix} count={counts.reposts}>
        <Repeat2 className={icon} strokeWidth={1.75} />
      </Btn>
      <Btn label="Send" onClick={share} count={counts.shares}>
        <Send className={icon} strokeWidth={1.75} />
      </Btn>
      <Btn label="Save" onClick={onSave} pressed={saved} count="">
        <Bookmark className={icon} strokeWidth={1.75} fill={saved ? 'white' : 'none'} />
      </Btn>
      <Btn label="More" onClick={c.onClear} count="">
        <Ellipsis className={icon} strokeWidth={2} />
      </Btn>
      {/* The "original audio" thumbnail at the bottom of the column. */}
      <span aria-hidden="true" className="mt-1 block overflow-hidden rounded-md border-2 border-white">
        <Avatar channel={channel} className="size-7 text-xs" />
      </span>
    </div>
  )
}

const cornerIcon =
  'flex size-10 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white'

export function Inside(c) {
  const { channel, title, paused, onPause, soundOn, onSound, soundLabel, onCover, subscribed, onSubscribe } = c
  const volume = soundOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />

  return (
    <>
      {/* Top-right: the cover button and sound (phone and desktop). */}
      <div className={`absolute top-0 right-0 flex pt-[max(8px,env(safe-area-inset-top))] pr-1.5 lg:pt-3 lg:pr-3 ${shadow}`}>
        <button type="button" onClick={onCover} aria-label="Someone's looking: show a decoy" className={cornerIcon}>
          <EyeOff className="size-5" />
        </button>
        <button type="button" onClick={onSound} aria-label={soundLabel} aria-pressed={!soundOn} className={`${cornerIcon} lg:hidden`}>
          {volume}
        </button>
      </div>

      {/* Desktop: the round sound button at the bottom-right of the video, and a play button when paused. */}
      <button
        type="button"
        onClick={onSound}
        aria-label={soundLabel}
        aria-pressed={!soundOn}
        className="absolute right-3 bottom-4 hidden size-10 cursor-pointer items-center justify-center rounded-full bg-black/55 outline-none focus-visible:ring-2 focus-visible:ring-white lg:flex"
      >
        {volume}
      </button>
      <button
        type="button"
        onClick={onPause}
        aria-label={paused ? 'Play' : 'Pause'}
        className="absolute top-3 left-3 hidden size-10 cursor-pointer items-center justify-center rounded-full bg-black/35 outline-none hover:bg-black/55 focus-visible:ring-2 focus-visible:ring-white lg:flex"
      >
        {paused ? <Play className="size-5 fill-white" /> : <Pause className="size-5 fill-white" />}
      </button>

      {/* Creator, Follow and caption, bottom-left. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/65 to-transparent" />
      <div className="absolute right-16 bottom-5 left-3 [text-shadow:0_1px_2px_rgb(0_0_0/0.5)] lg:right-16">
        <div className="pointer-events-none mb-3 flex items-end gap-6">
          <span className="relative">
            <Avatar channel={friend} className="size-10 rounded-full border-2 border-white/80 text-sm" />
            <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full" style={{ backgroundColor: red }}>
              <Heart className="size-3 fill-white" stroke="white" />
            </span>
          </span>
          <span className="relative">
            <Avatar channel={channel} className="size-10 rounded-full border-2 border-white/80 text-sm" />
            <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-[#2f80c4]">
              <Repeat2 className="size-3" stroke="white" />
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar channel={channel} className="size-8 shrink-0 rounded-full text-sm" />
          <span className="pointer-events-none flex min-w-0 items-center gap-1 text-[15px] font-semibold">
            <span className="truncate">{channel.handle} and 3 others</span>
            <BadgeCheck className="size-4 shrink-0 fill-[#0095f6]" stroke="white" />
          </span>
          <button
            type="button"
            onClick={onSubscribe}
            aria-pressed={subscribed}
            className="shrink-0 cursor-pointer rounded-lg border border-white/80 px-3 py-1 text-sm font-semibold outline-none [text-shadow:none] focus-visible:ring-2 focus-visible:ring-white"
          >
            {subscribed ? 'Following' : 'Follow'}
          </button>
        </div>
        <p className="pointer-events-none mt-2 line-clamp-2 text-[15px] leading-snug">{title}</p>
      </div>

      {/* Phone: the button column on the right. */}
      <div className="absolute right-1.5 bottom-4 lg:hidden">
        <ButtonColumn c={c} />
      </div>
    </>
  )
}

// Desktop: the button column beside the video.
export function Rail(c) {
  return (
    <div className="hidden pb-1 lg:block">
      <ButtonColumn c={c} />
    </div>
  )
}

export function Info() {
  return null
}

// A thin line along the bottom edge on phones; Instagram desktop has none.
export function Progress({ playCount, inView, paused }) {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/30 lg:hidden">
      <div
        key={playCount}
        style={{
          animation: 'shorts-progress 12s linear infinite',
          animationPlayState: inView && !paused ? 'running' : 'paused',
        }}
        className="h-full bg-white"
      />
    </div>
  )
}

export const frame = {
  ambient: () => '#0c1014',
  shortBg: '#0c1014',
  videoClass: 'lg:border lg:border-white/15',
  promptTop: 'top-[max(56px,calc(env(safe-area-inset-top)+48px))]',
}
