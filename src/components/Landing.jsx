import { useEffect, useRef, useState } from 'react'
import { NotebookPen, Search, Settings } from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import Avatar from '@/components/Avatar'
import Logo from '@/components/Logo'
import { examples } from '@/data/examples'
import { makeChannel } from '@/lib/fakeChannel'

// Per ready-made deck: a subject chip and the colour of its "thumbnail".
const subjects = {
  chem: { chip: 'Chemistry', colour: 'oklch(0.34 0.05 235)' },
  wwi: { chip: 'History', colour: 'oklch(0.35 0.08 30)' },
  french: { chip: 'French', colour: 'oklch(0.34 0.06 160)' },
  sat: { chip: 'SAT', colour: 'oklch(0.38 0.06 80)' },
  cyber: { chip: 'Cybersecurity', colour: 'oklch(0.34 0.05 200)' },
  deriv: { chip: 'Derivatives', colour: 'oklch(0.3 0.015 60)' },
  trig: { chip: 'Trig', colour: 'oklch(0.36 0.07 130)' },
  un: { chip: 'United Nations', colour: 'oklch(0.36 0.06 250)' },
}

// Each deck is posted by its own made-up channel, like a Short's creator.
const channels = Object.fromEntries(examples.map((ex) => [ex.id, makeChannel(ex.id)]))

const chipBase =
  'flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-white'

// The home screen, laid out like YouTube's: top bar with search, a row of chips,
// then a grid of video-style cards (one per ready-made deck).
// Searching hands the topic to the app, which builds the feed.
function Landing({ onSearch, onPick, onNotes, onSettings, onFeed }) {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('all')
  const inputRef = useRef(null)

  // Focus the bar on computers; on phones that would pop the keyboard open.
  useEffect(() => {
    if (matchMedia('(hover: hover)').matches) inputRef.current?.focus()
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const topic = query.trim()
    if (topic) onSearch(topic)
  }

  const shown = examples.filter((ex) => subject === 'all' || subject === ex.id)
  const chips = [{ id: 'all', chip: 'All' }, ...examples.map((ex) => ({ id: ex.id, chip: subjects[ex.id].chip }))]

  return (
    <>
      <main className="min-h-dvh bg-[#0f0f0f] pb-[calc(var(--nav-h)+24px)] text-white lg:pb-10">
        <header className="sticky top-0 z-10 grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-2 bg-[#0f0f0f] px-4 pt-[max(8px,env(safe-area-inset-top))] pb-2 lg:grid-cols-[1fr_minmax(0,640px)_1fr] lg:pt-2">
          <Logo className="lg:col-start-1" />

          <form
            onSubmit={submit}
            className="col-span-2 row-start-2 flex h-10 overflow-hidden rounded-full border border-white/20 bg-[#121212] focus-within:border-white/50 lg:col-span-1 lg:col-start-2 lg:row-start-1"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to larp?"
              aria-label="Topic to larp"
              maxLength={100}
              className="min-w-0 flex-1 bg-transparent pl-4 text-base text-white outline-none placeholder:text-white/50"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              aria-label="Make my feed"
              className="flex w-14 shrink-0 cursor-pointer items-center justify-center border-l border-white/20 bg-white/10 outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset disabled:cursor-default disabled:opacity-50 disabled:hover:bg-white/10"
            >
              <Search className="size-5" strokeWidth={1.75} />
            </button>
          </form>

          <button
            type="button"
            onClick={onSettings}
            aria-label="Settings"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white lg:col-start-3 lg:justify-self-end"
          >
            <Settings className="size-6" strokeWidth={1.75} />
          </button>
        </header>

        <div className="mx-auto max-w-[1280px]">
          {/* Chips: filter the cards by subject, or paste your own notes. */}
          <div className="flex gap-3 overflow-x-auto px-4 py-2 [scrollbar-width:none]">
            {chips.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSubject(c.id)}
                aria-pressed={subject === c.id}
                className={`${chipBase} ${
                  subject === c.id ? 'bg-white text-[#0f0f0f]' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {c.chip}
              </button>
            ))}
            <button type="button" onClick={onNotes} className={`${chipBase} bg-white/10 hover:bg-white/20`}>
              <NotebookPen className="size-4" strokeWidth={1.75} />
              Paste notes
            </button>
          </div>

          <ul className="mt-2 grid gap-x-4 gap-y-8 sm:grid-cols-2 sm:px-4 lg:grid-cols-3">
            {shown.map((ex) => (
              <li key={ex.id}>
                <button
                  type="button"
                  onClick={() => onPick(ex.id)}
                  className="group block w-full cursor-pointer text-left outline-none"
                >
                  <div
                    style={{ backgroundColor: subjects[ex.id].colour }}
                    className="relative flex aspect-video items-center overflow-hidden px-6 group-focus-visible:ring-2 group-focus-visible:ring-white sm:rounded-xl"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgb(0_0_0/0.45))]" />
                    <p className="shorts-caption relative text-[26px] leading-[1.15]">{ex.topic}</p>
                    <span className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium">
                      {ex.cards.length} cards
                    </span>
                  </div>
                  <div className="flex gap-3 px-4 pt-3 sm:px-0">
                    <Avatar channel={channels[ex.id]} className="size-9 rounded-full text-base" />
                    <div className="min-w-0">
                      <h2 className="line-clamp-2 text-base leading-snug font-medium">{ex.label}</h2>
                      <p className="mt-0.5 text-sm text-white/60">@{channels[ex.id].handle} · {ex.cards.length} flashcards</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <BottomNav current="home" onShorts={onFeed} onCreate={onNotes} onProfile={onSettings} />
    </>
  )
}

export default Landing
