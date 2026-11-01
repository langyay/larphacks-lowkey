// Marble drop: colourful marbles fall and bounce down through a grid of pegs.
// Worked out from the time `t`, so it loops forever.

const COLOURS = ['#ff5d5d', '#ffb340', '#ffe14d', '#5ee07a', '#4dc3ff', '#ff7ad9']
const FALL = 3.2 // seconds for a marble to reach the bottom
const EVERY = 0.22 // seconds between marbles

export function draw(ctx, w, h, t) {
  ctx.fillStyle = '#1c1a20'
  ctx.fillRect(0, 0, w, h)

  // Pegs.
  const rows = 11
  const cols = 7
  const gapX = w / cols
  const gapY = (h * 0.7) / rows
  ctx.fillStyle = '#4a4752'
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const px = c * gapX + (r % 2 ? gapX / 2 : 0)
      ctx.beginPath()
      ctx.arc(px, h * 0.15 + r * gapY, w * 0.012, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Bins at the bottom.
  ctx.fillStyle = '#2c2a33'
  ctx.fillRect(0, h * 0.9, w, h * 0.1)
  ctx.fillStyle = '#4a4752'
  for (let c = 0; c <= cols; c++) ctx.fillRect(c * gapX - 2, h * 0.86, 4, h * 0.14)

  // Each marble: falls with gravity, zig-zagging half a peg left or right at
  // every row (the direction comes from its number, so it's the same each loop).
  const count = Math.ceil(FALL / EVERY) + 1
  const newest = Math.floor(t / EVERY)
  const r = w * 0.03
  for (let k = 0; k < count; k++) {
    const id = newest - k
    const age = t - id * EVERY
    if (age < 0 || age > FALL) continue
    const progress = age / FALL
    const yPos = h * 0.08 + progress * progress * h * 0.8
    const row = Math.min(rows, Math.floor(((yPos - h * 0.15) / gapY) + 1))
    let xPos = w / 2 + (((id * 7919) % 5) - 2) * gapX * 0.15
    for (let i = 0; i < row; i++) {
      xPos += (Math.sin(id * 12.9898 + i * 78.233) > 0 ? 1 : -1) * gapX * 0.5
    }
    xPos = ((xPos % w) + w) % w
    const bounce = Math.abs(Math.sin(progress * rows * Math.PI)) * gapY * 0.25
    ctx.fillStyle = COLOURS[((id % COLOURS.length) + COLOURS.length) % COLOURS.length]
    ctx.beginPath()
    ctx.arc(xPos, Math.min(yPos - bounce, h * 0.88), r, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.beginPath()
    ctx.arc(xPos - r * 0.3, Math.min(yPos - bounce, h * 0.88) - r * 0.3, r * 0.3, 0, Math.PI * 2)
    ctx.fill()
  }
}
