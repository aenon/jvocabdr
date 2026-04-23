# Vocabulary Builder

A spaced repetition vocabulary learning app built with Next.js and Firebase.

## Features

- **Fill-in-the-blank learning** - See the definition + first/last letters, fill in the middle
- **Spaced repetition (SM-2)** - Forgetting curve scheduling for optimal retention
- **Progress tracking** - Per-user card progress stored in Firestore
- **Mobile-friendly** - Works on desktop and mobile browsers

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript
- **Backend:** Firebase (Auth, Firestore)
- **Deployment:** Vercel

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/aenon/jvocabdr.git
cd jvocabdr
bun install
```

### 2. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication** → Google Sign-in
3. Enable **Firestore Database**
4. Get your config from **Project Settings** → **Your apps** → **Web app**
5. Copy `.env.local.example` to `.env.local` and fill in values

### 3. Download Vocabulary Data

```bash
# List available sources
bun run vocab:list

# Download specific sources
bun run vocab:download oxford-5000

# Download all sources
bun run vocab:download-all
```

### 4. Seed Database

```bash
# Requires Firebase service account key
# Get from Firebase Console → Project Settings → Service Accounts
export FIREBASE_SERVICE_ACCOUNT_KEY=$(cat service-account.json | jq -Rs .)
bun run lib/seed.ts
```

### 5. Run development server

```bash
bun run dev
```

Open http://localhost:3000

## Project Structure

```
jvocabdr/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Sign-in page
│   ├── game/page.tsx      # Main game page
│   └── providers.tsx      # Auth context provider
├── components/            # React components
├── lib/                  # Core logic
│   ├── firebase.ts       # Firebase client
│   ├── auth.ts           # Authentication
│   ├── scheduler.ts       # SM-2 algorithm
│   ├── db.ts             # Firestore queries
│   └── seed.ts           # Database seed script
├── data/                 # Vocabulary data
├── scripts/              # Utility scripts
│   └── download-vocab.js # Download vocabulary sources
└── docs/                 # Documentation
```

## Vocabulary Sources

| Source | Levels | License |
|--------|--------|----------|
| Oxford 5000 | A1-C1 | Oxford (non-commercial) |
| Oxford 3000 | A1-B2 | Oxford (non-commercial) |
| CEFR-J | A1-C2 | CC BY-SA 4.0 |
| Words CEFR | A1-C2 | MIT |
| EFLLex | A1-C1 | CC BY-NC-SA 4.0 |

## Deployment

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## License

MIT