# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → Enter project name (e.g., `jvocabdr`)
3. Disable Google Analytics (optional, for MVP)
4. Wait for project creation → Click "Continue"

## 2. Enable Authentication

1. In Firebase Console → **Build** → **Authentication**
2. Click "Get Started"
3. Go to **Sign-in method** tab
4. Enable **Google**:
   - Email domain: leave empty (all domains)
   - Project support email: select your email
5. Click "Save"

## 3. Enable Firestore Database

1. In Firebase Console → **Build** → **Firestore Database**
2. Click "Create database"
3. Select location (e.g., `us-central1`)
4. Start in **Test mode** (allows read/write for 30 days)
5. Click "Create"

## 4. Get Configuration

1. In Firebase Console → **Project Settings** (gear icon)
2. Scroll to "Your apps" → Click web icon (</>)
3. Register app: enter nickname (e.g., "web")
4. Copy the `firebaseConfig` object:

```javascript
{
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## 5. Create .env.local

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 6. Deploy Firestore Rules

Copy `firestore.rules` to Firebase:

1. In Firebase Console → **Firestore Database** → **Rules**
2. Replace content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /decks/{deckId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /decks/{deckId}/cards/{cardId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /decks/{deckId}/cards/{cardId}/progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## 7. Seed Vocabulary Data

Run the seed script (requires Firebase Admin SDK with service account):

1. In Firebase Console → **Project Settings** → **Service accounts**
2. Click "Generate new private key"
3. Save as `service-account.json`
4. Set environment variable:

```bash
export FIREBASE_SERVICE_ACCOUNT_KEY=$(cat service-account.json | jq -Rs .)
bun run lib/seed.ts
```

Or use Firebase CLI:
```bash
firebase emulators:start
# In another terminal:
bun run lib/seed.ts
```

## 8. Deploy to Vercel (Optional)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy

---

*Setup completed: 2026-04-14*