import { Check, Clapperboard, GraduationCap, Layers, Minus, Plus } from 'lucide-react'
import { toggleSound, useSound } from '@/lib/narration'
import { APP_LOOKS, BRAINROT_LEVELS, DEFAULT_SETTINGS, FUN_CATEGORIES, MAX_PER_TYPE } from '@/lib/settings'

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
  const { soundOn } = useSound()

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
      <h3 className="text-base font-bold">App look</h3>
      <p className="mt-1 text-sm text-white/60">Which app the feed pretends to be.</p>
      <div className="mt-3 grid gap-2">
        {APP_LOOKS.map((look) => {
          const on = settings.app === look.id
          return (
            <button
              key={look.id}
              type="button"
              onClick={() => onChange({ ...settings, app: look.id })}
              aria-pressed={on}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-white ${
                on ? 'bg-[#f1f1f1] text-[#0f0f0f]' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{look.label}</span>
                <span className={`block truncate text-xs ${on ? 'text-black/60' : 'text-white/60'}`}>{look.hint}</span>
              </span>
              {on && <Check className="size-5 shrink-0" strokeWidth={2.5} />}
            </button>
          )
        })}
      </div>

      <h3 className="mt-8 text-base font-bold">Actual study mode</h3>
      <button
        type="button"
        role="switch"
        aria-checked={settings.studyMode}
        onClick={() => onChange({ ...settings, studyMode: !settings.studyMode })}
        className="mt-3 flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white/5 px-3 py-3 text-left outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">Turn off the distractions</span>
          <span className="block text-xs text-white/60">
            No Shorts and no background videos, just your flashcards. The app still looks the same.
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${settings.studyMode ? 'bg-primary' : 'bg-white/20'}`}
        >
          <span
            className={`absolute top-0.5 size-5 rounded-full bg-white transition-[left] ${settings.studyMode ? 'left-[22px]' : 'left-0.5'}`}
          />
        </span>
      </button>

      <h3 className="mt-8 text-base font-bold">Sound and focus mode</h3>
      <button
        type="button"
        role="switch"
        aria-checked={soundOn}
        onClick={toggleSound}
        className="mt-3 flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white/5 px-3 py-3 text-left outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">Narration sound</span>
          <span className="block text-xs text-white/60">The creator's voice reads each card aloud</span>
        </span>
        <span
          aria-hidden="true"
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${soundOn ? 'bg-primary' : 'bg-white/20'}`}
        >
          <span
            className={`absolute top-0.5 size-5 rounded-full bg-white transition-[left] ${soundOn ? 'left-[22px]' : 'left-0.5'}`}
          />
        </span>
      </button>
      <p className="mt-3 text-sm text-white/60">
        <span className="font-medium text-white">Focus mode</span> swaps the study feed for a normal-looking
        one when someone looks over. Turn it on with the eye button (YouTube), the LIVE icon (TikTok), the
        camera (Instagram), a two-finger double-tap, or the ` key. Do the same again to come back.
      </p>

      <h3 className="mt-8 text-base font-bold">Card voice</h3>
      <p className="mt-1 text-sm text-white/60">
        How the AI words the flashcards. It rewrites the cards you're on right now and any you open next, including the ready-made topics.
      </p>
      <input
        type="range"
        min={0}
        max={BRAINROT_LEVELS.length - 1}
        step={1}
        value={settings.brainrot}
        onChange={(e) => onChange({ ...settings, brainrot: Number(e.target.value) })}
        aria-label="Card voice"
        aria-valuetext={BRAINROT_LEVELS[settings.brainrot]}
        className="mt-4 h-6 w-full cursor-pointer accent-primary"
      />
      <div className="mt-1 flex justify-between text-xs font-medium">
        {BRAINROT_LEVELS.map((label, i) => (
          <span key={label} className={settings.brainrot === i ? 'text-white' : 'text-white/50'}>
            {label}
          </span>
        ))}
      </div>

      <h3 className="mt-8 text-base font-bold">Feed mix</h3>
      <p className="mt-1 text-sm text-white/60">
        {settings.studyMode ? 'Actual study mode is on, so the feed is flashcards only.' : summary(mix)}
      </p>

      <ul className={`mt-3 divide-y divide-white/10 rounded-xl bg-white/5 ${settings.studyMode ? 'opacity-40' : ''}`}>
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
        {settings.studyMode
          ? 'Off while actual study mode is on.'
          : mix.fun === 0
          ? 'Fun Shorts are set to 0 above, so none are mixed in.'
          : funCategories.length === 0
            ? 'Pick at least one kind, or no fun Shorts will show.'
            : 'What to mix in between the studying.'}
      </p>
      <div className={`mt-3 flex flex-wrap gap-2 ${mix.fun === 0 || settings.studyMode ? 'opacity-40' : ''}`}>
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
