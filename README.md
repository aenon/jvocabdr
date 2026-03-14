# VocaBuilder

A web application for building vocabulary using spaced repetition principles. Words appear over time following a forgetting curve to maximize long-term retention.

## Features

### Core Functionality
- **Word Practice:** First and last letters displayed with context hints
- **Smart Hints:** Hints don't reveal words similar to the target
- **Immediate Feedback:** Correct/incorrect feedback with reveal option
- **Spaced Repetition:** Words appear across multiple days based on mastery
    - Failed words retry immediately
    - Correct words progress to longer intervals (1d → 3d → 7d → 14d → 30d+)
- **Progress Tracking:** Statistics, streaks, and mastery levels

### Session Types
- **Quick Practice:** 10-15 words, 5-10 minutes
- **Daily Review:** All words due for review
- **New Words:** Learn fresh vocabulary

### Additional Features
- Light/dark theme support
- Responsive design (mobile-first)
- Progress dashboard with visualizations
- Category-based word organization
- Export/import data for backup
- Keyboard shortcuts

## Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS (v4)
- **Storage:** LocalStorage (client-side only)
- **Algorithm:** Simplified SM-2 (inspired by Anki)

## Installation

```bash
cd Projects/VocaBuilder
npm install
```

## Running the Application

### Development
```bash
npm run dev
```
Open http://localhost:5173/ in your browser

### Production Build
```bash
npm run build
npm run preview
```

## Project Structure

```
VocaBuilder/
├── src/
│   ├── components/      # React components
│   │   ├── Home.jsx           # Main landing page
│   │   ├── Practice.jsx       # Word practice interface
│   │   ├── Dashboard.jsx      # Statistics dashboard
│   │   └── Settings.jsx       # User settings
│   ├── lib/
│   │   ├── spacedRepetition.js  # SRS algorithm
│   │   └── storage.js            # LocalStorage utilities
│   ├── data/
│   │   └── initialWords.js      # 50 initial vocabulary words
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind CSS
├── public/
├── REQUIREMENTS.md        # Full requirements document
└── README.md             # This file
```

## How It Works

### Spaced Repetition Algorithm
VocaBuilder uses a simplified SM-2 algorithm (similar to Anki):

1. **Quality Rating:** Each answer is rated on success and attempts
2. **Interval Calculation:**
   - Failed (quality < 3): Reset to immediate review
   - Perfect (quality = 5): Double the interval
   - Good (quality = 4): Increase by 1.5x
3. **Initial Intervals:** 0 → 1d → 3d → 7d → 14d → 30d

### Word States
- **New:** Never practiced
- **Learning:** Active learning phase
- **Review:** Due for scheduled review
- **Mastered:** Passed multiple reviews with high quality

### Practice Flow
1. See hint and first/last letters
2. Type your answer
3. Get immediate feedback
4. If incorrect after 3 attempts, reveal answer
5. Continue through word list
6. View session summary and updated progress

## Current Status

✅ **Phase 1 Complete (MVP)**
- Basic word practice interface
- Local storage for progress
- Spaced repetition algorithm
- 50 predefined words
- Statistics dashboard
- Light/dark theme
- Responsive design

## Roadmap

### Phase 2 (Enhanced)
- Import/export custom word lists
- More session filters
- Detailed analytics charts
- Category-based practice
- Hint quality validation
- Enhanced keyboard shortcuts

### Phase 3 (Advanced)
- PWA offline support
- Cloud sync (optional)
- Multi-language support
- Audio pronunciation
- Social features
- Gamification (achievements, leaderboard)

## Contributing

Feel free to:
- Add new vocabulary words
- Improve the spaced repetition algorithm
- Enhance UI/UX
- Fix bugs

## License

ISC

---

Built with React, Tailwind CSS, and spaced repetition principles.
