// One full-screen "reel": the topic up top, the question as a big caption.
function ReelCard({ card, topic, index, total }) {
  return (
    <section className="relative flex h-dvh snap-start snap-always flex-col justify-between bg-reel px-6 pt-10 pb-12 text-reel-foreground">
      <p className="text-sm font-semibold tracking-wide text-primary uppercase">
        {topic}
      </p>

      <h2 className="text-3xl leading-tight font-bold sm:text-4xl">
        {card.question}
      </h2>

      <p className="text-base text-reel-muted">
        Card {index + 1} of {total}
      </p>
    </section>
  )
}

export default ReelCard
