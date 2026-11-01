// Channel avatar: the real picture for a YouTube channel, a letter for made-up ones.
function Avatar({ channel, className }) {
  if (channel.avatar) {
    return (
      <img
        src={channel.avatar}
        alt=""
        referrerPolicy="no-referrer"
        className={`shrink-0 object-cover ${className}`}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: channel.tone.bg, color: channel.tone.fg }}
      className={`flex shrink-0 items-center justify-center font-bold [text-shadow:none] ${className}`}
    >
      {channel.initial}
    </span>
  )
}

export default Avatar
