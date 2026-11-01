import { CirclePlus, House, Search, Send, SquarePlay, UserRound, Users, MessageSquare } from 'lucide-react'
import { useSkin } from '@/lib/skin'

// The black tab bar along the bottom of the phone app. It copies the look chosen
// in Settings (YouTube Shorts, TikTok or Instagram). Desktop has no bottom bar,
// so it's hidden from 1024px up.
function NavButton({ label, onClick, active, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className="flex h-[52px] flex-1 cursor-pointer items-center justify-center text-white outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
    >
      {children}
    </button>
  )
}

const bar =
  'fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[500px] pb-[env(safe-area-inset-bottom)] lg:hidden'

function YouTubeNav({ current, onHome, onShorts, onCreate, onProfile }) {
  return (
    <nav className={`${bar} bg-[#0f0f0f]`}>
      <NavButton label="Home" onClick={onHome} active={current === 'home'}>
        <House
          className={`size-6 ${current === 'home' ? 'fill-white [&>path]:stroke-[#0f0f0f]' : ''}`}
          strokeWidth={1.75}
        />
      </NavButton>
      <NavButton label="Shorts" onClick={onShorts} active={current === 'shorts'}>
        <SquarePlay
          className={`size-6 ${current === 'shorts' ? 'fill-white [&>path]:stroke-[#0f0f0f]' : ''}`}
          strokeWidth={1.75}
        />
      </NavButton>
      <NavButton label="Create: make a feed from your notes" onClick={onCreate}>
        <CirclePlus className="size-7" strokeWidth={1.5} />
      </NavButton>
      <NavButton label="You: feed settings" onClick={onProfile}>
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold">
          L
        </span>
      </NavButton>
    </nav>
  )
}

// TikTok: Home, Friends, the big +, Inbox, Profile, each with a small label.
// Only Home does something; search lives in the top bar (the 🔍), so + and
// Profile are just for the look, like Friends and Inbox.
function TikTokNav({ onHome }) {
  const label = 'mt-0.5 text-[11px] leading-none font-medium'
  const item = 'flex h-[52px] flex-1 cursor-pointer flex-col items-center justify-center text-white/70 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset'
  const badge = 'absolute -top-1 left-1/2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#fe2c55] px-1 text-[10px] font-bold text-white'
  return (
    <nav className={`${bar} bg-black`}>
      <button type="button" onClick={onHome} aria-label="Home" aria-current="page" className={`${item} !text-white`}>
        <House className="size-6 fill-white" strokeWidth={1.5} />
        <span className={label}>Home</span>
      </button>
      <div className={`${item} cursor-default`} aria-label="Friends">
        <span className="relative">
          <Users className="size-6" strokeWidth={1.75} />
          <span className={badge}>9</span>
        </span>
        <span className={label}>Friends</span>
      </div>
      <div aria-label="Create" className="flex h-[52px] flex-1 items-center justify-center">
        <span className="relative flex h-8 w-11 items-center justify-center">
          <span className="absolute inset-y-0 left-0 w-9 rounded-lg bg-[#25f4ee]" />
          <span className="absolute inset-y-0 right-0 w-9 rounded-lg bg-[#fe2c55]" />
          <span className="relative flex h-8 w-9 items-center justify-center rounded-lg bg-white text-black">
            <span className="text-2xl leading-none font-bold">+</span>
          </span>
        </span>
      </div>
      <div className={`${item} cursor-default`} aria-label="Inbox">
        <span className="relative">
          <MessageSquare className="size-6" strokeWidth={1.75} />
          <span className={badge}>3</span>
        </span>
        <span className={label}>Inbox</span>
      </div>
      <div aria-label="Profile" className={`${item} cursor-default`}>
        <UserRound className="size-6" strokeWidth={1.75} />
        <span className={label}>Profile</span>
      </div>
    </nav>
  )
}

// Instagram: home, reels, messages, search and your profile. No labels and no
// highlight behind the open tab: its icon is filled (Reels) or bolder (Search).
function InstagramNav({ current, onHome, onShorts, onProfile }) {
  const btn =
    'flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white'
  const onReels = current === 'shorts'
  const bg = onReels ? 'bg-black' : 'bg-[#0c1014]'
  return (
    <nav className={`${bar} items-center justify-around ${bg} text-white`}>
      <button type="button" onClick={onHome} aria-label="Home" className={btn}>
        <House className="size-7" strokeWidth={1.75} />
      </button>
      <button type="button" onClick={onShorts} aria-label="Reels" aria-current={onReels ? 'page' : undefined} className={btn}>
        <SquarePlay
          className={`size-7 ${onReels ? 'fill-white [&>path]:stroke-black' : ''}`}
          strokeWidth={1.75}
        />
      </button>
      <div aria-label="Messages" className="flex h-12 w-12 items-center justify-center">
        <Send className="size-7" strokeWidth={1.75} />
      </div>
      <button type="button" onClick={onHome} aria-label="Search and explore" aria-current={current === 'home' ? 'page' : undefined} className={btn}>
        <Search className="size-7" strokeWidth={current === 'home' ? 2.75 : 1.75} />
      </button>
      <button type="button" onClick={onProfile} aria-label="Profile: settings" className={btn}>
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold">L</span>
      </button>
    </nav>
  )
}

function BottomNav(props) {
  const skin = useSkin()
  const nav = { ...props, current: props.current ?? 'shorts' }
  if (skin === 'tiktok') return <TikTokNav {...nav} />
  if (skin === 'instagram') return <InstagramNav {...nav} />
  return <YouTubeNav {...nav} />
}

export default BottomNav
