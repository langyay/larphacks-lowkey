import { useEffect, useRef, useState } from 'react'
import { draw as marbles } from '@/lib/backgrounds/marbles'
import { draw as parkour } from '@/lib/backgrounds/parkour'
import { draw as runner } from '@/lib/backgrounds/runner'
import { draw as slice } from '@/lib/backgrounds/slice'

const drawings = { runner, parkour, slice, marbles }

// Kinds that have no video file yet. Remembered so cards stop asking for it.
const noVideo = new Set()

// A real clip from public/backgrounds/<kind>.mp4: silent, looping, starting at a
// random moment so two cards of the same kind don't look identical. It only
// plays while `playing` (the card is on screen).
function VideoBackground({ kind, playing, className, onMissing }) {
  const ref = useRef(null)
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const video = ref.current
    if (playing && !still) video.play().catch(() => {})
    else video.pause()
  }, [playing, still])

  return (
    <video
      ref={ref}
      src={`/backgrounds/${kind}.mp4`}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      data-kind={kind}
      onError={onMissing}
      onLoadedMetadata={(e) => {
        const video = e.currentTarget
        if (Number.isFinite(video.duration)) video.currentTime = Math.random() * video.duration
      }}
      className={`${className} object-cover`}
    />
  )
}

// Our own drawn animation, used when there's no video for this kind.
// Animates while `playing`; otherwise, or with "reduce motion" on, a still frame.
function CanvasBackground({ kind, playing, className }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const paint = drawings[kind] ?? runner
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let start = null

    // Match the canvas to its size on screen (sharp on phones, capped for speed).
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
    }
    const render = (seconds) => {
      if (canvas.width === 0 || canvas.height === 0) return
      paint(ctx, canvas.width, canvas.height, seconds)
    }
    const loop = (now) => {
      if (start === null) start = now
      render((now - start) / 1000)
      frame = requestAnimationFrame(loop)
    }

    const observer = new ResizeObserver(() => {
      resize()
      render(0.8)
    })
    observer.observe(canvas)
    resize()
    render(0.8)
    if (playing && !still) frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [kind, playing])

  return <canvas ref={canvasRef} aria-hidden="true" data-kind={kind} className={className} />
}

// The looping "brainrot" background behind a card: a real video clip if there is
// one for this kind, otherwise our drawn animation.
function MemeBackground({ kind, playing, className }) {
  const [, update] = useState(0)
  // Don't load a card's video until it has been on screen once (there are many cards).
  const [started, setStarted] = useState(false)
  if (playing && !started) setStarted(true)

  if (noVideo.has(kind)) return <CanvasBackground kind={kind} playing={playing} className={className} />
  if (!started) return <div aria-hidden="true" data-kind={kind} className={`${className} bg-black`} />
  return (
    <VideoBackground
      kind={kind}
      playing={playing}
      className={className}
      onMissing={() => {
        noVideo.add(kind)
        update((n) => n + 1)
      }}
    />
  )
}

export default MemeBackground
