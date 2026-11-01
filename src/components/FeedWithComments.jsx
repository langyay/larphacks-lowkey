import { useCallback, useState } from 'react'
import CommentsPanel from '@/components/CommentsPanel'
import Feed from '@/components/Feed'

// Feed plus its comments panel. Feed already takes an onOpenComments prop,
// so this wrapper just owns the open/closed state.
function FeedWithComments({ deck }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <Feed deck={deck} onOpenComments={() => setOpen(true)} />
      <CommentsPanel open={open} onClose={close} />
    </>
  )
}

export default FeedWithComments
