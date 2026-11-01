// Satisfying slicing: a knife cuts slices off a layered kinetic-sand block,
// and each slice tips over. Worked out from the time `t`, so it loops forever.

const PERIOD = 1.4 // seconds per slice
const LAYERS = ['#f4a6b8', '#a8e0c8', '#c3b4f0', '#ffe08a', '#9fd3f5']

export function draw(ctx, w, h, t) {
  const phase = (t % PERIOD) / PERIOD
  const cut = Math.floor(t / PERIOD)

  // Table top.
  ctx.fillStyle = '#efe6dc'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#e2d6c8'
  ctx.fillRect(0, h * 0.72, w, h * 0.28)

  const blockW = Math.min(w * 0.56, h * 0.4)
  const blockH = Math.min(h * 0.32, w * 0.5)
  const left = (w - blockW) / 2 - w * 0.08
  const bottom = h * 0.72
  const sliceW = blockW * 0.12
  const layerH = blockH / LAYERS.length
  // Rotate the layer colours each cut so the block looks endless.
  const colour = (i) => LAYERS[(i + cut) % LAYERS.length]

  const drawBlock = (x, width) => {
    for (let i = 0; i < LAYERS.length; i++) {
      ctx.fillStyle = colour(i)
      ctx.fillRect(x, bottom - blockH + i * layerH, width, layerH + 1)
    }
  }

  // The main block (minus the slice being cut).
  drawBlock(left, blockW - sliceW)

  // The slice: stays put while cutting, then tips over to the right.
  const sliceX = left + blockW - sliceW
  ctx.save()
  if (phase > 0.55) {
    const tip = Math.min(1, (phase - 0.55) / 0.35)
    ctx.translate(sliceX + sliceW, bottom)
    ctx.rotate((tip * tip * Math.PI) / 2)
    ctx.translate(-(sliceX + sliceW), -bottom)
  }
  drawBlock(sliceX, sliceW)
  ctx.restore()

  // The previous slice lying flat on the table: its layers now run sideways.
  const pileX = sliceX + sliceW + 4
  for (let l = 0; l < LAYERS.length; l++) {
    ctx.fillStyle = LAYERS[(LAYERS.length - 1 - l + cut + LAYERS.length - 1) % LAYERS.length]
    ctx.fillRect(pileX + l * layerH, bottom - sliceW, layerH + 1, sliceW)
  }

  // The knife: comes down through the block, then lifts back up.
  const down = phase < 0.5 ? phase / 0.5 : 1 - (phase - 0.5) / 0.5
  const bladeTop = bottom - blockH - h * 0.18 + down * (blockH + h * 0.02)
  ctx.fillStyle = '#d9dde3'
  ctx.fillRect(sliceX - 3, bladeTop, 6, h * 0.2)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(sliceX - 3, bladeTop, 2, h * 0.2)
  ctx.fillStyle = '#3b3b3b'
  ctx.fillRect(sliceX - 6, bladeTop - h * 0.09, 12, h * 0.09)
}
