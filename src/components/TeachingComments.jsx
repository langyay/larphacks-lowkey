import { useState } from 'react'
import { ChevronDown, ChevronUp, Heart, Pin, ThumbsDown, ThumbsUp } from 'lucide-react'
import { formatCount, makeCommenter } from '@/lib/fakeChannel'

// One YouTube-style comment: avatar, @handle · time, text, likes, Reply,
// and optionally a pin label, the creator's heart and a reply thread.
export function CommentRow({
  author,
  text,
  likes = 0,
  isCreator = false,
  pinnedBy,
  heartedBy,
  replies = [],
  small = false,
}) {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const shownLikes = likes + (liked ? 1 : 0)

  return (
    <li className={`flex gap-3 ${small ? 'py-2' : 'px-4 py-2.5'}`}>
      <span
        aria-hidden="true"
        style={{ backgroundColor: author.tone.bg, color: author.tone.fg }}
        className={`flex shrink-0 items-center justify-center rounded-full font-medium ${
          small ? 'size-6 text-xs' : 'size-10 text-base'
        }`}
      >
        {author.initial}
      </span>
      <div className="min-w-0 flex-1">
        {pinnedBy && (
          <p className="mb-0.5 flex items-center gap-1 text-xs text-white/60">
            <Pin className="size-3" strokeWidth={2} />
            Pinned by @{pinnedBy}
          </p>
        )}
        <p className="text-[13px] leading-5 text-white/60">
          <span
            className={
              isCreator
                ? 'rounded-full bg-white/20 px-1.5 py-px font-medium text-white'
                : 'font-medium text-white'
            }
          >
            @{author.handle}
          </span>{' '}
          · {author.ago}
        </p>
        <p className="mt-0.5 text-sm leading-5 break-words whitespace-pre-wrap">
          {text}
        </p>
        <div className="mt-1 -ml-2 flex items-center gap-1 text-[13px] text-white/60">
          <button
            type="button"
            onClick={() => {
              setLiked((l) => !l)
              setDisliked(false)
            }}
            aria-pressed={liked}
            aria-label="Like this comment"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            <ThumbsUp
              className={`size-[18px] ${liked ? 'fill-white text-white' : ''}`}
              strokeWidth={1.75}
            />
          </button>
          <span className="min-w-4">{shownLikes > 0 ? formatCount(shownLikes) : ''}</span>
          <button
            type="button"
            onClick={() => {
              setDisliked((d) => !d)
              setLiked(false)
            }}
            aria-pressed={disliked}
            aria-label="Dislike this comment"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            <ThumbsDown
              className={`size-[18px] ${disliked ? 'fill-white text-white' : ''}`}
              strokeWidth={1.75}
            />
          </button>
          {heartedBy && (
            <span
              title={`Hearted by @${heartedBy.handle}`}
              className="relative ml-1 flex size-5 items-center justify-center"
            >
              <span
                aria-hidden="true"
                style={{ backgroundColor: heartedBy.tone.bg, color: heartedBy.tone.fg }}
                className="flex size-5 items-center justify-center rounded-full text-[10px] font-bold"
              >
                {heartedBy.initial}
              </span>
              <Heart className="absolute -right-1 -bottom-1 size-3 fill-primary text-primary" />
              <span className="sr-only">Hearted by the creator</span>
            </span>
          )}
          <span className="ml-2 px-2 font-medium text-white">Reply</span>
        </div>

        {replies.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setShowReplies((s) => !s)}
              aria-expanded={showReplies}
              className="-ml-2 flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-2 text-sm font-medium text-[#3ea6ff] outline-none hover:bg-[#3ea6ff]/15 focus-visible:ring-2 focus-visible:ring-white"
            >
              {showReplies ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
            {showReplies && (
              <ul>
                {replies.map((r, i) => (
                  <CommentRow key={i} {...r} small />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </li>
  )
}

// The comments that teach one card: the creator's pinned explanation, your own
// comments, three viewer comments and a question answered by the creator.
// Names, times and likes come from the card's seed, so they stay the same.
function TeachingComments({ card, channel, seed, ownComments }) {
  const creator = { ...channel, ago: '1w ago' }
  // Comment likes are a small share (0.1–4%) of the Short's likes, like real YouTube.
  const people = [0, 1, 2, 3].map((i) => {
    const person = makeCommenter(`${seed}-c${i}`)
    const share = ((person.likes % 40) + 1) / 1000
    return { ...person, likes: Math.max(1, Math.round(channel.likes * share)) }
  })
  // Cards from the note splitter (or an incomplete AI reply) have no viewer comments.
  const hasTeaching = Boolean(card.comments?.length && card.ask)

  return (
    <ul className="py-1">
      <CommentRow
        author={creator}
        isCreator
        pinnedBy={channel.handle}
        text={card.pinned ?? `Answer: ${card.answer}`}
        likes={Math.round(channel.likes * 0.04)}
      />
      {ownComments.map((c) => (
        <CommentRow key={c.id} author={c.author} text={c.text} />
      ))}
      {hasTeaching && (
        <>
          {card.comments.map((text, i) => (
            <CommentRow
              key={i}
              author={people[i]}
              text={text}
              likes={people[i].likes}
              heartedBy={i === 0 ? channel : undefined}
            />
          ))}
          <CommentRow
            author={people[3]}
            text={card.ask.q}
            likes={people[3].likes}
            heartedBy={channel}
            replies={[
              {
                author: { ...channel, ago: people[3].ago },
                isCreator: true,
                text: card.ask.a,
                likes: Math.round(people[3].likes / 2),
              },
            ]}
          />
        </>
      )}
      {!hasTeaching && ownComments.length === 0 && (
        <li className="px-4 py-6 text-center text-sm text-white/60">
          No one else has explained this card yet. Be the first to comment.
        </li>
      )}
    </ul>
  )
}

export default TeachingComments
