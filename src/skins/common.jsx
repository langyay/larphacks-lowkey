import { useState } from 'react'
import { formatCount } from '@/lib/fakeChannel'

// Share the card with the phone's share sheet, or copy the link on computers.
export function useShare(text, url) {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const link = url ?? location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: 'larp&learn', text, url: link })
      } else {
        await navigator.clipboard.writeText(link)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }
    } catch {
      // The person closed the share sheet; nothing to do.
    }
  }
  return { share, copied }
}

const add = (n, extra) => (n == null ? null : n + extra)

// The numbers under the TikTok / Instagram buttons, as short text ("10.4K").
// Real Shorts hide some counts; those show nothing.
export function railCounts(channel, { liked, saved }) {
  const from = (own, ratio) => own ?? (channel.likes == null ? null : Math.round(channel.likes * ratio))
  const text = (n) => (n == null ? '' : formatCount(n))
  return {
    likes: text(add(channel.likes, liked ? 1 : 0)),
    comments: text(channel.comments),
    saves: text(add(from(channel.saves, 0.08), saved ? 1 : 0)),
    shares: text(from(channel.shares, 0.05)),
    reposts: text(from(channel.reposts, 0.03)),
  }
}

// A made-up second person for the "liked by" bubbles.
export const friend = { initial: 'M', tone: { bg: '#2f80c4', fg: 'white' } }
