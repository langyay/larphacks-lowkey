import {
  Camera,
  Ellipsis,
  EyeOff,
  Heart,
  MessageCircle,
  Music,
  Pause,
  Play,
  Repeat2,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react'
import Avatar from '@/components/Avatar'
import { railCounts, useShare } from '@/skins/common'

// The Instagram Reels look: "Reels / Friends" at the top, outline icons with
// counts on the right, then creator + see-through Follow, caption and the
// "Original audio" line at the bottom-left.

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
  const { liked, saved, onLike, onOpenComments } = rail
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
      {/* Like the real app, Save lives in the ⋯ menu, not in the column. */}
      <Btn label="More: clear screen" onClick={c.onClear} count="">
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
      {/* Phone: "Reels" and "Friends" tabs on the left, the camera on the right,
          like the real app. The camera secretly switches focus mode on. */}
      <div className={`absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/35 to-transparent pt-[max(8px,env(safe-area-inset-top))] pr-1.5 pb-6 pl-4 lg:hidden`}>
        <div className="flex items-center gap-4 text-[22px] font-bold [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]">
          <span className="text-white">Reels</span>
          <span className="text-[17px] font-semibold text-white/60">Friends</span>
        </div>
        <button type="button" onClick={onCover} aria-label="Camera (focus mode)" className={`${cornerIcon} ${shadow}`}>
          <Camera className="size-7" strokeWidth={1.75} />
        </button>
      </div>

      {/* Desktop: the cover button at the top-right of the video. */}
      <div className={`absolute top-3 right-3 hidden lg:flex ${shadow}`}>
        <button type="button" onClick={onCover} aria-label="Someone's looking: show a decoy" className={cornerIcon}>
          <EyeOff className="size-5" />
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
        <div className="flex items-center gap-2.5">
          <Avatar channel={channel} className="size-8 shrink-0 rounded-full text-sm" />
          <span className="pointer-events-none min-w-0 truncate text-[14px] font-semibold">
            {channel.handle}
            {/* Collab posts: "and 1 other" / "and 2 others"; most posts have none. */}
            {channel.collabs > 0 && ` and ${channel.collabs} other${channel.collabs > 1 ? 's' : ''}`}
          </span>
          {/* See-through Follow button with a thin white border. */}
          <button
            type="button"
            onClick={onSubscribe}
            aria-pressed={subscribed}
            className="shrink-0 cursor-pointer rounded-lg border border-white/70 bg-transparent px-2.5 py-[3px] text-[13px] font-semibold outline-none [text-shadow:none] focus-visible:ring-2 focus-visible:ring-white"
          >
            {subscribed ? 'Following' : 'Follow'}
          </button>
        </div>
        <p className="pointer-events-none mt-2 truncate text-[14px] leading-snug">
          {title} <span className="text-white/70">... more</span>
        </p>
        {/* The audio line. */}
        <p className="pointer-events-none mt-2 flex items-center gap-1.5 text-[13px]">
          <Music className="size-3.5 shrink-0" strokeWidth={2.25} />
          <span className="truncate">
            {channel.handle} · Original audio
          </span>
        </p>
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
