// The larp&learn logo: a red rounded square with two white "l"s that look like a
// pause button, next to the wordmark (the "&" picks up the red).
export function LogoMark({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      {/* Two "l"s (larp & learn) that also read as a pause button. */}
      <rect x="8" y="7.5" width="5.5" height="17" rx="2.75" fill="#fff" />
      <rect x="18.5" y="7.5" width="5.5" height="17" rx="2.75" fill="#fff" />
    </svg>
  )
}

export function Wordmark({ className = '' }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      larp<span className="text-primary">&amp;</span>learn
    </span>
  )
}

function Logo({ className = '' }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoMark />
      <Wordmark className="text-xl leading-none" />
    </span>
  )
}

export default Logo
