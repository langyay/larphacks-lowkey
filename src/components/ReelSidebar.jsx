import { useState } from 'react'
import { Forward, MessageSquareText, ThumbsDown, ThumbsUp } from 'lucide-react'

// The Shorts-style icon rail on the right of each reel. Each icon is a real button.
function SidebarButton({ label, onClick, pressed, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className="flex cursor-pointer flex-col items-center gap-1 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-reel-foreground/10">
        {children}
      </span>
      {label}
    </button>
  )
}

function ReelSidebar({ shareText, onOpenComments }) {
  // 'like', 'dislike' or null. Picking one clears the other, like on Shorts.
  const [vote, setVote] = useState(null)
  const [copied, setCopied] = useState(false)

  const toggleVote = (v) => setVote((current) => (current === v ? null : v))

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

  const iconClass = (active) =>
    `size-6 ${active ? 'fill-primary text-primary' : 'fill-reel-foreground'}`

  return (
    <div className="absolute right-3 bottom-8 z-10 flex flex-col gap-5">
      <SidebarButton
        label="Like"
        onClick={() => toggleVote('like')}
        pressed={vote === 'like'}
      >
        <ThumbsUp className={iconClass(vote === 'like')} />
      </SidebarButton>
      <SidebarButton
        label="Dislike"
        onClick={() => toggleVote('dislike')}
        pressed={vote === 'dislike'}
      >
        <ThumbsDown className={iconClass(vote === 'dislike')} />
      </SidebarButton>
      <SidebarButton label="Topic" onClick={onOpenComments}>
        <MessageSquareText className="size-6" />
      </SidebarButton>
      <SidebarButton label={copied ? 'Copied' : 'Share'} onClick={share}>
        <Forward className="size-6" />
      </SidebarButton>
    </div>
  )
}

export default ReelSidebar
