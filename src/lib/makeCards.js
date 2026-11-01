// The note splitter: turns study notes into flashcards with simple rules, no AI.
// Used for "Make my feed" now, and later as the backup if Gemini fails.
//   "Catalyst: speeds up..."   -> "What is catalyst?"      / "Speeds up..."
//   "Kc = products/reactants"  -> "Kc = ?"                 / "Products/reactants"
//   "pressure up -> fewer..."  -> "Pressure up → ?"        / "Fewer..."
//   "Enzymes are proteins..."  -> "What are enzymes?"      / "Proteins..."

const MAX_CARDS = 20

const capitalise = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function lineToCard(rawLine) {
  // Drop bullets and numbering at the start: "-", "*", "•", "1.", "2)".
  const line = rawLine.replace(/^\s*([-*•●▪◦]|\d+[.)])\s*/, '').trim()
  if (line.length < 5) return null

  const arrow = line.match(/^(.{2,60}?)\s*(?:->|→|=>)\s*(.{2,})$/)
  if (arrow) {
    return { question: `${capitalise(arrow[1])} → ?`, answer: capitalise(arrow[2]) }
  }

  const equals = line.match(/^(.{1,60}?)\s*=\s*(.{2,})$/)
  if (equals) {
    return { question: `${capitalise(equals[1])} = ?`, answer: capitalise(equals[2]) }
  }

  const definition = line.match(/^(.{2,60}?)\s*(?::|\s[-–—]\s)\s*(.{3,})$/)
  if (definition) {
    const term = definition[1]
    const question = term.endsWith('?') ? capitalise(term) : `What is ${term}?`
    return { question, answer: capitalise(definition[2]) }
  }

  const sentence = line.match(/^(.{2,60}?)\s+(is|are|means|refers to)\s+(.{3,})$/i)
  if (sentence) {
    const [, subject, verb, rest] = sentence
    const question =
      verb.toLowerCase() === 'means' || verb.toLowerCase() === 'refers to'
        ? `What does ${subject} mean?`
        : `What ${verb.toLowerCase()} ${subject}?`
    return { question: capitalise(question), answer: capitalise(rest) }
  }

  return null
}

export function makeCards(notes) {
  const seen = new Set()
  const cards = []
  for (const line of notes.split(/\r?\n/)) {
    const card = lineToCard(line)
    if (!card || seen.has(card.question)) continue
    seen.add(card.question)
    cards.push(card)
    if (cards.length === MAX_CARDS) break
  }
  return cards
}

// A short topic name for a notes deck: the first line if it reads like a title.
export function guessTopic(notes) {
  const first = notes.trim().split(/\r?\n/)[0]?.trim() ?? ''
  if (first && first.length <= 50 && !/[:=]|->|→/.test(first)) return first
  return 'My notes'
}
