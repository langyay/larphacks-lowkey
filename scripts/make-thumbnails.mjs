// One-off: asks Gemini's image model for a thumbnail picture for each ready-made
// topic and saves them to public/thumbs/. Run it yourself when you want new ones:
//
//   node --env-file=.env scripts/make-thumbnails.mjs            (all topics)
//   node --env-file=.env scripts/make-thumbnails.mjs chem un    (just these)
//
// The app only uses the saved pictures; it never calls the image model.

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error('GEMINI_API_KEY is missing. Run with: node --env-file=.env scripts/make-thumbnails.mjs')
  process.exit(1)
}

const LOOK =
  'Bold flat vector illustration, rich saturated colours on a dark moody background, simple shapes, ' +
  'wide 16:9 composition, no text, no letters, no numbers, no logos, no watermark.'

const topics = {
  econ: 'a supply and demand graph with two crossing curves, coins and a small factory on a grid, economics',
  chem: 'two glass beakers of bright liquid balanced on a seesaw scale, a chemistry equilibrium idea',
  wwi: 'a stylised map of Europe in 1914 with colourful alliance ropes tangled between the countries, no people',
  french: 'the Eiffel Tower, a croissant and a cafe cup with empty speech bubbles over a Paris skyline',
  sat: 'a tall stack of books with a pencil and a glowing lightbulb, studying vocabulary',
  cyber: 'a glowing padlock inside a shield on a circuit board, cybersecurity',
  deriv: 'a smooth curve on a grid with a tangent line touching it at one point, calculus',
  trig: 'a triangle with coloured angle arcs, a compass and a protractor on a grid',
  un: 'a blue globe surrounded by olive branches and many small round flags, international peace',
}

const wanted = process.argv.slice(2)
const ids = wanted.length ? wanted : Object.keys(topics)
const api = 'https://generativelanguage.googleapis.com/v1beta'

// Find the image-capable models this key can use, newest names first.
async function imageModels() {
  const res = await fetch(`${api}/models?pageSize=200`, { headers: { 'x-goog-api-key': KEY } })
  const body = await res.json()
  if (!res.ok) throw new Error(`Could not list models: ${body?.error?.message ?? res.status}`)
  return (body.models ?? [])
    .filter(
      (m) =>
        /image/i.test(m.name) &&
        !/imagen/i.test(m.name) &&
        (m.supportedGenerationMethods ?? []).includes('generateContent'),
    )
    .map((m) => m.name.replace(/^models\//, ''))
    .sort()
    .reverse()
}

const models = await imageModels()
if (models.length === 0) {
  console.error('This key has no Gemini image model available.')
  process.exit(1)
}
console.log('Image models to try:', models.join(', '))

const outDir = path.resolve(import.meta.dirname, '..', 'public', 'thumbs')
await mkdir(outDir, { recursive: true })

for (const id of ids) {
  if (!topics[id]) {
    console.warn(`Unknown topic "${id}", skipping.`)
    continue
  }
  let saved = false
  for (const model of models) {
    const res = await fetch(`${api}/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${topics[id]}. ${LOOK}` }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
      }),
    })
    const body = await res.json().catch(() => ({}))
    const part = body?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)
    if (!res.ok || !part) {
      console.warn(`  ${id}: ${model} failed (${res.status} ${body?.error?.message ?? 'no image returned'})`)
      continue
    }
    const ext = part.inlineData.mimeType === 'image/jpeg' ? 'jpg' : 'png'
    await writeFile(path.join(outDir, `${id}.${ext}`), Buffer.from(part.inlineData.data, 'base64'))
    console.log(`${id}: saved ${id}.${ext} (${model})`)
    saved = true
    break
  }
  if (!saved) console.error(`${id}: no model could make this one.`)
}
