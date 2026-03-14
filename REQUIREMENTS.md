# VocaBuilder - Requirements Document

## Overview
VocaBuilder is a web application for vocabulary building using spaced repetition principles. Users practice vocabulary words by seeing partial clues and attempting to complete them.

## Core Features

### 1. Word Practice Interface

#### Displayed Information
- **First letter** of the word is always shown
- **Last letter** of the word is always shown
- **Blank spaces** for intermediate letters (_____)
- **Hint text** providing context or definition
- **Progress indicator** (current word / total words for session)

#### Hint System Constraints
- Hints must **not contain** words similar to the target word
- Hints should provide context without giving away the answer
- Examples of good hints:
  - "A large feline predator found in Africa" (target: LION)
  - "The color of grass and leaves" (target: GREEN)
- Examples of bad hints:
  - "Synonymous with lionlike" (target: LION)
  - "Like the color green" (target: GREEN)

#### User Input
- Text input field for user's answer
- Submit button
- Skip button (rare case)
- Reveal option (after multiple wrong attempts)

#### Feedback
- **Immediate feedback** on submission
  - Correct: ✓ "Great job!" or similar positive reinforcement
  - Incorrect: ✗ "Not quite. The word was: [WORD]"
- Show the correct answer if user gives up after 3 attempts
- Highlight which letters were correct in the user's attempt

### 2. Spaced Repetition System

#### Forgetting Curve
- Words appear across multiple days following a forgetting curve
- Based on Ebbinghaus forgetting curve principles
- Schedule based on success/failure patterns

#### Scheduling Logic
```
Initial learning intervals:
- 1st review: immediately (during session)
- 2nd review: 1 day later
- 3rd review: 3 days later
- 4th review: 7 days later
- 5th review: 14 days later
- Mature reviews: 30+ days
```

#### Word States
- **New**: Never seen before
- **Learning**: Currently in active learning phase
- **Review**: Due for review
- **Mastered**: Passed multiple reviews, long interval
- **Failed**: Answered incorrectly, needs reinforcement

#### Retry Rules
- **Failed words**: Retry later in current session (if not exhausted)
- **Correct words (first attempt)**: Move to next review interval
- **Correct words (with hints)**: Shorter interval (half of normal)
- **Skipped words**: Treat as failed

### 3. Word Management

#### Data Model
```typescript
interface Word {
  id: string;
  word: string;           // The target word
  hint: string;           // Context hint (no similar words)
  examples?: string[];    // Optional usage examples
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];        // Categories (e.g., "nature", "tech")

  // Spaced repetition data
  state: 'new' | 'learning' | 'review' | 'mastered';
  nextReviewAt: Date;
  intervalDays: number;    // Current interval
  repetitions: number;     //Successful repetitions
  qualityHistory: number[]; // Quality ratings (0-5)
  lastReviewedAt?: Date;

  // Performance tracking
  correctCount: number;
  incorrectCount: number;
  skipCount: number;
}
```

#### Initial Word List
- Start with ~50 curated words across categories
- Categories: animals, colors, food, nature, technology, emotions
- Mix of difficulty levels
- English words initially

#### Import/Export
- **Import**: Support JSON, CSV formats
- **Export**: Export progress and word lists as JSON
- Backup/restore functionality

### 4. Session Management

#### Session Types
1. **Quick Practice**: 10-20 words, 5-10 minutes
2. **Daily Review**: All due words (20-50 words, 15-25 minutes)
3. **New Words**: Only unlearned words
4. **Custom**: User selects count and filters

#### Session Flow
1. Select session type
2. Show session settings (count, filters)
3. Begin practice loop
4. End with summary:
   - Total words practiced
   - Correct/Incorrect/Skipped breakdown
   - Words to review tomorrow
   - Progress over time visualization

### 5. Progress Tracking & Statistics

#### Dashboard
- **Today's progress**: Words reviewed, accuracy %
- **Streak**: Consecutive days of practice
- **Mastered words**: Total and by category
- **Upcoming reviews**: Words due in next 7 days

#### Detailed Statistics
- **Accuracy rate**: Overall and by category
- **Retention**: Words remembered after intervals
- **Learning curve**: Progress over time
- **Weak words**: Most frequently missed

#### Charts & Visualizations
- Accuracy over time (line chart)
- Word distribution by category (pie chart)
- Forgetting curve visualization (scatter plot)
- Streak calendar (heat map)

### 6. User Experience

#### Accessibility
- Keyboard navigation (Enter to submit, Tab for controls)
- Screen reader support (ARIA labels)
- High contrast mode option
- Adjustable font sizes

#### Responsiveness
- Mobile-first design
- Works on phones, tablets, desktops
- Touch-friendly buttons
- Offline mode (PWA support - future)

#### Theming
- Light/dark mode
- Color schemes:
  - Blue (default)
  - Green (nature)
  - Purple (creative)
  - Orange (energetic)

### 7. Data Storage

#### Local Storage (Initial Version)
- User progress stored in browser localStorage
- Word lists in IndexedDB (for larger datasets)
- No cloud sync required initially

#### Future Features (Not MVP)
- Cloud backup and sync
- Multi-device support
- Collaborative word lists
- Leaderboards (optional)

## Technical Stack Recommendations

### Frontend
- **Framework**: React or Vue.js (for interactive UI)
- **State Management**: Zustand or Redux Toolkit
- **Styling**: Tailwind CSS or modern CSS with custom properties
- **Components**: shadcn/ui or Chakra UI

### Backend (Optional for Phase 1)
- Can be a 100% client-side SPA initially
- Future: Node.js/Express or Next.js API routes

### Deployment
- Static hosting (Vercel, Netlify, GitHub Pages)
- PWA capabilities for offline use

## Implementation Phases

### Phase 1: MVP (Minimum Viable Product)
- [ ] Basic word practice interface
- [ ] Local storage for progress
- [ ] Simple spaced repetition (intervals: 1, 3, 7, 14 days)
- [ ] 50 predefined words
- [ ] Basic statistics dashboard
- [ ] Dark/light theme

### Phase 2: Enhanced Features
- [ ] Import/export word lists
- [ ] Custom sessions
- [ ] Detailed charts and analytics
- [ ] Category filtering
- [ ] Hint quality validation
- [ ] Keyboard shortcuts

### Phase 3: Advanced Features
- [ ] PWA offline support
- [ ] Cloud sync
- [ ] Multi-language support
- [ ] Audio pronunciation
- [ ] Social features
- [ ] Gamification (achievements, streaks)

## Success Metrics
- **Engagement**: Users return daily (spaced repetition working)
- **Retention**: Words mastered increase over time
- **Accuracy**: 70%+ accuracy overall (challenging but achievable)
- **Satisfaction**: 4+ star rating from users

## Open Questions
1. Should hints be AI-generated or curated manually?
2. How many words per session is optimal?
3. Should we include multiple-choice option as an alternative mode?
4. Integration with external dictionaries (API)?
5. Social sharing of progress (optional)?

---

_Version: 1.0_
_Last Updated: 2026-03-11_
