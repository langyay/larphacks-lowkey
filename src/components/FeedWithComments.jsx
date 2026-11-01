import { useCallback, useEffect, useState } from 'react'
import CommentsPanel from '@/components/CommentsPanel'
import Feed from '@/components/Feed'
import CoverScreen from '@/components/CoverScreen'
import Landing from '@/components/Landing'
import { LogoMark } from '@/components/Logo'
import { useCover, useCoverGesture } from '@/lib/cover'
import { SkinProvider } from '@/lib/skin'
import InstagramHome from '@/skins/InstagramHome'
import DesktopSidebar from '@/skins/sidebars'
import { examples, findExample } from '@/data/examples'
import { fetchCards, fetchFunShorts, fetchShorts } from '@/lib/api'
import { guessTopic, makeCards } from '@/lib/makeCards'
import { loadSettings, saveSettings } from '@/lib/settings'

// Load Shorts from the server into state, as { status, items, error }.
// A failure just means no Shorts; the feed carries on with what it has.
function useShorts(load, deps) {
  const [shorts, setShorts] = useState({ status: 'loading', items: [] })
  useEffect(() => {
    const controller = new AbortController()
    const request = load(controller.signal)
    if (!request) {
      setShorts({ status: 'off', items: [] })
      return
    }
    setShorts({ status: 'loading', items: [] })
    request
      .then((items) => setShorts({ status: 'ready', items }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setShorts({ status: 'error', items: [], error: error.message })
        }
      })
    return () => controller.abort()
  }, deps) // the caller lists what should trigger a reload

  return shorts
}

// Feed plus its comments panel. Owns:
// - the current deck (topic + cards), which the Search topic tab can replace
// - learning Shorts for that topic and fun Shorts for the chosen categories
// - the feed settings (mix and fun categories), saved in this browser
// - whether the panel is open, on which tab, and for which card or Short
// - recent searches (while the app is open)
function FeedWithComments() {
  // status: 'ready', or 'loading' while Gemini writes the cards, or 'error'.
  const [deck, setDeck] = useState({
    id: 0,
    topic: examples[0].topic,
    cards: examples[0].cards,
    status: 'ready',
  })
  // The app opens on the home page; searching (or any deck swap) shows the feed.
  // TikTok has no home page, so it always shows the feed.
  const [view, setView] = useState('home')
  const [settings, setSettings] = useState(loadSettings)
  const changeSettings = (next) => {
    setSettings(next)
    saveSettings(next)
  }

  // Bumped by "Try again" to reload Shorts without touching the cards.
  const [shortsRetry, setShortsRetry] = useState(0)
  // Shorts only load while the feed is showing, to spare the YouTube quota.
  const inFeed = settings.app === 'tiktok' || view === 'feed'
  // Actual study mode: flashcards only, so no Shorts are fetched at all.
  const study = settings.studyMode
  const pattern = study ? { cards: 1, learn: 0, fun: 0 } : settings.mix
  const wantLearn = inFeed && !study && settings.mix.learn > 0 && deck.topic !== 'My notes'
  const learn = useShorts(
    (signal) => (wantLearn ? fetchShorts(deck.topic, { signal }) : null),
    [deck.id, deck.topic, wantLearn, shortsRetry],
  )
  const funKey =
    inFeed && !study && settings.mix.fun > 0 ? [...settings.funCategories].sort().join(',') : ''
  const fun = useShorts(
    (signal) => (funKey ? fetchFunShorts(funKey.split(','), { signal }) : null),
    [deck.id, funKey, shortsRetry],
  )

  // Decoys for cover mode: fun Shorts from the same categories (the server
  // already caches them), so it costs no extra YouTube searches when the feed
  // mixes fun Shorts in. If the person turned fun off, comedy and gaming.
  const covered = useCover()
  useCoverGesture(inFeed)
  const decoyKey = inFeed
    ? settings.funCategories.length
      ? [...settings.funCategories].sort().join(',')
      : 'comedy,gaming'
    : ''
  const decoys = useShorts(
    (signal) => (decoyKey ? fetchFunShorts(decoyKey.split(','), { signal }) : null),
    [decoyKey],
  )

  const [panel, setPanel] = useState({
    open: false,
    tab: 'comments',
    target: null,
    notes: false,
    openId: 0,
  })
  const [recent, setRecent] = useState([])
  // Turning focus mode on hides the comments/search panel too.
  if (covered && panel.open) setPanel((p) => ({ ...p, open: false }))

  const close = useCallback(() => setPanel((p) => ({ ...p, open: false })), [])
  const goHome = () => {
    setPanel((p) => ({ ...p, open: false }))
    setView('home')
  }

  // Called by a card's or Short's Comments button, or by 🔍 / ➕ / You.
  const openPanel = ({ tab, card, channel, seed, short, notes = false }) =>
    setPanel((p) => ({
      open: true,
      tab,
      target: card ? { card, channel, seed } : short ? { short } : p.target,
      notes,
      openId: p.openId + 1,
    }))

  // Swap in a new deck. The Feed remounts (new key), so it starts at the top.
  // `input` is what Gemini is asked for ({ topic } or { notes }); while it
  // works, the deck is 'loading' and the feed shows Shorts in the meantime.
  const loadDeck = (topic, cards, input = null) => {
    const id = deck.id + 1
    setDeck({ id, topic, cards, status: input ? 'loading' : 'ready', input })
    setView('feed')
    if (topic !== 'My notes') {
      setRecent((list) => [topic, ...list.filter((t) => t !== topic)].slice(0, 5))
    }
    setPanel((p) => ({ ...p, open: false, target: null }))
    if (input) generate(id, input)
  }

  // Ask Gemini for cards. If it fails on notes, fall back to the note splitter.
  // Results for an older deck (the person searched again meanwhile) are ignored.
  const generate = (id, input) => {
    const update = (changes) =>
      setDeck((d) => (d.id === id ? { ...d, ...changes } : d))
    fetchCards(input)
      .then((result) =>
        update({
          status: 'ready',
          cards: result.cards,
          // For notes, Gemini names the topic (that also finds better Shorts).
          ...(input.notes ? { topic: result.topic } : {}),
        }),
      )
      .catch((error) => {
        const backup = input.notes ? makeCards(input.notes) : []
        if (backup.length > 0) {
          const guessed = guessTopic(input.notes)
          const topic = guessed === 'My notes' ? (findExample(input.notes)?.topic ?? guessed) : guessed
          update({ status: 'ready', cards: backup, topic })
        } else {
          update({ status: 'error', error: error.message })
        }
      })
  }

  const retryCards = () => {
    setDeck((d) => ({ ...d, status: 'loading', error: undefined }))
    generate(deck.id, deck.input)
  }

  // Each handler returns a message to show in the panel, or nothing if it worked.
  const search = (text) => {
    const example = findExample(text)
    if (example) return loadDeck(example.topic, example.cards)
    // Any other topic: Gemini writes the cards while real Shorts load.
    loadDeck(text, [], { topic: text, style: settings.brainrot })
  }

  const pick = (id) => {
    const example = examples.find((ex) => ex.id === id)
    loadDeck(example.topic, example.cards)
  }

  const fromNotes = (notes) => loadDeck('My notes', [], { notes, style: settings.brainrot })

  // Instagram has its own Explore-style home page; YouTube keeps the video grid.
  const Home = settings.app === 'instagram' ? InstagramHome : Landing

  return (
    <SkinProvider value={settings.app}>
      {/* In focus mode the side menu stays for the look, but leads nowhere
          study-related. */}
      <DesktopSidebar
        current={inFeed ? 'feed' : 'home'}
        onHome={covered ? undefined : goHome}
        onFeed={covered ? undefined : () => setView('feed')}
        onCreate={covered ? undefined : () => openPanel({ tab: 'search', notes: true })}
        onProfile={covered ? undefined : () => openPanel({ tab: 'settings' })}
      />
      {inFeed && covered && <CoverScreen shorts={decoys.items} />}
      {inFeed ? (
        // While focus mode is on, the study feed is hidden but kept, so you
        // come back to the same card.
        <div hidden={covered}>
          <Feed
            key={deck.id}
            deck={deck}
            learn={learn}
            fun={fun}
            pattern={pattern}
            plain={study}
            onHome={settings.app === 'tiktok' ? undefined : goHome}
            onOpenComments={openPanel}
            onRetry={() => setShortsRetry((n) => n + 1)}
            onRetryCards={retryCards}
          />
          {/* YouTube on desktop has no side menu, so the logo is its way back home. */}
          {settings.app === 'youtube' && (
            <button
              type="button"
              onClick={goHome}
              aria-label="Home"
              className="fixed top-4 left-5 z-30 hidden cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white lg:block"
            >
              <LogoMark className="size-9" />
            </button>
          )}
        </div>
      ) : (
        <Home
          onSearch={search}
          onPick={pick}
          onNotes={() => openPanel({ tab: 'search', notes: true })}
          onSettings={() => openPanel({ tab: 'settings' })}
          onFeed={() => setView('feed')}
        />
      )}
      <CommentsPanel
        open={panel.open}
        onClose={close}
        tab={panel.tab}
        onTabChange={(tab) => setPanel((p) => ({ ...p, tab }))}
        target={panel.target}
        openId={panel.openId}
        topic={deck.topic}
        recent={recent}
        startWithNotes={panel.notes}
        onSearch={search}
        onPick={pick}
        onNotes={fromNotes}
        settings={settings}
        onSettingsChange={changeSettings}
      />
    </SkinProvider>
  )
}

export default FeedWithComments
