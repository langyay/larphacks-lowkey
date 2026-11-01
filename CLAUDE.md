# CLAUDE.md

The project spec is in spec.md. Read it before planning anything.

## Working with me

I'm a beginner: new to the terminal, Git and JavaScript.
- Explain what you're doing and why in plain English, briefly. Define any jargon in one line.
- When there's a real choice (library, architecture, trade-off), give me 2 options and a recommendation, then wait.
- If I need to run something myself, give me the exact command and say where to run it.
- If a task will take more than ~30 minutes, say so first and suggest a smaller version.

## Stack

- Vite + React + Tailwind CSS, single-page app. shadcn/ui for components.
- No login, no database, no accounts. Save data in localStorage if needed.
- Only if an API key is involved: a small Node/Express backend in `/server`, so the key never reaches the browser.
- Deploy: Render. Static site: build `npm install && npm run build`, publish `dist`. A backend deploys as a separate Render web service.
- Don't add a dependency without telling me what it's for. Prefer fewer packages.

## Commands

- `npm install`: install dependencies
- `npm run dev`: run locally (preview)
- `npm run build`: production build. Must pass before every commit.

## How to work

1. **Plan before anything bigger than a small tweak.** Keep plans short and list the files you'll touch.
2. **Build in small steps.** Each step should leave the app working.
3. **Verify, don't assume.** After a change, run the app and check it in the preview (or `/verify`). Tell me exactly what you checked. Never say "should work".
4. **When a step works, tell me it's a good moment to commit.** Don't commit or push unless I ask.
5. **Bugs:** find and explain the cause before changing code. If your second fix fails, stop and tell me. Don't keep guessing.
6. **Don't delete or rewrite working code** outside the task without asking.

## Secrets

- API keys live only in `.env` (gitignored) and in Render's Environment settings. Never in code, never in a commit, never printed in chat.
- Only `VITE_`-prefixed variables reach the browser, and anyone can read them. Never put a secret key in one.
- Keep `.env.example` updated with variable names only.

## Design rules

- One accent colour. Everything else black, white or grey. One font from Google Fonts.
- Content in a centred column (max ~720px), generous padding, big readable text.
- Same corner radius, button style and shadow everywhere.
- Every screen has a loading state, an empty state (telling people what to do) and a friendly error state.
- Pre-fill example inputs so nobody faces an empty box.
- Must look right at phone width (375px).
- Images in `public/` are made by us. Don't generate replacements.

### Don't look AI-generated
Never use: purple/blue gradients or gradient text, glassmorphism, glows or blurred background blobs, emoji or sparkle icons in the UI, generic hype copy ("Revolutionize your…", "AI-powered"), a hero + three feature cards landing page, fake stats or testimonials, fade/scale animations on everything, Inter with default Tailwind greys, or placeholder text.
Instead: flat surfaces with thin borders, a tinted neutral palette, left-aligned body text, clear size/weight hierarchy, plain specific copy that says what the app does, and one purposeful animation. Drop users straight into the working tool rather than a marketing page.
Exception: the made-up channel names, like counts and comment counts on flashcards are part of the YouTube Shorts costume, not fake stats. Keep them invented (no real creators).

## Priorities

When in doubt: working > looks finished > handles errors > clever code.
Keep the deployed site working at all times. If a change breaks the build, fix it before anything else.