import { useEffect, useRef, useState } from 'react'
import { ListFilter, Send, X } from 'lucide-react'
import SettingsPanel from '@/components/SettingsPanel'
import TeachingComments from '@/components/TeachingComments'
import TopicSearch from '@/components/TopicSearch'
import { formatFull } from '@/lib/fakeChannel'

// The Shorts comments panel.
// - phone: a sheet that slides up from the bottom over the video
// - desktop: a rounded panel that slides in from the right edge
// Two tabs: "Comments" (people explaining the card you came from) and
// "Search topic" (pick what to study). Comments you add live only in this
// panel's state, per card (no saving, no accounts).

const you = {
  handle: 'you',
  initial: 'Y',
  tone: { bg: 'oklch(0.52 0.005 60)', fg: 'white' },
  ago: 'just now',
}

const tabs = [
  { id: 'comments', label: 'Comments' },
  { id: 'search', label: 'Search topic' },
  { id: 'settings', label: 'Settings' },
]

function CommentsPanel({
  open,
  onClose,
  tab,
  onTabChange,
  target,
  openId,
  topic,
  recent,
  startWithNotes,
  onSearch,
  onPick,
  onNotes,
  settings,
  onSettingsChange,
}) {
  // Your own comments, keyed by card question so each card keeps its own.
  const [byCard, setByCard] = useState({})
  const [draft, setDraft] = useState('')
  const closeRef = useRef(null)
  const cardKey = target?.card?.question
  const ownComments = (cardKey && byCard[cardKey]) || []

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
    if (!text || !cardKey) return
    setByCard((all) => ({
      ...all,
      [cardKey]: [{ id: crypto.randomUUID(), text, author: you }, ...(all[cardKey] ?? [])],
    }))
    setDraft('')
  }

  const commentCount = target?.card
    ? target.channel.comments + ownComments.length
    : (target?.short?.comments ?? 0)
  const showComments = tab === 'comments'

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
        aria-label={tabs.find((t) => t.id === tab)?.label}
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

        <header className="flex h-14 shrink-0 items-center gap-1 pr-2 pl-4">
          <h2 className="flex-1 text-base font-bold">
            {{ comments: 'Comments', search: 'Search', settings: 'Settings' }[tab]}
            {showComments && commentCount > 0 && (
              <span className="ml-2 font-normal text-white/60">
                {formatFull(commentCount)}
              </span>
            )}
          </h2>
          {showComments && (
            <button
              type="button"
              aria-label="Sort comments"
              className="flex size-10 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
            >
              <ListFilter className="size-6" strokeWidth={1.75} />
            </button>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="size-6" strokeWidth={1.75} />
          </button>
        </header>

        {/* Tab chips, styled like YouTube's "Top / Newest" chips. */}
        <div
          role="tablist"
          className="flex shrink-0 gap-2 border-b border-white/10 px-4 pb-3"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => onTabChange(t.id)}
              className={`h-8 cursor-pointer rounded-lg px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-white ${
                tab === t.id
                  ? 'bg-[#f1f1f1] text-[#0f0f0f]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {showComments ? (
            target?.short ? (
              // A real YouTube Short: its real comments live on YouTube.
              <div className="flex h-full flex-col items-center justify-center px-8 pb-10 text-center">
                <p className="text-base font-medium">{target.short.title}</p>
                <p className="mt-1 text-sm text-white/60">
                  This is a real Short by {target.short.channel}. Its comments are on YouTube.
                </p>
                <a
                  href={`https://www.youtube.com/shorts/${target.short.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex h-10 items-center rounded-full bg-[#f1f1f1] px-5 text-sm font-medium text-[#0f0f0f] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-white"
                >
                  Open on YouTube
                </a>
              </div>
            ) : target ? (
              <TeachingComments
                card={target.card}
                channel={target.channel}
                seed={target.seed}
                ownComments={ownComments}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 pb-10 text-center">
                <p className="text-base font-medium">Pick a Short first</p>
                <p className="mt-1 text-sm text-white/60">
                  Tap the comment button on a card to see people explain it.
                </p>
              </div>
            )
          ) : tab === 'settings' ? (
            <SettingsPanel settings={settings} onChange={onSettingsChange} />
          ) : (
            <TopicSearch
              key={openId}
              topic={topic}
              recent={recent}
              startWithNotes={startWithNotes}
              onSearch={onSearch}
              onPick={onPick}
              onNotes={onNotes}
            />
          )}
        </div>

        {showComments && target?.card && (
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
        )}
      </aside>
    </>
  )
}

export default CommentsPanel
