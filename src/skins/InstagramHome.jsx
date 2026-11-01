import { useEffect, useRef, useState } from 'react'
import { Bookmark, Eye, Play, Search, SlidersHorizontal } from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import { examples } from '@/data/examples'
import { formatCount, makeChannel } from '@/lib/fakeChannel'

// Instagram's Search and Explore page as the home screen: a search bar, a row of
// pills, then a tight grid of tiles (one per ready-made deck). Phones also get one
// wide featured tile at the top.

const chipNames = {
  econ: 'Economics',
  chem: 'Chemistry',
  wwi: 'History',
  french: 'French',
  sat: 'SAT',
  cyber: 'Cybersecurity',
  deriv: 'Derivatives',
  trig: 'Trig',
  un: 'United Nations',
}

// Made-up creators and view counts, the same every time.
const meta = Object.fromEntries(
  examples.map((ex) => {
    const channel = makeChannel(ex.id)
    return [ex.id, { handle: channel.handle, views: formatCount(channel.likes * 9) }]
  }),
)

function Picture({ id, className }) {
  const [broken, setBroken] = useState(false)
  if (broken) return null
  return (
    <img
      src={`/thumbs/${id}.svg`}
      alt=""
      loading="lazy"
      onError={() => setBroken(true)}
      className={`absolute inset-0 size-full object-cover ${className ?? ''}`}
    />
  )
}

function InstagramHome({ onSearch, onPick, onNotes, onSettings, onFeed }) {
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
  const featured = shown[0]
  const pill = 'flex h-11 shrink-0 cursor-pointer items-center rounded-full px-5 text-base font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-white'

  return (
    <>
      <main className="min-h-dvh bg-[#0c1014] pb-[calc(var(--nav-h)+8px)] text-white lg:pb-6 lg:pl-[72px]">
        <header className="flex items-center gap-3 px-4 pt-[max(12px,env(safe-area-inset-top))] lg:justify-center lg:px-6 lg:pt-1">
          <form
            onSubmit={submit}
            className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-white/10 px-4 focus-within:bg-white/15 lg:h-[52px] lg:max-w-[830px]"
          >
            <Search className="size-5 shrink-0 text-white/70" strokeWidth={2} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to larp?"
              aria-label="Topic to larp"
              maxLength={100}
              className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/60"
            />
            {query.trim() && (
              <button type="submit" className="cursor-pointer text-sm font-semibold text-[#0095f6] outline-none focus-visible:underline">
                Search
              </button>
            )}
          </form>
          <button
            type="button"
            onClick={onNotes}
            aria-label="Paste notes"
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white lg:hidden"
          >
            <Bookmark className="size-7" strokeWidth={1.75} />
          </button>
        </header>

        {/* Pills (phones): filter, For you, then a subject each. */}
        <div className="flex gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] lg:hidden">
          <button type="button" onClick={onSettings} aria-label="Settings" className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/25 outline-none focus-visible:ring-2 focus-visible:ring-white">
            <SlidersHorizontal className="size-5" strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => setSubject('all')} aria-pressed={subject === 'all'} className={`${pill} ${subject === 'all' ? 'bg-white/15' : 'border border-white/25'}`}>
            For you
          </button>
          {examples.map((ex) => (
            <button key={ex.id} type="button" onClick={() => setSubject(ex.id)} aria-pressed={subject === ex.id} className={`${pill} ${subject === ex.id ? 'bg-white/15' : 'border border-white/25'}`}>
              {chipNames[ex.id]}
            </button>
          ))}
        </div>

        {/* Phones: one wide featured tile. */}
        {featured && (
          <button type="button" onClick={() => onPick(featured.id)} className="group relative block aspect-video w-full cursor-pointer overflow-hidden bg-[#1b2530] text-left outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset lg:hidden">
            <Picture id={featured.id} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            <span className="absolute top-4 right-4 text-base font-medium">{featured.cards.length} cards</span>
            <span className="absolute inset-x-4 bottom-3 block">
              <span className="block text-[17px] leading-snug font-semibold">{featured.topic}</span>
              <span className="block text-[15px] text-white/80">
                {meta[featured.id].handle} · {meta[featured.id].views} views
              </span>
            </span>
          </button>
        )}

        <ul className="mx-auto mt-[3px] grid max-w-[1480px] grid-cols-3 gap-[3px] lg:mt-4 lg:grid-cols-4 lg:px-6">
          {shown.map((ex, i) => (
            <li key={ex.id} className={i === 0 ? 'max-lg:hidden' : ''}>
              <button
                type="button"
                onClick={() => onPick(ex.id)}
                className="group relative block aspect-[3/4] w-full cursor-pointer overflow-hidden bg-[#1b2530] text-left outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
              >
                <Picture id={ex.id} className="transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
                <span className="absolute top-2 right-2 hidden size-6 items-center justify-center rounded-md bg-white text-black lg:flex">
                  <Play className="size-3.5 fill-black" />
                </span>
                <span className="absolute inset-x-2 bottom-2 block">
                  <span className="block line-clamp-2 text-[13px] leading-tight font-semibold lg:text-base">{ex.topic}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-[15px] font-medium text-white/90">
                    <Eye className="size-4" strokeWidth={2.25} />
                    {meta[ex.id].views}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>

      <BottomNav current="home" onHome={() => {}} onShorts={onFeed} onCreate={onNotes} onProfile={onSettings} />
    </>
  )
}

export default InstagramHome
