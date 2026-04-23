# Firebase Setup for jvocabdr

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name: `jvocabdr` (or your preferred name)
4. Disable Google Analytics (optional, saves resources)
5. Click **"Create project"** → wait for completion
6. Click **"Continue"**

---

## Step 2: Enable Authentication (Google Sign-in)

1. In the left sidebar, click **Build** → **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **"Add provider"** → select **"Google"**
5. Enable Google sign-in:
   - **Email domain**: Leave empty (allows all domains)
   - **Project support email**: Select your email
6. Click **"Save"**

---

## Step 3: Enable Firestore Database

1. In the left sidebar, click **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select location: `us-central1` (or nearest to you)
4. Choose **"Start in test mode"** (allows read/write for 30 days)
5. Click **"Create"** → wait for creation

---

## Step 4: Get Configuration Values

1. Click the **gear icon** (Project Settings) in left sidebar
2. Scroll down to **"Your apps"**
3. Click the **web icon** (`</>`) to add a web app
4. App nickname: `jvocabdr` or `web`
5. Click **"Register app"**
6. You'll see a `firebaseConfig` object - copy these values:

```
apiKey: "AIzaSy..."
authDomain: "jvocabdr.firebaseapp.com"
projectId: "jvocabdr"
storageBucket: "jvocabdr.appspot.com"
messagingSenderId: "123456789"
appId: "1:123456789:web:abc123"
```

---

## Step 5: Configure Local Environment

1. In project root, copy the example env file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your values from Step 4:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Step 6: Deploy Security Rules

1. In Firebase Console → **Firestore Database** → **Rules**
2. Replace the content with:

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

3. Click **"Publish"**

---

## Step 7: Seed Vocabulary Data

You need a service account to run the seed script:

### 7a. Get Service Account Key

1. In Firebase Console → **Project Settings** → **Service accounts**
2. Click **"Generate new private key"**
3. Save the JSON file as `service-account.json` in project root

### 7b. Run Seed Script

```bash
# Set the service account key as environment variable
export FIREBASE_SERVICE_ACCOUNT_KEY=$(cat service-account.json | jq -Rs .)

# Run the seed script
bun run lib/seed.ts
```

You should see:
```
Creating deck...
Seeding 50 words...
Seed complete!
```

---

## Step 8: Run the App

```bash
bun run dev
```

Open http://localhost:3000

- Click "Sign in with Google"
- You'll be redirected to `/game`
- Start playing!

---

## Step 9: Deploy to Vercel (Optional)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository
4. Add the same environment variables from Step 5
5. Deploy

---

## Troubleshooting

### "Error: auth/invalid-api-key"
- Your `.env.local` is missing or has wrong values
- Restart the dev server after editing `.env.local`

### "Permission denied" errors
- Firestore rules not deployed (Step 6)
- Or not signed in (test mode expires after 30 days)

### Seed script fails
- Make sure service account key is set correctly
- Verify Firestore database is created (Step 3)

---

*Setup completed: 2026-04-14*