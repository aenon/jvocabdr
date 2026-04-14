// Vocabulary Builder - TypeScript Interfaces

export interface VocabCard {
  id: string;
  word: string;
  definition: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  dailyNewWords: number;
  createdAt: Date;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface CardProgress {
  cardId: string;
  userId: string;
  nextDue: Date;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lastReviewed: Date | null;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

export interface UserSettings {
  uid: string;
  dailyNewWords: number;
  theme: 'light' | 'dark' | 'system';
}

export interface GameState {
  currentCard: VocabCard | null;
  userInput: string;
  isRevealed: boolean;
  isCorrect: boolean | null;
  sessionProgress: number;
  sessionTotal: number;
}

export interface SessionStats {
  cardsReviewed: number;
  correctCount: number;
  startTime: Date;
}