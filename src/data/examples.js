// The three spec examples as ready-made decks. Each card carries the comments
// that teach it: a pinned explanation from the creator, three viewer comments
// (a simpler version, a memory trick, a mistake or real-life example) and a
// question with the creator's reply.

const chemistry = {
  id: 'chem',
  label: 'Chem: equilibrium',
  topic: "Le Chatelier's principle",
  keywords: ['chem', 'equilibrium', 'chatelier', 'le chat'],
  cards: [
    {
      question: 'What is dynamic equilibrium?',
      answer:
        'The forward and reverse reactions happen at the same rate, so concentrations stay constant.',
      pinned:
        "At equilibrium the reaction hasn't stopped. Reactants still turn into products and products turn back, at exactly the same speed, so the amounts stop changing.",
      comments: [
        'Think of walking down an up-escalator at the same speed it moves. Loads of movement, but you stay in the same spot.',
        "'Dynamic' = still moving. 'Equilibrium' = balanced. Moving but balanced.",
        'I used to think equal rates meant equal amounts of reactants and products. Nope, the amounts can be totally different, they just stop changing.',
      ],
      ask: {
        q: 'So does it only work in a closed container?',
        a: 'Yes! If something can escape, like gas out of an open beaker, it can never balance.',
      },
    },
    {
      question: "What does Le Chatelier's principle say?",
      answer:
        'If a system at equilibrium is disturbed, it shifts to partly undo the change.',
      pinned:
        'Disturb a system at equilibrium (change concentration, pressure or temperature) and it shifts in whichever direction partly cancels out that change.',
      comments: [
        "It's basically the reaction being petty. Whatever you do to it, it does the opposite.",
        "Le Chatelier = 'Leave me alone'. Push it and it pushes back.",
        "Same idea as your body sweating when you're hot. It works to undo the change.",
      ],
      ask: {
        q: 'Does it undo the change completely?',
        a: 'Only partly. The new equilibrium still feels some of the change.',
      },
    },
    {
      question: 'You add more reactant. Which way does equilibrium shift?',
      answer: 'Right, towards the products, to use up the extra reactant.',
      pinned:
        'Extra reactant is a disturbance, so the system uses it up by making more product. The equilibrium moves to the right.',
      comments: [
        'Too much on the left side? The reaction moves stuff to the right side to even it out.',
        'Add to a side → shift away from it. Remove from a side → shift towards it.',
        "Don't say K changes here! Only temperature changes K. Concentration just moves the position.",
      ],
      ask: {
        q: 'What if you add product instead?',
        a: 'Then it shifts left, back towards the reactants.',
      },
    },
    {
      question: 'You remove product as it forms. What happens?',
      answer: 'Equilibrium shifts right, making more product.',
      pinned:
        'Taking product away lowers its concentration, so the system makes more to replace it. The equilibrium shifts right.',
      comments: [
        'Like a shop restocking the shelf every time you buy the last one.',
        'Remove it → it makes more of it.',
        'This is how the Haber process gets more ammonia. They cool the mix so the ammonia turns liquid and they take it out.',
      ],
      ask: {
        q: 'Why would a factory want that?',
        a: 'Because the reaction never settles, so you keep getting more product out.',
      },
    },
    {
      question:
        'You raise the pressure on N₂ + 3H₂ ⇌ 2NH₃. Which side is favoured?',
      answer:
        'The right. It has fewer gas molecules (2 vs 4), so it lowers the pressure.',
      pinned:
        'Raising pressure favours the side with fewer gas molecules. The right has 2 and the left has 4, so the equilibrium shifts right and makes more NH₃.',
      comments: [
        'More pressure = more crowded. The reaction moves to the side that takes up less room.',
        'Pressure up → fewer moles. Pressure down → more moles.',
        'Only count GAS molecules, and use the big numbers in front (the coefficients), not the little ones.',
      ],
      ask: {
        q: 'What if both sides have the same number of gas molecules?',
        a: "Then pressure doesn't change the position at all.",
      },
    },
    {
      question: 'You heat an exothermic reaction. Which way does it shift?',
      answer:
        'Left. Treat heat as a product: adding heat pushes the reaction backwards.',
      pinned:
        'An exothermic reaction gives out heat, so heat counts as a product. Adding heat is like adding product, so the equilibrium shifts left.',
      comments: [
        "Exothermic reactions make heat. You're adding more of what they make, so they go backwards.",
        'Write "heat" into the equation as a word, then treat it like any other chemical.',
        'Temperature is the ONLY change that changes the value of K. For exothermic reactions, hotter = smaller K.',
      ],
      ask: {
        q: "So for endothermic it's the opposite?",
        a: 'Yes. Heat is a reactant there, so heating shifts it right.',
      },
    },
    {
      question: 'Does a catalyst change the position of equilibrium?',
      answer:
        'No. It speeds up both directions equally, so equilibrium is reached faster but sits in the same place.',
      pinned:
        "A catalyst speeds up the forward and reverse reactions by the same amount. You reach equilibrium sooner, but the amounts at equilibrium don't change.",
      comments: [
        "It's a shortcut in both directions. You end up in the same place, just faster.",
        "Catalyst = Can't move it, just speeds it.",
        'Factories still use catalysts for exactly this. Time is money even if the yield is the same.',
      ],
      ask: {
        q: 'Then why does the Haber process use an iron catalyst?',
        a: 'To reach equilibrium quickly at a lower temperature, which saves money.',
      },
    },
    {
      question: 'What does a large K value tell you?',
      answer: 'At equilibrium there are far more products than reactants.',
      pinned:
        "K compares products to reactants at equilibrium. A big K (like 10⁵) means the mixture is mostly products, so the reaction 'goes nearly to completion'.",
      comments: [
        'K is a scoreboard: products on top, reactants on the bottom. Big number = products winning.',
        'K big → products. K tiny → reactants. K near 1 → roughly even.',
        'A big K says nothing about speed. A reaction can have a huge K and still be super slow.',
      ],
      ask: {
        q: 'Does adding a catalyst change K?',
        a: 'No. Only temperature changes K.',
      },
    },
  ],
}

const history = {
  id: 'wwi',
  label: 'WWI causes',
  topic: 'Causes of World War I',
  keywords: ['ww1', 'wwi', 'world war 1', 'world war i', 'first world war', 'great war'],
  cards: [
    {
      question: 'What does the acronym MAIN stand for?',
      answer:
        'Militarism, Alliances, Imperialism, Nationalism: the four long-term causes of WWI.',
      pinned:
        'Historians group the long-term causes of WWI as MAIN. They built up tension for decades, then the assassination in 1914 set it all off.',
      comments: [
        'MAIN is the dry wood, the assassination is the match.',
        "MAIN causes = MAIN acronym. That's literally how I remember it.",
        "The assassination isn't one of the MAIN causes. It's the short-term trigger.",
      ],
      ask: {
        q: 'Which one matters most?',
        a: "Historians argue about it! Pick one and back it up with evidence. That's what examiners want.",
      },
    },
    {
      question: 'Who was assassinated in Sarajevo in June 1914?',
      answer:
        'Archduke Franz Ferdinand, heir to the Austro-Hungarian throne.',
      pinned:
        'On 28 June 1914, Gavrilo Princip, a Bosnian Serb nationalist, shot Franz Ferdinand and his wife Sophie. Austria-Hungary blamed Serbia.',
      comments: [
        'The future emperor of Austria-Hungary got shot, and his country blamed Serbia.',
        'Franz Ferdinand: Fired at, Fatal, in Sarajevo.',
        'His driver took a wrong turn and stopped right next to Princip. One wrong turn started a world war.',
      ],
      ask: {
        q: 'Was Princip working alone?',
        a: 'No. He was part of a group linked to the Black Hand, a secret Serbian nationalist society.',
      },
    },
    {
      question: 'What were the two main alliances in 1914?',
      answer:
        'The Triple Entente (Britain, France, Russia) and the Triple Alliance (Germany, Austria-Hungary, Italy).',
      pinned:
        'The alliances meant a local quarrel could pull in every great power: Russia backed Serbia, Germany backed Austria-Hungary, and France and Britain were linked to Russia.',
      comments: [
        'Like a group chat where if you fight one person, their whole friend group joins in.',
        'Entente = the west + Russia. Alliance = Germany + Austria + (sort of) Italy.',
        "Italy didn't actually fight with Germany. It switched and joined the Allies in 1915.",
      ],
      ask: {
        q: 'Why did Britain join?',
        a: 'Germany invaded Belgium, and Britain had promised to protect it (Treaty of London, 1839).',
      },
    },
    {
      question: 'What is militarism?',
      answer:
        'Building up big armies and navies and seeing military power as the way to solve problems.',
      pinned:
        'Before 1914 the great powers raced to build up their militaries and made detailed war plans. Being armed and ready made war easier to start.',
      comments: [
        "Everyone was buying weapons 'just in case', which made everyone else nervous.",
        'Militarism = military + -ism = believing in the military.',
        'The Anglo-German naval race: Britain and Germany competed to build Dreadnought battleships.',
      ],
      ask: {
        q: 'What was the Schlieffen Plan?',
        a: "Germany's plan to beat France fast through Belgium, then turn to Russia. It's why Britain got pulled in.",
      },
    },
    {
      question: 'How did imperialism cause tension?',
      answer:
        'The powers competed for colonies and empire, especially in Africa, which created rivalry and crises.',
      pinned:
        "Germany wanted 'a place in the sun' like Britain and France had. Clashes over colonies, like the Moroccan Crises, turned rivals into enemies.",
      comments: [
        'Everyone wanted the biggest empire, so they kept clashing over land.',
        'Imperialism = empire. Bigger empire, bigger ego.',
        'The Moroccan Crises (1905 and 1911): Germany challenged France over Morocco and ended up pushing Britain and France closer.',
      ],
      ask: {
        q: 'Was Germany late to the empire game?',
        a: 'Yes. It only unified in 1871, so most colonies were already taken.',
      },
    },
    {
      question: 'How did nationalism contribute to WWI?',
      answer:
        'Intense pride in your nation, plus groups like the Slavs wanting their own country, fuelled rivalries and unrest.',
      pinned:
        "Nationalism worked two ways: the great powers felt superior and wouldn't back down, and Slavic groups inside Austria-Hungary wanted independence, backed by Serbia.",
      comments: [
        'Countries were too proud to back down, and some groups wanted their own country.',
        'Nationalism = nation first, no matter what.',
        'Princip himself was a nationalist. He wanted Bosnia free from Austria-Hungary.',
      ],
      ask: {
        q: 'What was Pan-Slavism?',
        a: 'The idea that all Slavic peoples should unite. Russia supported it, which set it against Austria-Hungary.',
      },
    },
    {
      question: "What was the 'blank cheque'?",
      answer:
        "Germany's promise in July 1914 to fully back Austria-Hungary in whatever it did against Serbia.",
      pinned:
        "With Germany's unconditional support, Austria-Hungary sent Serbia a harsh ultimatum and then declared war on 28 July 1914.",
      comments: [
        "Germany basically said 'do whatever you want, we've got your back.'",
        'Blank cheque = no limit written on it.',
        "It wasn't actual money! It's a metaphor for unlimited support.",
      ],
      ask: {
        q: 'Did Serbia accept the ultimatum?',
        a: 'Almost all of it, but not every point. Austria-Hungary declared war anyway.',
      },
    },
    {
      question: "Why was the Balkans called the 'powder keg of Europe'?",
      answer:
        'It was full of competing nationalist groups and great-power rivalries, so one spark could set off a huge war.',
      pinned:
        'The Ottoman Empire was collapsing, Austria-Hungary and Russia both wanted influence there, and the Balkan Wars of 1912–13 made it even more unstable.',
      comments: [
        'A powder keg is a barrel of gunpowder. One spark and boom.',
        'Balkans = Barrel of gunpowder.',
        'Austria-Hungary taking over Bosnia in 1908 made Serbia and Russia furious. That was part of the build-up to 1914.',
      ],
      ask: {
        q: 'Which empire was falling apart?',
        a: 'The Ottoman Empire. That left a power vacuum everyone wanted to fill.',
      },
    },
  ],
}

const french = {
  id: 'french',
  label: 'French: passé composé',
  topic: 'Passé composé vs imparfait',
  keywords: ['french', 'passé composé', 'passe compose', 'imparfait'],
  cards: [
    {
      question: 'When do you use the passé composé?',
      answer:
        "For completed actions at a specific moment in the past: 'J'ai mangé une pomme.'",
      pinned:
        'The passé composé tells you what happened: the events of the story. Each action has a clear start and finish.',
      comments: [
        'If you could take a photo of the moment it happened, use passé composé.',
        'Passé Composé = Point in time, Completed.',
        "Don't forget the helper verb! 'J'ai mangé', not just 'je mangé'.",
      ],
      ask: {
        q: 'Is it like the English simple past?',
        a: "Mostly. 'I ate' = j'ai mangé. But English 'I ate' can sometimes be imparfait too, if it was a habit.",
      },
    },
    {
      question: 'When do you use the imparfait?',
      answer:
        "For background, descriptions and habits in the past: 'Il faisait beau.' / 'Je jouais au foot le samedi.'",
      pinned:
        'The imparfait sets the scene: weather, feelings, age, time, ongoing actions and things you used to do.',
      comments: [
        'Imparfait = the background of the movie. Passé composé = the plot.',
        "Imparfait = 'used to' or 'was …ing'.",
        'Quand j\'étais petit, je regardais des dessins animés = when I was little, I used to watch cartoons.',
      ],
      ask: {
        q: 'Is age always imparfait?',
        a: "Yes, when you're describing age: 'J'avais dix ans' (I was ten).",
      },
    },
    {
      question: "Translate: 'I was reading when the phone rang.'",
      answer: 'Je lisais quand le téléphone a sonné.',
      pinned:
        'The ongoing action (reading) is imparfait. The action that interrupts it (the phone ringing) is passé composé.',
      comments: [
        'Long background action = imparfait. Quick interruption = passé composé.',
        'Was …ing WHEN … → imparfait QUAND passé composé.',
        'Loads of people put both in passé composé. Only the ringing interrupts, so only that one is passé composé.',
      ],
      ask: {
        q: 'What if both actions were ongoing?',
        a: "Both imparfait: 'Je lisais pendant qu'il cuisinait.'",
      },
    },
    {
      question: 'How do you form the imparfait?',
      answer:
        'Take the nous form of the present, drop -ons, and add -ais, -ais, -ait, -ions, -iez, -aient.',
      pinned:
        "Nous finissons → finiss- → je finissais. The only irregular one is être: j'étais.",
      comments: [
        'Nous form, chop off -ons, add the endings. Same endings for every verb.',
        "Je, tu, il and ils endings all sound the same, like 'ay'. Only nous and vous sound different.",
        "Don't use the infinitive! It's 'nous finissons' → finiss-, not fin-.",
      ],
      ask: {
        q: 'What about manger?',
        a: 'Nous mangeons → mange- → je mangeais. Keep the e!',
      },
    },
    {
      question: 'Which verbs use être in the passé composé?',
      answer:
        "Movement and change-of-state verbs (DR MRS VANDERTRAMP) and all reflexive verbs: 'Je suis allé(e).'",
      pinned:
        'Most verbs use avoir, but about 17 verbs plus all reflexive verbs use être, and then the past participle agrees with the subject.',
      comments: [
        "If you physically go somewhere or change state (born, die), it's probably être.",
        'DR MRS VANDERTRAMP: devenir, revenir, monter, rester, sortir, venir, aller, naître, descendre, entrer, rentrer, tomber, retourner, arriver, mourir, partir.',
        "With être, add -e for feminine and -s for plural: 'Elles sont parties.'",
      ],
      ask: {
        q: 'Why does it agree?',
        a: 'With être the participle acts like an adjective describing the subject.',
      },
    },
    {
      question: "Passé composé or imparfait: 'Hier, il ___ (pleuvoir).'",
      answer: 'Il pleuvait. Weather is background description, so imparfait.',
      pinned:
        "Weather sets the scene, so it's normally imparfait, unless it's a sudden event like 'Il a commencé à pleuvoir' (it started to rain).",
      comments: [
        'Weather = background = imparfait.',
        'Imparfait is the weather forecast of the past.',
        "'Hier' doesn't automatically mean passé composé! Look at what's being described.",
      ],
      ask: {
        q: "What about 'it rained for two hours'?",
        a: 'Il a plu pendant deux heures. A set length of time makes it a completed action.',
      },
    },
    {
      question: 'Which signal words usually mean imparfait?',
      answer:
        "Words for habits or background: d'habitude, souvent, tous les jours, quand j'étais petit, pendant que.",
      pinned:
        'These words show repeated or ongoing actions, so they usually go with imparfait.',
      comments: [
        'If it happened again and again, use imparfait.',
        "Souvent, Toujours, D'habitude → imparfait. I remember S.T.D.",
        "'Toujours' isn't always imparfait. Check whether the action is finished.",
      ],
      ask: {
        q: 'And for passé composé?',
        a: 'Soudain, tout à coup, hier, une fois, ce matin: words for one moment.',
      },
    },
    {
      question:
        "Translate: 'When I was young, I lived in Paris, but in 2015 we moved.'",
      answer:
        "Quand j'étais jeune, j'habitais à Paris, mais en 2015 nous avons déménagé.",
      pinned:
        'The background (being young, living somewhere) is imparfait. The one event at a specific time (moving in 2015) is passé composé.',
      comments: [
        'The setting of the story is imparfait. The thing that happened in 2015 is passé composé.',
        'A specific year or date usually means passé composé.',
        'Déménager uses avoir, not être, even though it means moving house!',
      ],
      ask: {
        q: "Why isn't habiter in passé composé?",
        a: "Because it describes an ongoing situation. 'J'ai habité' works if you mean a finished period.",
      },
    },
  ],
}

export const examples = [chemistry, history, french]

// Find the ready-made deck that matches a search, if any.
export function findExample(text) {
  const query = text.trim().toLowerCase()
  if (!query) return null
  return (
    examples.find(
      (ex) =>
        ex.topic.toLowerCase() === query ||
        ex.label.toLowerCase() === query ||
        ex.keywords.some((k) => query.includes(k)),
    ) ?? null
  )
}

// Pre-fills the notes box so nobody faces an empty box.
export const sampleNotes = `le chatelier - if you change something the equilibrium shifts to undo it
dynamic equilibrium: forward and reverse rates are equal
- add reactant = shifts right (more products)
catalyst: speeds up both directions, doesn't move equilibrium
exothermic rxn + heat -> shifts left
pressure up -> side with fewer gas moles
Kc = [products]/[reactants] at equilibrium`
