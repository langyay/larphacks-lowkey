import { useEffect, useRef } from 'react'
import { draw as marbles } from '@/lib/backgrounds/marbles'
import { draw as parkour } from '@/lib/backgrounds/parkour'
import { draw as runner } from '@/lib/backgrounds/runner'
import { draw as slice } from '@/lib/backgrounds/slice'

const drawings = { runner, parkour, slice, marbles }

// One of our looping "brainrot" background animations, drawn on a canvas.
// It only animates while `playing` (the card is on screen); otherwise, or when
// the person has "reduce motion" on, it shows a still frame.
function MemeBackground({ kind, playing, className }) {
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

export default MemeBackground
