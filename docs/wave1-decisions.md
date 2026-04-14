# Wave 1: Architecture Decisions

## 1. Firestore Schema Design

### Decision: Collection Structure
**Option A:** `decks/{deckId}/cards/{cardId}` (subcollection)
- Pros: Natural security rules, no deckId field needed
- Cons: More complex queries across decks

**Option B:** `cards/{cardId}` with `deckId` field (flat)
- Pros: Simple queries, single collection
- Cons: Security rules more complex

**✅ DECISION: Option A (subcollection)** - Better security rule scoping

### Decision: User Progress Storage
**Option A:** `cards/{cardId}/progress/{uid}` (subcollection per card)
**Option B:** `users/{uid}/progress/{cardId}` (flat per user)
**Option C:** Hybrid - progress in cards subcollection but indexed by userId field

**✅ DECISION: Option C** - Progress stored in card's subcollection with userId denormalization for efficient queries

---

## 2. Firebase Auth Configuration

### Decision: Authentication Providers
- **Google Sign-In** - Required
- **Email/Password** - Optional for MVP

**✅ DECISION: Google Sign-In only for MVP**

### Decision: User Profile Creation
- Create user document in Firestore on first login
- Store: email, displayName, photoURL, dailyNewWords setting

**✅ DECISION: Auto-create user document on first sign-in**

---

## 3. SM-2 Algorithm Variant

### Decision: Initial Values
- **Initial ease factor:** 2.5 (standard SM-2)
- **Initial interval:** 1 day
- **Minimum ease factor:** 1.3

### Decision: Quality Grades (0-5 mapping)
- 0-2: Failed (reset to learning)
- 3: Hard (slight interval increase)
- 4: Good (normal interval increase)
- 5: Easy (larger interval increase)

**✅ DECISION: Standard SM-2 with custom quality mapping for game UX**

### Decision: Game Input to SM-2 Mapping
- Correct answer → Quality 4-5 (depending on time)
- Wrong answer → Quality 1 (reset)
- Skip → Quality 2

---

## 4. Data Models

### Vocabulary Card (Seed Data)
```typescript
interface VocabCard {
  id: string;
  word: string;
  definition: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
}
```

### User Progress
```typescript
interface CardProgress {
  cardId: string;
  userId: string;
  nextDue: Date;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lastReviewed: Date | null;
  status: 'new' | 'learning' | 'review' | 'mastered';
}
```

### User Settings
```typescript
interface UserSettings {
  uid: string;
  dailyNewWords: number; // default 10
  theme: 'light' | 'dark' | 'system';
}
```

---

## 5. File Structure

```
lib/
├── firebase.ts      # Firebase initialization
├── auth.ts          # Authentication helpers
├── scheduler.ts     # SM-2 algorithm
├── db.ts            # Firestore queries
└── types.ts         # TypeScript interfaces

data/
└── vocabulary.json  # Seed data (50+ words)

firestore.rules      # Security rules
firebase.json        # Firebase config
```

---

## 6. API/Query Design

### Required Operations
1. **Get due cards** - Cards where nextDue <= now for a user
2. **Get new cards** - Cards with status='new', limit by dailyNewWords
3. **Update progress** - After each answer
4. **Get user stats** - Cards learned, streak, accuracy

**✅ DECISION: Client-side queries with Firestore security rules**

---

## 7. Game Mechanics Details

### Display Format
- Show: Definition + First letter + Last letter
- Example: "A fruit that grows on trees" → "A____e"

### Input Handling
- Single text input for middle letters
- Case-insensitive matching
- Immediate feedback on submit

### Progression
1. Show definition + first/last letters
2. User types middle letters
3. Submit → Show correct/incorrect
4. Next button → Next card
5. Session ends when due cards exhausted + daily new words done

---

## 8. Mobile Considerations

- Touch-friendly input (large tap targets)
- Virtual keyboard handling
- Responsive breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Prevent zoom on input focus (viewport meta)

---

## 9. Security Rules (Draft)

```
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

match /decks/{deckId} {
  allow read: if true;
  allow write: if request.auth != null;
}

match /decks/{deckId}/cards/{cardId} {
  allow read: if true;
  allow write: if request.auth != null;
}

match /decks/{deckId}/cards/{cardId}/progress/{progressId} {
  allow read, write: if request.auth.uid == progressId;
}
```

**Note: Refine before implementation**

---

## 10. Pending Decisions (Deferred)

- [ ] Word frequency/source (future: API or larger dataset)
- [ ] Analytics dashboard (future)
- [ ] Multiple decks support (future)
- [ ] Export/import progress (future)

---

*Decisions made: 2026-04-14*
*Wave 1 - Foundation*