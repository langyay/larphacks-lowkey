import { useEffect, useRef, useState } from 'react'
import { ListFilter, Send, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import { formatFull } from '@/lib/fakeChannel'

// The Shorts comments panel.
// - phone: a sheet that slides up from the bottom over the video
// - desktop: a rounded panel that slides in from the right edge
// Comments you add live only in this panel's state (no saving, no accounts).

function Comment({ comment, onLike }) {
  return (
    <li className="flex gap-3 px-4 py-2.5">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[oklch(0.52_0.005_60)] text-base font-medium"
      >
        Y
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-5 text-white/60">
          <span className="font-medium text-white">@you</span> · just now
        </p>
        <p className="mt-0.5 text-sm leading-5 break-words whitespace-pre-wrap">
          {comment.text}
        </p>
        <div className="mt-1 flex items-center gap-1 text-[13px] text-white/60">
          <button
            type="button"
            onClick={onLike}
            aria-pressed={comment.liked}
            aria-label="Like this comment"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            <ThumbsUp
              className={`size-[18px] ${comment.liked ? 'fill-white text-white' : ''}`}
              strokeWidth={1.75}
            />
          </button>
          <span className="min-w-4">{comment.liked ? 1 : ''}</span>
          <button
            type="button"
            aria-label="Dislike this comment"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            <ThumbsDown className="size-[18px]" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="ml-2 h-9 cursor-pointer rounded-full px-3 font-medium text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            Reply
          </button>
        </div>
      </div>
    </li>
  )
}

function CommentsPanel({ open, onClose }) {
  const [comments, setComments] = useState([])
  const [draft, setDraft] = useState('')
  const closeRef = useRef(null)

  // Escape closes the panel; focus moves to the close button when it opens.
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const post = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setComments((list) => [{ id: crypto.randomUUID(), text, liked: false }, ...list])
    setDraft('')
  }

  const toggleLike = (id) =>
    setComments((list) =>
      list.map((c) => (c.id === id ? { ...c, liked: !c.liked } : c)),
    )

  return (
    <>
      {/* Dims the video on phones; on desktop it only catches outside clicks. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 motion-reduce:transition-none lg:bg-transparent ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-label="Comments"
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[70dvh] max-w-[500px] flex-col rounded-t-xl bg-[#212121] text-white transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none lg:inset-x-auto lg:top-3 lg:right-3 lg:bottom-3 lg:mx-0 lg:h-auto lg:w-[420px] lg:max-w-none lg:rounded-xl ${
          open
            ? 'visible translate-y-0 lg:translate-x-0'
            : 'invisible translate-y-full lg:translate-x-[110%] lg:translate-y-0'
        }`}
      >
        {/* Phone-only drag handle. */}
        <div aria-hidden="true" className="flex justify-center pt-2 lg:hidden">
          <span className="h-1 w-9 rounded-full bg-white/30" />
        </div>

        <header className="flex h-14 shrink-0 items-center gap-1 border-b border-white/10 pr-2 pl-4 lg:border-b-0">
          <h2 className="flex-1 text-base font-bold">
            Comments
            {comments.length > 0 && (
              <span className="ml-2 font-normal text-white/60">
                {formatFull(comments.length)}
              </span>
            )}
          </h2>
          <button
            type="button"
            aria-label="Sort comments"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            <ListFilter className="size-6" strokeWidth={1.75} />
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="size-6" strokeWidth={1.75} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {comments.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-8 pb-10 text-center">
              <p className="text-base font-medium">No comments yet</p>
              <p className="mt-1 text-sm text-white/60">
                Add a comment to start the conversation.
              </p>
            </div>
          ) : (
            <ul className="py-1">
              {comments.map((c) => (
                <Comment key={c.id} comment={c} onLike={() => toggleLike(c.id)} />
              ))}
            </ul>
          )}
        </div>

        <form
          onSubmit={post}
          className="flex shrink-0 items-center gap-3 border-t border-white/10 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]"
        >
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[oklch(0.52_0.005_60)] text-sm font-medium"
          >
            Y
          </span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a comment..."
            aria-label="Add a comment"
            className="h-10 min-w-0 flex-1 rounded-full bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/60 focus-visible:ring-2 focus-visible:ring-white/60"
          />
          {draft.trim() && (
            <button
              type="submit"
              aria-label="Post comment"
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
            >
              <Send className="size-5" strokeWidth={1.75} />
            </button>
          )}
        </form>
      </aside>
    </>
  )
}

export default CommentsPanel
