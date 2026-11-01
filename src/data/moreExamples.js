// More ready-made decks, in the same shape as examples.js. `card()` keeps each
// one short: question, answer, the creator's pinned explanation, three viewer
// comments (a simpler version, a memory trick, a mistake or real-life example)
// and a question with the creator's reply.

const card = (question, answer, pinned, comments, [q, a]) => ({
  question,
  answer,
  pinned,
  comments,
  ask: { q, a },
})

const sat = {
  id: 'sat',
  label: 'SAT: vocabulary',
  topic: 'SAT Vocabulary',
  keywords: ['sat vocab', 'vocabulary'],
  cards: [
    card(
      "What does 'ubiquitous' mean?",
      'Present or found everywhere.',
      "Ubiquitous describes something that seems to be everywhere at once, like phones, ads or WiFi. It's a favourite SAT word for 'very common'.",
      [
        'Basically: it is literally everywhere you look.',
        "Ubiquitous sounds like 'you be quitous'... you can't quit it, it's everywhere.",
        "Don't mix it up with 'unique'. Ubiquitous things are the opposite: super common.",
      ],
      ['Is it positive or negative?', 'Neither. It only says something is everywhere, so the tone comes from the sentence.'],
    ),
    card(
      "What does 'ephemeral' mean?",
      'Lasting for a very short time.',
      "Ephemeral things disappear fast, like a snowflake on your hand or a story that vanishes in 24 hours.",
      [
        'Short-lived. Here today, gone tomorrow.',
        "Ephemeral ≈ 'a FEW MORE' seconds and it's gone.",
        "I mixed it up with 'eternal' because they both start with E. They're opposites!",
      ],
      ['Can it describe feelings?', 'Yes. An ephemeral joy is one that fades quickly.'],
    ),
    card(
      "What does 'pragmatic' mean?",
      'Dealing with things in a practical, realistic way.',
      "A pragmatic person cares about what works, not what sounds ideal. On the SAT it usually means practical and sensible.",
      [
        "Pragmatic = practical. They'll pick the option that actually works.",
        'Pragmatic and practical both start with PRA.',
        "It doesn't mean boring or cold. It just means focused on what's realistic.",
      ],
      ['What is the opposite?', "Idealistic or impractical, someone who cares more about dreams than what's doable."],
    ),
    card(
      "What does 'ambivalent' mean?",
      'Having mixed or conflicting feelings about something.',
      "If you're ambivalent, you feel two ways at once, like being excited and nervous about a big move.",
      [
        "It's the 'I want it but I also don't' feeling.",
        "Ambi = both (like ambidextrous, both hands). Valent = feeling. Feeling both ways.",
        "Not the same as 'indifferent'. Ambivalent means strong feelings in two directions, indifferent means no feelings.",
      ],
      ['So is it just not caring?', "No, that's indifferent. Ambivalent people care a lot, they're just torn."],
    ),
    card(
      "What does 'meticulous' mean?",
      'Showing great attention to detail; very careful and precise.',
      'A meticulous person checks every little thing: the spelling, the numbers, the spacing. It is a positive word on the SAT.',
      [
        'Super careful about tiny details.',
        "Meticulous sounds like 'meh, ticks' every box. They tick every box.",
        "It doesn't mean slow. It means careful and thorough.",
      ],
      ['Can it be negative?', "Slightly, if it means someone is too picky, but on the SAT it's usually praise."],
    ),
    card(
      "What does 'candid' mean?",
      'Honest and straightforward, even when it is uncomfortable.',
      "Candid means telling the truth openly. A candid review says what the writer really thinks, with no sugar coating.",
      [
        'Being really honest and direct.',
        "Candid sounds like 'can did', someone who can say it like it is.",
        "Don't confuse it with 'candy'. Candid isn't sweet, it's honest.",
      ],
      ['Is candid rude?', "Not always. It means honest, and that can be said kindly."],
    ),
  ],
}

const cyber = {
  id: 'cyber',
  label: 'AP Cyber: the basics',
  topic: 'AP Cybersecurity prep',
  keywords: ['cybersecurity', 'cyber security', 'ap cyber', 'cyber'],
  cards: [
    card(
      'What does the CIA triad stand for?',
      'Confidentiality, Integrity and Availability.',
      "These are the three core goals of security. Confidentiality: only the right people see data. Integrity: data isn't changed without permission. Availability: systems and data are there when needed.",
      [
        'Keep it secret, keep it correct, keep it working.',
        "C-I-A: 'Can I Access?' only if you're allowed, it's accurate, and it's up.",
        "It has nothing to do with the spy agency, even though the letters match!",
      ],
      ['Which one does a DDoS attack hit?', 'Availability, because it floods a service so real users cannot reach it.'],
    ),
    card(
      'What is phishing?',
      'Tricking people, usually by fake emails or messages, into giving up information or clicking something harmful.',
      'Phishing attacks pretend to be someone you trust, like your bank or a teacher, to steal passwords or install malware. They rely on people, not on breaking code.',
      [
        "A fake message that fishes for your info. 'Phishing' sounds like fishing.",
        'Check the sender, the link and the urgency. Pressure to act NOW is a red flag.',
        "Hovering over a link shows where it really goes. I didn't know that for ages.",
      ],
      ['What is spear phishing?', 'A phishing attack aimed at one specific person or group, using details about them to look real.'],
    ),
    card(
      'What is multi-factor authentication (MFA)?',
      'Proving who you are with two or more different kinds of evidence.',
      "The three kinds of factors are something you know (a password), something you have (a phone or key) and something you are (a fingerprint). MFA needs at least two different kinds.",
      [
        'Password plus a code on your phone.',
        'Know, Have, Are. Two different ones means MFA.',
        "Two passwords is NOT MFA. They're both 'something you know'.",
      ],
      ['Why does MFA help?', 'A stolen password alone is no longer enough to get in.'],
    ),
    card(
      'What is the difference between symmetric and asymmetric encryption?',
      'Symmetric uses one shared key. Asymmetric uses a public and private key pair.',
      "Symmetric encryption is fast but both people need the same secret key. Asymmetric encryption uses a public key to lock and a private key to unlock, so no secret has to be shared first.",
      [
        'One key for both, versus two keys that match.',
        "Symmetric = same key. Asymmetric = a pair, like a mailbox: anyone can drop mail in (public), only you open it (private).",
        "People think the public key can decrypt. It can't. Only the private key unlocks.",
      ],
      ['Which one does HTTPS use?', 'Both. Asymmetric sets up the connection, then symmetric keeps it fast.'],
    ),
    card(
      'What does a firewall do?',
      'It filters network traffic using rules, blocking connections that are not allowed.',
      'A firewall sits between a trusted network and an untrusted one. It checks each connection against its rules and allows or blocks it.',
      [
        'A security guard for your network traffic.',
        'Think of a bouncer with a guest list.',
        "A firewall won't stop you from clicking a bad link. It only filters traffic.",
      ],
      ['Is a firewall enough on its own?', 'No. It is one layer. Good security uses several layers together.'],
    ),
    card(
      'What is hashing, and why are passwords stored as hashes?',
      'A one-way function that turns data into a fixed-size fingerprint, so stolen hashes do not reveal the passwords.',
      "A hash can't be turned back into the original text. Sites store the hash of your password, then hash what you type and compare. Adding a random 'salt' makes the hashes even harder to crack.",
      [
        'Like a blender: easy to blend, impossible to un-blend.',
        'Same input, same hash. Change one letter and the hash looks totally different.',
        'Hashing is not encryption. Encryption can be undone with a key, hashing cannot.',
      ],
      ['What is salting?', 'Adding random data to each password before hashing so identical passwords get different hashes.'],
    ),
  ],
}

const derivatives = {
  id: 'deriv',
  label: 'Calc: derivatives',
  topic: 'Derivatives',
  keywords: ['derivative', 'calculus'],
  cards: [
    card(
      'What does a derivative measure?',
      'The instantaneous rate of change of a function, the slope of its tangent line at a point.',
      "The derivative of f at x tells you how fast f is changing right at that moment. On a graph, it's the slope of the line that just touches the curve at that point.",
      [
        'How steep the graph is at one exact spot.',
        "A car's speedometer is a derivative: speed is the rate of change of position.",
        "It's not the average slope between two points. That's the secant. The derivative is the limit as the points get closer.",
      ],
      ['What does a derivative of zero mean?', 'The graph is flat at that point, like the top of a hill or the bottom of a valley.'],
    ),
    card(
      'What is the power rule?',
      'The derivative of xⁿ is n·xⁿ⁻¹.',
      'Bring the exponent down in front, then reduce the exponent by one. So the derivative of x⁴ is 4x³.',
      [
        'Drop the power in front and take one off the power.',
        "Power rule: 'bring it down, take one off.'",
        'The derivative of a constant like 5 is 0, not 5. A flat line has no slope.',
      ],
      ['What about 3x²?', 'Keep the 3 and apply the rule to x²: 3 · 2x = 6x.'],
    ),
    card(
      'What are the derivatives of sin x and cos x?',
      'The derivative of sin x is cos x, and the derivative of cos x is −sin x.',
      'These two chase each other around a cycle: sin → cos → −sin → −cos → sin. The minus sign only shows up when you differentiate cos x.',
      [
        'Sine turns into cosine, cosine turns into negative sine.',
        "'Co' things get a negative: the derivative of COsine is negative.",
        "I kept forgetting the minus sign on cos x. Don't forget it!",
      ],
      ['What is the derivative of −sin x?', 'It is −cos x, since the derivative of sin x is cos x.'],
    ),
    card(
      'What is the product rule?',
      '(f·g)′ = f′·g + f·g′.',
      "When two functions multiply, differentiate one at a time and add: the derivative of the first times the second, plus the first times the derivative of the second.",
      [
        'Derivative of the first times the second, plus the first times derivative of the second.',
        "'D-first, second-plus, first, D-second.'",
        "You can't just multiply the two derivatives together. (f·g)′ is not f′·g′.",
      ],
      ['When do I need it?', 'Whenever two functions that both depend on x are multiplied, like x²·sin x.'],
    ),
    card(
      'What is the chain rule?',
      'd/dx f(g(x)) = f′(g(x))·g′(x).',
      'For a function inside another function, differentiate the outer one (leaving the inside alone), then multiply by the derivative of the inside.',
      [
        'Outside derivative, times inside derivative.',
        'Peel it like an onion: outer layer first, then multiply by the next layer in.',
        "A common slip is forgetting to multiply by the derivative of the inside.",
      ],
      ['What is the derivative of (3x+1)⁵?', 'Outer: 5(3x+1)⁴. Inner: 3. So the answer is 15(3x+1)⁴.'],
    ),
    card(
      'What are the derivatives of eˣ and ln x?',
      'The derivative of eˣ is eˣ, and the derivative of ln x is 1/x.',
      'eˣ is special because its slope at every point equals its own height. ln x is the inverse of eˣ and its derivative is 1/x.',
      [
        "eˣ is its own derivative. It's the one function that doesn't change when you differentiate.",
        "ln x gives 1/x. 'ln' and 'one over x' go together.",
        "Don't confuse the derivative of ln x (1/x) with the derivative of 1/x (−1/x²).",
      ],
      ['What about e²ˣ?', 'Use the chain rule: the derivative is 2e²ˣ.'],
    ),
  ],
}

const trig = {
  id: 'trig',
  label: 'Trig: sine & cosine law',
  topic: 'Sine & Cosine Law',
  keywords: ['sine law', 'cosine law', 'law of sines', 'law of cosines', 'sine and cosine', 'sine & cosine', 'trigonometry'],
  cards: [
    card(
      'What is the law of sines?',
      'a / sin A = b / sin B = c / sin C.',
      'In any triangle, each side divided by the sine of its opposite angle gives the same number. Use it to find missing sides or angles.',
      [
        'Side over sine of the opposite angle, all equal.',
        "Match each side to the angle across from it. Sides and angles that face each other go together.",
        "It works on ANY triangle, not just right triangles.",
      ],
      ['Which letters go together?', 'Lowercase side a goes with the angle A directly opposite it.'],
    ),
    card(
      'When do you use the law of sines?',
      'When you know an angle and its opposite side, plus one other piece (AAS, ASA or SSA).',
      "You need a matching pair: an angle and the side opposite it. Then one more angle or side lets you solve for the rest.",
      [
        'You have one full pair, angle and opposite side.',
        "Find a 'pair' first. No pair, no law of sines.",
        "If you know two sides and the angle BETWEEN them, you can't start with the law of sines.",
      ],
      ['What is the third angle?', 'Subtract the other two from 180°, since a triangle always adds up to 180°.'],
    ),
    card(
      'What is the law of cosines?',
      'c² = a² + b² − 2ab·cos C.',
      "It's the Pythagorean theorem with a correction term. The angle C is the one opposite side c.",
      [
        'Pythagorean theorem with an extra piece subtracted.',
        'Square the two sides, add them, then subtract 2ab cos C.',
        "Don't forget to square-root at the end when you want the side itself.",
      ],
      ['Does it work for any side?', 'Yes. Just keep the angle opposite the side you are solving for.'],
    ),
    card(
      'When do you use the law of cosines?',
      'When you know two sides and the angle between them (SAS), or all three sides (SSS).',
      "If there's no angle-and-opposite-side pair to start from, the law of sines can't help. The law of cosines can.",
      [
        'Use it when the sine law has nothing to grab onto.',
        'SAS or SSS means cosines.',
        'For SSS, rearrange the formula to solve for the angle with inverse cosine.',
      ],
      ['Which do I try first?', 'Check for a pair of angle and opposite side. If you have one, use sines, otherwise use cosines.'],
    ),
    card(
      'What happens to the law of cosines when C = 90°?',
      'It becomes the Pythagorean theorem, c² = a² + b², because cos 90° = 0.',
      'The extra term is −2ab·cos C, and cos 90° is 0, so it disappears. The law of cosines is a bigger version of Pythagoras that works for any triangle.',
      [
        "The extra part vanishes, so you're left with a² + b².",
        'Right angle means cosine is zero means plain Pythagoras.',
        'This only works for the right angle. Any other angle keeps the extra term.',
      ],
      ['What if C is obtuse?', 'cos C is negative, so the −2ab·cos C term adds length and c gets bigger.'],
    ),
    card(
      'What is the ambiguous case of the law of sines?',
      'With SSA, the given information can make 0, 1 or 2 different triangles.',
      "When you know two sides and an angle that is NOT between them, the side opposite the angle can swing into two positions. Check if both angles (θ and 180° − θ) work.",
      [
        "Sometimes the same info fits two different triangles.",
        "SSA is sneaky. Two answers, one answer, or none.",
        "When sin⁻¹ gives you an angle, also try 180° minus it. Both might fit.",
      ],
      ['How do I check?', 'Add each possible angle to the given one. If the total is under 180°, that triangle exists.'],
    ),
  ],
}

const unitedNations = {
  id: 'un',
  label: 'Civics: the United Nations',
  topic: 'United Nations',
  keywords: ['united nations', 'security council', 'general assembly'],
  cards: [
    card(
      'When and why was the United Nations founded?',
      'In 1945, after World War II, to maintain international peace and security.',
      'The UN began in October 1945 when its charter took effect. Countries wanted a way to settle disputes through talks and cooperation instead of another world war.',
      [
        'Founded after WWII so countries would talk instead of fight.',
        "1945: the war ended and the UN began. Same year.",
        "It replaced the League of Nations, which failed to stop WWII.",
      ],
      ['How many members does it have?', 'There are 193 member states.'],
    ),
    card(
      'How many permanent members does the Security Council have?',
      'Five: the United States, the United Kingdom, France, Russia and China. Each has veto power.',
      "The Security Council has 15 members: 5 permanent and 10 elected for two-year terms. A 'no' from any permanent member blocks a resolution, even if everyone else agrees.",
      [
        'Five big countries who can each block a decision.',
        'The P5: US, UK, France, Russia, China.',
        "The veto isn't a vote against. It stops the whole resolution from passing.",
      ],
      ['What can the Security Council do?', 'Authorize sanctions, peacekeeping missions and, in some cases, the use of force.'],
    ),
    card(
      'What is the UN General Assembly?',
      'The body where all 193 member states have one vote each.',
      "Every member state sits in the General Assembly and gets one equal vote. It debates global issues and passes resolutions, but most of them are recommendations and are not legally binding.",
      [
        'Every country, one vote each.',
        "'General' = everyone is included.",
        "Its resolutions are mostly advice, not law. Only the Security Council can make binding decisions.",
      ],
      ['Do big countries get more votes?', 'No. Every country gets exactly one vote, big or small.'],
    ),
    card(
      'What do UN peacekeepers do?',
      'They monitor ceasefires, protect civilians and help carry out peace agreements.',
      'Peacekeepers are sent with the consent of the parties involved, usually after a conflict has paused. They come from member countries and wear blue helmets.',
      [
        'Neutral troops who help keep a ceasefire going.',
        'Blue helmets = UN peacekeepers.',
        "They're not there to fight a war. Their job is to support peace that already exists.",
      ],
      ['Who sends them?', 'The Security Council authorizes missions, and member countries volunteer the troops.'],
    ),
    card(
      'Where is the UN headquarters?',
      'In New York City, in the United States.',
      "The main UN headquarters sits on the east side of Manhattan, on land that is international territory. The UN also has major offices in Geneva, Vienna and Nairobi.",
      [
        'New York City, right on the East River.',
        "UN = Upper... no, just remember NYC.",
        "Many people say Geneva, but that's a major office, not the headquarters.",
      ],
      ['Is it part of the US?', 'The grounds are treated as international territory under an agreement with the US.'],
    ),
    card(
      'What is the Universal Declaration of Human Rights?',
      'A 1948 UN document listing the basic rights that belong to every person.',
      'It was adopted by the General Assembly in 1948 and covers rights like life, liberty, education and freedom from slavery. It is a statement of ideals, not a binding treaty.',
      [
        'A list of rights every human is supposed to have.',
        '1948, three years after the UN began.',
        "It isn't a law you can sue under. Later treaties turned many of its ideas into binding rules.",
      ],
      ['Who wrote it?', 'A UN committee led by Eleanor Roosevelt drafted it, with members from many countries.'],
    ),
  ],
}

// The deck the app opens with: a broad review that suits most students.
export const economics = {
  id: 'econ',
  label: 'AP Econ: review',
  topic: 'AP Economics review',
  keywords: ['econ', 'ap macro', 'ap micro', 'supply and demand', 'macroeconomics', 'microeconomics'],
  cards: [
    card(
      'What is opportunity cost?',
      'The value of the next best thing you give up when you make a choice.',
      "Every choice has a cost, even when no money changes hands. If you spend Saturday studying instead of working a shift, the opportunity cost is the pay you didn't earn.",
      [
        "It's the thing you didn't pick. Netflix tonight costs you the sleep you could've had.",
        'Opportunity cost = the "next best" option only, not every option you skipped.',
        "Common mistake: adding up ALL the alternatives. It's only the single best one you gave up.",
      ],
      ['Does it have to be money?', 'No. It can be time, effort or anything else of value you give up.'],
    ),
    card(
      'What does the law of demand say?',
      'When the price of a good rises, the quantity demanded falls (all else equal).',
      "Higher prices make people buy less, so the demand curve slopes downward. 'All else equal' (ceteris paribus) means only the price is changing.",
      [
        'Concert tickets go from $50 to $300 and suddenly way fewer people want to go.',
        'Price UP, quantity DOWN. They move in opposite directions, like a seesaw.',
        "It's quantity DEMANDED that changes, not demand itself. That difference shows up on the AP exam a lot.",
      ],
      ['Why does the curve slope down?', 'People substitute cheaper goods and their money buys less, so they buy less of the pricier good.'],
    ),
    card(
      'A price change vs a change in income: which shifts the demand curve?',
      'Income shifts the whole curve. A price change only moves you along the curve.',
      'Changing the good\'s own price is a movement along the same curve. Anything else that affects buying, like income, tastes, or prices of related goods, shifts the whole curve left or right.',
      [
        'Price = sliding along the line. Everything else = picking up the line and moving it.',
        'Remember TRIBE for demand shifters: Tastes, Related goods, Income, Buyers, Expectations.',
        'Classic trap: "the price fell, so demand increased." No: quantity demanded increased.',
      ],
      ['Which way does it shift if income rises?', 'Right for normal goods, left for inferior goods like instant noodles.'],
    ),
    card(
      'What does it mean if demand is price inelastic?',
      'Quantity demanded barely changes when the price changes.',
      'Inelastic goods are necessities with few substitutes, like insulin or gasoline in the short run. Elasticity is less than 1, so a price rise brings in more total revenue.',
      [
        "People need it no matter what, so they keep buying even when it's pricier.",
        'Inelastic = Insensitive. Elastic = Easily stretched by price changes.',
        'Real life: gas prices jump, but most people still have to drive to work that week.',
      ],
      ['What makes a good elastic?', 'Lots of substitutes, being a luxury, or taking up a big share of your budget.'],
    ),
    card(
      'What happens when a price ceiling is set below the equilibrium price?',
      'A shortage: quantity demanded is greater than quantity supplied.',
      'A price ceiling is a legal maximum price. Set below equilibrium, it makes buyers want more while sellers offer less, so the market runs short.',
      [
        'Rent control is the usual example: cheap rent, but far fewer apartments available.',
        'Ceiling BELOW equilibrium = shortage. Floor ABOVE equilibrium = surplus.',
        "A ceiling ABOVE equilibrium does nothing at all. It only matters when it's below.",
      ],
      ['Is a minimum wage a ceiling or a floor?', 'A floor, since it sets the lowest legal price for labour. Above equilibrium it can cause a surplus of workers.'],
    ),
    card(
      'What is the formula for GDP (expenditure approach)?',
      'GDP = C + I + G + (X − M): consumption, investment, government spending and net exports.',
      'GDP is the market value of all final goods and services produced in a country in a year. Adding up every type of spending gives the same total.',
      [
        "It's everything everyone in the country spends on new stuff, added together.",
        'C + I + G + NX. "Consumers Invest in Government Nachos eXtra" is how I remember it.',
        "Used goods and stock purchases don't count. Only NEW final goods and services do.",
      ],
      ['Do transfer payments like welfare count in G?', "No. They're not buying a good or service, just moving money around."],
    ),
    card(
      'What is the difference between fiscal and monetary policy?',
      'Fiscal policy is government spending and taxes. Monetary policy is the central bank changing the money supply and interest rates.',
      'Congress and the President run fiscal policy. The central bank (the Fed in the US) runs monetary policy. Both can push the economy out of a recession or cool down inflation.',
      [
        'Fiscal = the government\'s wallet. Monetary = the central bank\'s money printer and interest rates.',
        'Fiscal → Federal government. Monetary → Money supply.',
        'Common mix-up: the Fed does NOT set taxes. That is fiscal, decided by the government.',
      ],
      ['How does the Fed fight a recession?', 'It lowers interest rates (for example by buying bonds) so borrowing and spending go up.'],
    ),
    card(
      'What is comparative advantage?',
      'Being able to produce something at a lower opportunity cost than someone else.',
      'Even if one country is better at making everything (absolute advantage), both gain from trade when each specialises in what it gives up the least to make.',
      [
        "You might be faster at both cooking and cleaning, but if your roommate gives up less by cleaning, you should cook.",
        'Comparative = Compare opportunity costs. Absolute = who makes MORE.',
        "Mistake: thinking the better producer shouldn't trade. Trade still helps both sides.",
      ],
      ['How do you find it on the AP exam?', 'Work out each side\'s opportunity cost per unit; the lower one has the comparative advantage.'],
    ),
  ],
}

export const moreExamples = [sat, cyber, derivatives, trig, unitedNations]
