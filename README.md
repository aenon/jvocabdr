# xvocabdr

A simple vocabulary builder web app to help you learn and remember new words.

## Features
- **Dashboard** — Track your total words, review count, and mastery progress
- **Add Word** — Easily add new vocabulary with definition and example sentence
- **Quiz Mode** — Test yourself with fill-in-the-blank questions

## How to Use
1. Serve the folder with any static server, e.g. `python3 -m http.server 8000` (or `npx serve`)
2. Open http://localhost:8000 in your browser
3. Start adding words via the **Add Word** tab, or add words from the built-in dictionaries
4. Review and practice with **Quiz Mode**

Note: opening `index.html` directly via `file://` won't work — browsers block the `fetch()` calls that load the dictionaries.
## Data Storage
All data is stored in your browser's localStorage. No backend required.
