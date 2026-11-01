// Hand-written cards so the feed works before the AI step exists.
export const sampleDeck = {
  topic: "Le Chatelier's principle",
  cards: [
    {
      question: 'What is dynamic equilibrium?',
      answer:
        'The forward and reverse reactions happen at the same rate, so concentrations stay constant.',
    },
    {
      question: "What does Le Chatelier's principle say?",
      answer:
        'If a system at equilibrium is disturbed, it shifts to partly undo the change.',
    },
    {
      question: 'You add more reactant. Which way does equilibrium shift?',
      answer: 'Right, towards the products, to use up the extra reactant.',
    },
    {
      question: 'You remove product as it forms. What happens?',
      answer: 'Equilibrium shifts right, making more product.',
    },
    {
      question:
        'You raise the pressure on N₂ + 3H₂ ⇌ 2NH₃. Which side is favoured?',
      answer:
        'The right. It has fewer gas molecules (2 vs 4), so it lowers the pressure.',
    },
    {
      question: 'You heat an exothermic reaction. Which way does it shift?',
      answer:
        'Left. Treat heat as a product: adding heat pushes the reaction backwards.',
    },
    {
      question: 'Does a catalyst change the position of equilibrium?',
      answer:
        'No. It speeds up both directions equally, so equilibrium is reached faster but sits in the same place.',
    },
    {
      question: 'What does a large K value tell you?',
      answer: 'At equilibrium there are far more products than reactants.',
    },
  ],
}
