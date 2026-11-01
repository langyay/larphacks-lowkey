// The larp&learn logo: a red rounded square with a white ampersand, next to the
// wordmark (the "&" picks up the red).
export function LogoMark({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <text
        x="16"
        y="24.5"
        textAnchor="middle"
        fontFamily="Roboto, Arial, sans-serif"
        fontWeight="900"
        fontSize="25"
        fill="#fff"
      >
        &amp;
      </text>
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
