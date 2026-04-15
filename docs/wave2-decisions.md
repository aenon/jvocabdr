# Wave 2: Frontend UI Decisions

## 1. Page Structure

### Routes
- `/` - Landing/Sign-in page (unauthenticated)
- `/game` - Main game page (authenticated)
- `/settings` - User settings (future)

**✅ DECISION: Simple 2-page structure for MVP**

---

## 2. Authentication Flow

### User State Management
- Use React Context for auth state
- AuthProvider wraps entire app
- Protected routes redirect to `/`

### Sign-in Page
- Large "Sign in with Google" button
- Clean, centered layout
- App name/logo display
- Brief instructions

**✅ DECISION: Client-side auth check with redirect**

---

## 3. Game UI Layout

### Card Display
```
┌─────────────────────────────────┐
│  Progress: 3/20                 │
├─────────────────────────────────┤
│                                 │
│  Definition:                    │
│  A fruit that grows on trees    │
│                                 │
│  ┌─A──────e─┐                   │
│  │ input   │                    │
│  └─────────┘                    │
│                                 │
│  [Submit Answer]                │
│                                 │
└─────────────────────────────────┘
```

### States
- **Question** - Show definition + first/last letters + input
- **Revealed** - Show correct/incorrect + full word + Next button
- **Complete** - Show session summary + "Start new session" button

**✅ DECISION: Two-state game flow (question → revealed → next)**

---

## 4. Visual Design

### Color Palette
- Background: `#f8f9fa` (light gray)
- Card: `#ffffff` (white)
- Primary: `#2563eb` (blue)
- Success: `#16a34a` (green)
- Error: `#dc2626` (red)
- Text: `#1f2937` (dark gray)

### Typography
- Font: System font stack (fast, native)
- Heading: 24px bold
- Body: 16px regular
- Input: 20px (large for mobile)

### Spacing
- Container max-width: 480px (mobile-first)
- Padding: 24px
- Card padding: 32px
- Button height: 48px (touch-friendly)

**✅ DECISION: Clean, minimal design with system fonts**

---

## 5. Game Logic

### Card Selection Priority
1. Due cards (nextDue <= now) first
2. New cards up to dailyNewWords limit
3. Random shuffle within priority groups

### Input Validation
- Trim whitespace
- Case-insensitive comparison
- Empty input → show error

### Feedback Display
- Correct: Green background, "Correct!" message
- Incorrect: Red background, show correct word
- Show example sentence after reveal

**✅ DECISION: Simple priority queue for card selection**

---

## 6. Session Management

### Session State (in-memory)
- Current card index
- List of cards for session
- Session start time
- Answer history (for stats)

### Session End Conditions
- All due cards reviewed
- New cards limit reached
- User clicks "End Session"

**✅ DECISION: In-memory session, refetch on page reload**

---

## 7. Mobile Considerations

### Touch Targets
- Button min-height: 48px
- Input min-height: 48px
- Adequate spacing between elements

### Viewport
- Prevent scale on input focus
- Use viewport meta tag

### Responsive
- Single column layout
- Scales to full width on mobile

**✅ DECISION: Mobile-first single column**

---

## 8. File Structure

```
app/
├── page.tsx              # Sign-in page (/)
├── game/
│   └── page.tsx          # Game page (/game)
├── layout.tsx            # Root layout with providers
├── globals.css           # Global styles
└── providers.tsx          # Auth context provider

components/
├── AuthButton.tsx        # Google sign-in button
├── GameCard.tsx          # Vocabulary card display
├── GameInput.tsx         # Input field
├── GameFeedback.tsx      # Answer feedback
└── ProgressBar.tsx       # Session progress
```

---

## 9. Components Detail

### AuthButton
- Google branded button
- Loading state during sign-in
- Error handling display

### GameCard
- Definition text (large)
- First letter + last letter display
- Input field (middle letters)
- Submit button
- Skip button (optional)

### GameFeedback
- Correct/incorrect indicator
- Show full word
- Show example
- "Next" button

### ProgressBar
- Current/total display
- Visual progress bar

**✅ DECISION: 4 core components for MVP**

---

## 10. Error Handling

### Auth Errors
- Display error message on sign-in failure
- "Try again" button

### Game Errors
- Network error → show "Connection error"
- Graceful fallback to retry

**✅ DECISION: Simple error messages, no complex recovery**

---

*Decisions made: 2026-04-14*
*Wave 2 - Frontend UI*