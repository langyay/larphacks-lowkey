import { CirclePlus, House, SquarePlay } from 'lucide-react'

// The black tab bar along the bottom of the phone app: Home, Shorts (current),
// Create, You. Desktop has no bottom bar, so it's hidden from 1024px up.
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

function BottomNav({ onHome, onCreate }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[500px] bg-[#0f0f0f] pb-[env(safe-area-inset-bottom)] lg:hidden">
      <NavButton label="Home" onClick={onHome}>
        <House className="size-6" strokeWidth={1.75} />
      </NavButton>
      <NavButton label="Shorts" active>
        <SquarePlay className="size-6 fill-white [&>path]:stroke-[#0f0f0f]" strokeWidth={1.75} />
      </NavButton>
      <NavButton label="Create: make a feed from your notes" onClick={onCreate}>
        <CirclePlus className="size-7" strokeWidth={1.5} />
      </NavButton>
      <NavButton label="You" onClick={onCreate}>
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold">
          L
        </span>
      </NavButton>
    </nav>
  )
}

export default BottomNav
