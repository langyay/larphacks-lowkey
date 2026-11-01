import {
  CircleUser,
  Compass,
  Ellipsis,
  Heart,
  House,
  LayoutGrid,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Send,
  SquarePlay,
  SquarePlus,
  Tv,
  Users,
  UserRound,
} from 'lucide-react'
import Avatar from '@/components/Avatar'
import { LogoMark } from '@/components/Logo'
import { makeChannel } from '@/lib/fakeChannel'
import { useSkin } from '@/lib/skin'

// The left menu on computers: TikTok's wide one and Instagram's thin icon rail.
// YouTube has none. Items that mean something here are buttons; the rest are
// only there for the look.

// Made-up accounts for TikTok's "Following accounts" list.
const following = Array.from({ length: 5 }, (_, i) => makeChannel(`following-${i}`))

// Only the bar at the top does something (it opens Settings, which also has
// the search tab), so Explore, Upload and Profile are just for the look.
function TikTokSidebar({ onSettings }) {
  const items = [
    { label: 'For You', icon: House, active: true },
    { label: 'Explore', icon: Compass },
    { label: 'Following', icon: Users },
    { label: 'Friends', icon: UserRound },
    { label: 'LIVE', icon: Tv },
    { label: 'Messages', icon: Send },
    { label: 'Activity', icon: MessageSquare },
    { label: 'Upload', icon: SquarePlus },
    { label: 'Profile', icon: CircleUser },
    { label: 'More', icon: Ellipsis },
  ]
  const row = (item) => {
    const cls = `flex h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-[17px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-white ${
      item.active ? 'text-[#fe2c55]' : 'text-white'
    }`
    const body = (
      <>
        <item.icon className="size-7 shrink-0" strokeWidth={item.active ? 2.5 : 2} />
        <span className="hidden xl:inline">{item.label}</span>
      </>
    )
    return item.onClick ? (
      <button key={item.label} type="button" onClick={item.onClick} aria-label={item.label} className={`${cls} cursor-pointer hover:bg-white/5`}>
        {body}
      </button>
    ) : (
      <div key={item.label} aria-label={item.label} aria-current={item.active ? 'page' : undefined} className={cls}>
        {body}
      </div>
    )
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[72px] flex-col overflow-hidden bg-black px-3 py-4 text-white lg:flex xl:w-[280px]">
      {/* Just the logo: the app name would give the game away. */}
      <div className="flex items-center gap-2 px-1 pb-4">
        <LogoMark className="size-8 shrink-0" />
      </div>
      {/* Looks like TikTok's search bar; it opens Settings (search topic is a tab there too). */}
      <button
        type="button"
        onClick={onSettings}
        aria-label="Settings"
        className="mb-3 flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-white/10 px-0 text-white/60 outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white xl:justify-start xl:px-4"
      >
        <Settings className="size-5 shrink-0" />
        <span className="hidden xl:inline">Settings</span>
      </button>
      <nav className="flex flex-col gap-0.5">{items.map(row)}</nav>
      <div className="mt-5 hidden min-h-0 flex-1 overflow-hidden border-t border-white/10 pt-4 xl:block">
        <p className="px-3 pb-2 text-sm font-semibold text-white/55">Following accounts</p>
        <ul>
          {following.map((ch) => (
            <li key={ch.handle} className="flex items-center gap-3 px-3 py-1.5">
              <Avatar channel={ch} className="size-8 rounded-full text-sm" />
              <span className="min-w-0">
                <span className="block truncate text-[15px] leading-tight font-bold">{ch.handle}</span>
                <span className="block truncate text-[13px] leading-tight text-white/55">{ch.handle.replace(/[._]/g, ' ')}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

function InstagramSidebar({ current, onHome, onFeed, onCreate, onProfile }) {
  const icon = 'size-7'
  const btn =
    'flex size-12 cursor-pointer items-center justify-center rounded-lg text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white'
  const inert = 'flex size-12 items-center justify-center text-white'
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[72px] flex-col items-center justify-between bg-[#0c1014] py-5 lg:flex">
      <button
        type="button"
        onClick={onProfile}
        aria-label="Settings"
        className="cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <LogoMark className="size-8" />
      </button>
      <div className="flex flex-col items-center gap-3">
        <button type="button" onClick={onHome} aria-label="Home" className={btn}>
          <House className={icon} strokeWidth={1.75} />
        </button>
        <button type="button" onClick={onFeed} aria-label="Reels" aria-current={current === 'feed' ? 'page' : undefined} className={btn}>
          <SquarePlay className={`${icon} ${current === 'feed' ? 'fill-white [&>path]:stroke-[#0c1014]' : ''}`} strokeWidth={1.75} />
        </button>
        <span aria-label="Messages" className={inert}>
          <Send className={icon} strokeWidth={1.75} />
        </span>
        <button type="button" onClick={onHome} aria-label="Search and explore" aria-current={current === 'home' ? 'page' : undefined} className={btn}>
          <Search className={icon} strokeWidth={current === 'home' ? 2.5 : 1.75} />
        </button>
        <span aria-label="Notifications" className={`${inert} relative`}>
          <Heart className={icon} strokeWidth={1.75} />
          <span className="absolute top-2.5 right-2.5 size-2.5 rounded-full bg-[#ff3040]" />
        </span>
        <button type="button" onClick={onCreate} aria-label="Create: make a feed from your notes" className={btn}>
          <Plus className={icon} strokeWidth={1.75} />
        </button>
        <button type="button" onClick={onProfile} aria-label="Profile: settings" className={btn}>
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold">L</span>
        </button>
      </div>
      <div className="flex flex-col items-center gap-3">
        <span aria-label="Menu" className={inert}>
          <Menu className={icon} strokeWidth={1.75} />
        </span>
        <span aria-label="More" className={inert}>
          <LayoutGrid className={icon} strokeWidth={1.75} />
        </span>
      </div>
    </aside>
  )
}

// `current` is 'feed' or 'home' so Instagram's rail can highlight where you are.
function DesktopSidebar({ current, onHome, onFeed, onCreate, onProfile }) {
  const skin = useSkin()
  if (skin === 'tiktok') return <TikTokSidebar onSettings={onProfile} />
  if (skin === 'instagram')
    return <InstagramSidebar current={current} onHome={onHome} onFeed={onFeed} onCreate={onCreate} onProfile={onProfile} />
  return null
}


export default DesktopSidebar
