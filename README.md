# Python: First Contact 👽

> An alien-themed, interactive Python midterm review quiz — built as a study tool for a friend.

**Live demo:** https://python-first-contact.vercel.app

---

## What it is

A single-page React app that turns Python revision into a game. 200 questions across eight chapters, six play modes, a live Python sandbox powered by WebAssembly, and a full gamification layer — XP, levels, streaks, achievements, a daily challenge, and confetti on a perfect score.

The alien/teal aesthetic is intentional — it belongs to the person it was built for.

---

## Features

### Core quiz
- **200 questions** spanning Chapters 1–8 of a Python fundamentals course
- **Multiple-choice and fill-in-the-blank** question types
- **Syntax-highlighted code blocks** with a custom Dracula-inspired tokenizer
- **Live Python sandbox** (`area51.py`) powered by [Pyodide](https://pyodide.org) (Python in WebAssembly — no server, runs entirely in the browser) — lazy-loaded only when you open it
- **Spaced repetition** — missed questions are re-queued later in the same session (disabled in Exam and Survival modes)
- **Confidence tracking** — self-rate each answer (Knew It / Unsure / Guessed)
- **Hint system** — toggle a hint per question (tracked in stats; disabled in Exam mode)
- **Skip button** — defer the current question to the end of the queue (non-exam modes)
- **Bookmarks** — star any question mid-quiz; drill all starred questions from the menu

### Play modes
| Mode | Description |
|---|---|
| **Standard** | No time pressure — work through at your own pace |
| **Timed** | Configurable countdown per question (15 / 30 / 45 / 60 s) |
| **Flashcard** | Flip-to-reveal cards, mark Got It or Still Learning |
| **Speed Run** | Full-quiz stopwatch — beat your personal best per chapter |
| **Exam Simulator** | Timer forced, no hints, no spaced repetition — exam conditions |
| **Survival** | 3 lives — lose one per wrong answer; game over at 0 |

### Gamification
- **XP + 7 levels** — earn XP per correct answer with bonuses for speed, no-hint, streaks, and daily challenges
- **Combo XP scaling** — streak bonus grows with streak length (≥3 → +5, ≥5 → +8, ≥8 → +12, ≥10 → +15)
- **Level-up modal** — animated celebration with alien flavour text when you cross a level threshold
- **8 achievements** — unlockable badges for milestones (see below)
- **Custom callsign** — set a 1–12 character alias shown on your level badge
- **Daily Challenge** — one seeded question per day (changes at midnight), with a day-streak counter and +20 XP bonus
- **Weak Spots Drill** — appears on the menu once you have history; pulls all historically missed topics across sessions into a focused quiz
- **Starred Drill** — appears on the menu once you have bookmarks; drills only your starred questions
- **Chapter mastery rings** — per-chapter SVG ring showing your historical accuracy % on each chapter button
- **Session history** — last 10 sessions with accuracy bars, best streak, and weak-spot analysis
- **Streak calendar** — 35-day activity heatmap on the dashboard
- **Topic miss history** — top-12 most-missed topics with color-coded miss-count badges on the dashboard
- **Post-session Review tab** — in Results, browse every Q&A from the session with correct (green) / wrong (red) answers
- **Confetti** on a perfect score (100%)
- **Pomodoro timer** — 25-minute focus sessions with 🛸, directly on the menu

### UX
- Fully **responsive** — mobile and desktop
- **Configurable session length** — choose 5, 10, 15, 20, or all questions per session from the main menu
- **Keyboard shortcuts** — press `1–4` to answer instantly, `Enter`/`Space` to advance, `H` hint, `T` sandbox, `?` keyboard reference, `Esc` menu
- **Sound effects** — Web Audio API tones for correct, wrong, streak, time-up (toggleable)
- **Settings persistence** — sound and timer preferences saved across sessions
- **Share card** — copy a formatted score summary to clipboard
- **PWA-ready** — installable on mobile via the browser's "Add to Home Screen"

---

## Achievements

| Badge | ID | Condition |
|---|---|---|
| 🌍 First Contact | `first_contact` | Complete your first quiz |
| ✨ Flawless | `flawless` | Score 100% on any quiz |
| 🧠 Mind Over Hints | `no_hints` | Finish a full quiz without using any hints |
| 🔥 On Fire | `on_fire` | Reach a 10× answer streak |
| ⚡ Speed Demon | `speed_demon` | Answer 5 questions each in under 5 seconds |
| 📅 Daily Devotee | `daily_devotee` | Complete the daily challenge 3 days in a row |
| 👾 Veteran | `veteran` | Complete 10 quiz sessions |
| 🌌 Overlord | `overlord` | Reach Level 6: Overlord |

---

## Levels

| Level | Title | XP Required |
|---|---|---|
| 1 | 🌍 Earthling | 0 |
| 2 | 🛸 Abductee | 100 |
| 3 | 🔭 Cadet | 300 |
| 4 | 🪐 Navigator | 600 |
| 5 | 👽 Commander | 1,100 |
| 6 | 🌌 Overlord | 1,800 |
| 7 | 👾 The Alien | 3,000 |

### XP formula (per correct answer)
| Bonus | XP |
|---|---|
| Base | +10 |
| No hint used | +5 |
| Streak ≥ 3 | +5 |
| Streak ≥ 5 | +8 |
| Streak ≥ 8 | +12 |
| Streak ≥ 10 | +15 |
| Fast answer (< 8 s) | +5 |
| Daily Challenge | +20 |

Streak bonuses are tiered — only the highest applicable bonus applies.

---

## Chapters

| # | Title | Topics | Questions |
|---|---|---|---|
| 1 | Basics | Syntax errors, pseudocode, escape characters, `print()`, `int()`, `float()`, math, `**`, user input, f-strings, type conversion, floor division, modulo, `round()`, `type()`, augmented assignment | 25 |
| 2 | Logic | Booleans, logical operators, short-circuit, `in`/`not in`, `or` returns operand, comparison operators, chained comparisons, truthiness, `any()`, `all()`, boolean arithmetic | 25 |
| 3 | If Statements | Conditions, `elif`, indentation, nested if, ternary expressions, `pass`, membership, `not in`, `is None`, falsy values, `or` conditions, input validation | 25 |
| 4 | Loops | `for`, `while`, `range()`, augmented assignment, accumulator, `break`, `continue`, `enumerate()` with start, `reversed()`, `zip()` length mismatch, `for/else` | 25 |
| 5 | Lists & Functions | Lists, functions, scope, walrus operator, default parameters, `append()`, `extend()`, `pop()` with index, `sorted()` with key, slicing, `*args`, `max()`/`min()`, list comprehension | 25 |
| 6 | Lists Deep Dive | Indexing, negative slicing, tuples, packing/unpacking, star unpacking, `range()` → list, `*` repetition, `IndexError`, `len()`, `pop()`, `remove()`, 2D lists, `index()`, `del` | 25 |
| 7 | Strings | Slicing, `split()`, `strip()`, `replace()`, `join()`, `upper()`/`lower()`, `capitalize()`, `title()`, `find()` vs `index()`, `isdigit()`, `isalpha()`, f-strings, immutability, triple quotes | 25 |
| 8 | OOP | Classes, encapsulation, `__init__`, `__str__`, `__repr__`, `@property`, `@classmethod`, `@staticmethod`, inheritance, `super()`, method overriding, `isinstance()`, class variables, duck typing | 25 |

---

## Tech stack

| | |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Python runtime | Pyodide 0.25 (WebAssembly) |
| Confetti | canvas-confetti |
| Storage | `localStorage` (no backend) |
| Fonts | Fira Code, Fira Sans (Google Fonts) |
| Hosting | Vercel |

**No backend. No database. No tracking.** All state is in the browser.

---

## Colour palette

Built around teal as the primary accent.

| Role | Hex | Usage |
|---|---|---|
| Primary | `#00d4c0` | Accents, progress bars, level badge |
| Neon cyan | `#00ffe8` | Eye glow, code highlights |
| Alien green | `#00ff8c` | Correct answers, active states |
| Background | `#071820` | Page background |
| Surface | `#0d2d40` | Cards, inputs |
| Danger | `#ff1a44` | Wrong answers, timer warning |

---

## Running locally

```bash
git clone https://github.com/fr0ggy-p3ngu1n/python-first-contact.git
cd python-first-contact
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Deploying

The project auto-deploys on every push to `main` via Vercel.

**First-time setup:**
```bash
npm install
npx vercel login   # opens browser OAuth
npx vercel --prod  # first deploy — connects the project
```

After that, just push:
```bash
git add .
git commit -m "your message"
git push
```

Vercel picks up the push and deploys automatically. Preview URLs are generated for every branch.

---

## Project structure

```
python-first-contact/
├── public/
│   ├── favicon.svg          # 👽 emoji SVG favicon
│   └── manifest.json        # PWA manifest
├── src/
│   ├── constants/
│   │   ├── chapters.js      # Chapter definitions + accent colours
│   │   ├── levels.js        # Level thresholds + getLevel()
│   │   ├── palette.js       # D colour object
│   │   └── questions.js     # All 200 questions (MC + fill-in-the-blank)
│   ├── hooks/
│   │   ├── useAchievements.js
│   │   ├── useBookmarks.js  # Bookmark persistence (localStorage Set)
│   │   ├── useCallsign.js
│   │   ├── useDailyChallenge.js
│   │   ├── useIsMobile.js
│   │   ├── usePomodoro.js
│   │   ├── usePyodide.js
│   │   ├── useSessionHistory.js
│   │   ├── useSounds.js
│   │   ├── useTimer.js
│   │   └── useXP.js
│   ├── components/
│   │   ├── AchievementToast.jsx
│   │   ├── AlienLogo.jsx
│   │   ├── CodeSandbox.jsx
│   │   ├── DailyChallengeCard.jsx
│   │   ├── Dashboard.jsx    # Includes StreakCalendar + topic miss history
│   │   ├── FlashcardView.jsx
│   │   ├── KeyboardModal.jsx
│   │   ├── LevelBadge.jsx
│   │   ├── LevelUpModal.jsx
│   │   ├── PomodoroWidget.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Results.jsx      # Includes post-session Review tab
│   │   ├── SettingsPanel.jsx
│   │   ├── ShareCard.jsx
│   │   └── Toast.jsx
│   ├── utils/
│   │   ├── dailyQuestion.js # LCG seeding for daily question
│   │   └── syntaxHighlight.jsx
│   ├── PythonQuiz.jsx       # App shell — state, routing, quiz logic
│   ├── styles.js            # CSS keyframe animations
│   └── main.jsx             # Entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## Architecture notes

- **Zero server.** Pyodide downloads the Python runtime (~10 MB) from jsDelivr CDN the first time you open the sandbox. After that it's cached by the browser.
- **Pyodide is lazy-loaded** — the WASM bundle only starts downloading when you click "Try it" or press `T`. First load of the app is fast.
- **Spaced repetition** — when you answer a question wrong, it's spliced back into the question array 2–4 positions ahead, so you'll see it again soon in the same session. Disabled in Exam and Survival modes.
- **Answer shuffling** — each time a quiz starts, the four MC options for every question are randomly shuffled (fill-in-the-blank questions are unaffected). The `correct` index is updated to track the answer's new position, so all downstream logic (grading, keyboard shortcuts, highlighting) works unchanged.
- **Daily question seeding** — uses a simple LCG (Linear Congruential Generator) seeded from today's date string. Same question for everyone on the same day.
- **Keyboard shortcuts** use a two-effect ref pattern to avoid stale closures: one effect (no deps) refreshes `kbHandlerRef.current` every render; a second effect (empty deps) registers a stable `document.addEventListener` wrapper once.
- **Level-up detection** uses an `xpHydrated` flag so the modal doesn't fire on initial `localStorage` load — only on genuine XP gains during a session.
- **Achievements** are queue-based — multiple can unlock simultaneously and show one at a time, auto-dismissing after ~4 seconds.
- **Chapter mastery rings** — computed from session history filtered by chapter label; returns null if no sessions exist for that chapter (shows question count instead).
- **Session log** — every confirmed answer is appended to a `sessionLog` array during a quiz; passed to Results for the Review tab.
- **Bookmarks** — stored as a `Set` of question IDs, serialised to a JSON array in localStorage on every toggle.

---

## localStorage keys

| Key | Type | Description |
|---|---|---|
| `pyquiz-xp` | number string | Total XP |
| `pyquiz-history` | JSON array | Last 10 session summaries |
| `pyquiz-daily` | JSON object | `{ date, correct }` for streak tracking |
| `pyquiz-daily-streak` | number string | Current daily challenge streak |
| `pyquiz-callsign` | string | Custom alias (up to 12 chars) |
| `pyquiz-achievements` | JSON array | IDs of unlocked achievements |
| `pyquiz-speedpb` | JSON object | Speed run PBs keyed by chapter label |
| `pyquiz-settings` | JSON object | Sound toggle + timer duration |
| `pyquiz-bookmarks` | JSON array | Bookmarked question IDs |

---

## License

MIT — see [LICENSE](LICENSE).
