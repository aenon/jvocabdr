import { CardProgress } from './types';

export interface SM2Input {
  quality: number;
  repetitions: number;
  easeFactor: number;
  interval: number;
}

export interface SM2Output {
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextDue: Date;
}

const MIN_EASE_FACTOR = 1.3;
const INITIAL_EASE_FACTOR = 2.5;
const INITIAL_INTERVAL = 1;

export function calculateSM2(input: SM2Input): SM2Output {
  let { quality, repetitions, easeFactor, interval } = input;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < MIN_EASE_FACTOR) {
    easeFactor = MIN_EASE_FACTOR;
  }

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + interval);

  return {
    repetitions,
    easeFactor,
    interval,
    nextDue,
  };
}

export function getInitialProgress(): CardProgress {
  return {
    cardId: '',
    userId: '',
    nextDue: new Date(),
    intervalDays: 0,
    easeFactor: INITIAL_EASE_FACTOR,
    repetitions: 0,
    lastReviewed: null,
    status: 'new',
  };
}

export function mapAnswerToQuality(
  isCorrect: boolean,
  responseTimeMs: number
): number {
  if (!isCorrect) {
    return 1;
  }
  if (responseTimeMs < 3000) return 5;
  if (responseTimeMs < 5000) return 4;
  return 3;
}

export function getStatusFromProgress(progress: CardProgress): CardProgress['status'] {
  if (progress.repetitions === 0) return 'new';
  if (progress.intervalDays < 21) return 'learning';
  if (progress.intervalDays >= 21) return 'review';
  return 'learning';
}