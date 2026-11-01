import { Check, Clapperboard, GraduationCap, Layers, Minus, Plus } from 'lucide-react'
import { DEFAULT_SETTINGS, FUN_CATEGORIES, MAX_PER_TYPE } from '@/lib/settings'

const rows = [
  { key: 'cards', label: 'Flashcards', hint: 'Your study cards', icon: Layers },
  { key: 'learn', label: 'Learning Shorts', hint: 'Real Shorts that teach your topic', icon: GraduationCap },
  { key: 'fun', label: 'Fun Shorts', hint: 'Real doomscroll Shorts', icon: Clapperboard },
]

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

// "Every 4 swipes: 2 flashcards, 1 learning Short, 1 fun Short."
function summary({ cards, learn, fun }) {
  const parts = [
    cards && plural(cards, 'flashcard'),
    learn && plural(learn, 'learning Short'),
    fun && plural(fun, 'fun Short'),
  ].filter(Boolean)
  const total = cards + learn + fun
  return `Every ${total === 1 ? 'swipe' : plural(total, 'swipe')}: ${parts.join(', ')}.`
}

function StepButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/10 outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white/10"
    >
      {children}
    </button>
  )
}

// The "Settings" tab: how many flashcards / learning Shorts / fun Shorts come
// in each round of swipes, and which kinds of fun Shorts to mix in.
function SettingsPanel({ settings, onChange }) {
  const { mix, funCategories } = settings
  const total = mix.cards + mix.learn + mix.fun

  const setCount = (key, value) => onChange({ ...settings, mix: { ...mix, [key]: value } })
  const toggleCategory = (id) =>
    onChange({
      ...settings,
      funCategories: funCategories.includes(id)
        ? funCategories.filter((c) => c !== id)
        : [...funCategories, id],
    })

  return (
    <div className="px-4 pt-3 pb-6">
      <h3 className="text-base font-bold">Feed mix</h3>
      <p className="mt-1 text-sm text-white/60">{summary(mix)}</p>

      <ul className="mt-3 divide-y divide-white/10 rounded-xl bg-white/5">
        {rows.map(({ key, label, hint, icon: Icon }) => (
          <li key={key} className="flex items-center gap-3 px-3 py-3">
            <Icon className="size-5 shrink-0 text-white/70" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{label}</p>
              <p className="truncate text-xs text-white/60">{hint}</p>
            </div>
            <StepButton
              label={`Fewer ${label.toLowerCase()}`}
              onClick={() => setCount(key, mix[key] - 1)}
              disabled={mix[key] === 0 || total === 1}
            >
              <Minus className="size-4" />
            </StepButton>
            <span aria-live="polite" className="w-5 text-center text-base font-bold tabular-nums">
              {mix[key]}
            </span>
            <StepButton
              label={`More ${label.toLowerCase()}`}
              onClick={() => setCount(key, mix[key] + 1)}
              disabled={mix[key] === MAX_PER_TYPE}
            >
              <Plus className="size-4" />
            </StepButton>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-base font-bold">Fun Shorts</h3>
      <p className="mt-1 text-sm text-white/60">
        {mix.fun === 0
          ? 'Fun Shorts are set to 0 above, so none are mixed in.'
          : funCategories.length === 0
            ? 'Pick at least one kind, or no fun Shorts will show.'
            : 'What to mix in between the studying.'}
      </p>
      <div className={`mt-3 flex flex-wrap gap-2 ${mix.fun === 0 ? 'opacity-40' : ''}`}>
        {FUN_CATEGORIES.map((c) => {
          const on = funCategories.includes(c.id)
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCategory(c.id)}
              aria-pressed={on}
              className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-white ${
                on ? 'bg-[#f1f1f1] text-[#0f0f0f]' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {on && <Check className="size-4" strokeWidth={2.5} />}
              {c.label}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => onChange(DEFAULT_SETTINGS)}
        className="mt-8 h-10 w-full cursor-pointer rounded-full border border-white/15 text-sm font-medium outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
      >
        Reset to default
      </button>
    </div>
  )
}

export default SettingsPanel
