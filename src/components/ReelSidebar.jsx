import { useState } from 'react'
import {
  Bookmark,
  Forward,
  Heart,
  MessageSquareText,
  Plus,
  RefreshCw,
  ThumbsDown,
} from 'lucide-react'
import { formatCount, formatFull } from '@/lib/fakeChannel'

// The Shorts action rail. Two versions, copied from the real app:
// - phone: icons straight on the video, Like / Comments / Save / Share / Remix
// - desktop: grey circles beside the video, Like / Dislike / Comments / Share / Remix
function RailButton({ variant, label, ariaLabel, onClick, pressed, children }) {
  const phone = variant === 'phone'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={ariaLabel ?? label}
      className={`flex cursor-pointer flex-col items-center text-white outline-none focus-visible:ring-2 focus-visible:ring-white ${
        phone
          ? 'text-[13px] leading-[18px] font-medium [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]'
          : 'gap-2 text-sm'
      }`}
    >
      <span
        className={
          phone
            ? 'flex h-8 w-10 items-center justify-center drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]'
            : 'flex size-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 active:bg-white/30'
        }
      >
        {children}
      </span>
      {label}
    </button>
  )
}

// Remix: circular arrows with a plus in the middle.
function RemixIcon({ className }) {
  return (
    <span className={`relative ${className}`}>
      <RefreshCw className="size-full" strokeWidth={1.75} />
      <Plus className="absolute inset-0 m-auto size-[45%]" strokeWidth={2.5} />
    </span>
  )
}

function ReelSidebar({
  variant,
  channel,
  shareText,
  liked,
  onLike,
  disliked,
  onDislike,
  saved,
  onSave,
  onOpenComments,
  onRemix,
}) {
  const [copied, setCopied] = useState(false)
  const phone = variant === 'phone'
  const icon = 'size-6'

  const share = async () => {
    const data = { title: 'Lowkey', text: shareText, url: location.href }
    try {
      if (navigator.share) {
        await navigator.share(data)
      } else {
        await navigator.clipboard.writeText(location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }
    } catch {
      // The person closed the share sheet; nothing to do.
    }
  }

  const likes = channel.likes + (liked ? 1 : 0)

  return (
    <div className={`flex flex-col items-center ${phone ? 'gap-1.5' : 'gap-4'}`}>
      <RailButton
        variant={variant}
        label={formatCount(likes, { smallK: phone })}
        ariaLabel="Like"
        onClick={onLike}
        pressed={liked}
      >
        <Heart
          className={`${icon} ${liked ? 'fill-primary text-primary' : ''}`}
          strokeWidth={1.75}
        />
      </RailButton>

      {!phone && (
        <RailButton
          variant={variant}
          label={formatCount(channel.dislikes + (disliked ? 1 : 0))}
          ariaLabel="Dislike"
          onClick={onDislike}
          pressed={disliked}
        >
          <ThumbsDown
            className={`${icon} ${disliked ? 'fill-white' : ''}`}
            strokeWidth={1.75}
          />
        </RailButton>
      )}

      <RailButton
        variant={variant}
        label={
          phone
            ? formatCount(channel.comments, { smallK: true })
            : formatFull(channel.comments)
        }
        ariaLabel="Comments"
        onClick={onOpenComments}
      >
        <MessageSquareText className={icon} strokeWidth={1.75} />
      </RailButton>

      {phone && (
        <RailButton
          variant={variant}
          label={saved ? 'Saved' : 'Save'}
          onClick={onSave}
          pressed={saved}
        >
          <Bookmark
            className={`${icon} ${saved ? 'fill-white' : ''}`}
            strokeWidth={1.75}
          />
        </RailButton>
      )}

      <RailButton
        variant={variant}
        label={copied ? 'Copied' : 'Share'}
        onClick={share}
      >
        <Forward className={icon} strokeWidth={1.75} />
      </RailButton>

      <RailButton variant={variant} label="Remix" onClick={onRemix}>
        <RemixIcon className={icon} />
      </RailButton>

      {/* The channel's square tile at the bottom of the rail. */}
      <span
        aria-hidden="true"
        style={{ backgroundColor: channel.tone.bg, color: channel.tone.fg }}
        className={`flex items-center justify-center font-bold ${
          phone
            ? 'mt-2.5 size-[30px] rounded-md border-2 border-white text-sm'
            : 'mt-2 size-10 rounded-lg text-lg'
        }`}
      >
        {channel.initial}
      </span>
    </div>
  )
}

export default ReelSidebar
