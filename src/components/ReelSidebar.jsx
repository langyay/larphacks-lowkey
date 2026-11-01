import { useState } from 'react'
import {
  EllipsisVertical,
  Forward,
  Heart,
  MessageSquareText,
  Repeat2,
} from 'lucide-react'

// The Shorts action rail, matching the 2026 layout: heart (no dislike), outlined
// icons straight on the video with a soft shadow, then More and the sound tile.
function SidebarButton({ label, onClick, pressed, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      className="flex cursor-pointer flex-col items-center gap-1 text-xs font-medium text-white outline-none [text-shadow:0_1px_3px_rgb(0_0_0/0.7)] focus-visible:ring-2 focus-visible:ring-primary active:scale-90"
    >
      <span className="flex size-11 items-center justify-center drop-shadow-[0_1px_3px_rgb(0_0_0/0.7)]">
        {children}
      </span>
      {label}
    </button>
  )
}

function ReelSidebar({ shareText, onOpenComments, onRemix, onClearScreen }) {
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)

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

  return (
    <div className="absolute right-1.5 bottom-5 z-10 flex flex-col items-center gap-3">
      <SidebarButton
        label="Like"
        onClick={() => setLiked((l) => !l)}
        pressed={liked}
      >
        <Heart
          className={`size-7 ${liked ? 'fill-primary text-primary' : 'text-white'}`}
          strokeWidth={2}
        />
      </SidebarButton>
      <SidebarButton label="Comments" onClick={onOpenComments}>
        <MessageSquareText className="size-7 text-white" strokeWidth={2} />
      </SidebarButton>
      <SidebarButton label={copied ? 'Copied' : 'Share'} onClick={share}>
        <Forward className="size-7 text-white" strokeWidth={2} />
      </SidebarButton>
      <SidebarButton label="Remix" onClick={onRemix}>
        <Repeat2 className="size-7 text-white" strokeWidth={2} />
      </SidebarButton>
      <button
        type="button"
        onClick={onClearScreen}
        aria-label="More: clear screen"
        className="flex size-11 cursor-pointer items-center justify-center text-white outline-none drop-shadow-[0_1px_3px_rgb(0_0_0/0.7)] focus-visible:ring-2 focus-visible:ring-primary"
      >
        <EllipsisVertical className="size-6" />
      </button>
      {/* The little "sound" tile at the bottom of the rail. */}
      <span
        aria-hidden="true"
        className="mt-1 flex size-9 items-center justify-center rounded-md border-2 border-white bg-primary text-sm font-bold text-primary-foreground"
      >
        L
      </span>
    </div>
  )
}

export default ReelSidebar
