// Block parkour: a blocky character hopping across grass blocks over lava,
// scrolling sideways. Worked out from the time `t`, so it loops forever.

const SPEED = 2.2 // blocks per second

// Repeatable "random" number for a column, so the level is the same every loop.
const hash = (n) => {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}

// Height of the ground in a column (in blocks), or 0 for a gap over lava.
function groundAt(col) {
  if (col % 7 === 5) return 0
  return 2 + Math.floor(hash(Math.floor(col / 3)) * 3)
}

export function draw(ctx, w, h, t) {
  // Sized by the smaller side, so blocks look right in any shape of area.
  const block = Math.min(w / 7, h / 7)
  const columns = Math.ceil(w / block) + 2
  const scroll = t * SPEED
  const first = Math.floor(scroll)
  const shift = (scroll - first) * block
  const floor = h * 0.86

  // Sky and blocky clouds.
  ctx.fillStyle = '#86c5f2'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#ffffff'
  for (let i = 0; i < 4; i++) {
    const cx = ((i * 0.31 - t * 0.03) % 1.2 + 1.2) % 1.2 * w * 1.2 - w * 0.1
    ctx.fillRect(cx, h * (0.1 + i * 0.07), block * 1.6, block * 0.4)
    ctx.fillRect(cx + block * 0.3, h * (0.1 + i * 0.07) - block * 0.25, block * 0.9, block * 0.3)
  }

  // Lava along the bottom, with bubbling highlights.
  ctx.fillStyle = '#e8501f'
  ctx.fillRect(0, floor, w, h - floor)
  ctx.fillStyle = '#ffb02e'
  for (let i = 0; i < 10; i++) {
    const lx = ((i * 0.13 + t * 0.05) % 1) * w
    ctx.fillRect(lx, floor + block * 0.2 + Math.sin(t * 3 + i) * 4, block * 0.3, block * 0.1)
  }

  // Columns of dirt with a grass top.
  for (let i = -1; i < columns; i++) {
    const col = first + i
    const height = groundAt(col)
    if (!height) continue
    const left = i * block - shift
    const top = floor - height * block
    ctx.fillStyle = '#8a5a34'
    ctx.fillRect(left, top, block + 1, floor - top + 1)
    ctx.fillStyle = '#6f4527'
    for (let r = 1; r < height; r++) ctx.fillRect(left, top + r * block, block + 1, 2)
    ctx.fillStyle = '#5fb43c'
    ctx.fillRect(left, top, block + 1, block * 0.28)
    ctx.fillStyle = '#4a9a2e'
    ctx.fillRect(left, top + block * 0.22, block + 1, block * 0.06)
  }

  // The player is always over column 2 on screen. They hop each block, and
  // jump higher over a gap, landing on the next column.
  const px = block * 2
  const under = first + 2
  const overGap = groundAt(under) === 0
  const ground = overGap ? Math.max(groundAt(under - 1), groundAt(under + 1)) : groundAt(under)
  const hop = Math.sin((scroll % 1) * Math.PI) * block * (overGap ? 1.8 : 0.6)
  const py = floor - ground * block - hop
  const size = block * 0.8
  ctx.fillStyle = '#3a7bd5'
  ctx.fillRect(px - size / 2, py - size * 1.5, size, size * 0.9)
  ctx.fillStyle = '#e8b98d'
  ctx.fillRect(px - size * 0.4, py - size * 2.2, size * 0.8, size * 0.7)
  ctx.fillStyle = '#2b2b2b'
  ctx.fillRect(px + size * 0.05, py - size * 1.95, size * 0.15, size * 0.15)
  ctx.fillStyle = '#2f3b66'
  ctx.fillRect(px - size * 0.4, py - size * 0.6, size * 0.35, size * 0.6)
  ctx.fillRect(px + size * 0.05, py - size * 0.6, size * 0.35, size * 0.6)
}
