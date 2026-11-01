import { useState } from 'react'
import { ArrowLeft, History, NotebookPen, Search, X } from 'lucide-react'
import { examples, sampleNotes } from '@/data/examples'

// The "Search topic" tab: a YouTube-style search bar, the three ready-made
// decks as quick picks, recent searches, and a notes box ("Or paste your notes").
function TopicSearch({ topic, recent, startWithNotes, onSearch, onPick, onNotes }) {
  const [query, setQuery] = useState(topic)
  const [notesOpen, setNotesOpen] = useState(startWithNotes)
  const [notes, setNotes] = useState(sampleNotes)
  const [message, setMessage] = useState('')

  const search = (text) => {
    const trimmed = text.trim()
    if (!trimmed) {
      setMessage('Type a topic to search, or tap one of the picks below.')
      return
    }
    setMessage(onSearch(trimmed) ?? '')
  }

  const makeFeed = (e) => {
    e.preventDefault()
    if (!notes.trim()) {
      setMessage('Paste some notes first.')
      return
    }
    setMessage(onNotes(notes) ?? '')
  }

  if (notesOpen) {
    return (
      <form onSubmit={makeFeed} className="flex h-full flex-col px-4 pt-3 pb-4">
        <button
          type="button"
          onClick={() => {
            setNotesOpen(false)
            setMessage('')
          }}
          className="-ml-2 flex h-9 w-fit cursor-pointer items-center gap-1.5 rounded-full px-2 text-sm font-medium outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowLeft className="size-4" />
          Back to search
        </button>
        <label htmlFor="notes" className="mt-2 text-base font-bold">
          Paste your notes
        </label>
        <p className="mt-1 text-sm text-white/60">
          One fact per line works best, like <span className="text-white">catalyst: speeds up a reaction</span>.
        </p>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value)
            setMessage('')
          }}
          className="mt-3 min-h-40 flex-1 resize-none rounded-xl bg-white/10 p-3 text-sm leading-6 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        />
        {message && (
          <p role="alert" className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm">
            {message}
          </p>
        )}
        <button
          type="submit"
          className="mt-3 h-10 cursor-pointer rounded-full bg-[#f1f1f1] text-sm font-medium text-[#0f0f0f] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-white"
        >
          Make my feed
        </button>
      </form>
    )
  }

  return (
    <div className="px-4 pt-3 pb-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          search(query)
        }}
        className="flex h-10 items-center rounded-full bg-white/10 pr-1 pl-3 focus-within:ring-2 focus-within:ring-white/60"
      >
        <Search className="size-5 shrink-0 text-white/70" strokeWidth={1.75} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setMessage('')
          }}
          placeholder="Search a topic"
          aria-label="Search a topic"
          enterKeyHint="search"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/60"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="flex size-8 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        )}
      </form>

      {message && (
        <p role="alert" className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm">
          {message}
        </p>
      )}

      <h3 className="mt-5 text-sm font-medium text-white/60">Quick picks</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => onPick(ex.id)}
            className="h-8 cursor-pointer rounded-lg bg-white/10 px-3 text-sm font-medium outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {recent.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-medium text-white/60">Recent</h3>
          <ul className="mt-1">
            {recent.map((r) => (
              <li key={r}>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(r)
                    search(r)
                  }}
                  className="-mx-2 flex h-11 w-[calc(100%+16px)] cursor-pointer items-center gap-4 rounded-lg px-2 text-left text-sm outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
                >
                  <History className="size-5 shrink-0 text-white/70" strokeWidth={1.75} />
                  <span className="truncate">{r}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <button
        type="button"
        onClick={() => {
          setNotesOpen(true)
          setMessage('')
        }}
        className="mt-5 flex h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-white/15 px-3 text-left text-sm font-medium outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
      >
        <NotebookPen className="size-5 shrink-0" strokeWidth={1.75} />
        Or paste your notes
      </button>
    </div>
  )
}

export default TopicSearch
