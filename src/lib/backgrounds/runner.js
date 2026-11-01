// Endless runner: a runner dodging trains on three train-track lanes at sunset.
// Everything is worked out from the time `t` (seconds), so it loops forever.

const SPEED = 9 // track units per second
const FAR = 60 // furthest distance drawn

export function draw(ctx, w, h, t) {
  const horizon = h * 0.34
  const cx = w / 2
  const laneW = w * 0.34

  // Distance d (0 = at the camera) -> screen position and scale.
  const scale = (d) => 1 / (1 + d * 0.16)
  const y = (d) => horizon + (h - horizon) * scale(d)
  const x = (lane, d) => cx + lane * laneW * scale(d)

  // Sunset sky and a city skyline.
  ctx.fillStyle = '#f08a4b'
  ctx.fillRect(0, 0, w, horizon)
  ctx.fillStyle = '#f6b35c'
  ctx.fillRect(0, horizon * 0.55, w, horizon * 0.45)
  ctx.fillStyle = '#ffe2a0'
  ctx.beginPath()
  ctx.arc(cx, horizon * 0.78, w * 0.09, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#5a3b4a'
  for (let i = 0; i < 14; i++) {
    const bw = w / 14
    const bh = horizon * (0.18 + ((i * 37) % 11) / 30)
    ctx.fillRect(i * bw, horizon - bh, bw - 2, bh)
  }

  // Gravel bed.
  ctx.fillStyle = '#7d726b'
  ctx.beginPath()
  ctx.moveTo(x(-1.8, FAR), horizon)
  ctx.lineTo(x(1.8, FAR), horizon)
  ctx.lineTo(x(1.8, 0), h)
  ctx.lineTo(x(-1.8, 0), h)
  ctx.fill()

  // Sleepers, scrolling towards the camera.
  ctx.fillStyle = '#5b4236'
  const gap = 2
  const offset = (t * SPEED) % gap
  for (let d = gap - offset; d < FAR; d += gap) {
    const s = scale(d)
    for (const lane of [-1, 0, 1]) {
      const half = laneW * 0.42 * s
      ctx.fillRect(x(lane, d) - half, y(d), half * 2, Math.max(1, 10 * s))
    }
  }

  // Rails.
  ctx.strokeStyle = '#c9c4bf'
  ctx.lineWidth = 2
  for (const lane of [-1, 0, 1]) {
    for (const side of [-0.3, 0.3]) {
      ctx.beginPath()
      ctx.moveTo(x(lane + side, FAR), y(FAR))
      ctx.lineTo(x(lane + side, 0), h)
      ctx.stroke()
    }
  }

  // Trains and coins come towards the camera, far ones first so near ones overlap.
  const things = []
  for (let i = 0; i < 6; i++) {
    const lane = (i % 3) - 1
    const d = (i * 11 + 7 - t * SPEED) % 66
    things.push({ kind: 'train', lane, d: d < 0 ? d + 66 : d, color: ['#d6453d', '#2f6db5', '#e3b23c'][i % 3] })
  }
  for (let i = 0; i < 8; i++) {
    const d = (i * 3.5 + 2 - t * SPEED) % 28
    things.push({ kind: 'coin', lane: [0, 1, -1, 0][Math.floor(i / 2) % 4], d: d < 0 ? d + 28 : d })
  }
  things.sort((a, b) => b.d - a.d)
  for (const thing of things) {
    if (thing.d > FAR || thing.d < 0.6) continue
    const s = scale(thing.d)
    const px = x(thing.lane, thing.d)
    const py = y(thing.d)
    if (thing.kind === 'train') {
      const tw = laneW * 0.78 * s
      const th = h * 0.42 * s
      ctx.fillStyle = thing.color
      ctx.fillRect(px - tw / 2, py - th, tw, th)
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.fillRect(px - tw * 0.36, py - th * 0.82, tw * 0.72, th * 0.28)
      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      ctx.fillRect(px - tw / 2, py - th * 0.12, tw, th * 0.12)
    } else {
      const r = w * 0.035 * s
      ctx.fillStyle = '#ffd23f'
      ctx.beginPath()
      ctx.ellipse(px, py - r * 3, r * Math.abs(Math.cos(t * 6 + thing.d)) + 1, r, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // The runner: switches lanes every couple of seconds, bobbing as they run.
  const step = Math.floor(t / 1.8)
  const lanes = [0, 1, 0, -1, 0, -1, 1]
  const from = lanes[step % lanes.length]
  const to = lanes[(step + 1) % lanes.length]
  const blend = Math.min(1, ((t % 1.8) / 1.8) * 5)
  const lane = from + (to - from) * blend
  const d = 1.4
  const s = scale(d)
  const px = x(lane, d)
  const bob = Math.abs(Math.sin(t * 10)) * h * 0.012
  const py = y(d) - bob
  const size = h * 0.16 * s * 1.6
  const leg = Math.sin(t * 20) * size * 0.12
  ctx.fillStyle = '#1f2a44'
  ctx.fillRect(px - size * 0.14 + leg, py - size * 0.35, size * 0.1, size * 0.35)
  ctx.fillRect(px + size * 0.04 - leg, py - size * 0.35, size * 0.1, size * 0.35)
  ctx.fillStyle = '#e9573f'
  ctx.fillRect(px - size * 0.2, py - size * 0.78, size * 0.4, size * 0.45)
  ctx.fillStyle = '#f2c79b'
  ctx.beginPath()
  ctx.arc(px, py - size * 0.9, size * 0.13, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#2b2b2b'
  ctx.fillRect(px - size * 0.15, py - size * 1.04, size * 0.3, size * 0.08)
}
