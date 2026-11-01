import ReelCard from '@/components/ReelCard'

// The scrolling column. CSS scroll-snap makes each swipe land on exactly one card.
function Feed({ deck }) {
  return (
    <div className="mx-auto h-dvh max-w-[480px] snap-y snap-mandatory overflow-y-scroll border-x border-border">
      {deck.cards.map((card, i) => (
        <ReelCard
          key={i}
          card={card}
          topic={deck.topic}
          index={i}
          total={deck.cards.length}
        />
      ))}
    </div>
  )
}

export default Feed
